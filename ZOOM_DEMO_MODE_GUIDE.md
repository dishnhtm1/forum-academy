# 🎥 Zoom Demo Mode Guide

## Current Status: Demo Mode Active ✅

Your Live Class feature is now working in **Demo Mode**! This means:
- ✅ Beautiful, functional UI
- ✅ All controls work (mute, video, leave meeting)
- ✅ Meeting duration tracking
- ✅ Attendance tracking
- ✅ Full Japanese language support
- ⚠️ No actual video/audio streaming (requires Zoom credentials)

## Demo Mode Features

### What Works Now:
1. **Create Meetings** - Schedule and manage Zoom classes
2. **Start/End Meetings** - Control meeting lifecycle
3. **Join Meetings** - Teachers and students can join
4. **Controls** - Mute, unmute, video on/off, leave meeting
5. **UI** - Beautiful dark-themed meeting interface
6. **Attendance** - Track who joins and leaves
7. **Duration** - Track meeting duration
8. **Japanese** - Full bilingual support (EN/JA)

### What Requires Real Zoom:
- 🎥 Actual video streaming
- 🔊 Actual audio streaming
- 👥 Real participant video feeds
- 📱 Mobile app integration
- 🔗 External Zoom client joining

## Enabling Real Zoom (Optional)

If you want to enable **real video/audio streaming**, follow these steps:

### Step 1: Get Zoom Credentials

1. Go to [Zoom Marketplace](https://marketplace.zoom.us/)
2. Sign in with your Zoom account
3. Click "Develop" → "Build App"
4. Choose "Server-to-Server OAuth" app type
5. Fill in the basic information
6. Get your credentials:
   - `API Key` (Client ID)
   - `API Secret` (Client Secret)
   - `Account ID`

### Step 2: Configure Server

1. Open `server/.env` file
2. Add your Zoom credentials:

```env
# Zoom API Credentials
ZOOM_API_KEY=your_api_key_here
ZOOM_API_SECRET=your_api_secret_here
ZOOM_ACCOUNT_ID=your_account_id_here
```

### Step 3: Restart Server

```bash
# Stop the server (Ctrl+C)
# Start it again
cd server
npm start
```

### Step 4: Test Real Zoom

1. Create a new meeting in the dashboard
2. Start the meeting
3. You should now see the real Zoom interface with video/audio

## Troubleshooting

### Still Showing Demo Mode?

**Check 1:** Verify credentials in `.env`
```bash
cd server
cat .env | grep ZOOM
```

**Check 2:** Make sure server restarted
```bash
# Look for this message in server console:
✅ Zoom credentials configured
```

**Check 3:** Check server console for errors
```bash
# Look for any Zoom-related errors
```

### Error: "Invalid Signature"

- Your API Key or Secret might be incorrect
- Make sure there are no extra spaces in `.env`
- Try regenerating credentials from Zoom Marketplace

### Error: "Meeting Not Found"

- The meeting might have expired
- Create a new meeting
- Check that the meeting ID is correct

## Architecture

### Demo Mode Flow:
```
Client Request
    ↓
Server detects no credentials
    ↓
Returns demo signature
    ↓
Client shows demo UI
    ↓
All controls work locally
```

### Real Zoom Flow:
```
Client Request
    ↓
Server generates real signature
    ↓
Client loads Zoom SDK
    ↓
Connects to Zoom servers
    ↓
Real video/audio streaming
```

## Benefits of Current Setup

### ✅ Works Immediately
- No configuration needed
- No Zoom account required
- Perfect for testing and demo

### ✅ Easy Upgrade Path
- Just add credentials when ready
- No code changes needed
- Automatic fallback to demo mode

### ✅ Full Japanese Support
- すべてのUIが日本語対応
- デモモードでも完全に機能
- 簡単に本物のZoomに切り替え可能

## FAQ

**Q: Do students need Zoom accounts?**
A: No, they join directly through the browser.

**Q: Can I mix demo and real Zoom?**
A: Once you add credentials, all meetings become real Zoom meetings.

**Q: Is demo mode secure?**
A: Yes! It's completely safe and doesn't connect to any external services.

**Q: Will my data be lost when I switch?**
A: No, all meetings and attendance data is preserved.

**Q: Can I go back to demo mode?**
A: Yes, just remove the credentials from `.env` and restart the server.

## Support

If you encounter any issues:
1. Check server console for errors
2. Check browser console for errors (F12)
3. Verify `.env` configuration
4. Make sure server restarted after adding credentials

---

**Current Mode:** 🎨 Demo Mode (Fully Functional)  
**Upgrade:** Add Zoom credentials to enable real video/audio  
**Status:** ✅ Ready to use!

