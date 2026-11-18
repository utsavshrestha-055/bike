<?php
namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SpeedUpdated implements ShouldBroadcastNow
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public float $speed,
        public float $distance,
        public string $status,
    ) {}

    public function broadcastOn(): array
    {
        return [
            new Channel('bike.speed'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'speed.updated';
    }

    public function broadcastWith(): array
    {
        return [
            'speed'     => $this->speed,
            'distance'  => $this->distance,
            'status'    => $this->status,
            'timestamp' => now()->toISOString(),
        ];
    }
}
