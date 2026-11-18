<?php
    namespace App\Console\Commands;

    use App\Events\SpeedUpdated;
    use Illuminate\Console\Command;

    class SimulateBikeSpeed extends Command
    {
    protected $signature = 'bike:simulate';

    protected $description = 'Simulate live bike speed';

    public function handle(): int
    {
        $speed    = 0;
        $distance = 0;

        $this->info('Bike speed simulator started...');

        while (true) {
            // Random acceleration or deceleration
            $speed += rand(-15, 20) / 10;

            // Keep speed between 0 and 120 km/h
            $speed = max(0, min(120, $speed));

            // Distance traveled in 100 milliseconds
            $distance += ($speed / 3600) * 0.1;

            $status = $speed > 0 ? 'moving' : 'stopped';

            broadcast(new SpeedUpdated(
                round($speed, 1),
                round($distance, 4),
                $status
            ));

            usleep(100000); // 100ms
        }

        return self::SUCCESS;
    }
}
