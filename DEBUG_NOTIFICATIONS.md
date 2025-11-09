# 🔍 Debug Script for Notification Issues

## Problem

Notifications showing in Teacher Dashboard but displaying incomplete data:

- Title shows "New Announcement" without full content
- Message shows short text (vbcv, sgdgd, dfadf)
- Not fetching real notification content from admin

## Quick Debug

### Step 1: Check localStorage in Browser Console (F12)

Open the Teacher Dashboard, press F12, go to **Console** tab and run:

```javascript
// Check all local notifications
console.log("=== LOCAL NOTIFICATIONS ===");
const localNotifs = JSON.parse(
  localStorage.getItem("localNotifications") || "[]"
);
console.log("Total:", localNotifs.length);
console.log("All notifications:", localNotifs);

// Check each notification details
localNotifs.forEach((n, i) => {
  console.log(`\n--- Notification ${i + 1} ---`);
  console.log("ID:", n.id || n._id);
  console.log("Type:", n.type);
  console.log("Title:", n.title);
  console.log("Message:", n.message);
  console.log("Target Audience:", n.targetAudience);
  console.log("Priority:", n.priority);
  console.log("Sender:", n.sender);
  console.log("Timestamp:", n.timestamp || n.createdAt);
});

// Check read status
console.log("\n=== READ STATUS ===");
const readIds = JSON.parse(localStorage.getItem("readNotificationIds") || "[]");
console.log("Read notification IDs:", readIds);
```

### Step 2: Check What You Expected

The notification should look like:

```javascript
{
  id: "local_1730000000_abc123",
  type: "admin_announcement",
  title: "📢 New Announcement: Your Actual Title Here",
  message: "Your full announcement content/message here",
  targetAudience: "teachers" or "all",
  priority: "high" or "medium" or "low",
  sender: "Admin Name",
  timestamp: "2025-11-05T...",
  read: false
}
```

### Step 3: If Notifications Are Wrong Format

If the notifications show wrong data, **clear and recreate**:

```javascript
// Clear all notifications
localStorage.removeItem("localNotifications");
localStorage.removeItem("readNotificationIds");
console.log("✅ Cleared all notifications");

// Reload page
location.reload();
```

### Step 4: Create Test Announcement

In **Admin Dashboard**:

1. Go to Announcements
2. Click "Create New Announcement"
3. Fill in:
   - **Title**: "TEST - This is a test announcement"
   - **Content**: "This is the full content of the test announcement. You should see this message in the teacher dashboard."
   - **Target Audience**: "Teachers" or "All"
   - **Priority**: "High"
4. Click "Create"

### Step 5: Check Admin Console

In **Admin Dashboard**, open console (F12) and look for:

```
✅ Notifications created successfully via...
📋 AdminAnnouncement - Full notification: {object}
```

Copy the full notification object and check:

- Does it have the correct `title`?
- Does it have the correct `message`?
- Does it have `targetAudience: "teachers"` or "all"?

### Step 6: Check Teacher Dashboard Console

In **Teacher Dashboard**, open console and look for:

```
📋 Teacher Dashboard - Raw local notifications: X
📋 Teacher Dashboard - Sample local notifications: [...]
🔔 Teacher Dashboard - Fetched notifications: X, Unread: X
```

Check if:

- The notification appears in the sample
- The count is correct
- The title and message are correct

## Common Issues

### Issue 1: Notifications Show Wrong Title

**Symptom:** Title shows just "New Announcement" without the announcement title

**Cause:** Translation key missing or wrong format

**Fix:** Check the notification creation in AdminAnnouncement.js line 198:

```javascript
title: `📢 ${newAnnouncementPrefix}: ${announcementData.title}`;
```

### Issue 2: Message Shows Short Text

**Symptom:** Message shows "vbcv" or other short text instead of full content

**Cause:**

- Announcement content field is empty or short
- Wrong field being saved

**Fix:**

