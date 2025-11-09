# Notification System - Visual Guide

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                       ADMIN DASHBOARD                           │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ AdminAnnouncement Component                                │ │
│  │ - Create Announcement Form                                │ │
│  │ - Set: Title, Content, Target Audience, Priority          │ │
│  │ - Audience: "all", "teachers", "students", etc.           │ │
│  └────────────────────────────────────────────────────────────┘ │
│                          ↓                                      │
│              [Create Announcement Button]                       │
└─────────────────────────────────────────────────────────────────┘
                          ↓
        ╔═══════════════════════════════════════╗
        ║ createAnnouncementNotifications()      ║
        ║ - Type: "admin_announcement"          ║
        ║ - Title: "📢 New Announcement: ..."   ║
        ║ - Message: {announcement content}    ║
        ║ - Target Audience: "teachers"/"all"  ║
        ║ - Priority: "high"/"medium"/"low"    ║
        ╚═══════════════════════════════════════╝
           ↙                              ↘
        Try API                      Save to
        (Multiple endpoints)         localStorage
           ↓                              ↓
    Backend Store              Client-side Backup
    (if available)             (Fallback option)
           ↘                              ↙
           ╔═══════════════════════════════╗
           ║   NOTIFICATION STORAGE        ║
           ║ API + localStorage (redundant)║
           ╚═══════════════════════════════╝
                      ↓
