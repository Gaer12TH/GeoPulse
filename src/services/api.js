import { API_URL } from '../config/constants';

/**
 * Base API call to Google Apps Script backend
 */
async function callAPI(action, payload = {}) {
    if (!API_URL) {
        console.warn('API_URL not configured');
        return null;
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify({ action, ...payload }),
        });
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// ==========================================
// Geofence Operations
// ==========================================

export async function getData() {
    return callAPI('GET_DATA');
}

export async function updateLocation(lat, lng, notifyMode = 'family') {
    return callAPI('UPDATE_LOCATION', { lat, lng, notifyMode });
}

export async function addGeofence(geofence, lat, lng) {
    return callAPI('ADD_GEOFENCE', { payload: geofence, lat, lng });
}

export async function editGeofence(geofence, lat, lng) {
    return callAPI('EDIT_GEOFENCE', { payload: geofence, lat, lng });
}

export async function deleteGeofence(id, lat, lng) {
    return callAPI('DELETE_GEOFENCE', { id, lat, lng });
}

export async function toggleGeofence(id, enabled, lat, lng) {
    return callAPI('TOGGLE_GEOFENCE', { id, enabled, lat, lng });
}

// ==========================================
// Notifications & Actions
// ==========================================

export async function sendSOS(message, notifyMode = 'family') {
    return callAPI('SEND_SOS', { message, notifyMode });
}

export async function checkIn(lat, lng, notifyMode = 'family') {
    return callAPI('CHECK_IN', { lat, lng, notifyMode });
}

// ==========================================
// Chat Operations
// ==========================================

export async function sendChat(message, targetId, notifyMode = 'family') {
    return callAPI('SEND_CHAT', { message, targetId, notifyMode });
}

export async function getMessages(targetId = null) {
    return callAPI('GET_MESSAGES', { targetId });
}

export async function getContacts() {
    return callAPI('GET_CONTACTS');
}

export async function clearMessages() {
    return callAPI('CLEAR_MESSAGES');
}

// ==========================================
// Settings & System
// ==========================================

export async function setSettings(notifyMode) {
    return callAPI('SET_SETTINGS', { notifyMode });
}

export async function getQuota() {
    return callAPI('GET_QUOTA');
}

export async function cleanLogs() {
    return callAPI('CLEAN_LOGS');
}

export default {
    getData,
    updateLocation,
    addGeofence,
    editGeofence,
    deleteGeofence,
    toggleGeofence,
    sendSOS,
    checkIn,
    sendChat,
    getMessages,
    getContacts,
    clearMessages,
    setSettings,
    getQuota,
    cleanLogs,
};
