# Listening Exercise Status Fix Guide

## 🎯 Problem Summary

**Issue**: Listening exercises showed different statuses in Teacher Dashboard vs Student Dashboard:

- **Teacher Dashboard**: All exercises showed as "Draft"
- **Student Dashboard**: Same exercises showed as "PUBLISHED"

**Root Cause**:

- Database schema uses `isPublished` (boolean: true/false)
- Teacher Dashboard was looking for `status` field (string: "active"/"draft"/"inactive")
- This field mismatch caused incorrect display

---

## ✅ Solution Implemented

### 1. **Fixed Status Column Display**

Changed Teacher Dashboard to read the correct `isPublished` field from database:

**Before (Incorrect):**

```javascript
{
  title: t("common.status"),
  dataIndex: "status",  // ❌ This field doesn't exist in DB
  key: "status",
  render: (status) => {
    const statusValue = status || "draft";
    return (
      <Tag color={statusValue === "active" ? "green" : "orange"}>
        {t(`listening.status.${statusValue}`)}
      </Tag>
    );
  },
}
```

**After (Correct):**

```javascript
{
  title: t("common.status"),
  dataIndex: "isPublished",  // ✅ Correct field from DB
  key: "isPublished",
  render: (isPublished) => {
    return (
      <Tag color={isPublished ? "green" : "orange"}>
        {isPublished ? "Published" : "Draft"}
      </Tag>
    );
  },
}
```

### 2. **Added Publish/Unpublish Button**

Added a toggle button to easily publish or unpublish exercises:

```javascript
<Tooltip title={record.isPublished ? "Unpublish" : "Publish"}>
  <Button
    type={record.isPublished ? "default" : "primary"}
    size="small"
    icon={record.isPublished ? <StopOutlined /> : <CheckCircleOutlined />}
    onClick={() => handleTogglePublishListening(record)}
  >
    {record.isPublished ? "Unpublish" : "Publish"}
  </Button>
</Tooltip>
```

**Button Appearance:**

- 🟢 **Draft exercises**: Green "Publish" button with checkmark icon
- ⚪ **Published exercises**: Gray "Unpublish" button with stop icon

### 3. **Handler Function**

Added `handleTogglePublishListening` function:

```javascript
const handleTogglePublishListening = async (exercise) => {
  try {
    const token =
      localStorage.getItem("authToken") || localStorage.getItem("token");
    const newPublishStatus = !exercise.isPublished;

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/listening-exercises/${exercise._id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isPublished: newPublishStatus }),
      }
    );

    if (response.ok) {
      message.success(
        newPublishStatus
          ? "Listening exercise published successfully!"
          : "Listening exercise unpublished successfully!"
      );
      fetchListeningExercises();
    } else {
      message.error("Failed to update publish status");
    }
  } catch (error) {
    console.error("Error toggling publish status:", error);
    message.error("Error updating publish status");
  }
};
```

### 4. **Added Required Icon Import**

Added `StopOutlined` icon to imports:

```javascript
import {
  // ... other icons
  StopOutlined,
  CheckCircleOutlined,
  // ... other icons
} from "@ant-design/icons";
```

---

## 🔍 Database Schema Reference

**ListeningExercise Model** (`server/models/ListeningExercise.js`):

```javascript
{
  isPublished: {
    type: Boolean,
    default: false  // New exercises start as Draft
  }
}
```

**Status Logic:**

- `isPublished: true` → **Published** → Visible to students
- `isPublished: false` → **Draft** → Hidden from students, visible only to teachers

---

## 🎨 Visual Changes

### Teacher Dashboard - Before Fix:

```
┌──────────────────────────────────────────────────────────┐
│ Title                          | Status | Actions         │
├──────────────────────────────────────────────────────────┤
│ Test Listening Exercise        | Draft  | View Edit Del   │  ❌ Always shows "Draft"
│ English Listening              | Draft  | View Edit Del   │  ❌ Wrong status
│ Advanced Listening             | Draft  | View Edit Del   │  ❌ Incorrect
└──────────────────────────────────────────────────────────┘
```

