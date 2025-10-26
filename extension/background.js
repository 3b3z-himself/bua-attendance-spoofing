// Background service worker for the extension

// Store settings in memory
let settings = {
  enabled: false,
  latitude: null,
  longitude: null,
  accuracy: 10,
  locationName: ''
};

// Store camera settings in memory
let cameraSettings = {
  enabled: false,
  photo: null,
  selectedCamera: null,
  opacity: 100,
  size: 100,
  position: 'center'
};

// Load settings when extension starts
chrome.storage.sync.get(['spoofEnabled', 'latitude', 'longitude', 'accuracy', 'locationName'], (result) => {
  if (result) {
    settings = {
      enabled: result.spoofEnabled || false,
      latitude: result.latitude || null,
      longitude: result.longitude || null,
      accuracy: result.accuracy || 10,
      locationName: result.locationName || ''
    };
    console.log('Background: Settings loaded', settings);
  }
});

// Load camera settings when extension starts
chrome.storage.sync.get(['cameraOverlayEnabled', 'overlayPhoto', 'selectedCamera', 'overlayOpacity', 'overlaySize', 'overlayPosition'], (result) => {
  if (result) {
    cameraSettings = {
      enabled: result.cameraOverlayEnabled || false,
      photo: result.overlayPhoto || null,
      selectedCamera: result.selectedCamera || null,
      opacity: result.overlayOpacity || 100,
      size: result.overlaySize || 100,
      position: result.overlayPosition || 'center'
    };
    console.log('Background: Camera settings loaded', cameraSettings);
  }
});

// Listen for settings changes
chrome.storage.onChanged.addListener((changes) => {
  if (changes.spoofEnabled) {
    settings.enabled = changes.spoofEnabled.newValue;
  }
  if (changes.latitude) {
    settings.latitude = changes.latitude.newValue;
  }
  if (changes.longitude) {
    settings.longitude = changes.longitude.newValue;
  }
  if (changes.accuracy) {
    settings.accuracy = changes.accuracy.newValue;
  }
  if (changes.locationName) {
    settings.locationName = changes.locationName.newValue;
  }
  
  // Camera settings changes
  if (changes.cameraOverlayEnabled) {
    cameraSettings.enabled = changes.cameraOverlayEnabled.newValue;
  }
  if (changes.overlayPhoto) {
    cameraSettings.photo = changes.overlayPhoto.newValue;
  }
  if (changes.selectedCamera) {
    cameraSettings.selectedCamera = changes.selectedCamera.newValue;
  }
  if (changes.overlayOpacity) {
    cameraSettings.opacity = changes.overlayOpacity.newValue;
  }
  if (changes.overlaySize) {
    cameraSettings.size = changes.overlaySize.newValue;
  }
  if (changes.overlayPosition) {
    cameraSettings.position = changes.overlayPosition.newValue;
  }
  
  console.log('Background: Settings updated', settings);
  console.log('Background: Camera settings updated', cameraSettings);
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'getSettings') {
    console.log('💾 [background.js] Settings requested:', {
      enabled: settings.enabled,
      locationName: settings.locationName,
      latitude: settings.latitude,
      longitude: settings.longitude,
      accuracy: settings.accuracy
    });
    sendResponse(settings);
    return true;
  }
  
  if (message.type === 'getCameraSettings') {
    console.log('📷 [background.js] Camera settings requested:', cameraSettings);
    sendResponse(cameraSettings);
    return true;
  }
});

// Update badge when spoofing is enabled/disabled
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.spoofEnabled) {
    const isEnabled = changes.spoofEnabled.newValue;
    
    if (isEnabled) {
      chrome.action.setBadgeText({ text: 'ON' });
      chrome.action.setBadgeBackgroundColor({ color: '#28a745' });
    } else {
      chrome.action.setBadgeText({ text: '' });
    }
  }
  
  // Update badge for camera overlay
  if (namespace === 'sync' && changes.cameraOverlayEnabled) {
    const isCameraEnabled = changes.cameraOverlayEnabled.newValue;
    
    if (isCameraEnabled && settings.enabled) {
      chrome.action.setBadgeText({ text: '📷' });
    } else if (isCameraEnabled) {
      chrome.action.setBadgeText({ text: '📷' });
      chrome.action.setBadgeBackgroundColor({ color: '#007bff' });
    }
  }
});
