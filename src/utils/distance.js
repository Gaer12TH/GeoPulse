import { GPS_CONFIG } from '../config/constants';

/**
 * Calculate distance between two coordinates in meters using Haversine formula
 */
export function getDistanceInMeters(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lng2 - lng1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000; // Return in meters
}

/**
 * Format distance for display
 */
export function formatDistance(meters) {
    if (meters === undefined || meters === null || isNaN(meters)) {
        return '?';
    }
    if (meters >= 1000) {
        return `${(meters / 1000).toFixed(1)} km`;
    }
    return `${Math.round(meters)} m`;
}

/**
 * Calculate ETA based on distance and speed
 */
export function calculateETA(distanceMeters, speedKmh = GPS_CONFIG.avgSpeedKmh) {
    const distanceKm = distanceMeters / 1000;
    const etaMinutes = Math.round((distanceKm / speedKmh) * 60);

    const now = new Date();
    const arrivalTime = new Date(now.getTime() + etaMinutes * 60 * 1000);
    const formattedTime = arrivalTime.toLocaleTimeString('th-TH', {
        hour: '2-digit',
        minute: '2-digit',
    });

    return {
        distanceKm: distanceKm.toFixed(2),
        etaMinutes,
        arrivalTime: formattedTime,
    };
}

/**
 * Format speed for display
 */
export function formatSpeed(speedMs) {
    if (speedMs === undefined || speedMs === null || speedMs < 0.1) return '0 km/h';

    const kmh = speedMs * 3.6; // Convert m/s to km/h

    if (kmh < 1) {
        return `${(speedMs).toFixed(2)} m/s`;
    } else if (kmh < 100) {
        return `${kmh.toFixed(1)} km/h`;
    } else {
        return `${Math.round(kmh)} km/h`;
    }
}

/**
 * Validate GPS coordinates with stricter checks
 */
export function isValidGPSCoordinate(lat, lng) {
    if (lat === null || lng === null || lat === undefined || lng === undefined) return false;

    lat = parseFloat(lat);
    lng = parseFloat(lng);
    if (isNaN(lat) || isNaN(lng)) return false;

    if (lat < -90 || lat > 90) return false;
    if (lng < -180 || lng > 180) return false;

    if (lat === 0 && lng === 0) return false;

    return true;
}

/**
 * Detect and filter speed anomalies
 */
export function isRealisticSpeed(speedMs, prevSpeed) {
    if (speedMs === null || speedMs === undefined || isNaN(speedMs)) return false;
    if (speedMs < 0) return false;
    if (speedMs > 50) return false; // Max 180 km/h

    // Check for unrealistic acceleration if we have prevSpeed
    if (prevSpeed !== undefined && prevSpeed !== null && !isNaN(prevSpeed)) {
        const acceleration = Math.abs(speedMs - prevSpeed);
        if (acceleration > 15) return false; // > 15 m/s² is too generic for cars
    }

    return true;
}

/**
 * Calculate speed between two positions
 */
export function calculateSpeed(prevPos, currentPos, prevTime, currentTime) {
    if (!isValidGPSCoordinate(prevPos.lat, prevPos.lng) ||
        !isValidGPSCoordinate(currentPos.lat, currentPos.lng)) {
        return 0;
    }

    const distance = getDistanceInMeters(
        prevPos.lat,
        prevPos.lng,
        currentPos.lat,
        currentPos.lng
    );

    // Ignore small movements (GPS noise under 3m)
    if (distance < 3) {
        return 0;
    }

    const timeDiff = (currentTime - prevTime) / 1000; // in seconds
    if (timeDiff <= 0.5) return 0; // Ignore very short intervals

    return distance / timeDiff; // m/s
}

/**
 * Apply Adaptive Kalman-like smoothing to speed
 */
export function smoothSpeed(currentSpeed, smoothedSpeed) {
    // Validate input
    if (currentSpeed === null || currentSpeed === undefined || isNaN(currentSpeed)) {
        return smoothedSpeed;
    }

    // Adaptive gain
    // Higher gain (0.35) for faster response when starting
    // Lower gain (0.20) when stable
    const kalmanGain = (smoothedSpeed < 0.5) ? 0.35 : 0.20;

    let newSmoothed = (currentSpeed * kalmanGain) + (smoothedSpeed * (1 - kalmanGain));

    // Floor very low speeds
    if (newSmoothed < 0.3) newSmoothed = 0;

    // Cap max speed
    if (newSmoothed > 50) newSmoothed = 50;

    return newSmoothed;
}