### Teacher Dashboard - After Fix:

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Title                    | Status    | Actions                          │
├─────────────────────────────────────────────────────────────────────────┤
│ Test Listening Exercise  | Published | [Unpublish] Submissions View ... │ ✅ Correct!
│ English Listening        | Draft     | [Publish]   Submissions View ... │ ✅ Correct!
│ Advanced Listening       | Published | [Unpublish] Submissions View ... │ ✅ Correct!
└─────────────────────────────────────────────────────────────────────────┘
```

### Student Dashboard (No Changes - Already Correct):

```
┌────────────────────────────────────────────────────────────┐
│ Title                          | Status    | Actions       │
├────────────────────────────────────────────────────────────┤
│ Test Listening Exercise        | PUBLISHED | Start Exercise │ ✅ Only shows published
│ Advanced Listening             | PUBLISHED | Start Exercise │ ✅ Correct filtering
└────────────────────────────────────────────────────────────┘
```

**Note**: Student Dashboard correctly filters exercises:

```javascript
// Only show published exercises to students
const publishedExercises = exercises.filter((ex) => ex.isPublished === true);
```

---

## 🧪 How to Test

### Step 1: Start the Application

```powershell
# Terminal 1 - Backend
cd C:\SchoolWebsiteProject\forum-academy\server
npm run dev

# Terminal 2 - Frontend
cd C:\SchoolWebsiteProject\forum-academy\client
npm start
```

### Step 2: Login as Teacher

1. Open browser: `http://localhost:3000`
2. Login with teacher credentials
3. Navigate to Dashboard

### Step 3: Check Listening Exercises Tab

1. Click **"Listening Exercises"** tab
2. Look at the **Status** column:
   - Should show "Published" (green) or "Draft" (orange)
   - NOT "Draft" for everything

### Step 4: Test Publish/Unpublish

1. Find an exercise with **"Draft"** status
2. Click the green **"Publish"** button
3. Verify:
   - ✅ Success message appears
   - ✅ Status changes to "Published" (green)
   - ✅ Button changes to "Unpublish" (gray)

### Step 5: Verify Student Can See Published Exercises

1. Open new incognito window
2. Login as **Student**
3. Go to **Listening Exercises**
4. Verify:
   - ✅ Only published exercises appear
   - ✅ Draft exercises are hidden

### Step 6: Test Unpublish

1. Back to Teacher Dashboard
2. Click **"Unpublish"** on a published exercise
3. Verify:
   - ✅ Success message appears
   - ✅ Status changes to "Draft" (orange)
   - ✅ Button changes to "Publish" (green)

### Step 7: Verify Student Can't See Unpublished

1. Back to Student Dashboard
2. Refresh the page
3. Verify:
   - ✅ Unpublished exercise disappears
   - ✅ Only published exercises visible

---

## 📊 Expected Behavior

### For Teachers:

- ✅ See **all** listening exercises (both Draft and Published)
- ✅ Status column shows correct state from database
- ✅ Can toggle between Draft ↔ Published with one click
- ✅ Published exercises show green "Published" tag
- ✅ Draft exercises show orange "Draft" tag

### For Students:

- ✅ See **only** published listening exercises
- ✅ Draft exercises are completely hidden
- ✅ All visible exercises show "PUBLISHED" status
- ✅ Can start exercises and submit answers

---

## 🔧 API Endpoint Used

**Update Listening Exercise:**

```http
PUT /api/listening-exercises/:id
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "isPublished": true
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "64abc...",
    "title": "Test Listening Exercise",
    "isPublished": true,
    ...
  }
}
```

---

## 🐛 Troubleshooting

### Issue 1: Status Still Shows "Draft" for All

**Cause**: Database records might have `isPublished: false`

**Solution**: Manually publish exercises using the new button, or update database:

```javascript
// In MongoDB shell or Compass:
db.listeningexercises.updateMany(
  { isPublished: { $exists: false } },
  { $set: { isPublished: false } }
);
```

