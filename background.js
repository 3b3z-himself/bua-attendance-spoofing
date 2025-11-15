// Background service worker for the extension

let settings = {
  enabled: false,
  latitude: null,
  longitude: null,
  accuracy: 10,
  locationName: ''
};

let settingsLoaded = false;

// Load settings on extension startup
chrome.storage.sync.get(['spoofEnabled', 'latitude', 'longitude', 'accuracy', 'locationName'], (result) => {
  if (result) {
    settings = {
      enabled: result.spoofEnabled || false,
      latitude: result.latitude || null,
      longitude: result.longitude || null,
      accuracy: result.accuracy || 10,
      locationName: result.locationName || ''
    };
    settingsLoaded = true;
    console.log('Background: Settings loaded', settings);
  } else {
    settingsLoaded = true;
    console.log('Background: No stored settings, using defaults');
  }
});

// Listen for storage changes
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
  
  console.log('Background: Settings updated', settings);
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[background.js] Received message:', message.type);
  
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
  
  return true;
});

// Update badge when spoofing status changes
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
});
