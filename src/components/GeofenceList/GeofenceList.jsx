import GeofenceCard from './GeofenceCard';

/**
 * Geofence List Component
 */
export function GeofenceList({ geofences, onEdit, onDelete, onToggle, loading, currentPosition, onNavigate }) {
    if (loading) {
        return (
            <div className="text-center py-20 text-gray-400">
                <div className="animate-pulse">
                    <svg className="w-20 h-20 mx-auto mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>
                <p className="font-light text-sm">กำลังเชื่อมต่อดาวเทียม...</p>
            </div>
        );
    }

    if (geofences.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-gray-300">
                <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                <span className="text-sm font-medium">ยังไม่มีสถานที่ติดตาม</span>
                <span className="text-xs mt-1 opacity-75">กดปุ่ม + มุมขวาล่างเพื่อเริ่ม</span>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {geofences.map((geofence) => (
                <GeofenceCard
                    key={geofence.id}
                    geofence={geofence}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onToggle={onToggle}
                    currentPosition={currentPosition}
                    onNavigate={onNavigate}
                />
            ))}
        </div>
    );
}

export default GeofenceList;
