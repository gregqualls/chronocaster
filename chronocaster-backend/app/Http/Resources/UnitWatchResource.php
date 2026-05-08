<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Public-facing version of UnitResource: drops anything personally identifying
 * about the crew/host so a shared /watch link can't leak emails or roles.
 */
class UnitWatchResource extends JsonResource
{
    public function toArray($request): array
    {
        $segments = $this->whenLoaded('segments', fn () => $this->segments);
        $durationSec = $segments
            ? $segments->sum('duration')
            : (int) ($this->program?->default_duration ?? 0);

        return [
            'id'                          => $this->id,
            'name'                        => $this->name,
            'show'                        => $this->program?->name,
            'scheduled_at'                => optional($this->scheduled_at)?->toIso8601String(),
            'timezone'                    => $this->timezone,
            'status'                      => $this->status,
            'started_at'                  => optional($this->started_at)?->toIso8601String(),
            'completed_at'                => optional($this->completed_at)?->toIso8601String(),
            'rundown'                     => SegmentResource::collection($segments ?? collect()),
            'duration_sec'                => $durationSec,
            'current_segment_id'          => $this->current_segment_id,
            'current_segment_started_at'  => optional($this->current_segment_started_at)?->toIso8601String(),
            'paused_at'                   => optional($this->paused_at)?->toIso8601String(),
        ];
    }
}
