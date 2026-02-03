import { useState, useEffect, useCallback } from 'react';
import * as api from '../../services/api';
import { CONTACTS } from '../../config/constants';

/**
 * SOS & Chat Modal Component
 */
export function SOSModal({ isOpen, onClose, notifyMode, onShowNotification }) {
    const [message, setMessage] = useState('');
    const [selectedContact, setSelectedContact] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);

    // Fetch messages when modal opens or contact changes
    useEffect(() => {
        if (isOpen) {
            fetchMessages();
        }
    }, [isOpen, selectedContact]);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const data = await api.getMessages(selectedContact);
            if (data?.messages) {
                setMessages(data.messages);
            }
        } catch (err) {
            console.error('Failed to fetch messages:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSendChat = async () => {
        if (!message.trim()) return;

        setSending(true);
        try {
            await api.sendChat(message, selectedContact, notifyMode);
            setMessage('');
            fetchMessages();
            onShowNotification?.('Sent', 'ส่งข้อความสำเร็จ', 'success');
        } catch (err) {
            onShowNotification?.('Error', 'ส่งไม่สำเร็จ', 'error');
        } finally {
            setSending(false);
        }
    };

    const handleSendSOS = async () => {
        const sosMessage = message.trim() || 'ขอความช่วยเหลือ!';

        setSending(true);
        try {
            await api.sendSOS(sosMessage, notifyMode);
            setMessage('');
            onShowNotification?.('SOS Sent', 'ส่ง SOS สำเร็จ', 'success');
        } catch (err) {
            onShowNotification?.('Error', 'ส่ง SOS ไม่สำเร็จ', 'error');
        } finally {
            setSending(false);
        }
    };

    const handleClearMessages = async () => {
        if (!confirm('ต้องการลบประวัติแชททั้งหมด?')) return;

        try {
            await api.clearMessages();
            setMessages([]);
            onShowNotification?.('Cleared', 'ลบประวัติแล้ว', 'info');
        } catch (err) {
            console.error('Failed to clear messages:', err);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 glass-modal-overlay flex items-end sm:items-center justify-center z-[80] px-0 sm:px-4">
            <div className="glass-modal rounded-t-[2rem] sm:rounded-[2rem] w-full max-w-sm overflow-hidden transform transition-transform duration-300 h-[80vh] flex flex-col dark:bg-gray-900/95">
                {/* Header */}
                <div className="px-6 pt-6 pb-2 shrink-0 border-b border-gray-100 dark:border-white/10 bg-white dark:bg-gray-900/80 z-10">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-indigo-900/50 dark:to-purple-900/50 flex items-center justify-center">
                                💬
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Chat</h3>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleClearMessages}
                                className="p-2 bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 transition border border-red-100 dark:border-red-800/50"
                                title="ลบประวัติแชท"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                            <button
                                onClick={onClose}
                                className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition border border-gray-200 dark:border-gray-700"
                            >
                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Contact Selector */}
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        <button
                            onClick={() => setSelectedContact(null)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${selectedContact === null
                                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                                }`}
                        >
                            📢 Broadcast
                        </button>
                        {CONTACTS.map((contact) => (
                            <button
                                key={contact.id}
                                onClick={() => setSelectedContact(contact.id)}
                                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${selectedContact === contact.id
                                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                                    }`}
                            >
                                {contact.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Messages List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900/50 scrollbar-hide">
                    {loading ? (
                        <div className="text-center text-gray-400 dark:text-gray-500 text-xs py-10">กำลังโหลด...</div>
                    ) : messages.length === 0 ? (
                        <div className="text-center text-gray-400 dark:text-gray-500 text-xs py-10">ยังไม่มีข้อความ</div>
                    ) : (
                        messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.isOutgoing || msg.userId === 'ME' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${msg.isOutgoing || msg.userId === 'ME'
                                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-br-sm'
                                        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-sm border border-gray-100 dark:border-gray-700'
                                        }`}
                                >
                                    <p>{msg.text}</p>
                                    <span className={`text-[10px] block mt-1 ${msg.isOutgoing || msg.userId === 'ME' ? 'text-white/60' : 'text-gray-400 dark:text-gray-500'}`}>
                                        {new Date(msg.timestamp).toLocaleTimeString('th-TH', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white dark:bg-gray-900/80 border-t border-gray-100 dark:border-white/10 shrink-0 space-y-3">
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows="2"
                        placeholder="พิมพ์ข้อความ..."
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none transition text-gray-800 dark:text-gray-100 text-sm resize-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />

                    <div className="flex gap-2">
                        <button
                            onClick={handleSendChat}
                            disabled={sending || !message.trim()}
                            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-sm hover:from-indigo-600 hover:to-purple-600 active:scale-[0.98] shadow-lg shadow-indigo-500/30 dark:shadow-indigo-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span>{sending ? 'กำลังส่ง...' : 'ส่งข้อความ'}</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>

                        <button
                            onClick={handleSendSOS}
                            disabled={sending}
                            className="w-16 shrink-0 py-3 rounded-xl bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/40 dark:to-rose-900/30 text-red-600 dark:text-red-400 font-bold text-xs hover:from-red-100 hover:to-rose-100 dark:hover:from-red-900/60 dark:hover:to-rose-900/50 active:scale-[0.98] transition flex flex-col items-center justify-center leading-none border border-red-200 dark:border-red-800/50 disabled:opacity-50"
                            title="SOS Emergency"
                        >
                            <span className="text-lg">🚨</span>
                            <span className="mt-0.5 text-[10px]">SOS</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SOSModal;
