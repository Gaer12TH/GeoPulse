import { useState, useEffect, useMemo } from 'react';
import * as api from '../../services/api';

/**
 * Quota Modal Component - Enhanced with animations and LINE reset countdown
 */
export function QuotaModal({ isOpen, onClose }) {
    const [quota, setQuota] = useState({ totalUsage: 0, limit: 'Loading...' });
    const [loading, setLoading] = useState(false);
    const [animatedPercentage, setAnimatedPercentage] = useState(0);
    const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    // Calculate time until LINE quota resets (1st of next month)
    const calculateTimeUntilReset = () => {
        const now = new Date();
        const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0);
        const diff = nextMonth - now;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        return { days, hours, minutes, seconds };
    };

    useEffect(() => {
        if (isOpen) {
            setAnimatedPercentage(0);
            fetchQuota();
            setCountdown(calculateTimeUntilReset());

            // Update countdown every second
            const interval = setInterval(() => {
                setCountdown(calculateTimeUntilReset());
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [isOpen]);

    const fetchQuota = async () => {
        setLoading(true);
        try {
            const data = await api.getQuota();
            if (data?.quota) {
                setQuota(data.quota);
                // Animate the percentage
                const targetPercentage = data.quota.limit === 'Uncapped' || data.quota.limit === 'Error'
                    ? 0
                    : Math.min(100, (data.quota.totalUsage / data.quota.limit) * 100);

                setTimeout(() => setAnimatedPercentage(targetPercentage), 100);
            }
        } catch (err) {
            console.error('Failed to fetch quota:', err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const percentage = quota.limit === 'Uncapped' || quota.limit === 'Error'
        ? 0
        : Math.min(100, (quota.totalUsage / quota.limit) * 100);

    // Status based on usage
    const getStatus = () => {
        if (percentage < 50) return { color: 'emerald', label: 'ปกติ', emoji: '✅' };
        if (percentage < 80) return { color: 'amber', label: 'ใกล้ถึงขีดจำกัด', emoji: '⚠️' };
        return { color: 'red', label: 'ใกล้เต็มแล้ว!', emoji: '🚨' };
    };

    const status = getStatus();

    const gradientColors = {
        emerald: 'from-emerald-400 via-teal-500 to-cyan-500',
        amber: 'from-amber-400 via-orange-500 to-red-400',
        red: 'from-red-400 via-rose-500 to-pink-500'
    };

    return (
        <div className="fixed inset-0 glass-modal-overlay flex items-center justify-center px-4 z-[10001]">
            <div className="glass-modal w-full max-w-sm overflow-hidden transform transition-transform duration-300 p-6 text-center dark:bg-gray-900/95">
                {/* Animated Icon */}
                <div className="relative w-20 h-20 mx-auto mb-4">
                    <div className={`absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 rounded-2xl animate-pulse`} />
                    <div className="relative w-full h-full flex items-center justify-center">
                        <span className="text-4xl animate-float">📊</span>
                    </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">API Quota Usage</h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">Messaging API reference</p>

                {/* Status Badge */}
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${status.color === 'emerald' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' :
                    status.color === 'amber' ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' :
                        'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                    }`}>
                    <span>{status.emoji}</span>
                    <span className="text-sm font-bold">{status.label}</span>
                </div>

                {/* Usage Display */}
                <div className="my-4">
                    <div className="flex justify-between items-end mb-3">
                        <div className="text-left">
                            <span className="text-xs text-gray-400 dark:text-gray-500 block">Used</span>
                            <span className="text-2xl font-black text-gray-900 dark:text-white">
                                {loading ? '...' : quota.totalUsage?.toLocaleString()}
                            </span>
                        </div>
                        <div className="text-right">
                            <span className="text-xs text-gray-400 dark:text-gray-500 block">Limit</span>
                            <span className="text-lg font-bold text-gray-600 dark:text-gray-300">
                                {loading ? '...' : quota.limit?.toLocaleString?.() || quota.limit}
                            </span>
                        </div>
                    </div>

                    {/* Animated Progress Bar */}
                    <div className="relative">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden shadow-inner">
                            <div
                                className={`bg-gradient-to-r ${gradientColors[status.color]} h-4 rounded-full transition-all duration-1000 ease-out relative`}
                                style={{ width: `${animatedPercentage}%` }}
                            >
                                {/* Shimmer effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"
                                    style={{ backgroundSize: '200% 100%' }} />
                            </div>
                        </div>

                        {/* Percentage Badge */}
                        <div className={`absolute -top-1 transition-all duration-1000 ease-out transform -translate-x-1/2`}
                            style={{ left: `${Math.max(10, Math.min(90, animatedPercentage))}%` }}>
                            <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow-lg ${status.color === 'emerald' ? 'bg-emerald-500' :
                                status.color === 'amber' ? 'bg-amber-500' : 'bg-red-500'
                                }`}>
                                {Math.round(percentage)}%
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-2">
                        <span>0</span>
                        <span>50%</span>
                        <span>100%</span>
                    </div>
                </div>

                {/* LINE Quota Reset Countdown */}
                <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/10 border border-green-200/50 dark:border-green-700/30">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-lg">🔔</span>
                        <span className="text-sm font-bold text-green-700 dark:text-green-400">LINE Quota Reset</span>
                    </div>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-3">รีเซ็ตทุกวันที่ 1 ของเดือน</p>

                    <div className="flex justify-center gap-2">
                        <div className="bg-white dark:bg-gray-800 rounded-xl px-3 py-2 shadow-sm border border-green-100 dark:border-green-800/50">
                            <span className="text-xl font-black text-green-600 dark:text-green-400 block">{countdown.days}</span>
                            <span className="text-[9px] text-gray-400 uppercase font-bold">วัน</span>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl px-3 py-2 shadow-sm border border-green-100 dark:border-green-800/50">
                            <span className="text-xl font-black text-green-600 dark:text-green-400 block">{String(countdown.hours).padStart(2, '0')}</span>
                            <span className="text-[9px] text-gray-400 uppercase font-bold">ชม.</span>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl px-3 py-2 shadow-sm border border-green-100 dark:border-green-800/50">
                            <span className="text-xl font-black text-green-600 dark:text-green-400 block">{String(countdown.minutes).padStart(2, '0')}</span>
                            <span className="text-[9px] text-gray-400 uppercase font-bold">นาที</span>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl px-3 py-2 shadow-sm border border-green-100 dark:border-green-800/50">
                            <span className="text-xl font-black text-green-600 dark:text-green-400 block animate-pulse">{String(countdown.seconds).padStart(2, '0')}</span>
                            <span className="text-[9px] text-gray-400 uppercase font-bold">วินาที</span>
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 mt-4">
                    <button
                        onClick={fetchQuota}
                        disabled={loading}
                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/20 text-blue-600 dark:text-blue-400 font-bold hover:shadow-md transition border border-blue-200/50 dark:border-blue-700/30 disabled:opacity-50"
                    >
                        {loading ? '🔄 Loading...' : '🔄 Refresh'}
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold hover:shadow-lg hover:shadow-blue-500/30 transition transform active:scale-[0.98]"
                    >
                        ปิดหน้าต่าง
                    </button>
                </div>
            </div>
        </div>
    );
}

export default QuotaModal;
