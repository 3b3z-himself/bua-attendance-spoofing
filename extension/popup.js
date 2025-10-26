// Get DOM elements
const toggleSpoof = document.getElementById('toggle-spoof');
const statusText = document.getElementById('status-text');
const statusDiv = document.querySelector('.status');
const locationName = document.getElementById('location-name');
const latitude = document.getElementById('latitude');
const longitude = document.getElementById('longitude');
const accuracy = document.getElementById('accuracy');
const saveBtn = document.getElementById('save-btn');
const presetBtn = document.getElementById('preset-btn');
const presetList = document.getElementById('preset-list');
const currentInfo = document.getElementById('current-info');
const presetItems = document.querySelectorAll('.preset-item');
const testBtn = document.getElementById('test-btn');

// Open test page
testBtn.addEventListener('click', () => {
  chrome.tabs.create({
    url: chrome.runtime.getURL('test.html')
  });
});

// Open camera test page
const cameraTestBtn = document.getElementById('camera-test-btn');
cameraTestBtn.addEventListener('click', () => {
  chrome.tabs.create({
    url: chrome.runtime.getURL('camera-test.html')
  });
});

// Open iframe test page
const iframeTestBtn = document.getElementById('iframe-test-btn');
iframeTestBtn.addEventListener('click', () => {
  chrome.tabs.create({
    url: chrome.runtime.getURL('iframe-test.html')
  });
});

// Load saved settings
chrome.storage.sync.get(['spoofEnabled', 'locationName', 'latitude', 'longitude', 'accuracy'], (result) => {
  toggleSpoof.checked = result.spoofEnabled || false;
  updateStatus(result.spoofEnabled);
  
  if (result.locationName) locationName.value = result.locationName;
  if (result.latitude) latitude.value = result.latitude;
  if (result.longitude) longitude.value = result.longitude;
  if (result.accuracy) accuracy.value = result.accuracy;
  
  updateCurrentInfo(result);
});

// Toggle spoofing on/off
toggleSpoof.addEventListener('change', () => {
  const enabled = toggleSpoof.checked;
  
  chrome.storage.sync.get(['latitude', 'longitude', 'locationName', 'accuracy'], (result) => {
    chrome.storage.sync.set({ spoofEnabled: enabled }, () => {
      updateStatus(enabled);
      
      console.log('Toggle changed:', enabled ? 'ON' : 'OFF');
      
      // Pages will automatically pick up the change from storage
      // Just reload active tab to apply immediately
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        if (tabs[0]) {
          chrome.tabs.reload(tabs[0].id);
        }
      });
    });
  });
});

// Save location
saveBtn.addEventListener('click', () => {
  const lat = parseFloat(latitude.value);
  const lng = parseFloat(longitude.value);
  const acc = parseFloat(accuracy.value) || 10;
  const name = locationName.value.trim();
  
  // Validate inputs
  if (!name) {
    alert('Please enter a location name');
    return;
  }
  
  if (isNaN(lat) || lat < -90 || lat > 90) {
    alert('Please enter a valid latitude (-90 to 90)');
    return;
  }
  
  if (isNaN(lng) || lng < -180 || lng > 180) {
    alert('Please enter a valid longitude (-180 to 180)');
    return;
  }
  
  // Save to storage
  const settings = {
    locationName: name,
    latitude: lat,
    longitude: lng,
    accuracy: acc
  };
  
  chrome.storage.sync.set(settings, () => {
    updateCurrentInfo(settings);
    
    console.log('Location saved:', settings);
    
    // Show success feedback
    saveBtn.textContent = '✓ Saved!';
    saveBtn.style.background = '#28a745';
    
    setTimeout(() => {
      saveBtn.textContent = 'Save Location';
      saveBtn.style.background = '';
    }, 2000);
    
    // Reload active tab to apply changes
    if (toggleSpoof.checked) {
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        if (tabs[0]) {
          chrome.tabs.reload(tabs[0].id);
        }
      });
    }
  });
});

