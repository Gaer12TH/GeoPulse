import { useState, useEffect } from 'react';

/**
 * Add/Edit Geofence Modal
 */
export function AddEditModal({
    isOpen,
    onClose,
    onSave,
    editingGeofence,
    currentPosition,
    geofences,
}) {
    const [name, setName] = useState('');
    const [radius, setRadius] = useState(100);
    const [notifyEnter, setNotifyEnter] = useState(true);
    const [notifyExit, setNotifyExit] = useState(true);
    const [nextDestinationId, setNextDestinationId] = useState('');

    const isEditing = !!editingGeofence;

    // Populate form when editing
    useEffect(() => {
        if (editingGeofence) {
            setName(editingGeofence.name || '');
            setRadius(editingGeofence.radius || 100);
            setNotifyEnter(editingGeofence.notifyEnter !== false);
            setNotifyExit(editingGeofence.notifyExit !== false);
            setNextDestinationId(editingGeofence.nextDestinationId || '');
        } else {
            setName('');
            setRadius(100);
            setNotifyEnter(true);
            setNotifyExit(true);
            setNextDestinationId('');
        }
    }, [editingGeofence]);

    const handleSubmit = () => {
        if (!name.trim()) return;

        const geofenceData = {
            name: name.trim(),
            radius: parseInt(radius, 10),
            notifyEnter,
            notifyExit,
            nextDestinationId: nextDestinationId || null,
        };

        if (isEditing) {
            geofenceData.id = editingGeofence.id;
        } else {
            geofenceData.id = Date.now().toString();
            geofenceData.lat = currentPosition.lat;
            geofenceData.lng = currentPosition.lng;
            geofenceData.enabled = true;
            geofenceData.lastNotified = false;
        }

        onSave(geofenceData, isEditing);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 glass-modal-overlay flex items-center justify-center z-[80] px-4 transition-opacity duration-300">
            <div className="glass-modal w-full max-w-sm overflow-hidden transform transition-transform duration-300">
                <div className="p-6 pt-8">
                    <div className="flex justify-between items-center mb-1">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-800">
                            {isEditing ? 'แก้ไขสถานที่' : 'เพิ่มสถานที่ใหม่'}
                        </h3>
                        <button
                            onClick={onClose}
                            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition border border-gray-200"
                        >
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <p className="text-sm text-gray-500 mb-6">ระบุรายละเอียดตำแหน่งแจ้งเตือน</p>

                    <div className="space-y-5">
                        {/* Name Input */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5 ml-1">
                                ชื่อสถานที่
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="เช่น บ้าน, ออฟฟิศ"
                                className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition font-medium text-gray-800 placeholder-gray-400 text-base"
                            />
                        </div>

                        {/* Radius Input */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5 ml-1">
                                รัศมี (เมตร)
                            </label>
                            <input
                                type="number"
                                value={radius}
                                onChange={(e) => setRadius(e.target.value)}
                                className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition font-medium text-gray-800 text-base"
                            />
                        </div>

                        {/* Notification Options */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <label className="flex items-center gap-3 cursor-pointer flex-1 bg-gray-50 p-3.5 rounded-2xl border border-gray-200 hover:border-gray-300 transition">
                                <input
                                    type="checkbox"
                                    checked={notifyEnter}
                                    onChange={(e) => setNotifyEnter(e.target.checked)}
                                    className="w-5 h-5 accent-black rounded focus:ring-0"
                                />
                                <span className="text-sm text-gray-700 font-medium">เตือนเมื่อถึง</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer flex-1 bg-gray-50 p-3.5 rounded-2xl border border-gray-200 hover:border-gray-300 transition">
                                <input
                                    type="checkbox"
                                    checked={notifyExit}
                                    onChange={(e) => setNotifyExit(e.target.checked)}
                                    className="w-5 h-5 accent-black rounded focus:ring-0"
                                />
                                <span className="text-sm text-gray-700 font-medium">เตือนเมื่อออก</span>
                            </label>
                        </div>

                        {/* Destination Selector */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5 ml-1">
                                🎯 ปลายทาง (เมื่อออกจากที่นี่)
                            </label>
                            <select
                                value={nextDestinationId}
                                onChange={(e) => setNextDestinationId(e.target.value)}
                                className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:border-black dark:focus:border-blue-500 focus:ring-1 focus:ring-black dark:focus:ring-blue-500 outline-none transition font-medium text-gray-800 dark:text-gray-200 text-base"
                            >
                                <option value="">-- ไม่ระบุ --</option>
                                {geofences
                                    .filter((g) => g.id !== editingGeofence?.id)
                                    .map((g) => (
                                        <option key={g.id} value={g.id}>
                                            {g.name}
                                        </option>
                                    ))}
                            </select>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 ml-1">
                                เลือกสถานที่ถัดไปเพื่อแสดง ETA เมื่อออกจากที่นี่
                            </p>
                        </div>

                        {/* Current Location Display */}
                        <div className="bg-blue-50/50 p-4 rounded-2xl flex items-center justify-between border border-blue-100/80">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 border border-blue-200">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div className="text-xs overflow-hidden">
                                    <div className="font-bold text-gray-700">พิกัดปัจจุบัน</div>
                                    <div className="text-gray-500 font-mono truncate">
                                        {currentPosition.lat?.toFixed(6) || '...'}, {currentPosition.lng?.toFixed(6) || '...'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <button
                            onClick={handleSubmit}
                            className="w-full py-4 rounded-2xl bg-black text-white font-bold text-base hover:bg-gray-800 active:scale-[0.98] shadow-xl shadow-black/10 transition transform border-2 border-transparent hover:border-gray-700"
                        >
                            บันทึกข้อมูล
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddEditModal;
