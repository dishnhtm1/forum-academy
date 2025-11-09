# Testing the Notification System

## Quick Start Test (5 minutes)

### Step 1: Open Two Browser Windows

```
Window 1: Admin Dashboard (http://localhost:3000/admin or similar)
Window 2: Teacher Dashboard (http://localhost:3000/teacher or similar)
```

### Step 2: Create a Test Announcement

**In Admin Dashboard:**

1. Navigate to **Announcements** section
2. Click **"Create New Announcement"** button
3. Fill in the form:
   - **Title**: "Test Announcement - 🧪 Testing"
   - **Content**: "This is a test notification to verify the system works"
   - **Target Audience**: Select "Teachers" or "All"
   - **Priority**: Select "High"
   - **Type**: "General" or default
4. Click **"Create"** button

**Expected Result:**

- Success toast: "Announcement created successfully!"
- Console log: "✅ Notifications created successfully"

### Step 3: Check Teacher Dashboard

**In Teacher Dashboard:**

**Immediately after creation:**

- 🔔 Bell icon should show red badge with count "1"
- 📢 Toast notification: "📢 1 new notification"

**Click the bell icon:**

- Drawer opens from right side
- Notification appears with:
  - 📢 Icon (bell icon)
  - Title: "📢 Test Announcement - 🧪 Testing"
  - Message: "This is a test notification..."
  - Priority tag: "High" (red)
  - Timestamp: "now" or "a few seconds ago"
  - Blue dot: Indicates unread

### Step 4: Interact with Notification

1. **Click** the notification in the drawer

   - Blue dot disappears (marked as read)
   - Background changes to white
   - Unread count in badge decreases

2. **Mark All as Read** (if multiple notifications):

   - Click "Mark all as read" button
   - All notifications turn gray
   - Bell badge disappears

3. **Refresh** button:
   - Click to manually refresh notifications
   - Should show same notifications

## Comprehensive Testing

### Test 1: Real-time Updates

**Duration:** 2-3 minutes

**Steps:**

1. Open notification drawer in Teacher Dashboard
2. Keep drawer open
3. Switch to Admin Dashboard
4. Create another announcement
5. Watch Teacher Dashboard

**Expected Result:**

- New notification appears in drawer **within 5 seconds**
- Does NOT require clicking refresh or reopening drawer
- Bell badge updates immediately

**Verification:**

```
✓ Notification appears without manual refresh
✓ Timestamp shows current time
✓ Drawer updates in real-time
✓ Console shows: "🔄 Teacher Dashboard - Quick refreshing notifications"
```

### Test 2: Offline/Fallback Mode

**Duration:** 2-3 minutes

**Steps:**

1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Set throttling to **Offline** (or filter API calls)
4. Create announcement in Admin Dashboard
5. Check Teacher Dashboard

**Expected Result:**

- Notifications still appear (from localStorage)
- Toast shows in Teacher Dashboard
- Bell badge updates

**Verification:**

```
✓ Notifications saved to localStorage
✓ System works without API
✓ Console shows: "API notifications not available, checking local"
✓ Console shows: "⚠️ Could not create notifications - saving locally"
```

### Test 3: Multiple Teachers

**Duration:** 5-10 minutes

**Setup:**

```
Browser 1: Admin Dashboard
Browser 2: Teacher Dashboard (Teacher 1)
Browser 3: Teacher Dashboard (Teacher 2 - different account)
```

**Steps:**

1. In Admin Dashboard, create announcement
2. Set Target Audience: "Teachers"
3. Submit

**Expected Result:**

- **Teacher 1**: Sees notification ✓
- **Teacher 2**: Sees notification ✓
- **Other users** (e.g., students): Don't see it if sent to "Teachers" only ✓

**Verification:**

```
✓ All teachers receive same announcement
✓ Each has independent read/unread status
✓ Targeting works correctly
```

### Test 4: Priority Levels

**Duration:** 5 minutes

**Steps:**

1. Create 3 announcements with different priorities:

   - Announcement 1: Priority "High"
   - Announcement 2: Priority "Medium"
   - Announcement 3: Priority "Low"

2. View in Teacher Dashboard notification drawer

**Expected Result:**

- High: Red tag
- Medium: Orange tag
- Low: Default gray tag

**Verification:**

```
✓ Colors display correctly
✓ Tags show in drawer
✓ Sorting works (newest first regardless of priority)
```

### Test 5: Read Status Persistence

**Duration:** 3-5 minutes

**Steps:**

1. Create notification in Admin Dashboard
2. Open Teacher Dashboard, see notification
3. Click notification to mark as read
4. **Refresh the page** (F5)
5. Open notification drawer again

**Expected Result:**

- Notification still shows as read
- Blue dot is gone
- Unread count stays at 0

**Verification:**

```
✓ Read status saved to localStorage
✓ Persists after page refresh
✓ readNotificationIds array updated
```

### Test 6: Deduplication

**Duration:** 2-3 minutes

**Steps:**

1. Create an announcement
2. View in Teacher Dashboard
3. Create the same announcement again (copy)
4. Check Teacher Dashboard

**Expected Result:**

- **NOT two separate notifications**
- Only **one notification** appears
- System deduplicates by announcementId

**Verification:**

```
✓ Duplicates removed
✓ Newest version kept
✓ No duplicate display issues
```

### Test 7: UI/UX

**Duration:** 3-5 minutes

**Steps:**

1. Create notification
2. Test drawer interactions:
   - Open drawer
   - Scroll notifications
   - Click individual notifications
   - Click "Mark all as read"
   - Close drawer
   - Reopen drawer

