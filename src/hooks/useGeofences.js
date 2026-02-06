import { useState, useCallback, useEffect, useRef } from 'react';
import * as api from '../services/api';
import { getDistanceInMeters } from '../utils/distance';

/**
 * Custom hook for geofence management
 * @param {Object} position - Current GPS position
 * @param {string} notifyMode - Notification mode (family/private)
 * @param {Function} onGeofenceEvent - Callback for enter/exit events: (type, geofence) => void
 */
export function useGeofences(position, notifyMode, onGeofenceEvent) {
    const [geofences, setGeofences] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Track previous isInside state for each geofence to detect enter/exit
    const prevInsideStatesRef = useRef({});

    // Fetch initial data
    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const data = await api.getData();
            if (data?.geofences) {
                setGeofences(data.geofences);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Update location and recalculate distances
    const updateLocation = useCallback(async () => {
        if (!position.lat || !position.lng) return { success: false };

        try {
            const data = await api.updateLocation(position.lat, position.lng, notifyMode);
            if (data?.geofences) {
                setGeofences(data.geofences);
            }
            return { success: true, data };
        } catch (err) {
            console.error('Failed to update location:', err);
            // Call error callback if provided
            if (onGeofenceEvent) {
                onGeofenceEvent('error', { message: 'ส่งข้อมูลล้มเหลว' });
            }
            return { success: false, error: err };
        }
    }, [position.lat, position.lng, notifyMode, onGeofenceEvent]);

    // Add geofence
    const addGeofence = useCallback(async (geofence) => {
        if (!position.lat || !position.lng) return;

        try {
            const data = await api.addGeofence(geofence, position.lat, position.lng);
            if (data?.geofences) {
                setGeofences(data.geofences);
            }
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [position.lat, position.lng]);

    // Edit geofence
    const editGeofence = useCallback(async (geofence) => {
        if (!position.lat || !position.lng) return;

        try {
            const data = await api.editGeofence(geofence, position.lat, position.lng);
            if (data?.geofences) {
                setGeofences(data.geofences);
            }
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [position.lat, position.lng]);

    // Delete geofence
    const deleteGeofence = useCallback(async (id) => {
        try {
            const data = await api.deleteGeofence(id, position.lat, position.lng);
            if (data?.geofences) {
                setGeofences(data.geofences);
            }
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [position.lat, position.lng]);

    // Toggle geofence with optimistic update
    const toggleGeofence = useCallback(async (id, enabled) => {
        // Optimistic update - update UI immediately
        setGeofences((prev) =>
            prev.map((g) =>
                String(g.id) === String(id) ? { ...g, enabled } : g
            )
        );

        try {
            const data = await api.toggleGeofence(id, enabled, position.lat, position.lng);
            if (data?.geofences) {
                setGeofences(data.geofences);
            }
            return data;
        } catch (err) {
            // Revert on error
            setGeofences((prev) =>
                prev.map((g) =>
                    String(g.id) === String(id) ? { ...g, enabled: !enabled } : g
                )
            );
            setError(err.message);
            throw err;
        }
    }, [position.lat, position.lng]);

    // Calculate distances locally and detect enter/exit events
    const recalculateDistances = useCallback(() => {
        if (!position.lat || !position.lng) return;

        setGeofences((prev) => {
            const updated = prev.map((g) => {
                if (!g.lat || !g.lng) return g;
                const dist = getDistanceInMeters(position.lat, position.lng, g.lat, g.lng);
                const isInside = dist <= g.radius;

                // Only check enabled geofences for enter/exit events
                if (g.enabled && onGeofenceEvent) {
                    const prevIsInside = prevInsideStatesRef.current[g.id];

                    // Detect ENTER event (was outside, now inside)
                    if (prevIsInside === false && isInside === true) {
                        if (g.notifyEnter !== false) {
                            onGeofenceEvent('enter', g);
                        }
                    }
                    // Detect EXIT event (was inside, now outside)
                    else if (prevIsInside === true && isInside === false) {
                        if (g.notifyExit !== false) {
                            onGeofenceEvent('exit', g);
                        }
                    }

                    // Update previous state
                    prevInsideStatesRef.current[g.id] = isInside;
                }

                return {
                    ...g,
                    currentDistance: Math.round(dist),
                    isInside,
                };
            });
            return updated;
        });
    }, [position.lat, position.lng, onGeofenceEvent]);

    // Get nearest enabled geofence
    const getNearestGeofence = useCallback(() => {
        const enabled = geofences.filter((g) => g.enabled);
        if (enabled.length === 0) return null;

        return enabled.reduce((nearest, g) => {
            const dist = g.currentDistance ?? Infinity;
            const nearestDist = nearest?.currentDistance ?? Infinity;
            return dist < nearestDist ? g : nearest;
        }, null);
    }, [geofences]);

    // Fetch data on mount
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Recalculate distances when position changes
    useEffect(() => {
        recalculateDistances();
    }, [recalculateDistances]);

    return {
        geofences,
        loading,
        error,
        fetchData,
        updateLocation,
        addGeofence,
        editGeofence,
        deleteGeofence,
        toggleGeofence,
        getNearestGeofence,
    };
}

export default useGeofences;
