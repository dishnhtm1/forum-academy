# Visual Diagnostic Guide: Student Dashboard Data Issues

## 🎯 Quick Issue Identification

```
┌────────────────────────────────────────────────────────────┐
│          STUDENT DASHBOARD DIAGNOSTICS                     │
│                                                            │
│  Symptom              →  Likely Cause                      │
├────────────────────────────────────────────────────────────┤
│  Empty table          →  All exercises unpublished         │
│  Blank course names   →  Field mismatch (name vs title)    │
│  "N/A" duration       →  Field mismatch (duration vs time) │
│  No difficulty tags   →  Field mismatch (difficulty vs lvl)│
│  401 errors           →  Token missing/expired             │
│  Nothing loads        →  API endpoint down                 │
│  Stats show zeros     →  Missing calculation logic         │
└────────────────────────────────────────────────────────────┘
```

---

## 🔍 Data Flow Diagnostic Map

### The Journey of Listening Exercise Data

```
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 1: DATABASE                                                   │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  MongoDB: listeningexercises collection                     │    │
│  │  {                                                           │    │
│  │    title: "Test Exercise",                                  │    │
│  │    level: "beginner",          ← NOT "difficulty"           │    │
│  │    timeLimit: 30,              ← NOT "duration"             │    │
│  │    course: ObjectId(...)       ← References courses         │    │
│  │    isPublished: false          ← KEY FIELD!                 │    │
│  │    questions: [...]                                         │    │
│  │  }                                                           │    │
│  └────────────────────────────────────────────────────────────┘    │
│                            ↓                                        │
│  ⚠️ CHECKPOINT: Are exercises marked isPublished: true?            │
└─────────────────────────────────────────────────────────────────────┘

                               ↓

┌─────────────────────────────────────────────────────────────────────┐
│  STEP 2: BACKEND API                                                │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  GET /api/listening-exercises                               │    │
│  │                                                              │    │
│  │  ListeningExercise.find()                                   │    │
│  │    .populate('course', 'title code')  ← Returns "title"     │    │
│  │    .sort({ createdAt: -1 })                                 │    │
│  │                                                              │    │
│  │  Response: [                                                │    │
│  │    {                                                         │    │
│  │      _id: "64abc...",                                       │    │
│  │      title: "Test Exercise",                                │    │
│  │      level: "beginner",                                     │    │
│  │      timeLimit: 30,                                         │    │
│  │      course: {                                              │    │
│  │        _id: "64xyz...",                                     │    │
│  │        title: "English 101"  ← NOT "name"                   │    │
│  │      },                                                      │    │
│  │      isPublished: false                                     │    │
│  │    }                                                         │    │
│  │  ]                                                           │    │
│  └────────────────────────────────────────────────────────────┘    │
│                            ↓                                        │
│  ⚠️ CHECKPOINT: Does API return 200 status? Check Network tab      │
└─────────────────────────────────────────────────────────────────────┘

                               ↓

┌─────────────────────────────────────────────────────────────────────┐
│  STEP 3: FRONTEND FETCH                                             │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  const response = await fetch(...listening-exercises)       │    │
│  │  const data = await response.json()                         │    │
│  │                                                              │    │
│  │  console.log("📚 Response:", data)  ← CHECK THIS LOG        │    │
│  │  // Shows: [{ title: "Test", level: "beginner", ... }]     │    │
│  └────────────────────────────────────────────────────────────┘    │
│                            ↓                                        │
│  ⚠️ CHECKPOINT: Is console.log showing data? Open DevTools!        │
└─────────────────────────────────────────────────────────────────────┘

                               ↓

┌─────────────────────────────────────────────────────────────────────┐
│  STEP 4: FILTERING                                                  │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  const exercises = Array.isArray(data) ? data : []          │    │
│  │  const publishedExercises = exercises.filter(               │    │
│  │    (ex) => ex.isPublished === true                          │    │
│  │  )                                                           │    │
│  │                                                              │    │
│  │  console.log("✅ Published:", publishedExercises.length)    │    │
│  │  // If isPublished = false → Result: 0 exercises            │    │
│  │                                                              │    │
│  │  setListeningExercises(publishedExercises)                  │    │
│  └────────────────────────────────────────────────────────────┘    │
│                            ↓                                        │
│  ⚠️ CHECKPOINT: Are exercises being filtered out? Check count!     │
└─────────────────────────────────────────────────────────────────────┘

                               ↓

┌─────────────────────────────────────────────────────────────────────┐
│  STEP 5: UI RENDERING                                               │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  <Table dataSource={listeningExercises} />                  │    │
│  │                                                              │    │
│  │  Columns:                                                    │    │
│  │    title: record.title              ✅ Works                │    │
│  │    course: record.course?.name      ❌ Should be .title     │    │
│  │    difficulty: record.difficulty    ❌ Should be .level     │    │
│  │    duration: record.duration        ❌ Should be .timeLimit │    │
│  │    questions: record.questions      ✅ Works                │    │
│  │    isPublished: record.isPublished  ✅ Works                │    │
│  └────────────────────────────────────────────────────────────┘    │
│                            ↓                                        │
│  ⚠️ CHECKPOINT: Are table columns showing undefined/blank?         │
└─────────────────────────────────────────────────────────────────────┘

                               ↓

┌─────────────────────────────────────────────────────────────────────┐
│  RESULT ON SCREEN                                                   │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │ Exercise Title    | Difficulty | Duration | Questions       │    │
│  ├────────────────────────────────────────────────────────────┤    │
│  │ Test Exercise     | undefined  | N/A min  | 2 Questions     │    │
│  │                   |            |          |                 │    │
│  │ (blank course)    |            |          |                 │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                     │
│  OR if all unpublished:                                             │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  No listening exercises available                           │    │
│  └────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔧 Field Mismatch Visual

### What Frontend Expects vs What Backend Provides

```
┌───────────────────────────────────────────────────────────────┐
│  FIELD MAPPING COMPARISON                                     │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  Frontend Code              Database Schema                  │
│  (StudentDashboard.js)      (ListeningExercise.js)          │
│  ═════════════════          ═════════════════                │
│                                                               │
│  record.course?.name   ❌ ← → course.title         ✅        │
│                                                               │
│  record.difficulty     ❌ ← → level                ✅        │
│                                                               │
│  record.duration       ❌ ← → timeLimit            ✅        │
│                                                               │
│  record.title          ✅ ← → title                ✅        │
│                                                               │
│  record.questions      ✅ ← → questions            ✅        │
│                                                               │
│  record.isPublished    ✅ ← → isPublished          ✅        │
│                                                               │
└───────────────────────────────────────────────────────────────┘

