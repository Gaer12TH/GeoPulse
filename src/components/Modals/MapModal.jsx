/**
 * Map Modal Component - Shows Google Maps with directions
 */
export function MapModal({ isOpen, onClose, origin, destination }) {
    if (!isOpen || !destination) return null;

    // Build Google Maps embed URL with directions
    const buildMapUrl = () => {
        if (!origin?.lat || !origin?.lng || !destination?.lat || !destination?.lng) {
            return '';
        }

        // Google Maps Embed URL for directions
        const originCoords = `${origin.lat},${origin.lng}`;
        const destCoords = `${destination.lat},${destination.lng}`;

        return `https://www.google.com/maps?saddr=${originCoords}&daddr=${destCoords}&output=embed`;
    };

    const mapUrl = buildMapUrl();

    return (
        <div className="fixed inset-0 glass-modal-overlay flex items-end sm:items-center justify-center z-[80] px-0 sm:px-4">
            <div className="glass-modal rounded-t-[2rem] sm:rounded-[2rem] w-full max-w-2xl overflow-hidden transform transition-transform duration-300 h-[85vh] flex flex-col dark:bg-gray-900/95">
                {/* Header */}
                <div className="px-6 pt-6 pb-4 shrink-0 border-b border-gray-100 dark:border-white/10 bg-white dark:bg-gray-900/80 z-10">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/50 dark:to-teal-900/50 flex items-center justify-center">
                                🗺️
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    นำทางไป
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                                    {destination.name}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition border border-gray-200 dark:border-gray-700"
                        >
                            <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Map Container */}
                <div className="flex-1 relative bg-gray-100 dark:bg-gray-800">
                    {mapUrl ? (
                        <iframe
                            src={mapUrl}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="absolute inset-0"
                        ></iframe>
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
                            <div className="text-center">
                                <svg className="w-16 h-16 mx-auto mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                </svg>
                                <p className="text-sm">⚠️ กำลังรับสัญญาณ GPS...</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-4 bg-white dark:bg-gray-900/80 border-t border-gray-100 dark:border-white/10 shrink-0">
                    <button
                        onClick={() => {
                            // Open in Google Maps app (mobile) or new tab (desktop)
                            const mapsAppUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&travelmode=driving`;
                            window.open(mapsAppUrl, '_blank');
                        }}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-sm hover:from-emerald-600 hover:to-teal-600 active:scale-[0.98] shadow-lg shadow-emerald-500/30 dark:shadow-emerald-500/20 transition flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        <span>เปิดใน Google Maps</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default MapModal;
