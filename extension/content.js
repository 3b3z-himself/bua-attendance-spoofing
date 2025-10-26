// Inject our script into the page to override geolocation
const script = document.createElement('script');
script.src = chrome.runtime.getURL('inject.js');
script.onload = () => {
  script.remove();
};
(document.head || document.documentElement).appendChild(script);

console.log('🌍 Geolocation spoofer initializing...');

// Function to recursively inject script into all iframes (including nested ones)
function injectScriptIntoFrames() {
  try {
    const frames = document.querySelectorAll('iframe');
    
    frames.forEach((iframe, index) => {
      try {
        // Try to access iframe's content document
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        
        if (!iframeDoc) {
          console.warn(`⚠️ Cannot access iframe #${index} (${iframe.id || 'unnamed'}) - might be cross-origin or not loaded yet`);
          // Schedule retry for later
          scheduleIframeRetry(iframe, index);
          return;
        }
        
        // Check if script already injected
        if (iframeDoc.querySelector('script[data-geo-spoof]')) {
          console.log(`✓ Geolocation script already in iframe #${index} (${iframe.id || 'unnamed'})`);
          return;
        }
        
        // Create and inject script into iframe
        const iframeScript = iframeDoc.createElement('script');
        iframeScript.src = chrome.runtime.getURL('inject.js');
        iframeScript.setAttribute('data-geo-spoof', 'true');
        iframeScript.onload = () => {
          iframeScript.remove();
        };
        
        (iframeDoc.head || iframeDoc.documentElement).appendChild(iframeScript);
        console.log(`✓ Geolocation script injected into iframe #${index} (${iframe.id || 'unnamed'})`);
        
        // Recursively check for nested iframes
        injectScriptIntoNestedFrames(iframeDoc, index);
        
      } catch (err) {
        console.warn(`⚠️ Error injecting script into iframe #${index} (${iframe.id || 'unnamed'}):`, err.message);
        // Schedule retry
        scheduleIframeRetry(iframe, index);
      }
    });
  } catch (err) {
    console.error('Error in injectScriptIntoFrames:', err);
  }
}

// Track retries to avoid infinite loops
const retryTracker = new WeakMap();

// Function to retry iframe injection after a delay
function scheduleIframeRetry(iframe, index, attempt = 1) {
  if (attempt > 3) {
    console.warn(`⚠️ Max retries exceeded for iframe #${index}`);
    return;
  }
  
  const delay = Math.min(1000 * attempt, 3000); // Exponential backoff: 1s, 2s, 3s
  
  setTimeout(() => {
    try {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (iframeDoc && !iframeDoc.querySelector('script[data-geo-spoof]')) {
        console.log(`🔄 Retrying iframe injection #${index} (attempt ${attempt})...`);
        
        const iframeScript = iframeDoc.createElement('script');
        iframeScript.src = chrome.runtime.getURL('inject.js');
        iframeScript.setAttribute('data-geo-spoof', 'true');
        iframeScript.onload = () => {
          iframeScript.remove();
        };
        
        (iframeDoc.head || iframeDoc.documentElement).appendChild(iframeScript);
        console.log(`✓ Geolocation script injected into iframe #${index} on retry`);
        
        // Check for nested iframes
        injectScriptIntoNestedFrames(iframeDoc, index);
      }
    } catch (err) {
      // Schedule another retry if still failing
      scheduleIframeRetry(iframe, index, attempt + 1);
    }
  }, delay);
}

// Function to handle nested iframes
function injectScriptIntoNestedFrames(parentDoc, parentIndex, depth = 1) {
  const MAX_DEPTH = 10; // Prevent infinite recursion
  
  if (depth > MAX_DEPTH) {
    console.warn(`⚠️ Maximum iframe nesting depth (${MAX_DEPTH}) reached`);
    return;
  }
  
  try {
    const nestedFrames = parentDoc.querySelectorAll('iframe');
    
    nestedFrames.forEach((nestedIframe, index) => {
      try {
        const nestedDoc = nestedIframe.contentDocument || nestedIframe.contentWindow?.document;
        
        if (!nestedDoc) {
          console.warn(`⚠️ Cannot access nested iframe [${parentIndex}.${index}] (${nestedIframe.id || 'unnamed'}) - might be cross-origin or not loaded yet`);
          return;
        }
        
        // Check if script already injected
        if (nestedDoc.querySelector('script[data-geo-spoof]')) {
          console.log(`✓ Geolocation script already in nested iframe [${parentIndex}.${index}]`);
          return;
        }
        
        // Inject script into nested iframe
        const nestedScript = nestedDoc.createElement('script');
        nestedScript.src = chrome.runtime.getURL('inject.js');
        nestedScript.setAttribute('data-geo-spoof', 'true');
        nestedScript.onload = () => {
          nestedScript.remove();
        };
        
        (nestedDoc.head || nestedDoc.documentElement).appendChild(nestedScript);
        console.log(`✓ Geolocation script injected into nested iframe [${parentIndex}.${index}]`);
        
        // Recursively check for deeper nested iframes
        injectScriptIntoNestedFrames(nestedDoc, `${parentIndex}.${index}`, depth + 1);
        
      } catch (err) {
        console.warn(`⚠️ Error injecting script into nested iframe [${parentIndex}.${index}]:`, err.message);
      }
    });
  } catch (err) {
    console.error(`Error in injectScriptIntoNestedFrames at depth ${depth}:`, err);
  }
}

