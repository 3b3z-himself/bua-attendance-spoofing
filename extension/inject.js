// This script is injected into the page context to override the geolocation API

(() => {
  // Store original geolocation methods
  const originalGeolocation = navigator.geolocation;
  const originalGetCurrentPosition = navigator.geolocation.getCurrentPosition;
  const originalWatchPosition = navigator.geolocation.watchPosition;

  // Function to get settings from the extension
  function getSettings() {
    return new Promise((resolve) => {
      window.postMessage({ type: 'getGeolocationSettings' }, '*');

      function handleMessage(event) {
        if (event.data.type === 'geolocationSettings') {
          window.removeEventListener('message', handleMessage);
          resolve(event.data.settings);
        }
      }

      window.addEventListener('message', handleMessage);
    });
  }

  // Override getCurrentPosition
  navigator.geolocation.getCurrentPosition = async function(success, error, options) {
    try {
      const settings = await getSettings();

      if (settings && settings.enabled) {
        console.log('🌍 Geolocation Override Active:', settings.locationName);
        console.log('🌍 Returning FAKE location:', settings.latitude, settings.longitude);
        
        // Return spoofed location
        success({
          coords: {
            latitude: settings.latitude,
            longitude: settings.longitude,
            accuracy: settings.accuracy,
            altitude: null,
            altitudeAccuracy: null,
            heading: null,
            speed: null
          },
          timestamp: Date.now()
        });
      } else {
        // Use original geolocation if not enabled
        originalGetCurrentPosition.call(originalGeolocation, success, error, options);
      }
    } catch (err) {
      // Fallback to original if something goes wrong
      originalGetCurrentPosition.call(originalGeolocation, success, error, options);
    }
  };

  // Override watchPosition
  navigator.geolocation.watchPosition = async function(success, error, options) {
    try {
      const settings = await getSettings();

      if (settings && settings.enabled) {
        console.log('🌍 Watching FAKE location:', settings.latitude, settings.longitude);
        
        // Return spoofed location
        const watchId = setInterval(() => {
          success({
            coords: {
              latitude: settings.latitude,
              longitude: settings.longitude,
              accuracy: settings.accuracy,
              altitude: null,
              altitudeAccuracy: null,
              heading: null,
              speed: null
            },
            timestamp: Date.now()
          });
        }, 1000);

        // Return watch ID for clearWatch
        return watchId;
      } else {
        // Use original geolocation if not enabled
        return originalWatchPosition.call(originalGeolocation, success, error, options);
      }
    } catch (err) {
      // Fallback to original if something goes wrong
      return originalWatchPosition.call(originalGeolocation, success, error, options);
    }
  };

  // Keep original clearWatch method
  navigator.geolocation.clearWatch = originalGeolocation.clearWatch;

  console.log('[🌍 Geolocation Spoofer] API override script loaded');

  // ======= CAMERA OVERLAY FUNCTIONALITY =======

  const originalGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
  const originalEnumerateDevices = navigator.mediaDevices.enumerateDevices.bind(navigator.mediaDevices);

  // Function to get camera settings
  function getCameraSettings() {
    return new Promise((resolve) => {
      window.postMessage({ type: 'getCameraSettings' }, '*');

      function handleMessage(event) {
        if (event.data.type === 'cameraSettings') {
          window.removeEventListener('message', handleMessage);
          resolve(event.data.settings);
        }
      }

      window.addEventListener('message', handleMessage);
      
      // Timeout fallback
      setTimeout(() => {
        window.removeEventListener('message', handleMessage);
        resolve(null);
      }, 1000);
    });
  }

  // Create overlay canvas for video
  function createOverlayCanvas(video, photoDataUrl, opacity, size, position) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    
    const img = new Image();
    img.src = photoDataUrl;
    
    img.onload = () => {
      function drawFrame() {
        // Draw video frame
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Calculate overlay dimensions
        const scale = size / 100;
        const overlayWidth = canvas.width * scale;
        const overlayHeight = (img.height / img.width) * overlayWidth;
        
        // Calculate position
        let x, y;
        switch (position) {
          case 'center':
            x = (canvas.width - overlayWidth) / 2;
            y = (canvas.height - overlayHeight) / 2;
            break;
          case 'top-left':
            x = 10;
            y = 10;
            break;
          case 'top-right':
            x = canvas.width - overlayWidth - 10;
            y = 10;
            break;
          case 'bottom-left':
            x = 10;
            y = canvas.height - overlayHeight - 10;
            break;
          case 'bottom-right':
            x = canvas.width - overlayWidth - 10;
            y = canvas.height - overlayHeight - 10;
            break;
          default:
            x = (canvas.width - overlayWidth) / 2;
            y = (canvas.height - overlayHeight) / 2;
        }
        
        // Draw overlay with opacity
        ctx.globalAlpha = opacity / 100;
        ctx.drawImage(img, x, y, overlayWidth, overlayHeight);
        ctx.globalAlpha = 1.0;
        
        requestAnimationFrame(drawFrame);
      }
      
      drawFrame();
    };
    
    return canvas;
  }

  // Override getUserMedia
  navigator.mediaDevices.getUserMedia = async function(constraints) {
    try {
      const settings = await getCameraSettings();
      
      // Get the original stream
      const stream = await originalGetUserMedia(constraints);
      
      // Check if we should apply overlay
      if (settings && settings.enabled && settings.photo && constraints.video) {
        console.log('📷 Camera Overlay Active');
        
        const videoTrack = stream.getVideoTracks()[0];
        const video = document.createElement('video');
        video.srcObject = new MediaStream([videoTrack]);
        video.autoplay = true;
        video.muted = true;
        
        await video.play();
        
        // Wait for video to be ready
        await new Promise((resolve) => {
          video.onloadedmetadata = resolve;
        });
        
        // Create overlay canvas
        const canvas = createOverlayCanvas(
          video, 
          settings.photo, 
          settings.opacity || 100, 
          settings.size || 100, 
          settings.position || 'center'
        );
        
        // Get stream from canvas
        const canvasStream = canvas.captureStream(30);
        const canvasVideoTrack = canvasStream.getVideoTracks()[0];
        
        // Replace original video track with canvas track
        const audioTracks = stream.getAudioTracks();
        const newStream = new MediaStream([canvasVideoTrack, ...audioTracks]);
        
        console.log('📷 Video overlay applied successfully');
        return newStream;
      }
      
      return stream;
    } catch (err) {
      console.error('Camera error:', err);
      throw err;
    }
  };

  // Listen for camera list requests
  window.addEventListener('message', async (event) => {
    if (event.source !== window) return;
    
    if (event.data.type === 'requestCameraList') {
      try {
        console.log('📷 Requesting camera list...');
        
        // First, request camera permission to get camera labels
        // Without this, camera labels will be empty strings
        let stream = null;
        try {
          stream = await originalGetUserMedia({ video: true, audio: false });
          console.log('📷 Camera permission granted');
        } catch (permErr) {
          console.warn('📷 Camera permission denied or no camera available:', permErr);
          // Continue anyway - we might still get device IDs
        }
        
        // Now enumerate devices - labels should be available
        const devices = await originalEnumerateDevices();
        const cameras = devices
          .filter(device => device.kind === 'videoinput')
          .map(device => ({
            deviceId: device.deviceId,
            label: device.label || `Camera ${device.deviceId.substring(0, 8)}`,
            kind: device.kind
          }));
        
        console.log('📷 Found cameras:', cameras);
        
        // Stop the permission stream if we opened one
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        
        window.postMessage({ 
          type: 'cameraList', 
          cameras: cameras,
          success: true
        }, '*');
        
      } catch (err) {
        console.error('📷 Could not enumerate devices:', err);
        window.postMessage({ 
          type: 'cameraList', 
          cameras: [],
          success: false,
          error: err.message
        }, '*');
      }
    }
  });

  console.log('[📷 Camera Overlay] Script loaded');
})();