**Expected Result:**

- Smooth animations
- No lag or freezing
- Proper scrolling
- Bell updates correctly
- Toast notifications appear/disappear

**Verification:**

```
✓ Drawer slides smoothly
✓ No console errors
✓ Responsive on mobile
✓ Badge updates instantly
✓ Toast appears/hides correctly
```

### Test 8: Different Screen Sizes

**Duration:** 5 minutes

**Steps:**

1. Test on desktop (width > 1024px)
   - Drawer width should be 440px
2. Test on tablet (768px < width < 1024px)
   - Drawer width should be 440px
3. Test on mobile (width < 768px)
   - Drawer width should be 100%

**Expected Result:**

- Drawer properly sized for each breakpoint
- Text readable on all sizes
- Buttons clickable on touch devices

**Verification:**

```
✓ Desktop: 440px wide drawer
✓ Tablet: 440px wide drawer
✓ Mobile: Full width drawer (100%)
✓ Text readable
✓ Touch friendly
```

## Debugging with Console

### Check Current Notifications

```javascript
// Open browser DevTools console (F12) and run:

// View all notifications
JSON.parse(localStorage.getItem("localNotifications"));

// View read notification IDs
JSON.parse(localStorage.getItem("readNotificationIds"));

// Count total notifications
JSON.parse(localStorage.getItem("localNotifications")).length;

// Check specific notification
const notifs = JSON.parse(localStorage.getItem("localNotifications"));
notifs[0]; // View first notification
```

### Clear All Notifications

```javascript
// Clear all stored notifications
localStorage.removeItem("localNotifications");
localStorage.removeItem("readNotificationIds");
location.reload(); // Refresh page
```

### Manual Refresh

```javascript
// If fetchNotifications is available in scope:
fetchNotifications();
```

## Console Log Markers

Look for these patterns in browser console:

### ✅ Success Indicators

```
"✅ Notifications created successfully via"
"✅ Local notification created:"
"✅ API notification sent, also saving locally as backup"
"📢 Fetched announcements:"
"🔔 Teacher Dashboard - Fetched notifications:"
```

### ℹ️ Info Logs

```
"📋 Teacher Dashboard - Raw local notifications:"
"📋 Teacher Dashboard - Sample local notifications:"
"🔄 Teacher Dashboard - Opening notification drawer"
"🔄 Teacher Dashboard - Quick refreshing notifications"
```

### ⚠️ Warning Signs

```
"⚠️ Could not create notifications"
"❌ AdminAnnouncement - Error creating local notification:"
"❌ Teacher Dashboard - Filtered out notification:"
```

## Troubleshooting Checklist

### Notifications Not Appearing?

- [ ] Check browser console for errors
- [ ] Verify announcement targetAudience includes "teachers" or "all"
- [ ] Clear localStorage and refresh
- [ ] Check Network tab for failed API calls
- [ ] Look for: "API notifications not available" in console

### Bell Badge Not Showing?

- [ ] Check that notification type is "admin_announcement"
- [ ] Verify unreadCount > 0
- [ ] Look for: "🔔 Teacher Dashboard - Fetched notifications:"
- [ ] Check localStorage for "localNotifications"

### Notifications Disappearing After Refresh?

- [ ] Verify localStorage is not being cleared
- [ ] Check if read status is saved in "readNotificationIds"
- [ ] Test with localStorage manually (see console debugging)

### Drawer Not Updating in Real-Time?

- [ ] Ensure drawer is actually open (check DOM)
- [ ] Look for: "🔄 Teacher Dashboard - Quick refreshing"
- [ ] Check Network tab for fetch requests every 5s
- [ ] Verify no JavaScript errors in console

### Duplicate Notifications?

- [ ] Check for duplicate announcements in admin
- [ ] Clear localStorage
- [ ] Verify deduplication logic (check console logs)

## Performance Benchmarks

Expected performance metrics:

```
Initial Load:
  - Fetch notifications: < 2s
  - Display in drawer: < 500ms

Real-time Updates (drawer open):
  - Fetch interval: 5 seconds
  - Display update: < 1s
  - No lag or freezing

Background Updates (drawer closed):
  - Fetch interval: 10 seconds
  - Memory usage: < 5MB
  - CPU usage: minimal

Toast Notification:
  - Show: instant
  - Duration: 2 seconds
  - Hide: smooth fade
```

## Common Issues and Solutions

### Issue: API Connection Failed

**Solution:**

1. Check backend server is running
2. Verify API_BASE_URL is correct
3. Check CORS headers
4. Fallback to localStorage works automatically

### Issue: Notifications Stacking Up

**Solution:**

1. Implement pagination in drawer
2. Archive old notifications
3. Clear read notifications periodically

### Issue: Real-time Updates Slow

**Solution:**

1. Reduce refresh interval (currently 5s for drawer)
2. Implement WebSocket for true real-time
3. Optimize API response time

### Issue: localStorage Full

**Solution:**

1. Implement notification cleanup
2. Archive to backend
3. Clear old notifications (>30 days)

## Success Criteria

✅ **System is working correctly when:**

1. Notifications appear immediately after creation
2. Bell badge shows correct unread count
3. Notifications display in drawer with all details
4. Real-time updates work when drawer is open
5. Read status persists after refresh
6. No duplicate notifications appear
7. Proper filtering by targetAudience
8. Smooth animations and no lag
9. Works on desktop, tablet, mobile
10. Fallback to localStorage if API fails

---

**Last Updated:** November 5, 2025
**Test Status:** Ready for QA
