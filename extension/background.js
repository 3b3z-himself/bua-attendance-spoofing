// Background service worker for the extension

// Store settings in memory
let settings = {
  enabled: false,
  latitude: null,
  longitude: null,
  accuracy: 10,
  locationName: ''
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
  console.log('Background: Settings updated', settings);
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'getSettings') {
    sendResponse(settings);
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
});
