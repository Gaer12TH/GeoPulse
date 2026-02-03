import { useState, useEffect, useCallback } from 'react';
import './index.css';

// Hooks
import { useGeolocation } from './hooks/useGeolocation';
import { useSettings } from './hooks/useSettings';
import { useGeofences } from './hooks/useGeofences';
import { useDynamicIsland } from './hooks/useDynamicIsland';

// Components
import { DynamicIsland } from './components/DynamicIsland/DynamicIsland';
import { Header } from './components/Header/Header';
import { GeofenceList } from './components/GeofenceList/GeofenceList';
import { FAB } from './components/common/FAB';
import { AddEditModal } from './components/Modals/AddEditModal';
import { DeleteModal } from './components/Modals/DeleteModal';
import { QuotaModal } from './components/Modals/QuotaModal';
import { SOSModal } from './components/Modals/SOSModal';
import { CheckInModal } from './components/Modals/CheckInModal';
import { SystemInfoModal } from './components/Modals/SystemInfoModal';
import { TestModal } from './components/Modals/TestModal';
import { PocketModeOverlay } from './components/PocketMode/PocketModeOverlay';

// Services
import * as api from './services/api';
import { playSound } from './utils/audio';

function App() {
  // Hooks
  const { position, speed, status: gpsStatus } = useGeolocation();
  const { darkMode, notifyMode, toggleDarkMode, toggleNotifyMode } = useSettings();
  const {
    geofences,
    loading,
    addGeofence,
    editGeofence,
    deleteGeofence,
    toggleGeofence,
    getNearestGeofence,
    updateLocation,
  } = useGeofences(position, notifyMode);
  const {
    state: islandState,
    content: islandContent,
    showNotification,
    showTracking,
    toggleExpand,
    collapse
  } = useDynamicIsland();

  // Local state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showQuotaModal, setShowQuotaModal] = useState(false);
  const [showSOSModal, setShowSOSModal] = useState(false);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showSystemInfoModal, setShowSystemInfoModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [showPocketMode, setShowPocketMode] = useState(false);
  const [editingGeofence, setEditingGeofence] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [lastUpdate, setLastUpdate] = useState('Connecting...');

  // Get nearest enabled geofence
  const nearestGeofence = getNearestGeofence();

  // Update Dynamic Island with tracking info
  useEffect(() => {
    if (nearestGeofence && gpsStatus === 'tracking') {
      showTracking(nearestGeofence.name, nearestGeofence.currentDistance, speed);
    } else if (islandState === 'tracking' || islandState === 'large') {
      // If we were tracking but lost it (or no geofence), collapse
      collapse();
    }
  }, [nearestGeofence, gpsStatus, speed, showTracking, collapse, islandState]);

  // Update last update time
  useEffect(() => {
    if (gpsStatus === 'tracking') {
      const now = new Date().toLocaleTimeString('th-TH', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setLastUpdate(now);
    }
  }, [position.lat, position.lng, gpsStatus]);

  // Periodically update location to backend
  useEffect(() => {
    if (position.lat && position.lng) {
      const interval = setInterval(() => {
        updateLocation();
      }, 10000); // Every 10 seconds

      return () => clearInterval(interval);
    }
  }, [position.lat, position.lng, updateLocation]);

  // Handlers
  const handleOpenAddModal = useCallback(() => {
    setEditingGeofence(null);
    setShowAddModal(true);
  }, []);

  const handleOpenEditModal = useCallback((id) => {
    const geo = geofences.find((g) => String(g.id) === String(id));
    if (geo) {
      setEditingGeofence(geo);
      setShowAddModal(true);
    }
  }, [geofences]);

  const handleCloseModal = useCallback(() => {
    setShowAddModal(false);
    setEditingGeofence(null);
  }, []);

  const handleSaveGeofence = useCallback(async (geofenceData, isEditing) => {
    try {
      if (isEditing) {
        await editGeofence(geofenceData);
      } else {
        await addGeofence(geofenceData);
      }
      showNotification('Saved', geofenceData.name, 'success');
      playSound('success');
    } catch (err) {
      showNotification('Error', 'Failed to save', 'error');
      playSound('error');
    }
  }, [addGeofence, editGeofence, showNotification]);

  const handleOpenDeleteModal = useCallback((id) => {
    setDeleteTargetId(id);
    setShowDeleteModal(true);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setDeleteTargetId(null);
    setShowDeleteModal(false);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (deleteTargetId) {
      try {
        await deleteGeofence(deleteTargetId);
        showNotification('Deleted', 'Location removed', 'info');
        playSound('info');
      } catch (err) {
        showNotification('Error', 'Failed to delete', 'error');
      }
    }
    handleCloseDeleteModal();
  }, [deleteTargetId, deleteGeofence, showNotification, handleCloseDeleteModal]);

  const handleToggleGeofence = useCallback(async (id, enabled) => {
    // Find geofence name for notification
    const geo = geofences.find((g) => String(g.id) === String(id));
    const geoName = geo?.name || 'สถานที่';

    try {
      await toggleGeofence(id, enabled);
      // Show notification on DynamicIsland
      if (enabled) {
        showNotification('เปิดการแจ้งเตือน', geoName, 'success');
      } else {
        showNotification('ปิดการแจ้งเตือน', geoName, 'info');
      }
    } catch (err) {
      console.error('Failed to toggle geofence:', err);
      showNotification('Error', 'ไม่สามารถเปลี่ยนสถานะได้', 'error');
    }
  }, [toggleGeofence, geofences, showNotification]);

  const handleCheckIn = useCallback(() => {
    setShowCheckInModal(true);
  }, []);

  const handleConfirmCheckIn = useCallback(async () => {
    if (!position.lat || !position.lng) return;
    try {
      await api.checkIn(position.lat, position.lng, notifyMode);
      showNotification('Check-in', 'สำเร็จ!', 'success');
      playSound('success');
      setShowCheckInModal(false);
    } catch (err) {
      showNotification('Error', 'Failed to check-in', 'error');
    }
  }, [position, notifyMode, showNotification]);

  const handleSOS = useCallback(() => {
    setShowSOSModal(true);
  }, []);

  const handleQuota = useCallback(() => {
    setShowQuotaModal(true);
  }, []);

  const handleSystemInfo = useCallback(() => {
    setShowSystemInfoModal(true);
  }, []);

  // Handle dark mode toggle with notification
  const handleToggleDarkMode = useCallback(() => {
    toggleDarkMode();
    showNotification(
      darkMode ? 'Light Mode' : 'Dark Mode',
      darkMode ? '☀️ เปลี่ยนเป็นโหมดสว่าง' : '🌙 เปลี่ยนเป็นโหมดมืด',
      'info'
    );
  }, [toggleDarkMode, darkMode, showNotification]);

  // Handle notify mode toggle with notification
  const handleToggleNotifyMode = useCallback(() => {
    toggleNotifyMode();
    showNotification(
      notifyMode === 'family' ? 'Private Mode' : 'Family Mode',
      notifyMode === 'family' ? '😺 สลับเป็นโหมดส่วนตัว' : '👨‍👩‍👧‍👦 สลับเป็นโหมดครอบครัว',
      'info'
    );
  }, [toggleNotifyMode, notifyMode, showNotification]);

  // Handle Test modal with notification
  const handleOpenTest = useCallback(() => {
    setShowTestModal(true);
    showNotification('Test Mode', '🧪 เปิดหน้าทดสอบ', 'info');
  }, [showNotification]);

  // Handle Pocket Mode with notification
  const handleOpenPocketMode = useCallback(() => {
    setShowPocketMode(true);
    showNotification('Pocket Mode', '👁️ เปิดโหมดกระเป๋า', 'info');
  }, [showNotification]);

  return (
    <div className={`pb-32 min-h-screen transition-colors duration-500 ${darkMode ? 'dark' : ''}`}>
      {/* Dynamic Island */}
      <DynamicIsland
        state={islandState}
        content={islandContent}
        gpsStatus={gpsStatus}
        nearest={nearestGeofence}
        speed={speed}
        onClick={toggleExpand}
      />

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 pt-14">
        {/* Header */}
        <Header
          darkMode={darkMode}
          notifyMode={notifyMode}
          onToggleDarkMode={handleToggleDarkMode}
          onToggleNotifyMode={handleToggleNotifyMode}
          onOpenSOS={handleSOS}
          onOpenCheckIn={handleCheckIn}
          onOpenQuota={handleQuota}
          onOpenSystemInfo={handleSystemInfo}
          onOpenTest={handleOpenTest}
          onOpenPocketMode={handleOpenPocketMode}
          lastUpdate={lastUpdate}
        />

        {/* Geofence List */}
        <GeofenceList
          geofences={geofences}
          loading={loading || gpsStatus === 'connecting'}
          onEdit={handleOpenEditModal}
          onDelete={handleOpenDeleteModal}
          onToggle={handleToggleGeofence}
        />
      </div>

      {/* FAB */}
      <FAB
        onClick={handleOpenAddModal}
        disabled={!position.lat || !position.lng}
      />

      {/* Modals */}
      <AddEditModal
        isOpen={showAddModal}
        onClose={handleCloseModal}
        onSave={handleSaveGeofence}
        editingGeofence={editingGeofence}
        currentPosition={position}
        geofences={geofences}
      />

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />

      <QuotaModal
        isOpen={showQuotaModal}
        onClose={() => setShowQuotaModal(false)}
      />

      <SOSModal
        isOpen={showSOSModal}
        onClose={() => setShowSOSModal(false)}
        notifyMode={notifyMode}
        onShowNotification={showNotification}
      />

      <CheckInModal
        isOpen={showCheckInModal}
        onClose={() => setShowCheckInModal(false)}
        onConfirm={handleConfirmCheckIn}
        position={position}
        loading={gpsStatus === 'connecting'}
      />

      <SystemInfoModal
        isOpen={showSystemInfoModal}
        onClose={() => setShowSystemInfoModal(false)}
        position={position}
        speed={speed}
        accuracy={position.accuracy}
      />

      <TestModal
        isOpen={showTestModal}
        onClose={() => setShowTestModal(false)}
        notifyMode={notifyMode}
      />

      <PocketModeOverlay
        isOpen={showPocketMode}
        onClose={() => setShowPocketMode(false)}
        position={position}
        speed={speed}
        nearestGeofence={nearestGeofence}
      />
    </div>
  );
}

export default App;
