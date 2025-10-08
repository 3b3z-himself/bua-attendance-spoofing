const { ipcRenderer } = require('electron');

// DOM elements
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const statusCard = document.getElementById('status-card');
const statusText = document.getElementById('status-text');
const statusDetail = document.getElementById('status-detail');

const latInput = document.getElementById('latitude');
const lonInput = document.getElementById('longitude');
const cityInput = document.getElementById('city');
const countryInput = document.getElementById('country');
const portInput = document.getElementById('port');

// Preset buttons
const presetButtons = document.querySelectorAll('.preset-btn');

// Event listeners
startBtn.addEventListener('click', startProxy);
stopBtn.addEventListener('click', stopProxy);

presetButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    latInput.value = btn.dataset.lat;
    lonInput.value = btn.dataset.lon;
    cityInput.value = btn.dataset.city;
    countryInput.value = btn.dataset.country;
  });
});

async function startProxy() {
  const settings = {
    latitude: latInput.value,
    longitude: lonInput.value,
    city: cityInput.value,
    country: countryInput.value,
    port: parseInt(portInput.value)
  };

  // Validation
  if (!settings.latitude || !settings.longitude) {
    alert('Please enter latitude and longitude!');
    return;
  }

  if (Math.abs(settings.latitude) > 90) {
    alert('Latitude must be between -90 and 90!');
    return;
  }

  if (Math.abs(settings.longitude) > 180) {
    alert('Longitude must be between -180 and 180!');
    return;
  }

  startBtn.disabled = true;
  startBtn.textContent = '⏳ Starting...';

  try {
    const result = await ipcRenderer.invoke('start-proxy', settings);
    
    if (result.success) {
      updateStatus(true, settings.port);
      startBtn.disabled = true;
      stopBtn.disabled = false;
      startBtn.textContent = '▶️ Start Proxy';
    } else {
      alert(`Failed to start proxy: ${result.error}`);
      startBtn.disabled = false;
      startBtn.textContent = '▶️ Start Proxy';
    }
  } catch (error) {
    alert(`Error: ${error.message}`);
    startBtn.disabled = false;
    startBtn.textContent = '▶️ Start Proxy';
  }
}

async function stopProxy() {
  stopBtn.disabled = true;
  stopBtn.textContent = '⏳ Stopping...';

  try {
    const result = await ipcRenderer.invoke('stop-proxy');
    
    if (result.success) {
      updateStatus(false);
      startBtn.disabled = false;
      stopBtn.disabled = true;
      stopBtn.textContent = '⏹️ Stop Proxy';
    } else {
      alert(`Failed to stop proxy: ${result.error}`);
      stopBtn.disabled = false;
      stopBtn.textContent = '⏹️ Stop Proxy';
    }
  } catch (error) {
    alert(`Error: ${error.message}`);
    stopBtn.disabled = false;
    stopBtn.textContent = '⏹️ Stop Proxy';
  }
}

function updateStatus(running, port) {
  if (running) {
    statusCard.classList.add('active');
    statusText.textContent = '✅ Proxy Running';
    statusDetail.textContent = `Active on localhost:${port} - Configure your browser to use this proxy`;
  } else {
    statusCard.classList.remove('active');
    statusText.textContent = '❌ Not Running';
    statusDetail.textContent = 'Configure and start the proxy';
  }
}

// Initialize status on load
(async () => {
  const status = await ipcRenderer.invoke('get-status');
  if (status.running) {
    startBtn.disabled = true;
    stopBtn.disabled = false;
    updateStatus(true, portInput.value);
  }
})();