┌─────────────────────────────────────────────────────────────────┐
│                    TEACHER DASHBOARD                            │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ TeacherHeader Component                                  │  │
│  │                                                          │  │
│  │ [📢 Menu] [Title]     [EN/JP] [🔔❤️] [Profile]        │  │
│  │                                       ↑                  │  │
│  │                              Notification Bell          │  │
│  │                              - Shows unread count       │  │
│  │                              - Red badge (#ff4d4f)     │  │
│  │                              - Updates real-time        │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                          ↓ [Click Bell]                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Notification Drawer (Right Side)                         │  │
│  │                                                          │  │
│  │ [📢] Notifications          [x] [Mark all as read]      │  │
│  │ ─────────────────────────────────────────────────        │  │
│  │                                                          │  │
│  │ ┌─ UNREAD NOTIFICATION ────────────────────────────┐   │  │
│  │ │ [🔔] 📢 New Announcement: Important Update ●    │   │  │
│  │ │      The new policy is now in effect...         │   │  │
│  │ │      [High] Priority      2 hours ago           │   │  │
│  │ └────────────────────────────────────────────────┘   │  │
│  │                                                          │  │
│  │ ┌─ READ NOTIFICATION ──────────────────────────────┐   │  │
│  │ │ [🔔] 📢 New Announcement: Meeting Reminder      │   │  │
│  │ │      Please attend the team meeting tomorrow    │   │  │
│  │ │      [Medium] Priority     5 hours ago          │   │  │
│  │ └────────────────────────────────────────────────┘   │  │
│  │                                                          │  │
│  │ [Refresh] [Mark all as read]                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Notification Update Flow

### When Drawer is Closed:

```
Background Auto-Refresh (Every 10 seconds)
        ↓
Check localStorage + API for new notifications
        ↓
Update unread count
        ↓
If new notifications arrived:
  ├─ Update bell badge
  └─ Show toast: "📢 X new notification(s)"
```

### When Drawer Opens:

```
Click bell icon
        ↓
Immediate fetch notifications
        ↓
Show notification list
        ↓
Start aggressive refresh (Every 5 seconds)
        ↓
Update notification list in real-time
        ↓
When drawer closes:
  ├─ Stop 5-second refresh
  ├─ Resume 10-second background refresh
  └─ Clear memory
```

## Notification Object Structure

```javascript
{
  id: "local_timestamp_random",           // Unique identifier
  type: "admin_announcement",             // Type of notification
  title: "📢 New Announcement: Title",    // Display title
  message: "Announcement content...",     // Full message
  priority: "medium",                     // high/medium/low
  read: false,                            // Read status
  timestamp: "2025-11-05T10:00:00Z",      // Creation time
  icon: "bell",                           // Icon type
  color: "#1890ff",                       // Display color (blue)
  sender: "Admin Name",                   // Who sent it
  targetAudience: "teachers",             // "teachers"/"all"/"students"
  announcementId: "123456",               // Link to announcement
  actionUrl: "/announcements/123456"      // Click-through URL
}
```

## Filtering Logic

```javascript
Show notification if:
  (type === "announcement" OR type === "admin_announcement")
  AND
  (targetAudience === "teachers" OR targetAudience === "all")

Hide notification if:
  - targetAudience === "students" (only for students)
  - targetAudience === "admins" (only for admins)
  - targetAudience === other roles (not for this teacher)
```

## Storage Mechanism

```
Browser Storage Hierarchy:
├─ API Backend (Primary)
│  └─ GET /api/notifications - Fetch notifications
│  └─ POST /api/notifications - Create notification
│  └─ PUT /api/notifications/{id}/read - Mark as read
│
└─ localStorage (Fallback)
   ├─ "localNotifications" - All notifications as JSON array
   ├─ "readNotificationIds" - Array of read notification IDs
   └─ Used when API is unavailable
```

## Color Coding

### Priority Levels:

```
🔴 High Priority    → Red (#f5222d)
🟠 Medium Priority  → Orange (#faad14)
⚪ Low Priority     → Default (#bfbfbf)
```

### Notification Types:

```
📢 admin_announcement  → Blue (#1890ff) with bell icon
🏆 grade_update        → Green (#52c41a) with trophy icon
📄 assignment_new      → Purple (#722ed1) with file icon
❓ quiz_available      → Amber (#faad14) with question icon
⏰ homework_due        → Red (#f5222d) with clock icon
📹 live_class_started  → Red (#dc2626) with video icon
```

## Read/Unread States

```
UNREAD NOTIFICATION:
┌──────────────────────────────────┐
│ • [Bell Icon] Title              │  ← Blue dot indicator
│   Full message text displayed    │
│   [Priority Tag]  "5 hours ago" │
│ Light blue background (#f6f8ff) │
│ Bold title text (weight: 600)   │
└──────────────────────────────────┘

READ NOTIFICATION:
┌──────────────────────────────────┐
│   [Bell Icon] Title              │  ← No blue dot
│   Full message text displayed    │
│   [Priority Tag]  "5 hours ago" │
│ White background                 │
│ Normal title text (weight: 500)  │
└──────────────────────────────────┘
```

## Interactive Timeline

```
INITIAL STATE:
┌─ Teachers Dashboard loads
│  ├─ Check localStorage for notifications
│  ├─ Fetch from API
│  └─ Display bell with unread count
│
TIME: 0s - User opens notification drawer
│  ├─ Immediate fetch
│  ├─ Show notification list
│  └─ Start 5-second refresh
│
TIME: 5s - Auto-refresh (drawer open)
│  ├─ Fetch new notifications
│  └─ Update list in real-time
│
TIME: 10s - Admin creates announcement
│  ├─ Announcement saved to API
│  ├─ Notification created
│  └─ Stored in localStorage
│
TIME: 10.2s - Teacher dashboard refreshes (5s cycle)
│  ├─ Fetches new notification
│  ├─ Adds to list
│  └─ Updates in drawer immediately
│
TIME: 15s - User closes drawer
│  ├─ Stop 5-second refresh
│  ├─ Resume 10-second background refresh
│  └─ Clear memory
│
TIME: 20s, 30s, 40s... - Background refresh (every 10s)
│  ├─ Fetch notifications
│  ├─ Update bell badge if changed
│  └─ Show toast for new notifications
```

## Memory Management

```
Drawer Opens:
  ├─ Create: window._notificationRefreshInterval
  ├─ Interval: setInterval(fetchNotifications, 5000)
  └─ Purpose: Aggressive real-time updates

Drawer Closes:
  ├─ Check: if (window._notificationRefreshInterval)
  ├─ Clear: clearInterval(window._notificationRefreshInterval)
  ├─ Reset: window._notificationRefreshInterval = null
  └─ Purpose: Prevent memory leaks
```

## Error Handling

```
API Unavailable?
  → Fall back to localStorage
  → Show notifications from cache
  → Notify user: "Working offline"

localStorage Corrupted?
  → Parse JSON safely
  → Default to empty array []
  → Continue fetching from API

No Notifications?
  → Show: "No notifications yet"
  → Bell badge: Hidden
  → Toast: Not shown
```

---

This visual guide helps understand the complete notification lifecycle from creation to display and management.
