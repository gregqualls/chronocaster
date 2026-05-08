<?php

namespace App\Http\Controllers;

use App\Http\Resources\UnitResource;
use App\Models\Unit;
use Illuminate\Http\Request;

class UnitController extends Controller
{
    public function index(Request $request)
    {
        $query = Unit::query()
            ->with(['program', 'host', 'crew', 'segments'])
            ->orderBy('scheduled_at');

        if ($status = $request->query('status')) {
            $query->whereIn('status', explode(',', $status));
        }

        return UnitResource::collection($query->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'program_id'   => ['required', 'exists:programs,id'],
            'name'         => ['required', 'string', 'max:255'],
            'description'  => ['nullable', 'string'],
            'scheduled_at' => ['nullable', 'date'],
            'timezone'     => ['nullable', 'string', 'max:64'],
            'host_id'      => ['nullable', 'exists:users,id'],
            'status'       => ['nullable', 'in:draft,scheduled,ready,live,paused,completed'],
            'crew'         => ['array'],
            'crew.*.user_id' => ['required', 'exists:users,id'],
            'crew.*.role'    => ['required', 'in:director,host,crew,viewer'],
        ]);

        $crew = $data['crew'] ?? [];
        unset($data['crew']);

        $unit = Unit::create(array_merge([
            'status'   => $data['status']   ?? Unit::STATUS_DRAFT,
            'timezone' => $data['timezone'] ?? 'UTC',
        ], $data));

        if ($crew) {
            $unit->crew()->sync(collect($crew)->mapWithKeys(
                fn ($c) => [$c['user_id'] => ['role' => $c['role']]],
            ));
        }

        return new UnitResource($unit->fresh(['program', 'host', 'crew', 'segments']));
    }

    public function show(Unit $unit)
    {
        $unit->load(['program', 'host', 'crew', 'segments']);

        return new UnitResource($unit);
    }

    public function update(Request $request, Unit $unit)
    {
        $data = $request->validate([
            'program_id'   => ['sometimes', 'exists:programs,id'],
            'name'         => ['sometimes', 'string', 'max:255'],
            'description'  => ['nullable', 'string'],
            'scheduled_at' => ['nullable', 'date'],
            'timezone'     => ['nullable', 'string', 'max:64'],
            'host_id'      => ['nullable', 'exists:users,id'],
            'status'       => ['sometimes', 'in:draft,scheduled,ready,live,paused,completed'],
            'crew'         => ['sometimes', 'array'],
            'crew.*.user_id' => ['required', 'exists:users,id'],
            'crew.*.role'    => ['required', 'in:director,host,crew,viewer'],
        ]);

        $crew = $data['crew'] ?? null;
        unset($data['crew']);

        $unit->update($data);

        if ($crew !== null) {
            $unit->crew()->sync(collect($crew)->mapWithKeys(
                fn ($c) => [$c['user_id'] => ['role' => $c['role']]],
            ));
        }

        return new UnitResource($unit->fresh(['program', 'host', 'crew', 'segments']));
    }

    public function destroy(Unit $unit)
    {
        $unit->delete();

        return response()->noContent();
    }
}
