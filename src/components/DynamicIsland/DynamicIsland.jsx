import { useMemo } from 'react';
import { formatDistance, formatSpeed } from '../../utils/distance';

/**
 * Dynamic Island Component - iOS 26 Liquid Glass Style
 * Refactored to match index.html structure for exact behavior
 */
export function DynamicIsland({ state, content, gpsStatus, nearest, speed, onClick }) {
    // Determine island size class
    const sizeClass = useMemo(() => {
        switch (state) {
            case 'tracking':
                return 'island-tracking';
            case 'active':
                return 'island-active';
            case 'large':
                return 'island-large';
            default:
                return 'island-idle';
        }
    }, [state]);

    // GPS status colors
    const gpsStatusColor = useMemo(() => {
        switch (gpsStatus) {
            case 'tracking':
                return 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]';
            case 'connecting':
                return 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.8)] animate-pulse';
            case 'error':
                return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]';
            default:
                return 'bg-gray-500';
        }
    }, [gpsStatus]);

    // Show/Hide Logic
    const isIdleOrTracking = state === 'idle' || state === 'tracking';
    const isActive = state === 'active';
    const isLarge = state === 'large';

    return (
        <div className="fixed safe-top left-0 right-0 flex justify-center z-50 pointer-events-none">
            <div
                onClick={onClick}
                className={`dynamic-island ${sizeClass} island-transition text-white flex flex-col justify-center items-center overflow-hidden relative pointer-events-auto cursor-pointer group hover:scale-[1.02]`}
            >

                {/* IDLE & TRACKING STATE */}
                <div
                    className={`absolute inset-0 flex items-center justify-between px-3.5 transition-opacity duration-300 ${isIdleOrTracking ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                >
                    {/* Left: GPS Status */}
                    <div className="flex items-center gap-2.5">
                        <div className="relative flex items-center justify-center w-4 h-4">
                            <span className={`absolute w-full h-full ${gpsStatusColor.replace('bg-', 'bg-')}/50 rounded-full animate-ping`}></span>
                            <span className={`relative w-2 h-2 ${gpsStatusColor} rounded-full transition-colors duration-500`}></span>
                        </div>
                    </div>

                    {/* Middle: Tracking Info (Visible only when tracking) */}
                    {state === 'tracking' && nearest ? (
                        <div className="flex-1 flex items-center justify-between gap-3 pl-2 pr-1 animate-fade-in">
                            <div className="flex flex-col items-start leading-none min-w-[70px]">
                                <span className="text-[8px] text-gray-400 font-bold uppercase tracking-wide truncate max-w-[80px]">
                                    {nearest.name}
                                </span>
                                <div className="flex items-baseline gap-0.5">
                                    <span className="text-xs font-bold text-green-400 tabular-nums tracking-tight distance-value">
                                        {formatDistance(nearest.currentDistance)}
                                    </span>
                                </div>
                                <span className="text-[8px] text-blue-400 font-semibold tabular-nums mt-0.5">
                                    {formatSpeed(speed)}
                                </span>
                            </div>

                            {/* Car Animation Track */}
                            <div className="relative w-20 h-4 mb-0.5">
                                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gray-700/50 rounded-full" />
                                <div className="absolute bottom-0 right-0 text-[10px] leading-none transform translate-y-[1px]">
                                    🏁
                                </div>
                                <div
                                    className="absolute bottom-0 left-0 transition-all duration-700 ease-out"
                                    style={{
                                        left: `${Math.max(0, Math.min(85, 100 - (Math.log(nearest.currentDistance || 1) / Math.log(5000)) * 100))}%`,
                                    }}
                                >
                                    <div
                                        className="text-[10px] leading-none"
                                        style={{ transform: 'scaleX(-1) translateY(1px)' }}
                                    >
                                        🚗
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Spacer when not tracking to push wave to right */
                        <div className="flex-1" />
                    )}

                    {/* Right: Waveform */}
                    <div className="flex items-center gap-[2px] h-4">
                        {[0, 1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className={`wave-bar ${gpsStatus === 'tracking' ? '' : 'wave-paused'}`}
                                style={{ animationDelay: `${i * 0.1}s` }}
                            />
                        ))}
                    </div>
                </div>

                {/* ACTIVE STATE */}
                <div
                    className={`absolute inset-0 flex items-center justify-between px-5 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                >
                    <div className="flex items-center gap-3.5">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-inner transition-colors duration-300 ${content.status === 'success' ? 'bg-green-900' :
                            content.status === 'error' ? 'bg-red-900' :
                                'bg-gray-800'
                            }`}>
                            <span>{content.icon}</span>
                        </div>
                        <div className="flex flex-col text-left justify-center h-full">
                            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                                {content.title}
                            </span>
                            <span className="text-sm font-semibold leading-tight text-white line-clamp-1 w-40">
                                {content.message}
                            </span>
                        </div>
                    </div>
                    <div className={`w-2 h-2 rounded-full animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.3)] ${content.status === 'success' ? 'bg-green-500' :
                        content.status === 'error' ? 'bg-red-500' :
                            'bg-gray-500'
                        }`} />
                </div>

                {/* LARGE STATE */}
                <div
                    className={`absolute inset-0 flex flex-col items-center justify-center p-6 transition-opacity duration-300 ${isLarge ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                >
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl shadow-lg mb-1 ${content.status === 'success' ? 'bg-green-900' :
                        content.status === 'error' ? 'bg-red-900' :
                            'bg-gray-800'
                        }`}>
                        <span>{content.icon}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white leading-tight truncate w-full px-2 text-center">
                        {content.title}
                    </h3>
                    <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-bold text-white tracking-tighter distance-value">
                            {content.message}
                        </span>
                        {content.unit && (
                            <span className="text-sm text-gray-400 font-medium">
                                {content.unit}
                            </span>
                        )}
                    </div>
                    {content.eta && (
                        <div className="text-sm font-medium text-gray-400 mt-1 bg-white/10 px-3 py-0.5 rounded-full backdrop-blur-md">
                            {content.eta}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

export default DynamicIsland;
