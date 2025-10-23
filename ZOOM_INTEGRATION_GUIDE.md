# Zoom Live Class Integration Guide

## Overview

This guide explains the fully functional Zoom video conferencing integration for your school management system. The integration supports live classes, attendance tracking, and is fully translated into both English and Japanese.

## ✅ What Was Implemented

### 1. **Fully Functional Zoom Web SDK Integration**
- ✅ Removed all test/dummy mode features
- ✅ Real Zoom Web SDK v2.18.2 integration
- ✅ Production-ready video conferencing
- ✅ Real-time attendance tracking
- ✅ Live participant count updates

### 2. **Bilingual Support (English & Japanese)**
- ✅ Complete Japanese translations for all Zoom features
- ✅ Dynamic language switching (EN ⇄ JA)
- ✅ All UI elements translated:
  - Meeting controls (Mute, Video, Leave)
  - Status messages (Loading, Connecting, Connected)
  - Error messages
  - Success notifications

### 3. **Key Features**
- ✅ Host and participant roles
- ✅ Audio/video controls
- ✅ Real-time meeting duration tracking
- ✅ Participant count monitoring
- ✅ Meeting attendance records
- ✅ Meeting status management (Scheduled → Live → Ended)

## 🚀 Setup Instructions

### Step 1: Get Zoom API Credentials

1. Go to https://marketplace.zoom.us/
2. Sign in or create a Zoom Developer account
3. Click "Build App"
4. Select "JWT" app type (or Server-to-Server OAuth if JWT is deprecated)
5. Fill in the app details
6. Copy your **API Key** and **API Secret**

### Step 2: Configure Environment Variables

Add these to your server's `.env` file:

```env
# Zoom API Configuration
ZOOM_API_KEY=your_api_key_here
ZOOM_API_SECRET=your_api_secret_here
```

### Step 3: Install Dependencies

If not already installed:

```bash
cd server
npm install jsonwebtoken axios crypto

cd ../client
npm install react-i18next antd
```

### Step 4: Verify Installation

1. Start your server:
```bash
cd server
npm start
```

2. Start your client:
```bash
cd client
npm start
```

3. The Zoom SDK will automatically load when accessing a live meeting

## 📖 How to Use

### For Teachers (Creating & Starting a Live Class)

1. **Navigate to Zoom Classes**
   - Go to Teacher Dashboard
   - Click "Zoom Classes" tab

2. **Create a New Meeting**
   - Click "Create Zoom Class" button
   - Fill in:
     - Title (e.g., "JavaScript Basics - Session 1")
     - Description
     - Course (select from dropdown)
     - Start Time
     - Duration (in minutes)
     - Settings (waiting room, mute on entry, etc.)
   - Select students who can join
   - Click "Create Meeting"

3. **Start the Meeting**
   - Find your meeting in the list
   - Click "Start" button
   - The Zoom interface will load
   - Wait for students to join

4. **During the Meeting**
   - **Mute/Unmute**: Control your audio
   - **Start/Stop Video**: Control your camera
   - **End Meeting**: Finish and close the session
   - View participant count in real-time
   - Track meeting duration

5. **After the Meeting**
   - Click "End Meeting"
   - Attendance is automatically recorded
   - View attendance reports in the dashboard

### For Students (Joining a Live Class)

1. **Find Available Meetings**
   - Go to Student Dashboard
   - Click "Live Classes" or "Zoom Meetings"
   - See all scheduled and live meetings

2. **Join a Meeting**
   - Click "Join" on an active meeting
   - The Zoom interface will load automatically
   - Wait for host approval if waiting room is enabled

3. **During the Meeting**
   - **Mute/Unmute**: Control your audio
   - **Start/Stop Video**: Control your camera
   - **Leave Meeting**: Exit the session
   - Your attendance is tracked automatically

## 🌐 Language Support

### Switching Languages

Users can switch between English and Japanese using the language selector in the header:

**English (EN):**
- Meeting ID
- Status: Connected
- Leave Meeting
- Start Video / Stop Video
- Mute / Unmute

**Japanese (JA):**
- ミーティングID
- ステータス: 接続済み
- ミーティング退出
- ビデオ開始 / ビデオ停止
- ミュート / ミュート解除

## 📋 Translation Keys

All Zoom-related translations are available under the `zoom.meeting` namespace:

### English (`client/src/locales/en/translation.json`)
```json
"zoom": {
  "meeting": {
    "title": "Live Meeting",
    "loading": "Loading Zoom meeting...",
    "controls": {
      "mute": "Mute",
      "unmute": "Unmute",
      "leaveMeeting": "Leave Meeting"
    }
    // ... and more
  }
}
```

