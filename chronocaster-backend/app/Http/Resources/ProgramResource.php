<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProgramResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'               => $this->id,
            'name'             => $this->name,
            'description'      => $this->description,
            'image'            => $this->image,
            'default_duration' => (int) $this->default_duration,
            'recurrence'       => $this->recurrence,
        ];
    }
}
