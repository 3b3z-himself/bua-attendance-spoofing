# Desktop Geolocation Spoofer - Network Level

## Desktop App Advantages

✅ **Can intercept ALL network traffic**  
✅ **Can modify HTTP/HTTPS requests and responses**  
✅ **Works system-wide (all browsers, all apps)**  
✅ **Can spoof IP geolocation API responses**  
✅ **Can set custom latitude/longitude**  
✅ **More powerful than browser extensions**  

---

## Architecture Options

### Option 1: Local Proxy Server (Recommended)
**How it works:**
1. Desktop app runs a local proxy server (localhost:8080)
2. Browser/system configured to use this proxy
3. Proxy intercepts IP geolocation API calls
4. Returns fake location data with your custom lat/lng

**Advantages:**
- Works for all applications
- Easy to implement
- Can be toggled on/off
- No system-level permissions needed (mostly)

### Option 2: System-Wide VPN/Tunnel
**How it works:**
1. Creates a virtual network adapter
2. Routes all traffic through the app
3. Intercepts and modifies traffic in transit
4. More complex but more powerful

**Advantages:**
- Completely transparent
- No browser configuration needed
- Can modify any traffic

### Option 3: DNS/Hosts File Modification
**How it works:**
1. Modifies system DNS or hosts file
2. Redirects IP geolocation domains to local server
3. Local server returns fake data

**Advantages:**
- Simple approach
- No proxy setup needed

---

## Tech Stack Options

### Option A: Python + mitmproxy
```python
# Perfect for intercepting HTTPS traffic
# Built-in certificate handling
# Easy to script custom responses
```

**Pros:** Easy to develop, powerful, well-documented  
**Cons:** Requires Python installation

### Option B: Node.js + Electron
```javascript
// Desktop UI with Electron
// Proxy server with Node.js
// Works cross-platform
```

**Pros:** Nice UI, cross-platform, JavaScript-based  
**Cons:** Larger app size

### Option C: Go + Fyne
```go
// Native performance
// Small binary size
// Cross-platform UI
```

**Pros:** Fast, small, no dependencies  
**Cons:** Steeper learning curve

### Option D: Rust + Tauri
```rust
// Modern, secure, fast
// Small binary size
// Web-based UI
```

**Pros:** Very fast, secure, modern  
**Cons:** Harder to learn

---

## Implementation Plan

### Quick Prototype (Python + mitmproxy)

**1. Install mitmproxy:**
```bash
pip install mitmproxy
```

**2. Create intercept script:**
```python
# geolocation_spoofer.py
from mitmproxy import http
import json

# Your custom location
FAKE_LOCATION = {
    "latitude": 48.8566,
    "longitude": 2.3522,
    "city": "Paris",
    "country": "France",
    "country_code": "FR"
}

def response(flow: http.HTTPFlow) -> None:
    # List of IP geolocation APIs
    geo_apis = [
        "ipapi.co",
        "ip-api.com",
        "ipinfo.io",
        "freegeoip",
        "geoip-db.com",
        "ipgeolocation.io"
    ]
    
    # Check if request is to a geolocation API
    if any(api in flow.request.pretty_url for api in geo_apis):
        print(f"[INTERCEPTED] {flow.request.pretty_url}")
        
        # Create fake response
        fake_data = {
            "ip": "185.156.177.123",  # Fake French IP
            "city": FAKE_LOCATION["city"],
            "region": "Île-de-France",
            "country": FAKE_LOCATION["country"],
            "country_code": FAKE_LOCATION["country_code"],
            "latitude": FAKE_LOCATION["latitude"],
            "longitude": FAKE_LOCATION["longitude"],
            "timezone": "Europe/Paris",
            "postal": "75001"
        }
        
        # Replace response
        flow.response = http.Response.make(
            200,
            json.dumps(fake_data),
            {"Content-Type": "application/json"}
        )
        
        print(f"[SPOOFED] Returned fake location: {FAKE_LOCATION['city']}")

addons = [
    response
]
```

**3. Run the proxy:**
```bash
mitmproxy -s geolocation_spoofer.py --listen-port 8080
```

**4. Configure browser to use proxy:**
```
Proxy: localhost
Port: 8080
```

**5. Install mitmproxy certificate:**
```bash
# Certificate will be at ~/.mitmproxy/mitmproxy-ca-cert.pem
# Import into browser/system trust store
```

---

## Full Desktop App (Electron + Node.js)

### Features:
- 🎨 **Nice UI** - Toggle on/off, select locations
- 🌍 **Custom Locations** - Set your own lat/lng
- 📍 **Presets** - Popular cities
- 🔄 **Auto-start** - Start with system
- 📊 **Request Log** - See what's being intercepted
- ⚙️ **Settings** - Configure ports, certificates

### Project Structure:
```
geolocation-spoofer-desktop/
├── src/
│   ├── main/
│   │   ├── index.js           # Electron main process
│   │   ├── proxy-server.js    # Proxy server logic
│   │   └── certificate.js     # Certificate handling
│   ├── renderer/
│   │   ├── index.html         # UI
│   │   ├── styles.css         # Styling
│   │   └── app.js             # Frontend logic
│   └── preload.js             # Electron preload
├── package.json
└── README.md
```

### Key Files:

**proxy-server.js:**
```javascript
const http = require('http');
const httpProxy = require('http-proxy');

class GeoSpoofer {
  constructor(settings) {
    this.settings = settings;
    this.proxy = httpProxy.createProxyServer({});
  }
  
  start(port = 8080) {
    const server = http.createServer((req, res) => {
      if (this.isGeoAPI(req.url)) {
        this.spoofResponse(req, res);
      } else {
        this.proxy.web(req, res, { target: req.url });
      }
    });
    
    server.listen(port);
    console.log(`Proxy running on port ${port}`);
  }
  
  isGeoAPI(url) {
    const geoAPIs = ['ipapi.co', 'ip-api.com', 'ipinfo.io'];
    return geoAPIs.some(api => url.includes(api));
  }
  
  spoofResponse(req, res) {
    const fakeData = {
      latitude: this.settings.latitude,
      longitude: this.settings.longitude,
      city: this.settings.city,
      country: this.settings.country
    };
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(fakeData));
  }
}

module.exports = GeoSpoofer;
```

---

## Even Simpler: Browser Extension + Local Server

Since you already have the browser extension, you could:

1. **Create a simple local server** (Python/Node.js)
2. **Extension forwards IP geolocation requests** to local server
3. **Server returns fake data** based on your settings
4. **Extension injects responses** back into page

This combines both approaches!

---

## Would You Like Me To:

1. ✅ **Create a Python script** - Quick prototype with mitmproxy
2. ✅ **Create an Electron app** - Full desktop app with UI
3. ✅ **Create a simple Node.js server** - Works with existing extension
4. ✅ **Create a Rust/Tauri app** - Modern, fast desktop app

Just let me know which approach interests you, and I'll build it!

---

## My Recommendation:

**Start with:** Python + mitmproxy script (15 minutes to set up)  
**Then upgrade to:** Electron app if you want a nice UI  

This gives you full network-level interception while keeping your browser extension for the JavaScript geolocation API.

**Result:** Complete location spoofing! 🌍✨
