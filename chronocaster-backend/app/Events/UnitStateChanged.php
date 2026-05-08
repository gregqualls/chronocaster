<?php

namespace App\Events;

use App\Http\Resources\UnitResource;
use App\Models\Unit;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class UnitStateChanged implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public Unit $unit, public string $action)
    {
    }

    public function broadcastOn(): array
    {
        return [new PrivateChannel('unit.'.$this->unit->id)];
    }

    public function broadcastAs(): string
    {
        return 'unit.state';
    }

    public function broadcastWith(): array
    {
        $this->unit->load(['program', 'host', 'crew', 'segments']);

        return [
            'action'   => $this->action,
            'state'    => (new UnitResource($this->unit))->toArray(request()),
            'sentAt'   => now()->toIso8601String(),
            'epoch_ms' => (int) (microtime(true) * 1000),
        ];
    }
}
