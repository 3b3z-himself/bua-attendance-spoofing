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
