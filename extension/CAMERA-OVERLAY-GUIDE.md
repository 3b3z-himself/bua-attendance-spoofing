# 📷 Camera Overlay Feature

## Overview

The camera overlay feature allows you to overlay a custom photo on top of your camera feed. This works with any website that uses your camera, including video conferencing apps, online attendance systems, and more.

## Features

✅ **Photo Upload** - Upload any image to use as an overlay  
✅ **Camera Selection** - Choose which camera to use (if you have multiple)  
✅ **Opacity Control** - Adjust the transparency of the overlay (0-100%)  
✅ **Size Control** - Scale the overlay image (50-150%)  
✅ **Position Control** - Place the overlay in different positions:
  - Center
  - Top Left
  - Top Right
  - Bottom Left
  - Bottom Right

## How to Use

### Step 1: Enable Camera Overlay

1. Click the extension icon in your browser
2. Scroll down to the "📷 Camera Overlay" section
3. Toggle the "Camera Overlay" switch to **ON**

### Step 2: Upload a Photo

1. Click "Choose File" under "Upload Photo"
2. Select an image from your computer
3. The image preview will appear below
4. Your photo is now saved and ready to use

### Step 3: Configure Settings

**Opacity:**
- Drag the slider to adjust transparency
- 100% = Fully opaque (photo completely visible)
- 0% = Fully transparent (photo invisible)

**Size:**
- Drag the slider to scale the image
- 100% = Original relative size
- 150% = 1.5x larger
- 50% = Half size

**Position:**
- Select from the dropdown menu
- Choose where the overlay appears on your video

### Step 4: Select Camera (Optional)

1. Open any webpage (or the camera test page)
2. Click "🔄 Refresh Cameras" in the extension popup
3. Select your preferred camera from the dropdown

### Step 5: Test It Out

1. Click "📷 Test Camera Overlay" button in the extension popup
2. Or visit any website that uses your camera
3. Click "Start Camera" to see the overlay in action

## Technical Details

### How It Works

The extension intercepts the `navigator.mediaDevices.getUserMedia()` API call and:

1. Captures the original camera stream
2. Draws each video frame onto a canvas element
3. Overlays your uploaded photo on top
4. Returns the modified canvas stream instead of the original

This happens in real-time at approximately 30 FPS, providing a smooth video experience.

### Browser Compatibility

- ✅ Chrome 88+
- ✅ Edge 88+
- ✅ Brave
- ✅ Opera

### Supported Image Formats

- PNG
- JPEG/JPG
- GIF (static only)
- WebP
- SVG
- BMP

## Use Cases

### 1. Online Attendance Systems
Overlay your photo while taking attendance to ensure consistent appearance.

### 2. Video Conferencing
Add custom overlays or branding to your video feed.

### 3. Privacy Protection
Use overlays to partially obscure your video feed while maintaining presence.

### 4. Fun & Creative
Add fun images or graphics to your video calls!

## Tips & Best Practices

### Choosing the Right Photo

- **Transparent Background**: PNG images with transparent backgrounds work best
- **Face Photos**: For attendance, use a clear, front-facing photo
- **Resolution**: Higher resolution images provide better quality
- **File Size**: Keep images under 5MB for best performance

### Optimal Settings

**For Attendance Systems:**
- Opacity: 80-100%
- Size: 80-100%
- Position: Center

**For Video Calls:**
- Opacity: 30-60%
- Size: 50-80%
- Position: Bottom Right or Top Left

### Performance Tips

- Lower opacity values require less processing power
- Smaller overlay sizes improve performance
- Close unused browser tabs for smoother video

## Troubleshooting

### Photo Doesn't Appear

1. Make sure "Camera Overlay" toggle is **ON**
2. Verify you've uploaded a photo (check preview)
3. Refresh the webpage using the camera
4. Check opacity isn't set to 0%

### Camera Not Working

1. Check browser camera permissions
2. Make sure no other app is using the camera
3. Try refreshing the camera list
4. Restart your browser

### Blurry or Pixelated Overlay

1. Upload a higher resolution image
2. Reduce the overlay size setting
3. Try a different image format (PNG recommended)

### Performance Issues

1. Reduce overlay size to 70-80%
2. Use a smaller image file
3. Close other browser tabs
4. Try lowering the opacity

## Privacy & Security

### Data Storage

- Photos are stored locally in Chrome's sync storage
- No data is sent to external servers
- Photos sync across your Chrome profile (if sync is enabled)

### Removing Data

To remove all camera overlay data:

1. Click "Remove Photo" in the extension popup
2. Or disable the extension
3. Or clear extension data from Chrome settings

### Permissions

The extension requires:
- `storage`: To save your settings and photos
- `activeTab`: To inject the overlay script
- `<all_urls>`: To work on all websites (you control where it activates)

## Advanced Usage

### Custom Positioning with Aspect Ratios

For precise control, choose image dimensions that match your camera's aspect ratio:
- 16:9 cameras: 1920x1080 or 1280x720 images
- 4:3 cameras: 1024x768 or 640x480 images

### Multiple Profiles

To use different overlays for different purposes:
1. Use Chrome's profile feature
2. Create separate profiles for work, personal, etc.
3. Configure different overlays in each profile

### Testing Before Use

Always test your overlay configuration:
1. Use the built-in camera test page
2. Verify position, size, and opacity
3. Make sure the photo appears as intended
4. Then use on your target website

## FAQ

**Q: Will this work on Zoom/Teams/Google Meet?**  
A: Yes! It works on any website that uses your camera.

**Q: Can I use animated images?**  
A: Static frames only - animations won't play in the overlay.

**Q: Does this affect video recording?**  
A: Yes, the overlay will appear in recordings if the website records your camera feed.

**Q: Can I use multiple photos?**  
A: Currently, only one photo at a time. Save different photos and swap between them.

**Q: Will others see the overlay?**  
A: Yes, if the website shares your video feed, others will see the overlay.

**Q: Does this work on mobile?**  
A: This is a desktop Chrome extension. Mobile browsers don't support extensions.

## Support

If you encounter issues:

1. Check the browser console for error messages (F12)
2. Verify all settings are configured correctly
3. Try disabling and re-enabling the extension
4. Update to the latest Chrome version

## Changelog

### Version 1.1.0
- ✨ Added camera overlay feature
- 🎨 Photo upload with preview
- ⚙️ Adjustable opacity, size, and position
- 📷 Camera source selection
- 🧪 Added camera test page

### Version 1.0.0
- 🌍 Initial release with geolocation spoofing

## Credits

Developed as part of the BUA Attendance Spoofing project.  
Built with ❤️ using Chrome Extension Manifest V3.
