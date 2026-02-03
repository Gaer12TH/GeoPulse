// ==========================================
// CONFIGURATION
// ==========================================

// API URL - Google Apps Script Backend
// Set this in your .env file: VITE_API_URL=your_google_apps_script_url
export const API_URL = import.meta.env.VITE_API_URL || '';

// Contact List สำหรับระบบแชท
// Configure these IDs in your local environment
export const CONTACTS = [
    { id: import.meta.env.VITE_CONTACT_1_ID || '', name: '😺 Contact 1' },
    { id: import.meta.env.VITE_CONTACT_2_ID || '', name: '👩 Contact 2' },
    { id: import.meta.env.VITE_CONTACT_3_ID || '', name: '👨 Contact 3' },
    { id: import.meta.env.VITE_CONTACT_4_ID || '', name: '🐷 Contact 4' }
];

// User IDs สำหรับ notify mode
// Set these in your .env file
export const USER_ID = import.meta.env.VITE_USER_ID || ''; // Private mode
export const FAMILY_IDS = [
    import.meta.env.VITE_FAMILY_ID_1 || '',
    import.meta.env.VITE_FAMILY_ID_2 || '',
    import.meta.env.VITE_FAMILY_ID_3 || '',
];

// GPS Settings
export const GPS_CONFIG = {
    maxAccuracy: 50,           // Only use GPS with accuracy <= 50m
    minDistanceForSpeed: 3,    // m (ignore movements < 3m for speed calc)
    updateInterval: 5000,      // Update location every 5 seconds
    speedEMA: 0.3,             // EMA smoothing factor
    avgSpeedKmh: 40,           // Default average speed for ETA calculation
};

// Storage Keys
export const STORAGE_KEYS = {
    theme: 'geopulse_theme',
    notifyMode: 'geopulse_notify_mode',
    geofences: 'geopulse_geofences',
};
