(() => {
  const originalGeolocation = navigator.geolocation;
  const originalGetCurrentPosition = navigator.geolocation.getCurrentPosition;
  const originalWatchPosition = navigator.geolocation.watchPosition;
  
  const watchIds = new Map();
  let nextWatchId = 1;

  // Fallback to localStorage for cross-origin iframe scenarios where postMessage might be blocked
  function getSettings() {
    return new Promise((resolve) => {
      let resolved = false;
      let attemptCount = 0;
      const maxAttempts = 10;
      
      function tryGetSettings() {
        attemptCount++;
        
        // Try localStorage first (set by content.js)
        try {
          const stored = localStorage.getItem('__geo_spoof_settings__');
          if (stored && !resolved) {
            resolved = true;
            console.log('✓ Geolocation settings from localStorage:', JSON.parse(stored));
            resolve(JSON.parse(stored));
            return;
          }
        } catch (e) {
          // localStorage might be blocked
        }
        
        if (attemptCount === 1) {
          window.postMessage({ type: 'getGeolocationSettings' }, '*');
        }
        
        // Retry with exponential backoff
        if (attemptCount < maxAttempts) {
          setTimeout(tryGetSettings, 100 * attemptCount);
        } else if (!resolved) {
          resolved = true;
          console.warn('⚠️ Geolocation settings timeout - using real location');
          resolve({
            enabled: false,
            latitude: null,
            longitude: null,
            accuracy: 10
          });
        }
      }

      function handleMessage(event) {
        if (event.data.type === 'geolocationSettings' && !resolved) {
          resolved = true;
          window.removeEventListener('message', handleMessage);
          console.log('✓ Geolocation settings received via postMessage:', event.data.settings);
          resolve(event.data.settings || {});
        }
      }

      window.addEventListener('message', handleMessage);
      // Start attempting to get settings
      tryGetSettings();
    });
  }

  navigator.geolocation.getCurrentPosition = async function(success, error, options) {
    try {
      const settings = await getSettings();

      if (settings && settings.enabled && settings.latitude !== null && settings.longitude !== null) {
        const fakeCoords = {
          latitude: parseFloat(settings.latitude),
          longitude: parseFloat(settings.longitude),
          accuracy: parseFloat(settings.accuracy) || 10,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null
        };
        
        console.log('🌍 ====== GEOLOCATION SPOOFING ACTIVE ======');
        console.log('🌍 Location Name:', settings.locationName || 'Custom Location');
        console.log('🌍 Latitude:', fakeCoords.latitude);
        console.log('🌍 Longitude:', fakeCoords.longitude);
        console.log('🌍 Accuracy:', fakeCoords.accuracy + 'm');
        console.log('🌍 Timestamp:', new Date().toLocaleString());
        console.log('🌍 ==========================================');
        
        success({
          coords: fakeCoords,
          timestamp: Date.now()
        });
      } else {
        console.log('🌍 ⚠️ Geolocation spoofing disabled - using real location');
        originalGetCurrentPosition.call(originalGeolocation, success, error, options);
      }
    } catch (err) {
      console.error('🌍 ❌ Geolocation error:', err);
      originalGetCurrentPosition.call(originalGeolocation, success, error, options);
    }
  };

  navigator.geolocation.watchPosition = async function(success, error, options) {
    try {
      const settings = await getSettings();
      const watchId = nextWatchId++;

      if (settings && settings.enabled && settings.latitude !== null && settings.longitude !== null) {
        const fakeCoords = {
          latitude: parseFloat(settings.latitude),
          longitude: parseFloat(settings.longitude),
          accuracy: parseFloat(settings.accuracy) || 10,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null
        };
        
        console.log('🌍 ====== GEOLOCATION WATCH STARTED ======');
        console.log('🌍 Watch ID:', watchId);
        console.log('🌍 Location Name:', settings.locationName || 'Custom Location');
        console.log('🌍 Latitude:', fakeCoords.latitude);
        console.log('🌍 Longitude:', fakeCoords.longitude);
        console.log('🌍 Accuracy:', fakeCoords.accuracy + 'm');
        console.log('🌍 =======================================');
        
        const intervalId = setInterval(() => {
          success({
            coords: fakeCoords,
            timestamp: Date.now()
          });
        }, 1000);

        watchIds.set(watchId, intervalId);
        return watchId;
      } else {
        console.log('🌍 ⚠️ Geolocation spoofing disabled - using real location watch');
        return originalWatchPosition.call(originalGeolocation, success, error, options);
      }
    } catch (err) {
      console.error('🌍 ❌ Watch position error:', err);
      return originalWatchPosition.call(originalGeolocation, success, error, options);
    }
  };

  navigator.geolocation.clearWatch = function(watchId) {
    if (watchIds.has(watchId)) {
      clearInterval(watchIds.get(watchId));
      watchIds.delete(watchId);
      console.log('🌍 Watch cleared:', watchId);
    } else {
      originalGeolocation.clearWatch.call(originalGeolocation, watchId);
    }
  };

  console.log('[🌍 Geolocation Spoofer] API override script loaded');
})();
