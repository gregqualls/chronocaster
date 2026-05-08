<?php

namespace App\Http\Controllers;

use App\Events\UnitStateChanged;
use App\Http\Resources\UnitResource;
use App\Http\Resources\UnitWatchResource;
use App\Models\Unit;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class LiveEventController extends Controller
{
    public function show(Unit $unit)
    {
        $unit->load(['program', 'host', 'crew', 'segments']);

        return new UnitResource($unit);
    }

    public function watch(string $token)
    {
        $unit = Unit::where('share_token', $token)
            ->with(['program', 'segments'])
            ->firstOrFail();

        return new UnitWatchResource($unit);
    }

    public function start(Request $request, Unit $unit)
    {
        $this->authorizeControl($request);

        $unit->load('segments');
        $first = $unit->segments->first();

        $unit->forceFill([
            'status'                     => Unit::STATUS_LIVE,
            'started_at'                 => now(),
            'completed_at'               => null,
            'paused_at'                  => null,
            'current_segment_id'         => $first?->id,
            'current_segment_started_at' => now(),
        ])->save();

        return $this->respond($unit, 'started');
    }

    public function pause(Request $request, Unit $unit)
    {
        $this->authorizeControl($request);
        if ($unit->status !== Unit::STATUS_LIVE) {
            return response()->json(['error' => 'Not live'], 409);
        }

        $unit->forceFill([
            'status'    => Unit::STATUS_PAUSED,
            'paused_at' => now(),
        ])->save();

        return $this->respond($unit, 'paused');
    }

    public function resume(Request $request, Unit $unit)
    {
        $this->authorizeControl($request);
        if ($unit->status !== Unit::STATUS_PAUSED) {
            return response()->json(['error' => 'Not paused'], 409);
        }

        $pausedFor = $unit->paused_at
            ? Carbon::parse($unit->paused_at)->diffInSeconds(now())
            : 0;

        $unit->forceFill([
            'status'                     => Unit::STATUS_LIVE,
            'paused_at'                  => null,
            'current_segment_started_at' => optional($unit->current_segment_started_at)
                ?->copy()->addSeconds($pausedFor) ?? now(),
        ])->save();

        return $this->respond($unit, 'resumed');
    }

    public function advance(Request $request, Unit $unit)
    {
        $this->authorizeControl($request);

        $unit->load('segments');
        $current = $unit->segments->firstWhere('id', $unit->current_segment_id);
        $next = $current
            ? $unit->segments->where('position', '>', $current->position)->first()
            : $unit->segments->first();

        if (! $next) {
            return $this->stop($request, $unit);
        }

        $unit->forceFill([
            'current_segment_id'         => $next->id,
            'current_segment_started_at' => now(),
        ])->save();

        return $this->respond($unit, 'advanced');
    }

    public function stop(Request $request, Unit $unit)
    {
        $this->authorizeControl($request);

        $unit->forceFill([
            'status'                     => Unit::STATUS_COMPLETED,
            'completed_at'               => now(),
            'paused_at'                  => null,
            'current_segment_id'         => null,
            'current_segment_started_at' => null,
        ])->save();

        return $this->respond($unit, 'stopped');
    }

    private function authorizeControl(Request $request): void
    {
        $user = $request->user();
        if (! $user || ! $user->can('control_live_event')) {
            abort(403, 'You do not have permission to control this event.');
        }
    }

    private function respond(Unit $unit, string $action)
    {
        $unit->load(['program', 'host', 'crew', 'segments']);

        try {
            UnitStateChanged::dispatch($unit, $action);
        } catch (\Throwable $e) {
            // Broadcasting may not be wired in every environment; persist state
            // either way.
            report($e);
        }

        return new UnitResource($unit);
    }
}