LEGEND:
  ✅ = Field names match, data displays correctly
  ❌ = Field names don't match, shows undefined/blank
```

---

## 🧪 Quick Diagnostic Commands

### Open Browser Console (F12) and Run These:

#### Test 1: Check if Data is Fetched

```javascript
// After loading student dashboard, check console for:
"📚 Listening Exercises Response:"; // Should show array of exercises
"✅ Published Listening Exercises:"; // Should show count > 0
```

#### Test 2: Check Token

```javascript
localStorage.getItem("authToken"); // Should return long string
localStorage.getItem("token"); // Alternative location
localStorage.getItem("userRole"); // Should be "student"
```

#### Test 3: Manual API Test

```javascript
fetch("http://localhost:5000/api/listening-exercises", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    "Content-Type": "application/json",
  },
})
  .then((r) => r.json())
  .then((data) => console.log("API Response:", data))
  .catch((err) => console.error("API Error:", err));
```

#### Test 4: Check Exercise Fields

```javascript
// After data loads, inspect structure
fetch("http://localhost:5000/api/listening-exercises", {
  headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
})
  .then((r) => r.json())
  .then((data) => {
    console.log("First Exercise:", data[0]);
    console.log("Has course.name?", !!data[0]?.course?.name);
    console.log("Has course.title?", !!data[0]?.course?.title);
    console.log("Has difficulty?", !!data[0]?.difficulty);
    console.log("Has level?", !!data[0]?.level);
    console.log("Has duration?", !!data[0]?.duration);
    console.log("Has timeLimit?", !!data[0]?.timeLimit);
    console.log("isPublished value:", data[0]?.isPublished);
  });
```

---

## 📊 Issue Decision Tree

```
                    Student Dashboard Loads
                            ↓
                ┌───────────┴───────────┐
                │                       │
         No data at all          Data but wrong/blank
                │                       │
                ↓                       ↓
        ┌───────┴───────┐      ┌───────┴────────┐
        │               │      │                │
    401 Error    Empty Table   Blank columns   Stats wrong
        │               │      │                │
        ↓               ↓      ↓                ↓
   Token issue    Unpublished  Field mismatch  Calc missing
                  exercises
```

### If You See: "No listening exercises available"

```
DECISION TREE:

Open browser console
        ↓
Do you see: "📚 Listening Exercises Response:" ?
        ↓
    ┌───┴───┐
   YES      NO
    │        │
    │        └→ API FAILURE
    │           - Check Network tab for errors
    │           - Verify backend is running
    │           - Check token validity
    │
    ↓
Check the count: "✅ Published Listening Exercises: X"
        ↓
    ┌───┴───┐
   X = 0    X > 0
    │        │
    │        └→ UI RENDERING ISSUE
    │           - Check component state
    │           - Verify table dataSource
    │           - Look for console errors
    │
    ↓
ALL EXERCISES ARE UNPUBLISHED
    │
    └→ SOLUTION: Go to Teacher Dashboard
       Click "Publish" button on exercises
