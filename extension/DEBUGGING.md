# 🐛 Debugging Guide for Geolocation Spoofer

## Quick Debugging Steps

### 1. **Test with the Test Page First**

Open `test.html` in your browser:
- Right-click `test.html` → "Open with" → Your browser
- Click "Get Current Position" button
- Open Developer Console (F12) and look for logs with 🌍 emoji

**What to look for:**
- ✅ You should see: `🌍 Geolocation Override Active: [Location Name]`
- ✅ You should see: `🌍 Geolocation API successfully overridden!`
- ❌ If you don't see these, the extension isn't injecting properly

### 2. **Check Extension Settings**

1. Open the extension popup (click the icon)
2. Verify:
   - Toggle is **ON** (green)
   - Location name is filled in
   - Latitude and Longitude are NOT 0.0
   - "Current Spoofed Location" shows your settings

### 3. **Reload the Extension**

After making ANY changes:
1. Go to `chrome://extensions/`
2. Find "Geolocation Spoofer"
3. Click the **refresh/reload icon** ↻
4. Then refresh your test page

### 4. **Check Console Logs**

On ANY website (including Google Maps):
1. Press **F12** to open Developer Console
2. Go to the **Console** tab
3. Look for these logs:

**✅ SUCCESS - You should see:**
```
🌍 Geolocation Spoofer Loaded: {enabled: true, latitude: 48.8566, ...}
🌍 Geolocation Override Active: Paris
🌍 Geolocation API successfully overridden!
🌍 Spoofing: Paris
🌍 Coordinates: 48.8566,2.3522
```

**When a site requests location:**
```
🌍 Website requested location via getCurrentPosition
🌍 Returning FAKE location: 48.8566 2.3522
```

**❌ PROBLEM - If you see nothing:**
- Extension didn't load on this page
- Try reloading the extension and the page
- Check if the extension has permissions for this URL

### 5. **Test on Different Sites**

Try these sites in order:

1. **Your test.html file** (easiest)
2. **https://www.openstreetmap.org** (click the location icon)
3. **https://html5demos.com/geo** (simple test)
4. **https://www.google.com/maps** (most complex)

### 6. **Common Issues and Fixes**

#### Issue: No 🌍 logs appear in console

**Fix:**
1. Reload extension: `chrome://extensions/` → Click reload ↻
2. Close all browser tabs
3. Reopen browser
4. Try again

#### Issue: Logs appear but location is still real

**Fix:**
1. Check if latitude/longitude are actually set (not 0,0)
2. Make sure you clicked "Save Location" after entering coordinates
3. Check console - you should see "Returning FAKE location"

#### Issue: Google Maps still shows real location

**Fix:**
1. Clear browser cache: Settings → Privacy → Clear browsing data
2. Close and reopen the Maps tab
3. Click the location button on Maps again
4. Check console for 🌍 logs when you click

#### Issue: Works on test.html but not Google Maps

**Possible causes:**
- Google Maps uses multiple location detection methods
- May use IP-based location (extension only spoofs JavaScript API)
- May cache location permission
- Try in Incognito mode

### 7. **Testing in Incognito Mode**

1. Go to `chrome://extensions/`
2. Find "Geolocation Spoofer"
3. Click "Details"
4. Enable "Allow in Incognito"
5. Open Incognito window
6. Test there (no cache/cookies)

### 8. **Verify Extension Permissions**

1. Go to `chrome://extensions/`
2. Click "Details" on Geolocation Spoofer
3. Check "Site access" is set to "On all sites"
4. If not, change it to "On all sites"

### 9. **Check Console Logs in Extension Popup**

1. Right-click the extension icon
2. Select "Inspect popup"
3. A developer console opens for the popup
4. Toggle the switch ON/OFF and watch for logs
5. Click "Save Location" and check for confirmation logs

### 10. **Manual Verification**

Test with this code in the browser console:

```javascript
// This should return your SPOOFED coordinates
navigator.geolocation.getCurrentPosition(
  (pos) => console.log('✓ LAT:', pos.coords.latitude, 'LNG:', pos.coords.longitude),
  (err) => console.error('✗ Error:', err.message)
);
```

## Advanced Debugging

### Check if Override is Actually Running

Paste this in the browser console:

```javascript
// This should show "function" if properly overridden
console.log(typeof navigator.geolocation.getCurrentPosition);

// Check if it's a native function or our override
console.log(navigator.geolocation.getCurrentPosition.toString());
```

If you see the actual function code, the override worked.
If you see `[native code]`, the override didn't work.

### Force Reload Everything

1. Close ALL browser windows
2. Go to `chrome://extensions/`
3. Remove the extension
4. Reload the extension (Load unpacked again)
5. Open test.html
6. Check console

## Still Not Working?

### Last Resort Checklist

- [ ] Extension is installed and enabled
- [ ] Developer mode is ON
- [ ] Extension shows in toolbar
- [ ] Toggle is ON (green) in popup
- [ ] Latitude and Longitude are filled in (not 0)
- [ ] Clicked "Save Location"
- [ ] Reloaded extension at chrome://extensions
- [ ] Refreshed the test page (F5)
- [ ] Opened developer console (F12)
- [ ] Looking in the "Console" tab (not "Elements" or other tabs)

### Alternative: Try Preset Location

1. Open extension popup
2. Click "Load Preset"
3. Click "Paris" (or any preset)
4. Toggle should already be ON
5. Open test.html
6. Press F12 → Console tab
7. Click "Get Current Position" button
8. You should see: Latitude: 48.8566, Longitude: 2.3522

### Contact Info

If still not working, provide these details:
- Browser name and version
- Do you see ANY 🌍 logs in console? (Yes/No)
- What happens when you click "Get Current Position" on test.html?
- Screenshot of extension popup showing your settings
- Screenshot of console with logs

---

## Success Indicators

✅ **It's working if you see:**
- 🌍 logs in console
- Test page shows your spoofed coordinates
- OpenStreetMap shows your spoofed location
- Console shows "Returning FAKE location: [your coordinates]"

❌ **It's NOT working if:**
- No 🌍 logs appear
- Shows your actual city/coordinates
- Console shows "using real location"