// Toggle preset list
presetBtn.addEventListener('click', () => {
  presetList.classList.toggle('hidden');
});

// Handle preset selection
presetItems.forEach((item) => {
  item.addEventListener('click', () => {
    const lat = item.dataset.lat;
    const lng = item.dataset.lng;
    const name = item.dataset.name;
    
    locationName.value = name;
    latitude.value = lat;
    longitude.value = lng;
    
    presetList.classList.add('hidden');
    
    // Auto-save the preset
    saveBtn.click();
  });
});

// Update status display
function updateStatus(enabled) {
  if (enabled) {
    statusText.textContent = 'Status: Active ✓';
    statusDiv.classList.add('active');
  } else {
    statusText.textContent = 'Status: Disabled';
    statusDiv.classList.remove('active');
  }
}

// Update current location display
function updateCurrentInfo(settings) {
  if (settings.locationName && settings.latitude && settings.longitude) {
    currentInfo.innerHTML = `
      <strong>${settings.locationName}</strong><br>
      Lat: ${settings.latitude}, Lng: ${settings.longitude}<br>
      Accuracy: ${settings.accuracy || 10}m
    `;
  } else {
    currentInfo.textContent = 'No location set';
  }
}

// ======= CAMERA OVERLAY FUNCTIONALITY =======

const toggleCamera = document.getElementById('toggle-camera');
const cameraStatusText = document.getElementById('camera-status-text');
const cameraStatusDiv = document.querySelector('.camera-section .status');
const photoUpload = document.getElementById('photo-upload');
const photoPreview = document.getElementById('photo-preview');
const previewImg = document.getElementById('preview-img');
const removePhoto = document.getElementById('remove-photo');
const cameraSelect = document.getElementById('camera-select');
const refreshCameras = document.getElementById('refresh-cameras');
const overlayOpacity = document.getElementById('overlay-opacity');
const opacityValue = document.getElementById('opacity-value');
const overlaySize = document.getElementById('overlay-size');
const sizeValue = document.getElementById('size-value');
const overlayPosition = document.getElementById('overlay-position');

// Load camera overlay settings
chrome.storage.sync.get(['cameraOverlayEnabled', 'overlayPhoto', 'selectedCamera', 'overlayOpacity', 'overlaySize', 'overlayPosition'], (result) => {
  toggleCamera.checked = result.cameraOverlayEnabled || false;
  updateCameraStatus(result.cameraOverlayEnabled);
  
  if (result.overlayPhoto) {
    previewImg.src = result.overlayPhoto;
    photoPreview.classList.remove('hidden');
  }
  
  if (result.selectedCamera) {
    // Will be populated when cameras are detected
  }
  
  if (result.overlayOpacity !== undefined) {
    overlayOpacity.value = result.overlayOpacity;
    opacityValue.textContent = result.overlayOpacity + '%';
  }
  
  if (result.overlaySize !== undefined) {
    overlaySize.value = result.overlaySize;
    sizeValue.textContent = result.overlaySize + '%';
  }
  
  if (result.overlayPosition) {
    overlayPosition.value = result.overlayPosition;
  }
});

// Toggle camera overlay on/off
toggleCamera.addEventListener('change', () => {
  const enabled = toggleCamera.checked;
  
  chrome.storage.sync.set({ cameraOverlayEnabled: enabled }, () => {
    updateCameraStatus(enabled);
    
    console.log('Camera Overlay Toggle:', enabled ? 'ON' : 'OFF');
    
    // Reload active tab to apply immediately
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.reload(tabs[0].id);
      }
    });
  });
});

// Handle photo upload
photoUpload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  if (!file.type.startsWith('image/')) {
    alert('Please select an image file');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = (e) => {
    const imageData = e.target.result;
    
    // Save to storage
    chrome.storage.sync.set({ overlayPhoto: imageData }, () => {
      previewImg.src = imageData;
      photoPreview.classList.remove('hidden');
      
      console.log('Photo saved to storage');
      
      // Show success feedback
      photoUpload.style.borderColor = '#28a745';
      setTimeout(() => {
        photoUpload.style.borderColor = '';
      }, 2000);
    });
  };
  
  reader.readAsDataURL(file);
});

