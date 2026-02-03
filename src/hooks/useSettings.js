import { useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS } from '../config/constants';

/**
 * Custom hook for app settings management
 */
export function useSettings() {
    const [darkMode, setDarkMode] = useState(false);
    const [notifyMode, setNotifyMode] = useState('family'); // 'family' or 'private'

    // Initialize from localStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem(STORAGE_KEYS.theme);
        const savedNotifyMode = localStorage.getItem(STORAGE_KEYS.notifyMode);

        if (savedTheme === 'dark') {
            setDarkMode(true);
            document.documentElement.classList.add('dark');
        }

        if (savedNotifyMode) {
            setNotifyMode(savedNotifyMode);
        }
    }, []);

    // Toggle dark mode
    const toggleDarkMode = useCallback(() => {
        let newValue;
        setDarkMode((prev) => {
            newValue = !prev;
            localStorage.setItem(STORAGE_KEYS.theme, newValue ? 'dark' : 'light');

            if (newValue) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }

            return newValue;
        });
        return newValue;
    }, []);

    // Toggle notify mode
    const toggleNotifyMode = useCallback(() => {
        let newValue;
        setNotifyMode((prev) => {
            newValue = prev === 'family' ? 'private' : 'family';
            localStorage.setItem(STORAGE_KEYS.notifyMode, newValue);
            return newValue;
        });
        return newValue;
    }, []);

    return {
        darkMode,
        notifyMode,
        toggleDarkMode,
        toggleNotifyMode,
        setNotifyMode,
    };
}

export default useSettings;
