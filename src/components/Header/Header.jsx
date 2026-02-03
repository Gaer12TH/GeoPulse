import { useState } from 'react';

/**
 * Header Component with Mobile Menu
 */
export function Header({
    darkMode,
    notifyMode,
    onToggleDarkMode,
    onToggleNotifyMode,
    onOpenSOS,
    onOpenCheckIn,
    onOpenQuota,
    onOpenSystemInfo,
    onOpenTest,
    onOpenPocketMode,
    lastUpdate,
}) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setMobileMenuOpen((prev) => !prev);
    };

    return (
        <div
            className={`flex flex-col mb-6 sticky top-0 py-4 z-40 -mx-4 px-4 transition-all rounded-b-2xl ${mobileMenuOpen
                ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl border-b border-gray-200 dark:border-gray-800'
                : 'header-glass'
                }`}
        >
            <div className="flex justify-between items-center w-full">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white tracking-tight drop-shadow-sm shrink-0">
                    GeoPulse
                </h1>

                {/* Desktop Actions */}
                <div className="hidden sm:flex items-center gap-3 overflow-x-auto scrollbar-hide py-1 pl-2">
                    {/* Dark Mode Toggle */}
                    <button
                        onClick={onToggleDarkMode}
                        className="w-9 h-9 shrink-0 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 active:scale-95 transition shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-yellow-400"
                        title="เปลี่ยนโหมดสี"
                    >
                        <span>{darkMode ? '☀️' : '🌙'}</span>
                    </button>

                    {/* Family/Private Toggle */}
                    <button
                        onClick={onToggleNotifyMode}
                        className="w-9 h-9 shrink-0 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 active:scale-95 transition shadow-sm border border-gray-200 relative overflow-hidden"
                        title="เปลี่ยนโหมดการแจ้งเตือน"
                    >
                        <span className="text-sm">{notifyMode === 'family' ? '👨‍👩‍👧‍👦' : '😺'}</span>
                    </button>

                    {/* Quota Button */}
                    <button
                        onClick={onOpenQuota}
                        className="w-9 h-9 shrink-0 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 hover:bg-blue-200 active:scale-95 transition shadow-sm border border-blue-200"
                        title="เช็คโควต้า API"
                    >
                        <span className="text-xs">📊</span>
                    </button>

                    {/* System Info Button */}
                    <button
                        onClick={onOpenSystemInfo}
                        className="w-9 h-9 shrink-0 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 hover:bg-cyan-200 active:scale-95 transition shadow-sm border border-cyan-200"
                        title="ข้อมูลระบบ"
                    >
                        <span className="text-xs">ℹ️</span>
                    </button>

                    {/* Check-in Button */}
                    <button
                        onClick={onOpenCheckIn}
                        className="w-9 h-9 shrink-0 rounded-full bg-green-100 flex items-center justify-center text-green-600 hover:bg-green-200 active:scale-95 transition shadow-sm border border-green-200"
                        title="Check-in ทันที"
                    >
                        <span className="text-sm">📍</span>
                    </button>

                    {/* SOS Button */}
                    <button
                        onClick={onOpenSOS}
                        className="w-9 h-9 shrink-0 rounded-full bg-red-100 flex items-center justify-center text-red-600 hover:bg-red-200 active:scale-95 transition shadow-sm border border-red-200 animate-pulse"
                        title="แจ้งเหตุฉุกเฉิน / ส่งข้อความ"
                    >
                        <span className="font-bold text-[10px]">SOS</span>
                    </button>
                </div>

                {/* Mobile Hamburger Button */}
                <button
                    onClick={toggleMobileMenu}
                    className="sm:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-sm border border-gray-200 dark:border-gray-700 active:scale-95 transition"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
                <div className="sm:hidden mt-4 pt-4 border-t border-gray-200/50 dark:border-white/10 grid grid-cols-4 gap-2.5 animate-pop">
                    {/* Dark Mode */}
                    <button
                        onClick={() => { onToggleDarkMode(); }}
                        className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/20 border border-amber-200/60 dark:border-amber-700/40 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                        <span className="text-2xl drop-shadow-sm">{darkMode ? '☀️' : '🌙'}</span>
                        <span className="text-[10px] font-semibold bg-gradient-to-r from-amber-600 to-orange-500 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">Theme</span>
                    </button>

                    {/* Notify Mode - Changes color based on mode */}
                    <button
                        onClick={() => { onToggleNotifyMode(); }}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md ${notifyMode === 'family'
                            ? 'bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/20 border-indigo-200/60 dark:border-indigo-700/40'
                            : 'bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/30 dark:to-rose-900/20 border-pink-200/60 dark:border-pink-700/40'
                            }`}
                    >
                        <span className="text-2xl drop-shadow-sm">{notifyMode === 'family' ? '👨‍👩‍👧‍👦' : '😺'}</span>
                        <span className={`text-[10px] font-semibold bg-clip-text text-transparent ${notifyMode === 'family'
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-500 dark:from-indigo-400 dark:to-purple-400'
                            : 'bg-gradient-to-r from-pink-600 to-rose-500 dark:from-pink-400 dark:to-rose-400'
                            }`}>{notifyMode === 'family' ? 'Family' : 'Private'}</span>
                    </button>

                    {/* Tests */}
                    <button
                        onClick={() => { onOpenTest?.(); setMobileMenuOpen(false); }}
                        className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-violet-900/30 dark:to-fuchsia-900/20 border border-violet-200/60 dark:border-violet-700/40 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                        <span className="text-2xl drop-shadow-sm">🧪</span>
                        <span className="text-[10px] font-semibold bg-gradient-to-r from-violet-600 to-fuchsia-500 dark:from-violet-400 dark:to-fuchsia-400 bg-clip-text text-transparent">Tests</span>
                    </button>

                    {/* System Info */}
                    <button
                        onClick={() => { onOpenSystemInfo(); setMobileMenuOpen(false); }}
                        className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-gradient-to-br from-cyan-50 to-sky-50 dark:from-cyan-900/30 dark:to-sky-900/20 border border-cyan-200/60 dark:border-cyan-700/40 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                        <span className="text-2xl drop-shadow-sm">ℹ️</span>
                        <span className="text-[10px] font-semibold bg-gradient-to-r from-cyan-600 to-sky-500 dark:from-cyan-400 dark:to-sky-400 bg-clip-text text-transparent">System</span>
                    </button>

                    {/* Quota */}
                    <button
                        onClick={() => { onOpenQuota(); setMobileMenuOpen(false); }}
                        className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/20 border border-blue-200/60 dark:border-blue-700/40 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                        <span className="text-2xl drop-shadow-sm">📊</span>
                        <span className="text-[10px] font-semibold bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">Quota</span>
                    </button>

                    {/* Check-in */}
                    <button
                        onClick={() => { onOpenCheckIn(); setMobileMenuOpen(false); }}
                        className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/20 border border-emerald-200/60 dark:border-emerald-700/40 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                        <span className="text-2xl drop-shadow-sm">📍</span>
                        <span className="text-[10px] font-semibold bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">Check-in</span>
                    </button>

                    {/* SOS & Chat - spans 2 columns */}
                    <button
                        onClick={() => { onOpenSOS(); setMobileMenuOpen(false); }}
                        className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/40 dark:to-rose-900/30 border border-red-200/60 dark:border-red-700/50 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg col-span-2 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-rose-500/5 dark:from-red-500/10 dark:to-rose-500/10"></div>
                        <span className="text-2xl drop-shadow-sm animate-pulse">🚨</span>
                        <span className="text-[10px] font-bold bg-gradient-to-r from-red-600 to-rose-500 dark:from-red-400 dark:to-rose-400 bg-clip-text text-transparent">SOS & Chat</span>
                    </button>

                    {/* Pocket Mode - spans 2 columns */}
                    <button
                        onClick={() => { onOpenPocketMode?.(); setMobileMenuOpen(false); }}
                        className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-800/80 dark:to-gray-800/60 border border-slate-200/60 dark:border-slate-600/40 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md col-span-2"
                    >
                        <svg className="w-6 h-6 text-slate-600 dark:text-slate-300 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span className="text-[10px] font-semibold bg-gradient-to-r from-slate-600 to-gray-500 dark:from-slate-400 dark:to-gray-400 bg-clip-text text-transparent">Pocket Mode</span>
                    </button>
                </div>
            )}

            {/* Status Bar */}
            <div className="flex items-center gap-2 mt-3">
                <div className={`text-[11px] font-semibold px-4 py-2 rounded-full shadow-sm flex items-center gap-2 backdrop-blur-sm transition-all duration-300 ${notifyMode === 'family'
                        ? 'bg-gradient-to-r from-indigo-50/90 to-purple-50/90 dark:from-indigo-900/40 dark:to-purple-900/30 border border-indigo-200/50 dark:border-indigo-700/30 text-indigo-700 dark:text-indigo-300'
                        : 'bg-gradient-to-r from-pink-50/90 to-rose-50/90 dark:from-pink-900/40 dark:to-rose-900/30 border border-pink-200/50 dark:border-pink-700/30 text-pink-700 dark:text-pink-300'
                    }`}>
                    <span className="flex items-center gap-1">
                        <span className="text-base">{notifyMode === 'family' ? '👨‍👩‍👧‍👦' : '😺'}</span>
                        <span className="font-bold">{notifyMode === 'family' ? 'Family' : 'Private'}</span>
                    </span>
                    <span className="w-px h-3 bg-current opacity-20" />
                    <span className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full animate-pulse shadow-sm ${notifyMode === 'family'
                                ? 'bg-emerald-500 shadow-emerald-500/50'
                                : 'bg-emerald-400 shadow-emerald-400/50'
                            }`} />
                        <span className="text-gray-600 dark:text-gray-400 font-medium">{lastUpdate}</span>
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Header;
