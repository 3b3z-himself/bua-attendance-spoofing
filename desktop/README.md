# 🌍 Geolocation Spoofer Desktop App

A powerful desktop application that spoofs your IP-based geolocation by intercepting network requests to geolocation APIs.

## ✨ Features

- 🎯 **Easy Lat/Long Input** - Simply enter coordinates or use quick presets
- 🌐 **Network-Level Spoofing** - Intercepts IP geolocation API requests
- 🖥️ **Clean Desktop UI** - Built with Electron for a native experience
- 📍 **Quick Presets** - One-click location switching (Paris, New York, London, Tokyo, etc.)
- ⚡ **Real-time Proxy** - Works with all browsers and applications
- 🔧 **Easy Setup** - No complex configuration needed

## 🚀 Quick Start

### Installation

1. **Install Node.js** (if not already installed)
   - Download from: https://nodejs.org/

2. **Install Dependencies**
   ```bash
   cd desktop
   npm install
   ```

3. **Run the App**
   ```bash
   npm start
   ```

## 📖 How to Use

### Step 1: Configure Location
- Enter **Latitude** and **Longitude** (e.g., 48.8566, 2.3522 for Paris)
- Or click a **preset button** for popular cities
- Optionally set city and country name

### Step 2: Start Proxy
- Click **"Start Proxy"** button
- The app will start a local proxy server on port 8080 (default)

### Step 3: Configure Browser
You need to configure your browser to use the proxy:

#### Chrome/Edge
1. Settings → System → Open your computer's proxy settings
2. Manual proxy configuration
3. HTTP Proxy: `localhost` Port: `8080`
4. Save

#### Firefox
1. Settings → Network Settings → Settings button
2. Manual proxy configuration
3. HTTP Proxy: `localhost` Port: `8080`
4. Check "Also use this proxy for HTTPS"
5. OK

#### Windows System-Wide
1. Windows Settings → Network & Internet → Proxy
2. Manual proxy setup → Turn ON
3. Address: `localhost` Port: `8080`
4. Save

### Step 4: Test It!
Visit any website that uses IP geolocation:
- https://www.iplocation.net/
- https://ipapi.co/
- https://ip-api.com/
- Any attendance system that checks location

Your spoofed location will be returned! 🎉

## 🛠️ How It Works

1. The app creates a **local HTTP proxy server**
2. When your browser makes requests through the proxy, the app intercepts them
3. If a request is to an **IP geolocation API**, the app returns your fake location
4. All other requests are passed through normally

### Supported Geolocation APIs
- ipapi.co
- ip-api.com
- ipinfo.io
- freegeoip
- geoip-db.com
- ipgeolocation.io
- extreme-ip-lookup.com
- ipwhois.app
- And more...

## 🔧 Configuration

### Change Proxy Port
If port 8080 is already in use, you can change it in the app's Proxy Settings section.

### Custom Locations
You can save custom locations by entering:
- **Latitude**: -90 to 90
- **Longitude**: -180 to 180
- **City**: Any city name (optional)
- **Country**: Any country name (optional)

## 📍 Preset Locations

| City | Coordinates |
|------|-------------|
| 🇫🇷 Paris | 48.8566, 2.3522 |
| 🇺🇸 New York | 40.7128, -74.0060 |
| 🇬🇧 London | 51.5074, -0.1278 |
| 🇯🇵 Tokyo | 35.6762, 139.6503 |
| 🇦🇺 Sydney | -33.8688, 151.2093 |
| 🇩🇪 Berlin | 52.5200, 13.4050 |

## ⚠️ Important Notes

### For Testing Only
This tool is designed for testing and development purposes. Use responsibly.

### Browser Extension Combination
For complete location spoofing, use this desktop app **along with** your browser extension:
- Desktop app → Spoofs IP-based location
- Browser extension → Spoofs JavaScript geolocation API

### HTTPS Limitations
Currently, the app handles HTTP requests. For HTTPS geolocation APIs, they may not be intercepted. Most geolocation APIs use HTTP by default.

### Firewall Warnings
Your firewall may ask for permission when the app starts the proxy server. Allow it for localhost connections.

## 🐛 Troubleshooting

### Proxy not working?
- Make sure the app shows "✅ Proxy Running"
- Verify your browser proxy settings are correct
- Try a different port if 8080 is in use
- Restart your browser after configuring the proxy

### Location still shows real location?
- Some websites use JavaScript geolocation (use browser extension for this)
- Some websites cache your location
- Try clearing browser cache and cookies
- Make sure you're using the proxy in your browser

### Port already in use?
- Change the port number in the app (try 8081, 8082, etc.)
- Stop any other proxy/VPN applications

## 🚧 Development

### Run in Development Mode
```bash
npm run dev
```
This opens DevTools for debugging.

### Build for Production
```bash
npm install electron-builder --save-dev
npm run build
```

## 📝 Technical Details

- **Framework**: Electron
- **Proxy**: Node.js HTTP server
- **UI**: HTML/CSS/JavaScript
- **Interception**: Request URL matching

## 🔒 Privacy

- All proxy traffic stays on your local machine
- No data is sent to external servers
- The app only intercepts geolocation API requests
- All other traffic passes through normally

## 📄 License

MIT License - Use freely for testing and development.

---

**Made with ❤️ for testing IP geolocation spoofing**

For questions or issues, check the console output in the app (run with `npm run dev`).