// Wait for iframe to load and inject
function waitForIframeAndInject(iframe, selector, maxAttempts = 10) {
  let attempts = 0;
  
  const checkInterval = setInterval(() => {
    attempts++;
    
    try {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (iframeDoc && iframeDoc.readyState === 'complete') {
        clearInterval(checkInterval);
        // Give it an extra moment to ensure scripts are loaded
        setTimeout(() => {
          injectScriptIntoFrames();
        }, 100);
      }
    } catch (err) {
      // Still cross-origin or not accessible
    }
    
    if (attempts >= maxAttempts) {
      clearInterval(checkInterval);
    }
  }, 500);
}

// Inject into iframes when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM loaded - injecting into iframes...');
    injectScriptIntoFrames();
  });
} else {
  console.log('📄 DOM already loaded - injecting into iframes...');
  injectScriptIntoFrames();
}

// Also inject when page is fully loaded (for late-loading iframes)
window.addEventListener('load', () => {
  console.log('🔄 Page fully loaded - checking for iframes...');
  setTimeout(injectScriptIntoFrames, 500);
});

// Watch for dynamically added iframes
const observer = new MutationObserver((mutations) => {
  let hasNewFrames = false;
  const addedFrames = [];
  
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList') {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.tagName === 'IFRAME') {
            hasNewFrames = true;
            addedFrames.push(node.id || 'unnamed');
            
            // Try to inject immediately for synchronous iframes
            try {
              const iframeDoc = node.contentDocument || node.contentWindow?.document;
              if (iframeDoc) {
                const iframeScript = iframeDoc.createElement('script');
                iframeScript.src = chrome.runtime.getURL('inject.js');
                iframeScript.setAttribute('data-geo-spoof', 'true');
                (iframeDoc.head || iframeDoc.documentElement).appendChild(iframeScript);
                console.log(`✓ Immediate injection into new iframe: ${node.id || 'unnamed'}`);
              } else {
                // Schedule for later
                node.addEventListener('load', () => {
                  injectScriptIntoFrames();
                }, { once: true });
              }
            } catch (err) {
              // Cross-origin, schedule retry
              node.addEventListener('load', () => {
                injectScriptIntoFrames();
              }, { once: true });
            }
          } else if (node.querySelectorAll) {
            const iframesInNode = node.querySelectorAll('iframe');
            if (iframesInNode.length > 0) {
              hasNewFrames = true;
              iframesInNode.forEach(f => addedFrames.push(f.id || 'unnamed'));
            }
          }
        }
      });
    }
  });
  
  if (hasNewFrames) {
    console.log(`📡 Detected new iframe(s): ${addedFrames.join(', ')}`);
    // Small delay to ensure iframe is fully loaded
    setTimeout(injectScriptIntoFrames, 500);
  }
});

observer.observe(document.documentElement, {
  childList: true,
  subtree: true
});

console.log('✓ Geolocation spoofer content script initialized with iframe support');

// Listen for messages from the injected script
window.addEventListener('message', (event) => {
  // Only accept messages from the same frame
  if (event.source !== window) return;

  if (event.data.type === 'getGeolocationSettings') {
    console.log('📬 [content.js] Received settings request from inject.js');
    
    // Request settings from background script
    chrome.runtime.sendMessage({ type: 'getSettings' }, (response) => {
      if (chrome.runtime.lastError) {
        console.warn('⚠️ [content.js] Chrome runtime error:', chrome.runtime.lastError);
        return;
      }
      
      // Log the settings being sent
      console.log('📤 [content.js] Sending settings to inject.js:', {
        enabled: response?.enabled,
        locationName: response?.locationName,
        latitude: response?.latitude,
        longitude: response?.longitude,
        accuracy: response?.accuracy
      });
      
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
      if (chrome.runtime.lastError) {
        console.warn('Chrome runtime error:', chrome.runtime.lastError);
        return;
      }
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