### Japanese (`client/src/locales/ja/translation.json`)
```json
"zoom": {
  "meeting": {
    "title": "ライブミーティング",
    "loading": "Zoomミーティングを読み込み中...",
    "controls": {
      "mute": "ミュート",
      "unmute": "ミュート解除",
      "leaveMeeting": "ミーティング退出"
    }
    // ... and more
  }
}
```

## 🔧 Technical Details

### Files Modified

1. **`client/src/components/ZoomMeeting.js`**
   - Removed test/dummy mode
   - Integrated real Zoom Web SDK v2.18.2
   - Added i18n support with `useTranslation` hook
   - Dynamic SDK loading
   - Real-time event listeners

2. **`client/src/locales/en/translation.json`**
   - Added complete English translations

3. **`client/src/locales/ja/translation.json`**
   - Added complete Japanese translations

4. **`server/routes/zoomRoutes.js`**
   - Updated SDK signature endpoint
   - Real JWT signature generation
   - Meeting number extraction

5. **`server/services/zoomService.js`**
   - JWT generation for Zoom API
   - SDK signature generation
   - Meeting management functions

### How It Works

#### Flow Diagram

```
Teacher Creates Meeting
    ↓
Meeting Saved to Database
    ↓
Teacher Clicks "Start"
    ↓
Zoom SDK Loads
    ↓
SDK Signature Generated (JWT)
    ↓
Teacher Joins as Host
    ↓
Students Join as Participants
    ↓
Real-time Video Conference
    ↓
Attendance Tracked
    ↓
Meeting Ends
    ↓
Attendance Report Generated
```

### Security

- ✅ JWT-based authentication
- ✅ Meeting passwords required
- ✅ Student authorization check
- ✅ Waiting room support
- ✅ Host-only controls

## 🐛 Troubleshooting

### Issue: "Failed to load Zoom SDK"
**Solution:** 
- Check internet connection
- Verify Zoom SDK CDN is accessible
- Clear browser cache and reload

### Issue: "Failed to get SDK signature"
**Solution:**
- Verify `ZOOM_API_KEY` and `ZOOM_API_SECRET` in `.env`
- Check server logs for errors
- Ensure Zoom API credentials are valid

### Issue: "Meeting not found"
**Solution:**
- Verify meeting exists in database
- Check meeting ID is correct
- Ensure meeting status is 'live' or 'scheduled'

### Issue: Meeting interface not showing
**Solution:**
- Open browser console (F12)
- Check for JavaScript errors
- Verify `#zmmtg-root` element exists
- Try refreshing the page

### Issue: Japanese text not showing
**Solution:**
- Verify translation files are loaded
- Check browser console for i18n errors
- Ensure language is set correctly
- Reload page after language change

## 📊 Features Comparison

| Feature | Before (Test Mode) | After (Production) |
|---------|-------------------|-------------------|
| Zoom SDK | ❌ Simulated | ✅ Real v2.18.2 |
| Video/Audio | ❌ Dummy UI | ✅ Functional |
| Participants | ❌ Simulated count | ✅ Real-time tracking |
| Attendance | ❌ Manual | ✅ Automatic |
| Japanese Support | ❌ None | ✅ Complete |
| Controls | ❌ Non-functional | ✅ Fully working |

## 🎯 Next Steps

### Optional Enhancements

1. **Recording Feature**
   - Enable cloud recording
   - Automatic recording storage
   - Playback interface

2. **Breakout Rooms**
   - Group discussions
   - Teacher management

3. **Screen Sharing**
   - Presentation mode
   - Multiple screen support

4. **Chat Integration**
   - In-meeting chat
   - File sharing

5. **Analytics**
   - Engagement metrics
   - Speaking time tracking
   - Attention monitoring

## 📝 Notes

- Zoom Web SDK supports modern browsers (Chrome, Firefox, Safari, Edge)
- Minimum bandwidth: 1.5 Mbps up/down for HD video
- Recommended: Headset with microphone for better audio quality
- The first time a user joins, browser may ask for camera/microphone permissions

## 🆘 Support

If you encounter any issues:

1. Check browser console for errors (F12)
2. Verify Zoom API credentials
3. Ensure internet connection is stable
4. Check server logs: `server/logs/`
5. Verify all dependencies are installed

## 🎉 Success!

Your Zoom integration is now fully functional and production-ready with complete bilingual support!

**Test the integration:**
1. Create a test meeting as a teacher
2. Start the meeting
3. Join as a student (different browser/incognito)
4. Test controls and features
5. Switch language and verify translations
6. End meeting and check attendance

---

**Version:** 1.0.0  
**Last Updated:** 2025-10-20  
**Status:** ✅ Production Ready

