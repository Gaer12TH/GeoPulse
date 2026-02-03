import { useState, useEffect, useCallback } from 'react';
import { toggleBackgroundAudio } from '../../utils/audio';
import { enableWakeLock, disableWakeLock } from '../../utils/wakeLock';
import { calculateETA } from '../../utils/distance';

/**
 * Pocket Mode Overlay Component
 * Full-screen overlay for tracking while phone is in pocket
 */
export function PocketModeOverlay({
    isOpen,
    onClose,
    position,
    speed,
    nearestGeofence,
}) {
    const [currentTime, setCurrentTime] = useState('00:00');
    const [lastTap, setLastTap] = useState(0);

    // Update clock every second
    useEffect(() => {
        if (!isOpen) return;

        // Start background audio to keep app alive
        toggleBackgroundAudio(true);
        enableWakeLock();

        const updateTime = () => {
            const now = new Date();
            const time = now.getHours().toString().padStart(2, '0') + ':' +
                now.getMinutes().toString().padStart(2, '0');
            setCurrentTime(time);
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => {
            clearInterval(interval);
            toggleBackgroundAudio(false);
            disableWakeLock();
        };
    }, [isOpen]);

    // Handle double tap to close
    const handleTap = useCallback(() => {
        const now = Date.now();
        if (now - lastTap < 500 && now - lastTap > 0) {
            onClose();
        }
        setLastTap(now);
    }, [lastTap, onClose]);

    // Calculate display values
    const getDistance = () => {
        if (!nearestGeofence || !position.lat || !position.lng) return '-';
        const dist = nearestGeofence.currentDistance;
        if (dist === undefined || dist === null) return '-';
        if (dist >= 1000) return (dist / 1000).toFixed(2) + ' km';
        return Math.round(dist) + ' m';
    };

    const getSpeed = () => {
        if (!speed || speed < 0.1) return '0 km/h';
        return Math.round(speed * 3.6) + ' km/h';
    };

    const getETA = () => {
        if (!nearestGeofence) return '-';

        const dist = nearestGeofence.currentDistance;
        if (!dist || dist < 10) return '-';

        // Calculate ETA with walking speed fallback
        const currentSpeedKmh = (speed || 0) * 3.6;
        const etaSpeed = currentSpeedKmh < 3 ? 5 : currentSpeedKmh;

        const { etaMinutes, arrivalTime } = calculateETA(dist, etaSpeed);

        if (etaMinutes > 24 * 60) return '> 1 day';

        return (
            <div className="flex flex-col items-center leading-none">
                <span className="text-xl font-bold text-white drop-shadow-md">
                    {etaMinutes} <span className="text-xs font-medium text-white/60">min</span>
                </span>
                <div className="text-[9px] font-medium text-white/50 bg-white/10 px-2 py-0.5 rounded-full mt-1 backdrop-blur-md border border-white/5 flex items-center gap-1">
                    <span>🏁</span>
                    <span>{arrivalTime}</span>
                </div>
            </div>
        );
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center select-none touch-none"
            style={{
                backgroundColor: '#000000', // OLED True Black
            }}
            onClick={handleTap}
        >
            <div className="flex flex-col items-center scale-110">
                {/* Animated Cat GIF */}
                <div className="relative mb-6">
                    <img
                        src="https://media.tenor.com/ohfj0KnJ4xwAAAAi/catjam.gif"
                        alt="GeoPulse"
                        className="relative w-32 h-32 rounded-full object-cover border-2 border-white/10 opacity-80"
                    />
                </div>

                {/* Clock */}
                <h2 className="text-6xl font-black text-gray-200 tracking-tighter mb-8 font-variant-numeric tabular-nums opacity-90">
                    {currentTime}
                </h2>

                {/* Stats Display */}
                <div className="grid grid-cols-3 gap-8 w-full max-w-xs px-4">
                    {/* Distance */}
                    <div className="flex flex-col items-center">
                        <div className="mb-2 opacity-50">
                            <span className="text-2xl">📏</span>
                        </div>
                        <span className="text-lg font-bold text-white tracking-tight">{getDistance()}</span>
                        <span className="text-[10px] uppercase tracking-widest text-white/30 mt-1">Dist</span>
                    </div>

                    {/* Speed */}
                    <div className="flex flex-col items-center">
                        <div className="mb-2 opacity-50">
                            <span className="text-2xl">⚡</span>
                        </div>
                        <span className="text-lg font-bold text-white tracking-tight">{getSpeed()}</span>
                        <span className="text-[10px] uppercase tracking-widest text-white/30 mt-1">Speed</span>
                    </div>

                    {/* ETA */}
                    <div className="flex flex-col items-center">
                        <div className="mb-2 opacity-50">
                            <span className="text-2xl">⏱️</span>
                        </div>
                        <div className="flex items-center justify-center h-[28px]">
                            {getETA()}
                        </div>
                        <span className="text-[10px] uppercase tracking-widest text-white/30 mt-1">ETA</span>
                    </div>
                </div>

                {/* Destination Name */}
                {nearestGeofence && (
                    <p className="mt-8 text-sm text-white/50 font-medium tracking-wide">
                        📍 {nearestGeofence.name}
                    </p>
                )}
            </div>

            {/* Unlock Hint */}
            <p className="absolute bottom-20 text-[10px] text-zinc-600 animate-pulse">
                Double tap to unlock
            </p>
        </div>
    );
}

export default PocketModeOverlay;