// Remove photo
removePhoto.addEventListener('click', () => {
  chrome.storage.sync.set({ overlayPhoto: null }, () => {
    photoPreview.classList.add('hidden');
    previewImg.src = '';
    photoUpload.value = '';
    console.log('Photo removed from storage');
  });
});

// Request camera list from active tab
refreshCameras.addEventListener('click', () => {
  // Show loading state
  refreshCameras.textContent = '⏳ Loading...';
  refreshCameras.disabled = true;
  cameraSelect.innerHTML = '<option value="">Detecting cameras...</option>';
  
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    if (!tabs[0]) {
      refreshCameras.textContent = '🔄 Refresh Cameras';
      refreshCameras.disabled = false;
      cameraSelect.innerHTML = '<option value="">No active tab found</option>';
      alert('Please open a webpage first, then click refresh cameras');
      return;
    }
    
    chrome.tabs.sendMessage(tabs[0].id, { type: 'getCameras' }, (response) => {
      // Reset button state
      refreshCameras.textContent = '🔄 Refresh Cameras';
      refreshCameras.disabled = false;
      
      if (chrome.runtime.lastError) {
        console.error('Could not get cameras:', chrome.runtime.lastError);
        cameraSelect.innerHTML = '<option value="">Error: Refresh the page</option>';
        alert('Could not communicate with the page. Please refresh the webpage and try again.');
        return;
      }
      
      if (response && response.cameras) {
        if (response.cameras.length === 0) {
          cameraSelect.innerHTML = '<option value="">No cameras found</option>';
          alert('No cameras detected. Please:\n1. Make sure a camera is connected\n2. Allow camera permissions when prompted\n3. Try again');
        } else {
          populateCameraSelect(response.cameras);
          console.log('✅ Found', response.cameras.length, 'camera(s)');
        }
      } else {
        cameraSelect.innerHTML = '<option value="">Error detecting cameras</option>';
        alert('Failed to detect cameras. Please try again.');
      }
    });
  });
});

// Populate camera select dropdown
function populateCameraSelect(cameras) {
  cameraSelect.innerHTML = '<option value="">Select a camera...</option>';
  
  cameras.forEach((camera, index) => {
    const option = document.createElement('option');
    option.value = camera.deviceId;
    option.textContent = camera.label || `Camera ${index + 1}`;
    cameraSelect.appendChild(option);
  });
  
  // Load saved camera selection
  chrome.storage.sync.get(['selectedCamera'], (result) => {
    if (result.selectedCamera) {
      cameraSelect.value = result.selectedCamera;
    }
  });
}

// Save selected camera
cameraSelect.addEventListener('change', () => {
  const deviceId = cameraSelect.value;
  chrome.storage.sync.set({ selectedCamera: deviceId }, () => {
    console.log('Camera selected:', deviceId);
  });
});

// Update opacity slider
overlayOpacity.addEventListener('input', () => {
  const value = overlayOpacity.value;
  opacityValue.textContent = value + '%';
  chrome.storage.sync.set({ overlayOpacity: parseInt(value) });
});

// Update size slider
overlaySize.addEventListener('input', () => {
  const value = overlaySize.value;
  sizeValue.textContent = value + '%';
  chrome.storage.sync.set({ overlaySize: parseInt(value) });
});

// Update position dropdown
overlayPosition.addEventListener('change', () => {
  chrome.storage.sync.set({ overlayPosition: overlayPosition.value });
});

// Update camera status display
function updateCameraStatus(enabled) {
  if (enabled) {
    cameraStatusText.textContent = 'Camera Overlay: Active ✓';
    cameraStatusDiv.classList.add('active');
  } else {
    cameraStatusText.textContent = 'Camera Overlay: Disabled';
    cameraStatusDiv.classList.remove('active');
  }
}
