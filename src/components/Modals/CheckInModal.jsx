import { useState } from 'react';

/**
 * Check-in Modal Component
 */
export function CheckInModal({ isOpen, onClose, onConfirm, position, loading }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 glass-modal-overlay flex items-center justify-center px-4 z-[10001]">
            <div className="glass-modal w-full max-w-sm overflow-hidden transform transition-transform duration-300 p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-200">
                    <span className="text-3xl">📍</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Check-in</h3>
                <p className="text-gray-500 text-sm mb-6">
                    ยืนยันการส่งพิกัดปัจจุบันของคุณไปยังเซิร์ฟเวอร์
                </p>

                <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left border border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-gray-400">Latitude</span>
                        <span className="font-mono text-sm text-gray-700">{position?.lat?.toFixed(6) || '-'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-400">Longitude</span>
                        <span className="font-mono text-sm text-gray-700">{position?.lng?.toFixed(6) || '-'}</span>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3.5 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition"
                        disabled={loading}
                    >
                        ยกเลิก
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading || !position?.lat}
                        className="flex-1 py-3.5 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 shadow-lg shadow-green-600/20 transition disabled:opacity-50"
                    >
                        {loading ? 'กำลังส่ง...' : 'ยืนยัน'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CheckInModal;
