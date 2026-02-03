import { useState, useEffect, useCallback, useRef } from 'react';
import { GPS_CONFIG } from '../config/constants';
import { calculateSpeed, smoothSpeed, isRealisticSpeed } from '../utils/distance';

/**
 * Custom hook for GPS geolocation tracking
 */
export function useGeolocation() {
    const [position, setPosition] = useState({
        lat: null,
        lng: null,
        accuracy: null,
    });
    const [speed, setSpeed] = useState(0);
    const [smoothedSpeed, setSmoothedSpeed] = useState(0);
    const [status, setStatus] = useState('idle'); // idle, connecting, tracking, error
    const [error, setError] = useState(null);

    const prevPosition = useRef({ lat: null, lng: null, time: null });
    const watchId = useRef(null);

    const handleSuccess = useCallback((pos) => {
        const { latitude: lat, longitude: lng, accuracy } = pos.coords;
        const currentTime = Date.now();

        // 1. [ENHANCED] Adaptive accuracy filtering
        // If accuracy is poor (>50m), trigger a warning but accept if it's the best we have in a while
        // For now, strict cutoff at 100m unless it's the first fix
        if (accuracy > 100 && prevPosition.current.lat) {
            console.warn(`GPS accuracy too low (${accuracy}m) - skipping`);
            return;
        }

        // 2. [NEW] Jump Detection (Anti-Teleport)
        if (prevPosition.current.lat && prevPosition.current.time) {
            const timeDiff = (currentTime - prevPosition.current.time) / 1000;
            if (timeDiff > 0) {
                // Calculate distance from last valid point
                const dist = calculateSpeed(prevPosition.current, { lat, lng }, prevPosition.current.time, currentTime) * timeDiff;

                // Max reasonable speed 60 m/s (216 km/h)
                const maxReasonableDist = timeDiff * 60;

                if (dist > maxReasonableDist && dist > 500) {
                    console.warn(`🚨 Suspicious jump detected: ${Math.round(dist)}m in ${Math.round(timeDiff)}s - ignoring`);
                    return;
                }
            }
        }

        // 3. Calculate Speed with Smoothing
        let newSpeed = 0;
        if (prevPosition.current.lat && prevPosition.current.time) {
            const rawSpeed = calculateSpeed(
                prevPosition.current,
                { lat, lng },
                prevPosition.current.time,
                currentTime
            );

            // Only update speed if it passes realistic check
            // Use current smoothedSpeed state which is available in closure if we properly manage deps
            // However, hook state 'smoothedSpeed' is not immediately available here without ref or deps
            setSmoothedSpeed(prevSmoothed => {
                if (isRealisticSpeed(rawSpeed, prevSmoothed)) {
                    const smoothed = smoothSpeed(rawSpeed, prevSmoothed);
                    setSpeed(rawSpeed);
                    return smoothed;
                } else {
                    return prevSmoothed * 0.9; // Decay if anomalous
                }
            });
        }

        // Update position
        setPosition({ lat, lng, accuracy });
        prevPosition.current = { lat, lng, time: currentTime };
        setStatus('tracking');
        setError(null);
    }, []);

    const handleError = useCallback((err) => {
        console.error('Geolocation error:', err);
        setStatus('error');
        setError(err.message);
    }, []);

    const startTracking = useCallback(() => {
        if (!navigator.geolocation) {
            setStatus('error');
            setError('Geolocation not supported');
            return;
        }

        setStatus('connecting');

        // Get initial position
        navigator.geolocation.getCurrentPosition(
            handleSuccess,
            handleError,
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );

        // Start watching
        watchId.current = navigator.geolocation.watchPosition(
            handleSuccess,
            handleError,
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 2000 }
        );
    }, [handleSuccess, handleError]);

    const stopTracking = useCallback(() => {
        if (watchId.current !== null) {
            navigator.geolocation.clearWatch(watchId.current);
            watchId.current = null;
        }
        setStatus('idle');
    }, []);

    // Auto-start on mount
    useEffect(() => {
        startTracking();
        return () => stopTracking();
    }, [startTracking, stopTracking]);

    return {
        position,
        speed,
        smoothedSpeed,
        status,
        error,
        startTracking,
        stopTracking,
    };
}

export default useGeolocation;
