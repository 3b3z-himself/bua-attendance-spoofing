// Inject our script into the page to override geolocation
const script = document.createElement('script');
script.src = chrome.runtime.getURL('inject.js');
(document.head || document.documentElement).appendChild(script);
script.onload = () => {
  script.remove();
};

// Listen for messages from the injected script
window.addEventListener('message', (event) => {
  // Only accept messages from the same frame
  if (event.source !== window) return;

  if (event.data.type === 'getGeolocationSettings') {
    // Request settings from background script
    chrome.runtime.sendMessage({ type: 'getSettings' }, (response) => {
      // Send settings back to the injected script
      window.postMessage({
        type: 'geolocationSettings',
        settings: response
      }, '*');
    });
  }
  
  if (event.data.type === 'getCameraSettings') {
    // Request camera overlay settings
    chrome.runtime.sendMessage({ type: 'getCameraSettings' }, (response) => {
      window.postMessage({
        type: 'cameraSettings',
        settings: response
      }, '*');
    });
  }
});

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'getCameras') {
    console.log('📷 Content script: Requesting camera list from page');
    
    // Forward request to the page
    window.postMessage({ type: 'requestCameraList' }, '*');
    
    // Set timeout for response
    let timeoutId;
    let responded = false;
    
    // Wait for response
    const handler = (event) => {
      if (event.source !== window) return;
      if (event.data.type === 'cameraList') {
        if (!responded) {
          responded = true;
          clearTimeout(timeoutId);
          window.removeEventListener('message', handler);
          
          console.log('📷 Content script: Received camera list', event.data.cameras);
          sendResponse({ 
            cameras: event.data.cameras || [],
            success: event.data.success !== false
          });
        }
      }
    };
    
    window.addEventListener('message', handler);
    
    // Timeout after 5 seconds
    timeoutId = setTimeout(() => {
      if (!responded) {
        responded = true;
        window.removeEventListener('message', handler);
        console.error('📷 Content script: Camera list request timed out');
        sendResponse({ 
          cameras: [],
          success: false,
          error: 'Request timed out'
        });
      }
    }, 5000);
    
    return true; // Keep channel open for async response
  }
});
