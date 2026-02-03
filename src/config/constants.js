// ==========================================
// CONFIGURATION
// ==========================================

// API URL - Google Apps Script Backend
export const API_URL = 'https://script.google.com/macros/s/AKfycbxlT1K95OszhfcJ_DSw4Cdxr5Xmf771mC2uyvijuF_ursqveoPwjRnQieHhiO3OR9nf/exec';

// Contact List สำหรับระบบแชท
export const CONTACTS = [
    { id: 'U040b0e7749d305a3767ca81393d9a4b6', name: '😺 แมวเด้ง' },
    { id: 'Uf3c9d54871b5639c76bda2acb10b907c', name: '👩 แม่' },
    { id: 'Ud10ccc6c969d5409b5c17362158b8abc', name: '👨 พ่อ' },
    { id: 'U8a1cd2d64381ad5eb0239d180337b313', name: '🐷 ตัวเอง' }
];

// User IDs สำหรับ notify mode
export const USER_ID = 'U040b0e7749d305a3767ca81393d9a4b6'; // Private mode
export const FAMILY_IDS = [
    'U8a1cd2d64381ad5eb0239d180337b313', // UID ของคุณ
    'Uf3c9d54871b5639c76bda2acb10b907c', // UID แม่
    'Ud10ccc6c969d5409b5c17362158b8abc', // UID พ่อ
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
