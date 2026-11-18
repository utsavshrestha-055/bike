import { useEffect, useState } from 'react';

interface SpeedData {
    speed: number;
    distance: number;
    status: string;
    timestamp: string;
}

export default function Speedometer() {
    const [data, setData] = useState<SpeedData>({
        speed: 0,
        distance: 0,
        status: 'waiting',
        timestamp: '',
    });

    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const channel = window.Echo.channel('bike.speed');

        channel
            .listen('.speed.updated', (event: SpeedData) => {
                setData(event);
            });

        const pusher = window.Echo.connector.pusher;

        const onConnected = () => setConnected(true);
        const onDisconnected = () => setConnected(false);

        pusher.connection.bind('connected', onConnected);
        pusher.connection.bind('disconnected', onDisconnected);

        setConnected(pusher.connection.state === 'connected');

        return () => {
            channel.stopListening('.speed.updated');
            window.Echo.leave('bike.speed');

            pusher.connection.unbind('connected', onConnected);
            pusher.connection.unbind('disconnected', onDisconnected);
        };
    }, []);

    const percentage = Math.min(data.speed / 120, 1);

    // SVG semicircle gauge
    const radius = 100;
    const circumference = Math.PI * radius;
    const dashOffset = circumference * (1 - percentage);

    return (
        <main className="min-h-screen bg-slate-950 text-white p-6">
            <div className="max-w-4xl mx-auto space-y-8">

                <header className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Bike Dashboard
                        </h1>
                        <p className="text-slate-400 text-sm">
                            Real-time vehicle monitoring
                        </p>
                    </div>

                    <span className={`text-sm px-3 py-2 rounded-full ${
                        connected
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                    }`}>
                        {connected ? '● Connected' : '● Disconnected'}
                    </span>
                </header>

                <section className="bg-slate-900 rounded-2xl p-8 text-center">
                    <p className="text-slate-400 uppercase tracking-widest">
                        Current Speed
                    </p>

                    <div className="relative max-w-sm mx-auto mt-8">
                        <svg viewBox="0 0 240 140" className="w-full">
                            <path
                                d="M 20 120 A 100 100 0 0 1 220 120"
                                fill="none"
                                stroke="#334155"
                                strokeWidth="14"
                                strokeLinecap="round"
                            />

                            <path
                                d="M 20 120 A 100 100 0 0 1 220 120"
                                fill="none"
                                stroke="#22c55e"
                                strokeWidth="14"
                                strokeLinecap="round"
                                strokeDasharray={circumference}
                                strokeDashoffset={dashOffset}
                                className="transition-all duration-100"
                            />
                        </svg>

                        <div className="absolute inset-0 flex flex-col justify-end items-center pb-2">
                            <span className="text-6xl font-bold tabular-nums">
                                {data.speed.toFixed(1)}
                            </span>
                            <span className="text-slate-400">KM/H</span>
                        </div>
                    </div>

                    <p className="text-slate-400 mt-6">
                        {data.status.toUpperCase()}
                    </p>
                </section>

                <section className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-900 rounded-2xl p-6">
                        <p className="text-slate-400 text-sm">
                            Total Distance
                        </p>
                        <h2 className="text-3xl font-bold mt-3">
                            {data.distance.toFixed(3)}
                            <span className="text-sm ml-2 text-slate-400">
                                KM
                            </span>
                        </h2>
                    </div>

                    <div className="bg-slate-900 rounded-2xl p-6">
                        <p className="text-slate-400 text-sm">
                            Connection
                        </p>
                        <h2 className="text-3xl font-bold mt-3">
                            {connected ? 'LIVE' : 'OFFLINE'}
                        </h2>
                    </div>
                </section>

                <footer className="text-center text-slate-500 text-xs">
                    Last update: {data.timestamp || 'Waiting for data'}
                </footer>

            </div>
        </main>
    );
}
