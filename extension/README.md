# 🌍 Geolocation Spoofer Browser Extension

A powerful browser extension that allows you to spoof your geolocation to any location worldwide. Perfect for testing location-based features or accessing geo-restricted content.

## Features

- ✅ Spoof geolocation to any latitude/longitude
- ✅ Custom location names
- ✅ Adjustable accuracy settings
- ✅ 8 built-in preset locations (New York, London, Paris, Tokyo, Sydney, San Francisco, Dubai, São Paulo)
- ✅ Easy-to-use popup interface
- ✅ Toggle spoofing on/off instantly
- ✅ Works on all websites
- ✅ Visual status indicator

## Installation

### Chrome/Edge/Brave (Chromium-based browsers)

1. **Open Extension Management Page**
   - Chrome: Navigate to `chrome://extensions/`
   - Edge: Navigate to `edge://extensions/`
   - Brave: Navigate to `brave://extensions/`

2. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner

3. **Load the Extension**
   - Click "Load unpacked"
   - Select the folder containing the extension files (`bua-attendance-spoofing`)

4. **Pin the Extension** (Optional)
   - Click the puzzle piece icon in the toolbar
   - Pin the "Geolocation Spoofer" extension for easy access

## Usage

1. **Click the extension icon** in your browser toolbar to open the popup

2. **Enable spoofing**:
   - Toggle the switch to "ON" (it will turn green)

3. **Set your location** using one of two methods:

   **Method A: Use a Preset Location**
   - Click "Load Preset" button
   - Select a location from the list

   **Method B: Enter Custom Coordinates**
   - Enter a location name (e.g., "My Office")
   - Enter latitude (e.g., 40.7128)
   - Enter longitude (e.g., -74.0060)
   - Optionally adjust accuracy in meters
   - Click "Save Location"

4. **Refresh any open web pages** to apply the new location

5. **Test it**:
   - Visit any website that uses geolocation (e.g., Google Maps, weather sites)
   - The site should now see your spoofed location

## How It Works

The extension uses a content script that runs on every webpage and overrides the browser's native `navigator.geolocation` API. When a website requests your location, the extension provides the fake coordinates you've set instead of your real location.

### Technical Details

- **Manifest Version**: 3 (latest Chrome extension format)
- **Permissions**: `storage`, `activeTab`, and access to all URLs
- **Content Script**: Injected at `document_start` to override geolocation before page scripts run
- **Storage**: Uses Chrome's `sync` storage to persist settings across devices

## Files Structure

```
bua-attendance-spoofing/
├── manifest.json       # Extension configuration
├── popup.html          # Extension popup UI
├── popup.css           # Popup styling
├── popup.js            # Popup functionality
├── content.js          # Geolocation API override script
├── background.js       # Background service worker
├── icons/              # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md           # This file
```

## Preset Locations

The extension includes these preset locations:

| Location | Latitude | Longitude |
|----------|----------|-----------|
| New York City, USA | 40.7128 | -74.0060 |
| London, UK | 51.5074 | -0.1278 |
| Paris, France | 48.8566 | 2.3522 |
| Tokyo, Japan | 35.6762 | 139.6503 |
| Sydney, Australia | -33.8688 | 151.2093 |
| San Francisco, USA | 37.7749 | -122.4194 |
| Dubai, UAE | 25.2048 | 55.2708 |
| São Paulo, Brazil | -23.5505 | -46.6333 |

## Important Notes

⚠️ **Privacy & Ethics**:
- This extension is for educational and testing purposes
- Use responsibly and respect website terms of service
- Some services may have policies against location spoofing

⚠️ **Limitations**:
- This only spoofs JavaScript-based geolocation APIs
- It does NOT hide your IP address or change your network location
- Some advanced detection methods may still identify your real location

⚠️ **Troubleshooting**:
- If a site still shows your real location, try refreshing the page after enabling spoofing
- Make sure the extension is enabled and a valid location is set
- Check the browser console for any error messages

## Development

To modify the extension:

1. Edit the source files
2. Go to your browser's extension page
3. Click the refresh icon on the extension card
4. Test your changes

## License

This project is provided as-is for educational purposes.

## Contributing

Feel free to submit issues, fork the repository, and create pull requests for any improvements.

## Support

If you encounter any issues or have questions:
1. Check the browser console for error messages
2. Ensure all files are present and properly loaded
3. Try disabling and re-enabling the extension

---

**Enjoy spoofing your location! 🌍**
