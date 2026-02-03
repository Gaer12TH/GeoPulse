import { useState, useEffect, useCallback, useRef } from 'react';
import { calculateETA } from '../utils/distance';

/**
 * Custom hook for Dynamic Island state management
 */
export function useDynamicIsland() {
    const [state, setState] = useState('idle'); // idle, tracking, active, large
    const [content, setContent] = useState({
        title: 'GeoPulse',
        message: '',
        icon: '📍',
        status: 'wait', // wait, success, error, info
    });
    const [autoHideTimeout, setAutoHideTimeout] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const notificationActiveRef = useRef(false); // Track if notification is currently showing

    // Show notification - has priority over tracking
    const showNotification = useCallback(
        (title, message, status = 'info', duration = 3000) => {
            // Set notification active flag
            notificationActiveRef.current = true;

            setContent({
                title,
                message,
                icon: getIconForStatus(status),
                status,
            });
            setState('active');
            setIsExpanded(false); // Notifications collapse the island

            // Clear existing timeout
            if (autoHideTimeout) {
                clearTimeout(autoHideTimeout);
            }

            // Auto-hide after duration
            if (duration > 0) {
                const timeout = setTimeout(() => {
                    notificationActiveRef.current = false; // Clear notification flag
                    setState('idle');
                }, duration);
                setAutoHideTimeout(timeout);
            }
        },
        [autoHideTimeout]
    );

    // Show large notification
    const showLarge = useCallback(
        (title, value, unit, status = 'info') => {
            notificationActiveRef.current = true;

            setContent({
                title,
                message: value,
                unit,
                icon: getIconForStatus(status),
                status,
            });
            setState('large');
            setIsExpanded(true);

            // Auto-hide after 5 seconds
            if (autoHideTimeout) {
                clearTimeout(autoHideTimeout);
            }
            const timeout = setTimeout(() => {
                notificationActiveRef.current = false;
                setState('idle');
                setIsExpanded(false);
            }, 5000);
            setAutoHideTimeout(timeout);
        },
        [autoHideTimeout]
    );

    // Expand to show tracking info - DOES NOT override active notifications
    const showTracking = useCallback((name, distance, speed) => {
        // If notification is active, don't override it
        if (notificationActiveRef.current) {
            return;
        }

        if (isExpanded) {
            // Show large detail view
            let distDisplay = '-';
            let unitDisplay = 'meters';

            if (distance >= 1000) {
                distDisplay = (distance / 1000).toFixed(2);
                unitDisplay = 'km';
            } else {
                distDisplay = Math.round(distance);
                unitDisplay = 'm';
            }

            // Calculate ETA
            // If speed is very low (< 3 km/h), assume walking speed (5 km/h)
            const currentSpeedKmh = (speed || 0) * 3.6;
            const etaSpeed = currentSpeedKmh < 3 ? 5 : currentSpeedKmh;

            const { etaMinutes, arrivalTime } = calculateETA(distance, etaSpeed);
            const etaDisplay = `${etaMinutes} min • ${arrivalTime}`;

            setContent({
                title: name,
                message: distDisplay,
                unit: unitDisplay,
                eta: etaDisplay,
                icon: '📍',
                status: 'tracking'
            });
            setState('large');
        } else {
            // Standard pill view
            setContent({
                title: name,
                message: distance,
                speed,
                icon: '🚗',
                status: 'tracking',
            });
            setState('tracking');
        }
    }, [isExpanded]);

    // Toggle expansion
    const toggleExpand = useCallback(() => {
        setIsExpanded(prev => !prev);
    }, []);

    // Collapse to idle
    const collapse = useCallback(() => {
        notificationActiveRef.current = false;
        setState('idle');
        setIsExpanded(false);
    }, []);

    // Get icon based on status
    const getIconForStatus = (status) => {
        const icons = {
            success: '✅',
            error: '❌',
            info: '📍',
            warning: '⚠️',
            wait: '⏳',
            tracking: '🚗',
        };
        return icons[status] || '📍';
    };

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (autoHideTimeout) {
                clearTimeout(autoHideTimeout);
            }
        };
    }, [autoHideTimeout]);

    return {
        state,
        content,
        showNotification,
        showLarge,
        showTracking,
        toggleExpand,
        collapse,
    };
}

export default useDynamicIsland;
