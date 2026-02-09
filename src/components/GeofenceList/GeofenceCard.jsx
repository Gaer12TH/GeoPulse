import { formatDistance } from '../../utils/distance';

/**
 * Geofence Card Component
 */
export function GeofenceCard({ geofence, onEdit, onDelete, onToggle, currentPosition }) {
    const {
        id,
        name,
        lat,
        lng,
        radius,
        enabled,
        currentDistance,
        isInside,
        notifyEnter = true,
        notifyExit = true,
    } = geofence;

    const cardStyle = isInside
        ? 'border-emerald-400 border-2 shadow-[0_8px_32px_-8px_rgba(34,197,94,0.35)] ring-4 ring-emerald-500/15 dark:border-emerald-500 dark:ring-emerald-400/10'
        : 'border-gray-200/60 border shadow-md hover:shadow-lg dark:border-white/10 dark:bg-gray-800/50';

    const statusClass = isInside
        ? 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border-emerald-200 dark:from-emerald-900/40 dark:to-teal-900/30 dark:text-emerald-300 dark:border-emerald-700/50'
        : 'bg-gradient-to-r from-gray-50 to-slate-50 text-gray-500 border-gray-200 dark:from-gray-800 dark:to-slate-800 dark:text-gray-400 dark:border-gray-700';

    const statusDot = isInside
        ? 'bg-emerald-500 shadow-[0_0_12px_rgba(34,197,94,0.9)] animate-pulse'
        : 'bg-gray-300 dark:bg-gray-600';

    const opacity = enabled ? 'opacity-100' : 'opacity-50 grayscale-[0.6]';

    // Handle navigation to Google Maps
    const handleNavigate = () => {
        if (!currentPosition?.lat || !currentPosition?.lng) {
            alert('⚠️ รอสักครู่ กำลังรับสัญญาณ GPS...');
            return;
        }

        const { lat: destLat, lng: destLng } = geofence;
        const { lat: originLat, lng: originLng } = currentPosition;

        // Google Maps directions URL
        const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${destLat},${destLng}&travelmode=driving`;

        // Open in new tab/window
        window.open(mapsUrl, '_blank');
    };

    return (
        <div className={`glass-card p-5 transition-all duration-300 ${cardStyle} ${opacity} mb-4 relative overflow-hidden group`}>
            {/* Gradient Overlay when inside */}
            {isInside && (
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 dark:from-emerald-500/10 dark:to-teal-500/10 pointer-events-none" />
            )}

            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex items-start gap-3.5">
                    <div className={`mt-1.5 w-3 h-3 rounded-full ${statusDot} shrink-0 transition-all duration-500`} />
                    <div className="overflow-hidden">
                        <h3 className="font-bold text-gray-900 text-lg leading-tight truncate w-40 sm:w-auto dark:text-gray-50">
                            {name}
                        </h3>
                        <div className="text-xs text-gray-500 mt-1.5 font-medium flex flex-wrap gap-x-2 gap-y-1 items-center dark:text-gray-400">
                            <span className="flex items-center gap-1">
                                <svg className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300">ห่าง {formatDistance(currentDistance)}</span>
                            </span>
                            <span className="w-1.5 h-1.5 bg-gray-300 rounded-full dark:bg-gray-600" />
                            <span className="text-gray-600 dark:text-gray-400">รัศมี {radius}ม.</span>
                        </div>
                    </div>
                </div>

                {/* Toggle Switch */}
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={enabled}
                        onChange={(e) => onToggle(id, e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-md peer-checked:bg-gradient-to-r peer-checked:from-indigo-500 peer-checked:to-purple-500 shadow-inner dark:bg-gray-700 dark:border-gray-600" />
                </label>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-gray-100/50 relative z-10 dark:border-white/10">
                <div className="flex flex-col gap-1.5">
                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border ${statusClass} uppercase tracking-wider w-fit shadow-sm`}>
                        {isInside ? '✓ อยู่ในพื้นที่' : 'อยู่นอกพื้นที่'}
                    </span>
                    <div className="flex items-center gap-1.5">
                        <span className={`text-[9px] px-2 py-1 rounded-lg border font-semibold transition-all ${notifyEnter
                            ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 border-blue-200/60 dark:from-blue-900/30 dark:to-indigo-900/20 dark:text-blue-400 dark:border-blue-700/40'
                            : 'bg-gray-50 text-gray-300 border-gray-100 dark:bg-gray-800 dark:text-gray-500 dark:border-gray-700'
                            }`}>
                            {notifyEnter ? '🔔 เข้า' : '🔕 เข้า'}
                        </span>
                        <span className={`text-[9px] px-2 py-1 rounded-lg border font-semibold transition-all ${notifyExit
                            ? 'bg-gradient-to-r from-orange-50 to-amber-50 text-orange-600 border-orange-200/60 dark:from-orange-900/30 dark:to-amber-900/20 dark:text-orange-400 dark:border-orange-700/40'
                            : 'bg-gray-50 text-gray-300 border-gray-100 dark:bg-gray-800 dark:text-gray-500 dark:border-gray-700'
                            }`}>
                            {notifyExit ? '🔔 ออก' : '🔕 ออก'}
                        </span>
                    </div>
                </div>

                <div className="flex gap-2">
                    {/* Navigate Button */}
                    <button
                        onClick={handleNavigate}
                        disabled={!currentPosition?.lat || !currentPosition?.lng}
                        className="p-2.5 text-gray-400 hover:text-emerald-500 hover:bg-gradient-to-br hover:from-emerald-50 hover:to-teal-50 rounded-xl transition-all border border-transparent hover:border-emerald-200/60 active:scale-95 shadow-sm hover:shadow-md disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-gray-400 disabled:hover:bg-transparent dark:hover:from-emerald-900/30 dark:hover:to-teal-900/20 dark:hover:border-emerald-700/40"
                        title="นำทางด้วย Google Maps"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                    </button>
                    <button
                        onClick={() => onEdit(id)}
                        className="p-2.5 text-gray-400 hover:text-blue-500 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 rounded-xl transition-all border border-transparent hover:border-blue-200/60 active:scale-95 shadow-sm hover:shadow-md dark:hover:from-blue-900/30 dark:hover:to-indigo-900/20 dark:hover:border-blue-700/40"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    <button
                        onClick={() => onDelete(id)}
                        className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-gradient-to-br hover:from-red-50 hover:to-rose-50 rounded-xl transition-all border border-transparent hover:border-red-200/60 active:scale-95 shadow-sm hover:shadow-md dark:hover:from-red-900/30 dark:hover:to-rose-900/20 dark:hover:border-red-700/40"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default GeofenceCard;
