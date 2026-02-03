/**
 * Floating Action Button Component
 */
export function FAB({ onClick, disabled }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="fixed safe-bottom right-6 fab-glass text-white rounded-full w-16 h-16 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed z-40 group"
        >
            <svg
                className="w-7 h-7 group-hover:rotate-90 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
        </button>
    );
}

export default FAB;
