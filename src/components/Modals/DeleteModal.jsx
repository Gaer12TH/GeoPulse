/**
 * Delete Confirmation Modal
 */
export function DeleteModal({ isOpen, onClose, onConfirm }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 glass-modal-overlay flex items-center justify-center px-4 z-[9999]">
            <div className="glass-modal w-full max-w-sm overflow-hidden transform transition-transform duration-300 p-6 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-200">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">ยืนยันการลบ?</h3>
                <p className="text-gray-500 text-sm mb-6">
                    คุณต้องการลบสถานที่นี้ใช่หรือไม่<br />การกระทำนี้ไม่สามารถย้อนกลับได้
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3.5 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition"
                    >
                        ยกเลิก
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-3.5 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 shadow-lg shadow-red-500/30 transition"
                    >
                        ลบเลย
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteModal;
