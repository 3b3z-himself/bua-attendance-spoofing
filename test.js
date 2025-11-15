// Test page JavaScript
let watchId = null;

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  // Attach event listeners
  document.getElementById('test1-btn').addEventListener('click', testGetCurrentPosition);
  document.getElementById('test2-start-btn').addEventListener('click', testWatchPosition);
  document.getElementById('test2-stop-btn').addEventListener('click', stopWatching);
  document.getElementById('test3-btn').addEventListener('click', showOnMap);
  document.getElementById('test4-btn').addEventListener('click', checkExtension);
  
  console.log('🧪 TEST PAGE: Loaded and ready');
  console.log('🧪 TEST PAGE: If you see 🌍 logs, the extension is working');
});

function testGetCurrentPosition() {
  const resultDiv = document.getElementById('result1');
  resultDiv.style.display = 'block';
  resultDiv.textContent = 'Requesting location...';
  resultDiv.className = 'result info';
  
  console.log('🧪 TEST: Calling getCurrentPosition()');
  
  navigator.geolocation.getCurrentPosition(
    (position) => {
      console.log('🧪 TEST: Position received:', position);
      const result = `✓ SUCCESS!

Latitude: ${position.coords.latitude}
Longitude: ${position.coords.longitude}
Accuracy: ${position.coords.accuracy} meters
Timestamp: ${new Date(position.timestamp).toLocaleString()}

Full position object:
${JSON.stringify(position, null, 2)}`;
      
      resultDiv.textContent = result;
      resultDiv.className = 'result success';
    },
    (error) => {
      console.error('🧪 TEST: Error getting position:', error);
      resultDiv.textContent = `✗ ERROR: ${error.message}\n\nCode: ${error.code}`;
      resultDiv.className = 'result error';
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
}

function testWatchPosition() {
  const resultDiv = document.getElementById('result2');
  resultDiv.style.display = 'block';
  resultDiv.textContent = 'Starting to watch position...';
  resultDiv.className = 'result info';
  
  console.log('🧪 TEST: Calling watchPosition()');
  
  let updateCount = 0;
  watchId = navigator.geolocation.watchPosition(
    (position) => {
      updateCount++;
      console.log('🧪 TEST: Watch position update #' + updateCount, position);
      const result = `✓ Position Update #${updateCount}

Latitude: ${position.coords.latitude}
Longitude: ${position.coords.longitude}
Accuracy: ${position.coords.accuracy} meters
Time: ${new Date(position.timestamp).toLocaleTimeString()}`;
      
      resultDiv.textContent = result;
      resultDiv.className = 'result success';
    },
    (error) => {
      console.error('🧪 TEST: Watch position error:', error);
      resultDiv.textContent = `✗ ERROR: ${error.message}`;
      resultDiv.className = 'result error';
    }
  );
  
  console.log('🧪 TEST: Watch ID:', watchId);
}

function stopWatching() {
  if (watchId !== null) {
    console.log('🧪 TEST: Stopping watch:', watchId);
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
    
    const resultDiv = document.getElementById('result2');
    resultDiv.textContent += '\n\n⏸ Watching stopped';
  }
}

function showOnMap() {
  const resultDiv = document.getElementById('result3');
  const mapDiv = document.getElementById('map');
  resultDiv.style.display = 'block';
  resultDiv.textContent = 'Getting location for map...';
  resultDiv.className = 'result info';
  
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      
      // Use OpenStreetMap iframe
      mapDiv.innerHTML = `<iframe 
        width="100%" 
        height="300" 
        frameborder="0" 
        scrolling="no" 
        marginheight="0" 
        marginwidth="0" 
        src="https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.01},${lat-0.01},${lng+0.01},${lat+0.01}&layer=mapnik&marker=${lat},${lng}"
        style="border-radius: 8px;">
      </iframe>`;
      
      resultDiv.textContent = `✓ Map loaded!\n\nLocation: ${lat}, ${lng}`;
      resultDiv.className = 'result success';
    },
    (error) => {
      resultDiv.textContent = `✗ ERROR: ${error.message}`;
      resultDiv.className = 'result error';
    }
  );
}

function checkExtension() {
  const resultDiv = document.getElementById('result4');
  resultDiv.style.display = 'block';
  
  console.log('🧪 TEST: Checking extension status');
  console.log('Navigator.geolocation:', navigator.geolocation);
  console.log('getCurrentPosition:', navigator.geolocation.getCurrentPosition);
  console.log('watchPosition:', navigator.geolocation.watchPosition);
  
  const info = `Extension Check:

✓ navigator.geolocation exists: ${!!navigator.geolocation}
✓ getCurrentPosition exists: ${!!navigator.geolocation?.getCurrentPosition}
✓ watchPosition exists: ${!!navigator.geolocation?.watchPosition}

Check the Developer Console (F12) for detailed logs with 🌍 emoji.
Look for "Geolocation Override Active" message.

If you don't see the 🌍 logs, the extension may not be injecting properly.`;
  
  resultDiv.textContent = info;
  resultDiv.className = 'result info';
}
