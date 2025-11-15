// Inject our script into the page to override geolocation
const script = document.createElement('script');
script.src = chrome.runtime.getURL('inject.js');
script.onload = () => {
  script.remove();
};
(document.head || document.documentElement).appendChild(script);

console.log('🌍 Geolocation spoofer initializing...');

function preloadSettingsToLocalStorage() {
  chrome.runtime.sendMessage({ type: 'getSettings' }, (response) => {
    if (!chrome.runtime.lastError && response) {
      try {
        localStorage.setItem('__geo_spoof_settings__', JSON.stringify(response));
        console.log('✓ Settings pre-loaded to localStorage:', response);
      } catch (e) {
        console.warn('⚠️ Could not pre-load settings to localStorage:', e.message);
      }
    }
  });
}

// Pre-load settings immediately on page load
preloadSettingsToLocalStorage();

// Also re-load settings periodically to ensure they're fresh
setInterval(preloadSettingsToLocalStorage, 2000);

// Recursively inject script into all iframes (including nested ones)
function injectScriptIntoFrames() {
  try {
    const frames = document.querySelectorAll('iframe');
    
    frames.forEach((iframe, index) => {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        
        if (!iframeDoc) {
          console.warn(`⚠️ Cannot access iframe #${index} (${iframe.id || 'unnamed'}) - might be cross-origin or not loaded yet`);
          scheduleIframeRetry(iframe, index);
          return;
        }
        
        if (iframeDoc.querySelector('script[data-geo-spoof]')) {
          console.log(`✓ Geolocation script already in iframe #${index} (${iframe.id || 'unnamed'})`);
          return;
        }
        
        const iframeScript = iframeDoc.createElement('script');
        iframeScript.src = chrome.runtime.getURL('inject.js');
        iframeScript.setAttribute('data-geo-spoof', 'true');
        iframeScript.onload = () => {
          iframeScript.remove();
        };
        
        (iframeDoc.head || iframeDoc.documentElement).appendChild(iframeScript);
        console.log(`✓ Geolocation script injected into iframe #${index} (${iframe.id || 'unnamed'})`);
        
        injectScriptIntoNestedFrames(iframeDoc, index);
        
      } catch (err) {
        console.warn(`⚠️ Error injecting script into iframe #${index} (${iframe.id || 'unnamed'}):`, err.message);
        scheduleIframeRetry(iframe, index);
      }
    });
  } catch (err) {
    console.error('Error in injectScriptIntoFrames:', err);
  }
}

// Track retries to avoid infinite loops
const retryTracker = new WeakMap();

// Retry iframe injection after a delay with exponential backoff
function scheduleIframeRetry(iframe, index, attempt = 1) {
  if (attempt > 3) {
    console.warn(`⚠️ Max retries exceeded for iframe #${index}`);
    return;
  }
  
  const delay = Math.min(1000 * attempt, 3000);
  
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
        
        injectScriptIntoNestedFrames(iframeDoc, index);
      }
    } catch (err) {
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
          console.warn(`⚠️ Cannot access nested iframe [${parentIndex}.${index}]`);
          return;
        }
        
        if (nestedDoc.querySelector('script[data-geo-spoof]')) {
          console.log(`✓ Geolocation script already in nested iframe [${parentIndex}.${index}]`);
          return;
        }
        
        const nestedScript = nestedDoc.createElement('script');
        nestedScript.src = chrome.runtime.getURL('inject.js');
        nestedScript.setAttribute('data-geo-spoof', 'true');
        nestedScript.onload = () => {
          nestedScript.remove();
        };
        
        (nestedDoc.head || nestedDoc.documentElement).appendChild(nestedScript);
        console.log(`✓ Geolocation script injected into nested iframe [${parentIndex}.${index}]`);
        
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
        setTimeout(() => {
          injectScriptIntoFrames();
        }, 100);
      }
    } catch (err) {
      // Ignore cross-origin or inaccessible iframes
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

window.addEventListener('message', (event) => {
  if (event.source !== window) return;

  if (event.data.type === 'getGeolocationSettings') {
    console.log('📬 [content.js] Received settings request from inject.js');
    
    chrome.runtime.sendMessage({ type: 'getSettings' }, (response) => {
      if (chrome.runtime.lastError) {
        console.warn('⚠️ [content.js] Chrome runtime error:', chrome.runtime.lastError.message);
        const fallback = {
          enabled: false,
          latitude: null,
          longitude: null,
          accuracy: 10,
          locationName: ''
        };
        window.postMessage({
          type: 'geolocationSettings',
          settings: fallback
        }, '*');
        
        try {
          localStorage.setItem('__geo_spoof_settings__', JSON.stringify(fallback));
        } catch (e) {
          console.warn('Could not store settings in localStorage');
        }
        return;
      }
      
      if (!response) {
        console.warn('⚠️ [content.js] No response from background script');
        const fallback = {
          enabled: false,
          latitude: null,
          longitude: null,
          accuracy: 10,
          locationName: ''
        };
        window.postMessage({
          type: 'geolocationSettings',
          settings: fallback
        }, '*');
        
        try {
          localStorage.setItem('__geo_spoof_settings__', JSON.stringify(fallback));
        } catch (e) {
          console.warn('Could not store settings in localStorage');
        }
        return;
      }
      
      console.log('📤 [content.js] Sending settings to inject.js:', {
        enabled: response?.enabled,
        locationName: response?.locationName,
        latitude: response?.latitude,
        longitude: response?.longitude,
        accuracy: response?.accuracy
      });
      
      window.postMessage({
        type: 'geolocationSettings',
        settings: response
      }, '*');
      
      try {
        localStorage.setItem('__geo_spoof_settings__', JSON.stringify(response));
      } catch (e) {
        console.warn('⚠️ Could not store settings in localStorage:', e.message);
      }
    });
    
    return true;
  }
});
