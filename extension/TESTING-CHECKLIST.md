# ✅ Camera Overlay Testing Checklist

Use this checklist to verify all features are working correctly.

## Pre-Testing Setup

- [ ] Extension installed in Chrome
- [ ] Extension enabled (check chrome://extensions/)
- [ ] Test photo prepared (preferably PNG with transparent background)
- [ ] Camera permissions granted to browser
- [ ] Camera working (test in another app first)

---

## Basic Functionality Tests

### Photo Upload
- [ ] Click extension icon
- [ ] Scroll to camera overlay section
- [ ] Click "Choose File" button
- [ ] Select a photo from your computer
- [ ] Verify preview appears below upload button
- [ ] Verify image loads correctly in preview
- [ ] Try uploading different formats (PNG, JPG, GIF)

### Toggle Control
- [ ] Toggle camera overlay to ON
- [ ] Verify status changes to "Camera Overlay: Active ✓"
- [ ] Verify status div turns green
- [ ] Toggle OFF
- [ ] Verify status returns to "Camera Overlay: Disabled"
- [ ] Toggle back ON for remaining tests

### Opacity Slider
- [ ] Move opacity slider to 0%
- [ ] Verify value displays "0%"
- [ ] Move to 50%
- [ ] Verify value displays "50%"
- [ ] Move to 100%
- [ ] Verify value displays "100%"
- [ ] Check that changes save (close/reopen popup)

### Size Slider
- [ ] Move size slider to 50%
- [ ] Verify value displays "50%"
- [ ] Move to 100%
- [ ] Verify value displays "100%"
- [ ] Move to 150%
- [ ] Verify value displays "150%"
- [ ] Check that changes save

### Position Dropdown
- [ ] Select "Center" from dropdown
- [ ] Select "Top Left"
- [ ] Select "Top Right"
- [ ] Select "Bottom Left"
- [ ] Select "Bottom Right"
- [ ] Verify selection saves

### Remove Photo
- [ ] Click "Remove Photo" button
- [ ] Verify preview disappears
- [ ] Verify file input clears
- [ ] Re-upload a photo for further testing

---

## Camera Test Page

### Opening Test Page
- [ ] Click "📷 Test Camera Overlay" button
- [ ] Verify new tab opens
- [ ] Verify test page loads correctly
- [ ] Verify page styling looks correct

### Camera Activation
- [ ] Click "🎥 Start Camera" button
- [ ] Verify camera permission prompt appears (if first time)
- [ ] Grant camera permission
- [ ] Verify video feed appears in container
- [ ] Verify status shows "✅ Camera active!"
- [ ] Verify status turns green

### Overlay Visibility
- [ ] With overlay enabled, verify photo appears on video
- [ ] Check photo position matches setting (center, etc.)
- [ ] Verify photo is visible/clear
- [ ] Check opacity matches slider setting
- [ ] Check size matches slider setting

### Stop Camera
- [ ] Click "⏹️ Stop Camera" button
- [ ] Verify video stops
- [ ] Verify "Start Camera" button reappears
- [ ] Verify status updates correctly

---

## Real-Time Settings Changes

### Opacity Changes
- [ ] Start camera on test page
- [ ] Open extension popup (keep test page visible)
- [ ] Move opacity slider to different values
- [ ] Stop and restart camera
- [ ] Verify overlay opacity changes

### Size Changes
- [ ] Start camera
- [ ] Change size slider
- [ ] Restart camera
- [ ] Verify overlay size changes
- [ ] Try 50%, 100%, 150%

### Position Changes
- [ ] Start camera
- [ ] Change position dropdown
- [ ] Restart camera
- [ ] Verify overlay moves to new position
- [ ] Test all 5 positions

### Photo Changes
- [ ] Start camera
- [ ] Upload different photo
- [ ] Restart camera
- [ ] Verify new photo appears
- [ ] Test with different image types

---

## Camera Selection Tests

### Enumerate Cameras
- [ ] Open any webpage
- [ ] Click extension icon
- [ ] Click "🔄 Refresh Cameras" button
- [ ] Verify dropdown populates with camera names
- [ ] Check that camera names are readable

### Select Camera (if multiple available)
- [ ] Select different camera from dropdown
- [ ] Open test page
- [ ] Start camera
- [ ] Verify correct camera activates
- [ ] Switch cameras and test again

### Single Camera System
- [ ] On system with one camera
- [ ] Refresh cameras
- [ ] Verify single camera appears
- [ ] Verify selection works

---

## Persistence Tests

### Settings Persistence
- [ ] Configure all settings (photo, opacity, size, position)
- [ ] Close browser completely
- [ ] Reopen browser
- [ ] Open extension popup
- [ ] Verify all settings retained
- [ ] Verify photo still shows in preview

### Toggle Persistence
- [ ] Enable camera overlay
- [ ] Close popup
- [ ] Reopen popup
- [ ] Verify toggle still ON
- [ ] Verify status correct

### Photo Persistence
- [ ] Upload photo
- [ ] Close browser
- [ ] Reopen browser
- [ ] Open extension popup
- [ ] Verify photo preview appears
- [ ] Verify photo data retained

---

## Browser Console Tests

### Check for Errors
- [ ] Open test page
- [ ] Press F12 to open console
- [ ] Start camera
- [ ] Verify no error messages (red text)
- [ ] Look for success messages:
  - "📷 Camera Overlay Active"
  - "📷 Video overlay applied successfully"
  - "📷 Camera Overlay] Script loaded"

### Check Settings Loading
- [ ] Open console
- [ ] Reload page
- [ ] Look for settings loaded messages
- [ ] Verify settings object contains correct data

---

## Real Website Tests

### Video Conferencing Sites

#### Google Meet
- [ ] Go to meet.google.com
- [ ] Start or join a meeting
- [ ] Enable camera
- [ ] Verify overlay appears
- [ ] Check if others can see overlay (if in call)

#### Zoom (Web)
- [ ] Go to zoom.us
- [ ] Join meeting via browser
- [ ] Enable video
- [ ] Verify overlay appears

#### Microsoft Teams (Web)
- [ ] Go to teams.microsoft.com
- [ ] Join meeting
- [ ] Enable camera
- [ ] Verify overlay appears

### Other Camera-Using Sites
- [ ] Test on attendance system (if applicable)
- [ ] Test on any custom site
- [ ] Verify overlay works universally

---

## Edge Cases & Error Handling

### No Photo Uploaded
- [ ] Enable overlay without uploading photo
- [ ] Start camera
- [ ] Verify camera works normally (no crash)
- [ ] No overlay should appear

### Disabled Overlay
- [ ] Upload photo
- [ ] Disable toggle
- [ ] Start camera
- [ ] Verify NO overlay appears
- [ ] Verify original camera feed shows

### Camera Permission Denied
- [ ] Block camera permission
- [ ] Try to start camera
- [ ] Verify error message appears
- [ ] Verify no crash/freeze

### No Camera Available
- [ ] Disable camera in device manager (or use PC without camera)
- [ ] Try to refresh cameras
- [ ] Verify graceful error handling

### Large Photo File
- [ ] Try uploading very large photo (>10MB)
- [ ] Verify upload completes
- [ ] Check performance
- [ ] If slow, note in issues

### Invalid Image File
- [ ] Try uploading non-image file
- [ ] Verify error message or rejection
- [ ] Verify no crash

---

## Performance Tests

### CPU Usage
- [ ] Open task manager
- [ ] Start camera with overlay
- [ ] Check CPU usage of browser
- [ ] Should be under 20% on modern PC
- [ ] Note if excessive

### Memory Usage
- [ ] Check browser memory before camera
- [ ] Start camera with overlay
- [ ] Check memory after
- [ ] Increase should be <50MB
- [ ] Note if excessive

### Frame Rate
- [ ] Start camera with overlay
- [ ] Check if video is smooth
- [ ] Should be 30fps
- [ ] Note any lag or stuttering

### Extended Use
- [ ] Keep camera running for 5 minutes
- [ ] Check for memory leaks
- [ ] Check for performance degradation
- [ ] Verify overlay stays stable

---

## Cross-Browser Tests

### Chrome
- [ ] All features working
- [ ] No errors in console
- [ ] Good performance

### Edge
- [ ] All features working
- [ ] No errors in console
- [ ] Good performance

### Brave
- [ ] All features working
- [ ] Check if shields affect functionality
- [ ] Good performance

### Opera
- [ ] Install extension
- [ ] Test all features
- [ ] Good performance

---

## Visual Quality Tests

### Photo Quality
- [ ] Upload high-res photo (1920x1080)
- [ ] Start camera
- [ ] Verify photo is sharp
- [ ] No pixelation or blur

### Aspect Ratio
- [ ] Try square photo (1:1)
- [ ] Try portrait photo (3:4)
- [ ] Try landscape photo (16:9)
- [ ] Verify all scale correctly

### Transparency
- [ ] Upload PNG with transparent background
- [ ] Verify transparency preserved
- [ ] Verify no white borders

### Different Positions
- [ ] Test each position
- [ ] Verify photo doesn't get cut off
- [ ] Verify proper spacing from edges

---

## Documentation Tests

### README Files
- [ ] Read CAMERA-QUICKSTART.md
- [ ] Verify instructions match actual behavior
- [ ] Check for typos/errors

### Guide Files
- [ ] Read CAMERA-OVERLAY-GUIDE.md
- [ ] Verify all features documented
- [ ] Check if troubleshooting helps

### Visual Guide
- [ ] Read VISUAL-GUIDE.md
- [ ] Verify diagrams make sense
- [ ] Check ASCII art renders correctly

---

## Final Verification

### Complete User Flow
- [ ] Install fresh extension
- [ ] Follow CAMERA-QUICKSTART.md exactly
- [ ] Complete setup in under 5 minutes
- [ ] Verify overlay works

### Uninstall/Reinstall
- [ ] Note current settings
- [ ] Uninstall extension
- [ ] Reinstall extension
- [ ] Verify fresh state
- [ ] Re-configure and test

### Multiple Tabs
- [ ] Open camera in multiple tabs
- [ ] Verify overlay works in all tabs
- [ ] Check for conflicts

---

## Bug Reporting

If any test fails, document:

```
Test Failed: [Test Name]
Browser: [Chrome/Edge/etc]
Version: [Browser version]
Expected: [What should happen]
Actual: [What actually happened]
Steps to Reproduce:
1. 
2. 
3. 

Console Errors:
[Paste any error messages]

Screenshots:
[Attach if relevant]
```

---

## Test Results Summary

Date: _______________
Tester: _______________

| Category | Tests Passed | Tests Failed | Notes |
|----------|--------------|--------------|-------|
| Basic Functionality | __/18 | __ | |
| Camera Test Page | __/8 | __ | |
| Real-Time Changes | __/12 | __ | |
| Camera Selection | __/7 | __ | |
| Persistence | __/8 | __ | |
| Console Tests | __/4 | __ | |
| Real Websites | __/6 | __ | |
| Edge Cases | __/8 | __ | |
| Performance | __/5 | __ | |
| Cross-Browser | __/8 | __ | |
| Visual Quality | __/8 | __ | |
| Documentation | __/6 | __ | |
| Final Verification | __/6 | __ | |

**Total: __/104 tests**

---

## Sign-Off

- [ ] All critical tests passed
- [ ] Major features working
- [ ] Performance acceptable
- [ ] Documentation complete
- [ ] Ready for use

**Tested by:** _______________  
**Date:** _______________  
**Signature:** _______________

---

**🎉 If all tests pass, the extension is ready to use!**
