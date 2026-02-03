import { GPS_CONFIG } from '../config/constants';
import * as api from '../services/api';
import { getDistanceInMeters, calculateETA } from './distance';

/**
 * System Diagnostics Test Suite
 * Ported from index.html
 */

export const loadTests = () => [
    // 🌐 Category 1: Browser Capabilities
    {
        name: 'Geolocation API',
        emoji: '🌍',
        category: 'Browser',
        fn: async () => 'geolocation' in navigator
    },
    {
        name: 'GPS Position Access',
        emoji: '📍',
        category: 'Browser',
        fn: async () => {
            if (!('geolocation' in navigator)) return false;
            return new Promise((resolve) => {
                navigator.geolocation.getCurrentPosition(
                    () => resolve(true),
                    () => resolve(false),
                    { timeout: 3000, enableHighAccuracy: false }
                );
            });
        }
    },
    {
        name: 'Online Status',
        emoji: '📡',
        category: 'Browser',
        fn: async () => navigator.onLine
    },

    // 💾 Category 2: Storage & Data
    {
        name: 'LocalStorage',
        emoji: '💾',
        category: 'Storage',
        fn: async () => {
            try {
                const testKey = '_geopulse_test_' + Date.now();
                localStorage.setItem(testKey, 'test');
                const result = localStorage.getItem(testKey);
                localStorage.removeItem(testKey);
                return result === 'test';
            } catch (e) { return false; }
        }
    },

    // 🎵 Category 3: Media & Audio
    {
        name: 'Audio Context',
        emoji: '🎵',
        category: 'Media',
        fn: async () => {
            try {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                return !!AudioCtx;
            } catch (e) { return false; }
        }
    },
    {
        name: 'Vibration API',
        emoji: '📳',
        category: 'Media',
        fn: async () => 'vibrate' in navigator
    },

    // 🔋 Category 4: Power & Performance
    {
        name: 'Wake Lock API',
        emoji: '🔋',
        category: 'Power',
        fn: async () => 'wakeLock' in navigator
    },
    {
        name: 'Battery API',
        emoji: '🔌',
        category: 'Power',
        fn: async () => 'getBattery' in navigator
    },

    // 🧮 Category 5: GeoPulse Core Functions
    {
        name: 'Distance Calculation',
        emoji: '📏',
        category: 'Core',
        fn: async () => {
            // Bangkok to Chiang Mai ~585km
            const dist = getDistanceInMeters(13.7563, 100.5018, 18.7883, 98.9853);
            return dist > 525000 && dist < 650000;
        }
    },
    {
        name: 'ETA Calculation',
        emoji: '⏱️',
        category: 'Core',
        fn: async () => {
            const eta = calculateETA(1000, 18); // 1km at 18km/h (5m/s)
            return !!eta.arrivalTime;
        }
    },

    // 🌐 Category 6: API
    {
        name: 'API Connection',
        emoji: '🔗',
        category: 'API',
        fn: async () => {
            try {
                // Simple ping check if possible, or just check if API functions exist
                return typeof api.getQuota === 'function';
            } catch (e) { return false; }
        }
    },

    // 🎨 Category 7: UI
    {
        name: 'Dynamic Island',
        emoji: '🏝️',
        category: 'UI',
        fn: async () => !!document.querySelector('.dynamic-island')
    }
];

export async function runAllTests(onProgress) {
    const tests = loadTests();
    const results = [];

    for (let i = 0; i < tests.length; i++) {
        const test = tests[i];
        onProgress?.(Math.round((i / tests.length) * 100), test.name);

        try {
            const start = Date.now();
            const passed = await test.fn();
            const duration = Date.now() - start;

            results.push({
                ...test,
                passed,
                duration,
                status: passed ? 'success' : 'error'
            });
        } catch (e) {
            results.push({
                ...test,
                passed: false,
                duration: 0,
                status: 'error',
                message: e.message
            });
        }

        // Small delay for visual effect
        await new Promise(r => setTimeout(r, 100));
    }

    onProgress?.(100, 'Done');
    return results;
}
