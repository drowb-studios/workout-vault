# Building Workout Vault as an Android App

## Overview
Workout Vault uses **Capacitor** to wrap the web app as a native Android application. This allows you to distribute it via Google Play Store or install it directly on Android devices.

## Prerequisites

### Required Software
1. **Android Studio** - Download from https://developer.android.com/studio
2. **Java JDK 17** - Usually installed with Android Studio
3. **Node.js** - Already installed

### Android Studio Setup
After installing Android Studio:
1. Open Android Studio
2. Go to **Tools > SDK Manager**
3. Ensure you have:
   - Android SDK Platform 33+ installed
   - Android SDK Build-Tools
   - Android SDK Command-line Tools

## Build Process

### 1. Build the Web App
```bash
cd c:\Projects\Workout-Vault\workout-vault
npm run build
```

### 2. Sync with Android
After any code changes, sync to Android:
```bash
npx cap sync android
```

This copies your built web assets to the Android project.

### 3. Open in Android Studio
```bash
npx cap open android
```

This will open the Android project in Android Studio.

### 4. Build APK in Android Studio

#### Option A: Debug APK (for testing)
1. In Android Studio, click **Build > Build Bundle(s) / APK(s) > Build APK(s)**
2. Wait for the build to complete
3. Click "locate" to find the APK file
4. Default location: `android/app/build/outputs/apk/debug/app-debug.apk`

#### Option B: Release APK (for distribution)
1. In Android Studio, click **Build > Generate Signed Bundle / APK**
2. Select **APK**
3. Create a new keystore or use an existing one
4. Follow the wizard to generate a signed APK
5. Location: `android/app/build/outputs/apk/release/app-release.apk`

### 5. Install on Device

#### Via Android Studio
1. Connect your Android device via USB (enable USB debugging in Developer Options)
2. Click the green **Run** button in Android Studio
3. Select your device from the list

#### Via APK File
1. Transfer the APK to your device
2. Open the APK file on your device
3. Allow installation from unknown sources if prompted
4. Install the app

## Quick Commands Reference

```bash
# Build web app
npm run build

# Sync changes to Android
npx cap sync android

# Open in Android Studio
npx cap open android

# Run on connected device (from Android Studio terminal)
# or use Android Studio's Run button
```

## Development Workflow

When making changes to your app:

1. **Edit code** in `src/` folder
2. **Test in browser** with `npm run dev`
3. **Build** with `npm run build`
4. **Sync** with `npx cap sync android`
5. **Test on device** via Android Studio

## Configuration

### App Name & Icon
Edit `android/app/src/main/res/values/strings.xml`:
```xml
<string name="app_name">Workout Vault</string>
```

### App Icon
Replace icons in:
- `android/app/src/main/res/mipmap-hdpi/`
- `android/app/src/main/res/mipmap-mdpi/`
- `android/app/src/main/res/mipmap-xhdpi/`
- `android/app/src/main/res/mipmap-xxhdpi/`
- `android/app/src/main/res/mipmap-xxxhdpi/`

Use a tool like [Android Asset Studio](https://romannurik.github.io/AndroidAssetStudio/) to generate proper icon sizes.

### Package Name
The package name is: `com.workoutvault.app`

To change it, edit `capacitor.config.ts` and rebuild:
```typescript
const config: CapacitorConfig = {
  appId: 'com.yourname.workoutvault',
  // ...
};
```

### Permissions
Add permissions in `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.INTERNET" />
<!-- Add more as needed -->
```

## Troubleshooting

### Build Errors in Android Studio
1. **Sync Project with Gradle Files** - File > Sync Project with Gradle Files
2. **Invalidate Caches** - File > Invalidate Caches / Restart
3. **Clean Project** - Build > Clean Project

### App Not Updating
- Make sure to run `npm run build` before `npx cap sync`
- Try cleaning the Android build: Build > Clean Project in Android Studio

### White Screen on Device
- Check browser console in Android Studio
- Verify all environment variables are set
- Check that Supabase URLs are accessible from mobile network

### Network Issues
- If app can't connect to Supabase, check:
  - Device has internet connection
  - Supabase URL is correct
  - No firewall blocking the connection

## Publishing to Google Play Store

1. **Generate signed release APK** (see above)
2. Create a **Google Play Developer account** ($25 one-time fee)
3. Create a new app in Play Console
4. Fill out store listing (description, screenshots, etc.)
5. Upload your signed APK or App Bundle
6. Complete content rating questionnaire
7. Set pricing (free or paid)
8. Publish!

## Native Features (Future Enhancements)

Capacitor provides access to native features:

```bash
# Examples of what you can add:
npm install @capacitor/camera
npm install @capacitor/geolocation
npm install @capacitor/local-notifications
npm install @capacitor/haptics
```

See: https://capacitorjs.com/docs/apis

## Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Android Studio User Guide](https://developer.android.com/studio/intro)
- [Google Play Console](https://play.google.com/console)

---

**Your Workout Vault app is now ready to run on Android! 🚀📱**