1. Make sure you fill the "Content" field when creating announcement
2. Check that `announcementData.content` has the full text
3. Verify line 199 in AdminAnnouncement.js:

```javascript
message: announcementData.content,
```

### Issue 3: Notifications Not Showing

**Symptom:** Bell badge shows count but drawer is empty or no notifications

**Cause:** Filtering issue with targetAudience or type

**Fix:**

```javascript
// Check filtering in console
const localNotifs = JSON.parse(
  localStorage.getItem("localNotifications") || "[]"
);
const filtered = localNotifs.filter(
  (n) =>
    (n.type === "announcement" || n.type === "admin_announcement") &&
    (n.targetAudience === "teachers" || n.targetAudience === "all")
);
console.log("Filtered for teachers:", filtered);
```

### Issue 4: Duplicate or Old Notifications

**Symptom:** Old test notifications keep appearing

**Fix:**

```javascript
// Clear specific notifications
let localNotifs = JSON.parse(
  localStorage.getItem("localNotifications") || "[]"
);

// Option 1: Remove notifications with specific keywords
localNotifs = localNotifs.filter(
  (n) =>
    !n.title.includes("vbcv") &&
    !n.title.includes("sgdgd") &&
    !n.title.includes("dfadf")
);

// Option 2: Keep only recent notifications (last 24 hours)
const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
localNotifs = localNotifs.filter(
  (n) => new Date(n.timestamp || n.createdAt).getTime() > oneDayAgo
);

// Save back
localStorage.setItem("localNotifications", JSON.stringify(localNotifs));
console.log("✅ Cleaned up. Remaining:", localNotifs.length);
location.reload();
```

## Manual Test Notification

Create a perfect test notification manually:

```javascript
// Run this in Teacher Dashboard console
const testNotification = {
  id: "test_" + Date.now(),
  _id: "test_" + Date.now(),
  type: "admin_announcement",
  title: "📢 New Announcement: Manual Test Notification",
  message:
    "This is a manually created test notification to verify the display is working correctly. You should see this full message in the drawer.",
  targetAudience: "teachers",
  priority: "high",
  sender: "Test Admin",
  timestamp: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  read: false,
  isLocal: true,
  icon: "📢",
  color: "#1890ff",
};

const localNotifs = JSON.parse(
  localStorage.getItem("localNotifications") || "[]"
);
localNotifs.push(testNotification);
localStorage.setItem("localNotifications", JSON.stringify(localNotifs));
console.log("✅ Test notification created");

// Reload to see it
location.reload();
```

## Expected vs Actual

### Expected Behavior

1. Admin creates announcement with title and content
2. Notification created with:
   - Title: "📢 New Announcement: [announcement title]"
   - Message: [full announcement content]
3. Teacher sees notification in drawer with full title and message
4. Clicking notification opens full detail

### Actual Problem (from your screenshot)

1. Notifications appear but show:
   - Title: "New Announcement"
   - Message: Very short text like "vbcv", "sgdgd", "dfadf"
2. Missing emoji prefix "📢"
3. Missing announcement title after "New Announcement:"
4. Missing full content in message

## Solution Steps

1. **Clear old test data:**

   ```javascript
   localStorage.removeItem("localNotifications");
   localStorage.removeItem("readNotificationIds");
   location.reload();
   ```

2. **Create proper announcement in Admin:**

   - Use full, detailed title
   - Fill the content field completely
   - Select "Teachers" as target audience
   - Set priority to "High" for testing

3. **Check Admin console logs:**

   - Look for "✅ Notifications created successfully"
   - Check the full notification object structure

4. **Check Teacher dashboard:**

   - Should see bell badge with count
   - Should see toast notification
   - Open drawer and verify full content displays

5. **If still not working, share console output:**
   - Copy the output from Step 1 above
   - Copy any error messages in console
   - Share the notification object from Admin console

---

**Run the Step 1 debug script now and share the output so I can see exactly what's in your localStorage!**
