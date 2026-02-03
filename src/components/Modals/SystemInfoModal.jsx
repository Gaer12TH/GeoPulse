
/**
 * System Info Modal Component
 */
export function SystemInfoModal({ isOpen, onClose, position, speed, accuracy }) {
    if (!isOpen) return null;

    // Compute values at render time to ensure they're always current
    const lat = position?.lat ?? null;
    const lng = position?.lng ?? null;
    const acc = accuracy ?? position?.accuracy ?? 0;
    const spd = speed ?? 0;

    const items = [
        {
            label: 'GPS Coordinates',
            value: lat && lng ? `${lat.toFixed(6)}, ${lng.toFixed(6)}` : 'ไม่พบตำแหน่ง',
            icon: '📍'
        },
        {
            label: 'Accuracy',
            value: `±${Math.round(acc)}m`,
            icon: '🎯'
        },
        {
            label: 'Speed',
            value: `${(spd * 3.6).toFixed(1)} km/h`,
            icon: '⚡'
        },
        {
            label: 'Platform',
            value: /iPhone|iPad|iPod/.test(navigator.userAgent) ? 'iOS' :
                /Android/.test(navigator.userAgent) ? 'Android' :
                    /Mac/.test(navigator.platform) ? 'macOS' :
                        /Win/.test(navigator.platform) ? 'Windows' :
                            /Linux/.test(navigator.platform) ? 'Linux' : 'Unknown',
            icon: '💻'
        },
        {
            label: 'Browser',
            value: navigator.userAgent.includes('Chrome') ? 'Chrome' :
                navigator.userAgent.includes('Safari') ? 'Safari' :
                    navigator.userAgent.includes('Firefox') ? 'Firefox' : 'Other',
            icon: '🌐'
        },
        {
            label: 'App Version',
            value: '2.0.0',
            icon: '📱'
        },
    ];

    return (
        <div className="fixed inset-0 glass-modal-overlay flex items-center justify-center px-4 z-[10001]">
            <div className="glass-modal w-full max-w-sm overflow-hidden transform transition-transform duration-300 p-6 dark:bg-gray-900/95">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-100 to-sky-100 dark:from-cyan-900/50 dark:to-sky-900/50 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/20">
                        <span className="text-3xl">ℹ️</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">System Info</h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Device & GPS Information</p>
                </div>

                <div className="space-y-2 mb-6">
                    {items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center py-3 px-3 rounded-xl bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800/50 dark:to-slate-800/50 border border-gray-100/50 dark:border-white/5">
                            <div className="flex items-center gap-2">
                                <span className="text-sm">{item.icon}</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{item.label}</span>
                            </div>
                            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 text-right max-w-[160px] truncate">{item.value}</span>
                        </div>
                    ))}
                </div>

                <button
                    onClick={onClose}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 text-white font-bold hover:shadow-lg hover:shadow-cyan-500/30 transition transform active:scale-[0.98]"
                >
                    ปิดหน้าต่าง
                </button>
            </div>
        </div>
    );
}

export default SystemInfoModal;
