<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UnitResource extends JsonResource
{
    public function toArray($request): array
    {
        $segments = $this->whenLoaded('segments', fn () => $this->segments);
        $durationSec = $segments
            ? $segments->sum('duration')
            : (int) ($this->program?->default_duration ?? 0);

        $crew = $this->whenLoaded('crew', fn () => $this->crew->map(fn ($u) => [
            'id'    => $u->id,
            'name'  => $u->name,
            'email' => $u->email,
            'role'  => $u->pivot->role,
        ]));

        return [
            'id'                          => $this->id,
            'program_id'                  => $this->program_id,
            'program'                     => $this->whenLoaded('program', fn () => new ProgramResource($this->program)),
            'name'                        => $this->name,
            'show'                        => $this->program?->name,
            'description'                 => $this->description,
            'scheduled_at'                => optional($this->scheduled_at)?->toIso8601String(),
            'timezone'                    => $this->timezone,
            'status'                      => $this->status,
            'started_at'                  => optional($this->started_at)?->toIso8601String(),
            'completed_at'                => optional($this->completed_at)?->toIso8601String(),
            'host'                        => $this->whenLoaded('host', fn () => [
                'id'    => $this->host?->id,
                'name'  => $this->host?->name,
                'email' => $this->host?->email,
            ]),
            'host_id'                     => $this->host_id,
            'crew'                        => $crew,
            'rundown'                     => SegmentResource::collection($segments ?? collect()),
            'duration_sec'                => $durationSec,
            'current_segment_id'          => $this->current_segment_id,
            'current_segment_started_at'  => optional($this->current_segment_started_at)?->toIso8601String(),
            'paused_at'                   => optional($this->paused_at)?->toIso8601String(),
            'share_token'                 => $this->share_token,
        ];
    }
}
