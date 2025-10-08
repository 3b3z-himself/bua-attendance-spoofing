# Quick Start Guide

## Installation Steps

1. Open Chrome/Edge and go to: `chrome://extensions/` or `edge://extensions/`
2. Enable "Developer mode" (toggle in top-right)
3. Click "Load unpacked"
4. Select the `bua-attendance-spoofing` folder
5. Done! The extension is now installed.

## Generate Icons (Required First Time)

Before loading the extension, you need to create the icon images:

1. Open `icons/generate-icons.html` in your browser
2. Right-click each canvas image
3. Select "Save image as..."
4. Save them in the `icons` folder with these names:
   - `icon16.png`
   - `icon48.png`
   - `icon128.png`

## Using the Extension

1. Click the extension icon in your toolbar
2. Toggle "ON" to enable spoofing
3. Choose a preset location OR enter custom coordinates:
   - Location Name: "Paris"
   - Latitude: 48.8566
   - Longitude: 2.3522
4. Click "Save Location"
5. Refresh any web pages
6. Test on: https://www.google.com/maps or any location-aware site

## Testing

Test your spoofed location:
- Google Maps: https://www.google.com/maps
- IP/Location checker: https://www.iplocation.net
- Weather sites
- Any location-based web app

## Troubleshooting

**Extension not loading?**
- Make sure all files are in the folder
- Generate the icon files first (see above)
- Check Developer mode is enabled

**Location not changing?**
- Enable the toggle switch (must be ON)
- Click "Save Location" after entering coordinates
- Refresh the webpage
- Clear browser cache if needed

**Still showing real location?**
- Some sites use IP-based location (this extension only spoofs JavaScript API)
- Try testing on Google Maps first to confirm it works
- Check browser console for any errors

## Quick Preset Locations

- New York: 40.7128, -74.0060
- London: 51.5074, -0.1278
- Tokyo: 35.6762, 139.6503
- Paris: 48.8566, 2.3522
- Dubai: 25.2048, 55.2708

Enjoy! 🌍
