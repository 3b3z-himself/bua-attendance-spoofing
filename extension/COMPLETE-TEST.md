# ✅ COMPLETE TESTING CHECKLIST

## Before You Start

**CRITICAL:** Chrome/Edge extensions often don't work on `file://` URLs by default!

### Enable File URL Access:
1. Go to `chrome://extensions/`
2. Find "Geolocation Spoofer"
3. Click "Details"
4. Scroll down
5. Enable **"Allow access to file URLs"** toggle
6. This lets the extension work on `simple-test.html`

## Full Test Procedure

### ✅ Step 1: Reload Extension (IMPORTANT!)
```
1. Go to: chrome://extensions/
2. Find: Geolocation Spoofer
3. Click: Reload button (circular arrow ↻)
4. Status should be: Enabled, no errors
```

### ✅ Step 2: Configure Extension
```
1. Click extension icon in toolbar
2. Check toggle is ON (green)
3. Click "Load Preset"
4. Select "Paris, France"
5. Verify bottom shows:
   "Paris
   Lat: 48.8566, Lng: 2.3522
   Accuracy: 10m"
```

### ✅ Step 3: Test on Local File
```
1. Navigate to your extension folder
2. Double-click: simple-test.html
3. Press: F12 (Developer Console)
4. Go to: Console tab
5. Click: "🎯 Get My Location" button
6. Look for: 🌍 emoji logs
```

**Expected Result:**
```
🌍 Geolocation Spoofer Loaded: {enabled: true, latitude: 48.8566, ...}
🌍 Geolocation Override Active: Paris
🌍 Geolocation API successfully overridden!
🧪 TEST: Button clicked...
🌍 Website requested location via getCurrentPosition
🌍 Returning FAKE location: 48.8566 2.3522
```

Page should display: **Latitude: 48.8566, Longitude: 2.3522**

### ✅ Step 4: Test on Real Website
```
1. Open new tab
2. Go to: https://html5demos.com/geo
3. Press: F12 (Console)
4. Click: "find my location" button on page
5. Check console: Should see 🌍 logs
6. Check page: Should show Paris coordinates
```

### ✅ Step 5: Test on OpenStreetMap
```
1. Open: https://www.openstreetmap.org
2. Press: F12 (Console)
3. Look for: 🌍 logs (extension loaded)
4. Click: Location button (target/crosshair icon) in map controls
5. Map should: Zoom to Paris, France
6. Console should: Show "🌍 Returning FAKE location: 48.8566 2.3522"
```

### ✅ Step 6: Test on Google Maps
```
1. Open: https://www.google.com/maps
2. Press: F12 (Console)
3. Look for: 🌍 logs
4. Click: Blue location button (bottom-right of map)
5. Should: Center on Paris (Eiffel Tower area)
6. URL should: Contain coordinates near 48.8566, 2.3522
```

## Troubleshooting

### Issue 1: No 🌍 Logs at All

**Cause:** Extension not running on this page

**Fix:**
```
1. Check extension is enabled: chrome://extensions/
2. Check "On all sites" permission is granted
3. For file:// URLs: Enable "Allow access to file URLs"
4. Reload the extension
5. Refresh/reopen the test page
```

### Issue 2: Shows Real Location

**Cause:** Extension loaded but settings wrong

**Check:**
```
1. Open extension popup
2. Is toggle ON? (should be green)
3. Is location set? (not 0, 0)
4. Did you click "Save Location"?
5. Console shows 🌍 logs but says "using real location"?
```

**Fix:**
```
1. Click "Load Preset" → "Paris"
2. Toggle OFF then ON
3. Refresh test page (F5)
4. Try again
```

### Issue 3: CSP Errors in Console

**Cause:** test.html had inline scripts (now fixed)

**Fix:**
```
1. Make sure you reloaded extension after latest update
2. Use simple-test.html instead (no CSP issues)
3. Or test on real websites (no CSP issues there)
```

### Issue 4: Works on Some Sites, Not Others

**Explanation:**
- Extension spoofs JavaScript geolocation API ✅
- Does NOT change your IP address ❌
- Does NOT affect network-based location ❌

**Sites that should work:**
- ✅ html5demos.com/geo
- ✅ openstreetmap.org
- ✅ Most websites using navigator.geolocation

**Sites that might not work:**
- ⚠️ Google Maps (may use multiple sources)
- ⚠️ Sites using IP geolocation
- ⚠️ Native mobile apps

## Quick Diagnostic Commands

### Test 1: Check if geolocation API is overridden
```javascript
console.log(navigator.geolocation.getCurrentPosition.toString());
```
Should show function code, NOT `[native code]`

### Test 2: Get current location
```javascript
navigator.geolocation.getCurrentPosition(
  pos => console.log('LAT:', pos.coords.latitude, 'LNG:', pos.coords.longitude),
  err => console.error('Error:', err.message)
);
```
Should return 48.8566, 2.3522 (Paris)

### Test 3: Check extension is loaded
```javascript
// Should see 🌍 in console history when page loaded
console.log('Extension should have logged 🌍 already - scroll up!');
```

## Success Indicators

### ✅ Working Correctly:
- [x] See 🌍 logs in console on any webpage
- [x] simple-test.html shows Paris coordinates (48.8566, 2.3522)
- [x] html5demos.com/geo shows Paris
- [x] OpenStreetMap centers on Paris
- [x] Console shows "Returning FAKE location"

### ❌ NOT Working:
- [ ] No 🌍 logs appear anywhere
- [ ] Shows real city/coordinates
- [ ] Extension popup shows toggle OFF
- [ ] Extension not in chrome://extensions/

## Alternative Testing (If file:// doesn't work)

Host the test file locally:

```powershell
# In PowerShell, navigate to extension folder, then:
python -m http.server 8000
# Or if you have Node.js:
npx http-server -p 8000
```

Then open: `http://localhost:8000/simple-test.html`

## Final Verification

Answer these YES/NO:

1. Extension is enabled in chrome://extensions/ → YES/NO?
2. Toggle is ON (green) in extension popup → YES/NO?
3. Location shows "Paris" in popup → YES/NO?
4. You reloaded the extension after latest changes → YES/NO?
5. You see 🌍 logs on html5demos.com/geo → YES/NO?

**If all YES:** Extension is working! 🎉
**If any NO:** That's the problem - fix that step

## Report Issues

If still not working, provide:
1. **Browser version:** (Help → About)
2. **Do you see 🌍 logs?** YES/NO
3. **What does simple-test.html show?** (coordinates)
4. **What does extension popup show?** (screenshot)
5. **Console logs when you test** (screenshot)

---

**Remember:** The key indicator is the 🌍 emoji in console.
If you see it, the extension is running!
If not, it's not injecting into the page.