```

### If You See: Blank course names, "N/A" duration, undefined difficulty

```
DIAGNOSIS: FIELD MISMATCH

Exercises load but columns show blanks/undefined
        ↓
This means data is fetched successfully
        ↓
But frontend is looking for wrong field names
        ↓
┌────────────────────────────────────────────┐
│ FIELD NAME CORRECTIONS NEEDED:             │
│                                            │
│ course?.name     → course?.title           │
│ difficulty       → level                   │
│ duration         → timeLimit               │
└────────────────────────────────────────────┘
```

---

## 🎯 Quick Test Matrix

| Test                   | What to Check               | Where                                                      | Expected Result                       |
| ---------------------- | --------------------------- | ---------------------------------------------------------- | ------------------------------------- |
| **1. Console Logs**    | Any errors or data logs     | F12 → Console                                              | See "📚 Listening Exercises Response" |
| **2. Network Tab**     | API request status          | F12 → Network                                              | GET /api/listening-exercises → 200 OK |
| **3. Token**           | Authentication token exists | Console: `localStorage.getItem("authToken")`               | Long string (JWT)                     |
| **4. Role**            | User is student             | Console: `localStorage.getItem("userRole")`                | "student"                             |
| **5. Database**        | Exercises exist             | MongoDB: `db.listeningexercises.find()`                    | At least 1 document                   |
| **6. Published**       | Any published exercises     | MongoDB: `db.listeningexercises.find({isPublished: true})` | At least 1 result                     |
| **7. Field Names**     | Schema field names          | Check model file                                           | level, timeLimit, course.title        |
| **8. Response Format** | API returns array           | Network → Response tab                                     | `[{...}, {...}]` not `{data: [...]}`  |

---

## 🚨 Error Signatures

### Error Pattern 1: Authentication Failure

```
Console shows:
❌ Authentication failed - token expired or invalid
Your session has expired. Please login again.

What happened: Token is invalid/expired
Where it breaks: Line 252-256
Result: Redirects to login page
```

### Error Pattern 2: All Filtered Out

```
Console shows:
📚 Listening Exercises Response: (4) [{...}, {...}, {...}, {...}]
✅ Published Listening Exercises: 0

What happened: All exercises have isPublished: false
Where it breaks: Line 266-268 (filter)
Result: Empty table, "No exercises available"
```

### Error Pattern 3: Field Undefined

```
UI shows:
- Blank course names
- "undefined" for difficulty
- "N/A min" for all durations

What happened: Frontend looking for wrong fields
Where it breaks: Line 777, 785, 799 (render functions)
Result: Partial data display
```

### Error Pattern 4: API Down

```
Console shows:
❌ Error fetching listening exercises: TypeError: Failed to fetch

What happened: Backend server not responding
Where it breaks: Line 280 (catch block)
Result: No data loads at all
```

---

## 📋 Quick Diagnostic Checklist

**Before Investigating Code:**

```
□ Is backend server running? (npm run dev in server folder)
□ Is frontend running? (npm start in client folder)
□ Can you access http://localhost:5000/api/listening-exercises in browser?
□ Do you get prompted to login if token missing?
```

**In Browser Console:**

```
□ Any red error messages?
□ Can you see "📚 Listening Exercises Response:" log?
□ What does the published count show?
□ Does localStorage have authToken or token?
□ Does localStorage show userRole as "student"?
```

**In Network Tab:**

```
□ Is there a request to /api/listening-exercises?
□ What is the status code? (200, 401, 500?)
□ What does the response Preview show?
□ Are there any failed requests (red)?
```

**In Database:**

```
□ Do listening exercises exist?
□ Are any marked isPublished: true?
□ Do course references point to valid courses?
□ Are field names correct (level not difficulty)?
```

---

## 🎓 Summary

**Most Common Issues (in order of likelihood):**

1. **🥇 All exercises unpublished** → Filter removes everything
2. **🥈 Field name mismatches** → Data loads but displays as undefined
3. **🥉 Token expired** → Redirects to login
4. **4️⃣ Backend not running** → No API responses
5. **5️⃣ Database empty** → No exercises to fetch

**Quick Fix Candidates:**

| If This...    | Try This First...                                  |
| ------------- | -------------------------------------------------- |
| Empty table   | Check if exercises are published in DB             |
| Blank columns | Check field names (course.title, level, timeLimit) |
| 401 errors    | Re-login to get fresh token                        |
| Nothing loads | Restart backend server                             |
| Wrong counts  | Check calculation logic in overview section        |

---

**Diagnostic Document Reference:** See `STUDENT_DASHBOARD_DATA_DIAGNOSTIC.md` for detailed analysis

**Next Steps:** Run Quick Test Matrix → Identify pattern → Cross-reference with Decision Tree

**Status:** ✅ Diagnostic tools ready - Begin testing!
