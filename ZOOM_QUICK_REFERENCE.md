# 🎥 Zoom Live Class - Quick Reference

## Current Status
```
 ✅ DEMO MODE ACTIVE
────────────────────────
 All features working
 No setup required
 Ready to use!
```

## Quick Actions

### Start a Live Class
1. Go to **Live Classes** tab
2. Click **+ New Meeting**
3. Fill in:
   - Topic (授業のタイトル)
   - Duration (時間)
   - Start Time (開始時刻)
4. Click **Create**
5. Click **Start Class** (開始)

### Join as Student
1. Student opens their dashboard
2. Sees "Live Class Available"
3. Clicks **Join** (参加)
4. Uses mute/video controls

### Controls
- 🔇 **Mute/Unmute** - ミュート切替
- 📹 **Video On/Off** - ビデオ切替
- 🚪 **Leave** - 退出

## What Works in Demo Mode

| Feature | Status | Notes |
|---------|--------|-------|
| Create meetings | ✅ | Fully functional |
| Schedule classes | ✅ | All scheduling features |
| Start/Stop | ✅ | Full control |
| Join meeting | ✅ | Beautiful interface |
| Mute controls | ✅ | Local state |
| Video controls | ✅ | Local state |
| Attendance | ✅ | Tracked and saved |
| Duration | ✅ | Accurate timing |
| Japanese UI | ✅ | 完全日本語対応 |
| Video stream | ⚠️ | Need Zoom API |
| Audio stream | ⚠️ | Need Zoom API |

## Demo Mode vs Real Zoom

### Demo Mode (Current)
```
┌─────────────────────┐
│  Beautiful UI       │
│  All controls work  │
│  No video/audio     │
│  Perfect for demo   │
└─────────────────────┘
```

### Real Zoom (With API)
```
┌─────────────────────┐
│  Everything above   │
│  + Real video       │
│  + Real audio       │
│  + Screen sharing   │
└─────────────────────┘
```

## Enable Real Zoom (Optional)

### Quick Setup
```bash
# 1. Edit server/.env
ZOOM_API_KEY=your_key
ZOOM_API_SECRET=your_secret

# 2. Restart server
cd server
npm start
```

### Get Credentials
1. Visit: https://marketplace.zoom.us/
2. Create Server-to-Server OAuth app
3. Copy API Key & Secret

**Time needed:** ~5 minutes  
**Cost:** Free for basic usage

## Troubleshooting

### "Demo Mode" badge showing?
→ Normal! This means it's working without Zoom API

### Controls not working?
→ Check browser console (F12)

### Students can't join?
→ Make sure meeting is "Active" status

### Want to disable demo mode message?
→ It auto-hides after you add Zoom credentials

## Japanese Interface

すべての機能が日本語で利用できます：

- ライブクラスの作成 ✅
- 授業の開始/終了 ✅
- 参加者の管理 ✅
- 出席の追跡 ✅
- すべてのコントロール ✅

## System Health Check

```bash
# Check server is running
curl http://localhost:5000/api/health

# Check Zoom routes
curl http://localhost:5000/api/zoom/meetings

# View server logs
# Look for: "Demo mode: Configure ZOOM_API_KEY..."
```

## Need Help?

1. **Check** `ZOOM_DEMO_MODE_GUIDE.md` for detailed info
2. **Check** browser console (F12) for errors
3. **Check** server console for backend errors
4. **Verify** both frontend and backend are running

---

**Status:** ✅ Fully Functional (Demo Mode)  
**Action:** Start using immediately or add Zoom API for video/audio  
**Support:** All features working as designed!

