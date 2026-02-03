import { useState, useEffect } from 'react';
import { runAllTests } from '../../utils/testSystem';
import confetti from 'canvas-confetti';

/**
 * Test System Modal
 * Runs diagnostics on device capabilities using the full test suite
 */
export function TestModal({ isOpen, onClose }) {
    const [results, setResults] = useState([]);
    const [running, setRunning] = useState(false);
    const [progress, setProgress] = useState({ percent: 0, current: '' });

    useEffect(() => {
        if (isOpen) {
            setResults([]);
            setRunning(false);
            setProgress({ percent: 0, current: '' });
        }
    }, [isOpen]);

    const handleRunTests = async () => {
        setRunning(true);
        setResults([]);

        try {
            const finalResults = await runAllTests((percent, name) => {
                setProgress({ percent, current: name });
            });

            setResults(finalResults);

            // Check if all passed
            const allPassed = finalResults.every(r => r.passed);
            if (allPassed) {
                triggerConfetti();
            }
        } catch (e) {
            console.error(e);
        } finally {
            setRunning(false);
        }
    };

    const triggerConfetti = () => {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        setTimeout(() => {
            confetti({ particleCount: 50, angle: 60, spread: 80 });
            confetti({ particleCount: 50, angle: 120, spread: 80 });
        }, 250);
    };

    if (!isOpen) return null;

    // Calculate Stats
    const total = results.length;
    const passed = results.filter(r => r.passed).length;
    const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;
    const avgTime = total > 0 ? Math.round(results.reduce((sum, r) => sum + r.duration, 0) / total) : 0;

    // Group by category for nicer display
    const grouped = results.reduce((acc, r) => {
        if (!acc[r.category]) acc[r.category] = [];
        acc[r.category].push(r);
        return acc;
    }, {});

    return (
        <div className="fixed inset-0 glass-modal-overlay flex items-center justify-center px-4 z-[10001]">
            <div className="glass-modal w-full max-w-md overflow-hidden transform transition-transform duration-300 p-6 flex flex-col max-h-[85vh] dark:bg-gray-900/95">
                <div className="flex justify-between items-center mb-4 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-violet-100 to-fuchsia-100 dark:from-violet-900/50 dark:to-fuchsia-900/50 rounded-xl flex items-center justify-center">
                            <span className="text-xl">🧪</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">System Tests</h3>
                    </div>
                    <button onClick={onClose} className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition text-gray-500 dark:text-gray-400">
                        ✕
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto min-h-[200px] scrollbar-hide">
                    {results.length === 0 && !running && (
                        <div className="text-center text-gray-400 dark:text-gray-500 py-12 flex flex-col items-center">
                            <span className="text-5xl mb-4 animate-float">🚀</span>
                            <p className="text-sm font-medium">พร้อมวิเคราะห์ความสามารถของระบบ</p>
                        </div>
                    )}

                    {running && (
                        <div className="space-y-4 py-8 px-4">
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 h-3 rounded-full transition-all duration-300 animate-pulse"
                                    style={{ width: `${progress.percent}%` }}
                                ></div>
                            </div>
                            <p className="text-center text-sm font-mono text-gray-500 dark:text-gray-400">
                                Testing: <span className="text-violet-600 dark:text-violet-400 font-semibold">{progress.current}</span>...
                            </p>
                        </div>
                    )}

                    {results.length > 0 && (
                        <div className="space-y-4 animate-fade-in">
                            {/* Summary Card */}
                            <div className={`p-4 rounded-2xl border-2 shadow-md ${passed === total
                                ? 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/20 border-emerald-200 dark:border-emerald-700/50'
                                : 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/20 border-amber-200 dark:border-amber-700/50'}`}>
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-bold text-gray-800 dark:text-gray-100">Summary</h4>
                                    <span className="text-2xl">{passed === total ? '✅' : '⚠️'}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-center">
                                    <div className="bg-white/70 dark:bg-gray-800/70 p-3 rounded-xl backdrop-blur-sm">
                                        <div className="text-2xl font-black text-gray-800 dark:text-white">{passed}/{total}</div>
                                        <div className="text-[10px] uppercase text-gray-500 dark:text-gray-400 font-bold">Passed</div>
                                    </div>
                                    <div className="bg-white/70 dark:bg-gray-800/70 p-3 rounded-xl backdrop-blur-sm">
                                        <div className="text-2xl font-black text-gray-800 dark:text-white">{passRate}%</div>
                                        <div className="text-[10px] uppercase text-gray-500 dark:text-gray-400 font-bold">Rate</div>
                                    </div>
                                </div>
                            </div>

                            {/* Detailed Results */}
                            {Object.entries(grouped).map(([category, items]) => (
                                <div key={category} className="space-y-2">
                                    <h5 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase ml-1 tracking-wider">{category}</h5>
                                    {items.map((res, idx) => (
                                        <div key={idx} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${res.passed
                                            ? 'bg-gradient-to-r from-emerald-50/50 to-teal-50/50 dark:from-emerald-900/20 dark:to-teal-900/10 border-emerald-100 dark:border-emerald-800/50'
                                            : 'bg-gradient-to-r from-red-50/50 to-rose-50/50 dark:from-red-900/20 dark:to-rose-900/10 border-red-100 dark:border-red-800/50'}`}>
                                            <div className="flex items-center gap-3">
                                                <span className="text-xl">{res.emoji}</span>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-800 dark:text-gray-100">{res.name}</p>
                                                    {res.message && <p className="text-xs text-red-500 dark:text-red-400">{res.message}</p>}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-[10px] font-mono px-2 py-1 rounded-lg ${res.duration < 50
                                                    ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400'
                                                    : 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400'}`}>
                                                    {res.duration}ms
                                                </span>
                                                <span>{res.passed ? '✅' : '❌'}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/10 shrink-0">
                    <button
                        onClick={handleRunTests}
                        disabled={running}
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 text-white font-bold hover:shadow-lg hover:shadow-violet-500/30 transition transform active:scale-[0.98] disabled:opacity-50 disabled:scale-100"
                    >
                        {running ? '🔄 Running Tests...' : results.length > 0 ? '🔄 Run Again' : '🚀 Start Diagnostic'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TestModal;