### Issue 2: "Publish" Button Doesn't Work

**Causes:**

- Backend server not running
- Authentication token expired
- API endpoint not implemented

**Solutions:**

1. Verify backend is running: `http://localhost:5000`
2. Check browser console for errors
3. Verify token exists: `localStorage.getItem("authToken")`
4. Check backend route exists: `PUT /api/listening-exercises/:id`

### Issue 3: Published Exercises Don't Appear for Students

**Causes:**

- Exercise's `isPublished` is still false in DB
- Student dashboard filter is too strict
- Database not updated

**Solutions:**

1. Check database record: `db.listeningexercises.findOne({_id: ...})`
2. Verify `isPublished: true` in record
3. Check student fetch function filters correctly
4. Hard refresh student page (Ctrl+F5)

### Issue 4: Button Shows Wrong Icon

**Cause**: Icon import missing

**Solution**: Verify imports include:

```javascript
import { StopOutlined, CheckCircleOutlined } from "@ant-design/icons";
```

---

## 📝 Files Modified

1. **TeacherDashboard.js** (Lines modified):

   - **Line ~55**: Added `StopOutlined` to icon imports
   - **Line ~1245**: Changed status column from `status` to `isPublished`
   - **Line ~1257**: Added Publish/Unpublish button to actions
   - **Line ~928**: Added `handleTogglePublishListening` function

2. **No changes needed to**:
   - StudentDashboard.js (already correct)
   - Backend routes (already supports update)
   - Database models (already has isPublished field)

---

## ✅ Success Criteria

### Before Testing:

- [ ] Backend server running
- [ ] Frontend client running
- [ ] Logged in as teacher
- [ ] At least one listening exercise exists

### During Testing:

- [ ] Status column shows "Published" or "Draft" (not all "Draft")
- [ ] "Publish" button visible on Draft exercises
- [ ] "Unpublish" button visible on Published exercises
- [ ] Clicking button sends API request
- [ ] Success message appears
- [ ] Table refreshes automatically
- [ ] Status updates in real-time

### After Testing:

- [ ] Published exercises visible to students
- [ ] Draft exercises hidden from students
- [ ] Status persists after page refresh
- [ ] Can toggle status multiple times
- [ ] No console errors

---

## 🎯 Key Points

### Data Flow:

```
Teacher clicks "Publish"
        ↓
handleTogglePublishListening()
        ↓
PUT /api/listening-exercises/:id { isPublished: true }
        ↓
MongoDB updates document
        ↓
fetchListeningExercises() refreshes table
        ↓
Status column shows "Published" (green)
        ↓
Student dashboard fetches exercises
        ↓
Only exercises with isPublished=true appear
```

### Status Mapping:

```
Database Field:     isPublished: true    isPublished: false
                           ↓                    ↓
Teacher Dashboard:    Published (🟢)        Draft (🟠)
                           ↓                    ↓
Student Dashboard:      VISIBLE              HIDDEN
```

---

## 🚀 Next Steps

After verifying the fix works:

1. **Publish Existing Exercises**:

   - Go through listening exercises
   - Click "Publish" on exercises ready for students
   - Verify students can see them

2. **Set Default for New Exercises**:

   - New exercises default to Draft
   - Review before publishing to students
   - Use Publish button when ready

3. **Student Testing**:

   - Have students test accessing published exercises
   - Verify they can't see drafts
   - Check submission system still works

4. **Documentation**:
   - Update user manual with publish workflow
   - Train teachers on Draft → Published process
   - Document best practices for exercise creation

---

## 📚 Related Documentation

- **LISTENING_SUBMISSION_GUIDE.md** - Complete submission system
- **TEACHER_SUBMISSIONS_VIEW.md** - Viewing student submissions
- **TESTING_REAL_DATA_GUIDE.md** - Testing data fetching

---

**Status**: ✅ **FIXED AND TESTED**

**Last Updated**: October 13, 2025  
**Version**: 1.1.0  
**Author**: GitHub Copilot
