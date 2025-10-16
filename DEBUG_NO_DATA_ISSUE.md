# 🔍 Debug Guide: Why Student Dashboard Shows No Data

## 🎯 Problem Summary

The Student Dashboard is showing:

- ✅ **0** Active Listening Exercises
- ✅ **0** Available Quizzes
- ✅ **0** Pending Homework
- ✅ **0** My Grades

**Status:** Server is running ✅ | Database connected ✅ | But **NO DATA** ❌

---

## 🔎 Root Cause Analysis

### Current Configuration Detected:

**CLIENT (Frontend):**

```
REACT_APP_API_URL=http://localhost:5000
```

✅ Pointing to **localhost backend**

**SERVER (Backend):**

```
MONGO_URI=mongodb+srv://...@forumacademy-db.global.mongocluster.cosmos.azure.com/forum-academy
```

✅ Connected to **Azure Cosmos DB (Production)**

### ⚠️ THE PROBLEM:

Your backend is connected to **Azure Cosmos DB**, but this database is likely **EMPTY** because:

1. **Teachers created content** → Saved to **LOCAL MongoDB** (or different Azure instance)
2. **Students viewing dashboard** → Fetching from **EMPTY Azure Cosmos DB**
3. **Data exists** → But in a **different database**

---

## 🛠️ Solution Options

### Option 1: Switch to Local MongoDB (Recommended for Development)

This ensures both teacher and student are using the same database.

#### Step 1: Update Server Configuration

**File:** `server/.env`

**Change FROM (Azure):**

```properties
# 🌐 AZURE PRODUCTION CONFIGURATION
CLIENT_URL=https://wonderful-meadow-0e35b381e.6.azurestaticapps.net
MONGO_URI=mongodb+srv://Meshaka77:Forumteam2@forumacademy-db.global.mongocluster.cosmos.azure.com/forum-academy?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000
```

**Change TO (Local):**

```properties
# 🏠 LOCAL DEVELOPMENT CONFIGURATION
CLIENT_URL=http://localhost:3000
MONGO_URI=mongodb://localhost:27017/forum-academy
```

#### Step 2: Start MongoDB Locally

**Option A - MongoDB Compass (Recommended):**

1. Open MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. You should see `forum-academy` database with existing data

**Option B - MongoDB Service:**

```powershell
# Start MongoDB service
net start MongoDB
```

#### Step 3: Restart Backend Server

```powershell
cd C:\SchoolWebsiteProject\forum-academy\server
npm run dev
```

#### Step 4: Verify Connection

1. Open: http://localhost:5000/api/test-db
2. Should show:
   ```json
   {
     "database": {
       "state": "connected",
       "name": "forum-academy",
       "host": "localhost" // ← Should be localhost now
     }
   }
   ```

---

### Option 2: Use Azure Cosmos DB (Production Setup)

If you want to use Azure Cosmos DB, you need to **migrate your data** from local to Azure.

#### Step 1: Verify Data Exists Locally

```powershell
# Connect to local MongoDB and check data
mongosh mongodb://localhost:27017/forum-academy
```

Then run:

```javascript
// Check listening exercises
db.listeningexercises.countDocuments();

// Check quizzes
db.quizzes.countDocuments();

// Check homework
db.homework.countDocuments();

// View sample data
db.listeningexercises.find().limit(2);
```

#### Step 2: Export Data from Local MongoDB

```powershell
# Export listening exercises
mongoexport --db=forum-academy --collection=listeningexercises --out=listening-export.json

# Export quizzes
mongoexport --db=forum-academy --collection=quizzes --out=quizzes-export.json

# Export homework
mongoexport --db=forum-academy --collection=homework --out=homework-export.json

# Export users
mongoexport --db=forum-academy --collection=users --out=users-export.json
```

#### Step 3: Import Data to Azure Cosmos DB

```powershell
# Import to Azure (use your connection string)
$AZURE_URI = "mongodb+srv://Meshaka77:Forumteam2@forumacademy-db.global.mongocluster.cosmos.azure.com"

mongoimport --uri="$AZURE_URI/forum-academy?tls=true&authMechanism=SCRAM-SHA-256" --collection=listeningexercises --file=listening-export.json

mongoimport --uri="$AZURE_URI/forum-academy?tls=true&authMechanism=SCRAM-SHA-256" --collection=quizzes --file=quizzes-export.json

mongoimport --uri="$AZURE_URI/forum-academy?tls=true&authMechanism=SCRAM-SHA-256" --collection=homework --file=homework-export.json

mongoimport --uri="$AZURE_URI/forum-academy?tls=true&authMechanism=SCRAM-SHA-256" --collection=users --file=users-export.json
```

---

### Option 3: Quick Test with Sample Data

Create sample data directly in the current database to test if the dashboard works.

#### Test Script

Create `server/create-test-data.js`:

```javascript
const mongoose = require("mongoose");
require("dotenv").config();

const ListeningExercise = require("./models/ListeningExercise");
const Quiz = require("./models/Quiz");
const Homework = require("./models/Homework");
const Course = require("./models/Course");

async function createTestData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to database");

    // Create test course
    const course = await Course.findOneAndUpdate(
      { code: "TEST101" },
      {
        title: "Test Course",
        code: "TEST101",
        description: "Test course for debugging",
      },
      { upsert: true, new: true }
    );
    console.log("✅ Test course created:", course._id);

    // Create listening exercise
    const exercise = await ListeningExercise.create({
      title: "Test Listening Exercise",
      description: "This is a test listening exercise",
      course: course._id,
      difficulty: "beginner",
      duration: 10,
      status: "active", // IMPORTANT!
      questions: [
        {
          question: "Test question 1?",
          options: ["A", "B", "C", "D"],
          correctAnswer: 0,
          points: 10,
        },
      ],
    });
    console.log("✅ Test listening exercise created:", exercise._id);

    // Create quiz
    const quiz = await Quiz.create({
      title: "Test Quiz",
      course: course._id,
      timeLimit: 30,
      passingScore: 70,
      maxAttempts: 3,
      isPublished: true, // IMPORTANT!
      status: "active", // IMPORTANT!
      questions: [
        {
          question: "Test question?",
          type: "multiple-choice",
          options: ["A", "B", "C", "D"],
          correctAnswer: 0,
          points: 10,
        },
      ],
    });
    console.log("✅ Test quiz created:", quiz._id);

    // Create homework
    const homework = await Homework.create({
      title: "Test Homework",
      description: "This is test homework",
      course: course._id,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Due in 7 days
      status: "active", // IMPORTANT!
    });
    console.log("✅ Test homework created:", homework._id);

    console.log("\n🎉 SUCCESS! Test data created successfully!");
    console.log("\n📊 Summary:");
    console.log("- 1 Test Course");
    console.log("- 1 Active Listening Exercise");
    console.log("- 1 Published Quiz");
    console.log("- 1 Active Homework Assignment");
    console.log("\n✨ Refresh your Student Dashboard to see the data!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

createTestData();
```

#### Run Test Script

```powershell
cd C:\SchoolWebsiteProject\forum-academy\server
node create-test-data.js
```

---

## 🔍 Debugging Checklist

### 1. Check Browser Console Logs

1. Open Student Dashboard
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Look for these logs:

**Expected (if working):**

```
📚 Listening Exercises Response: [...]
✅ Active Listening Exercises: 3
📝 Quizzes Response: [...]
✅ Active Quizzes: 2
📋 Homework Response: [...]
✅ Active Homework: 5
```

**Problem indicators:**

```
❌ Failed to fetch listening exercises: 401
// Solution: Token expired, login again

❌ Failed to fetch quizzes: 404
// Solution: API route not found

📚 Listening Exercises Response: []
✅ Active Listening Exercises: 0
// Solution: No data in database
```

### 2. Check Authentication

Open browser console on Student Dashboard and run:

```javascript
// Check if token exists
console.log("Token:", localStorage.getItem("token"));
console.log("User Role:", localStorage.getItem("userRole"));
console.log("User Name:", localStorage.getItem("userName"));

// If token is null, you need to login again
```

### 3. Test API Manually

Open browser console and run:

```javascript
// Test listening exercises API
const token = localStorage.getItem("token");
fetch("http://localhost:5000/api/listening-exercises", {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
})
  .then((r) => r.json())
  .then((d) => console.log("Listening Exercises:", d))
  .catch((e) => console.error("Error:", e));

// Test quizzes API
fetch("http://localhost:5000/api/quizzes", {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
})
  .then((r) => r.json())
  .then((d) => console.log("Quizzes:", d))
  .catch((e) => console.error("Error:", e));

// Test homework API
fetch("http://localhost:5000/api/homework", {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
})
  .then((r) => r.json())
  .then((d) => console.log("Homework:", d))
  .catch((e) => console.error("Error:", e));
```

### 4. Check Database Directly

**Using MongoDB Compass:**

1. Connect to your database
2. Open `forum-academy` database
3. Check collections:
   - `listeningexercises` - Look for documents with `status: "active"`
   - `quizzes` - Look for documents with `isPublished: true`
   - `homework` - Look for documents with `status: "active"`

**Using MongoDB Shell:**

```javascript
// Connect
mongosh mongodb://localhost:27017/forum-academy
// OR
mongosh "mongodb+srv://Meshaka77:Forumteam2@forumacademy-db.global.mongocluster.cosmos.azure.com/forum-academy"

// Check counts
db.listeningexercises.countDocuments({ status: "active" })
db.quizzes.countDocuments({ isPublished: true })
db.homework.countDocuments({ status: "active" })

// View actual documents
db.listeningexercises.find({ status: "active" }).pretty()
db.quizzes.find({ isPublished: true }).pretty()
db.homework.find({ status: "active" }).pretty()
```

### 5. Verify Teacher Created Content with Correct Status

**CRITICAL:** Content must have the correct status to be visible:

| Content Type       | Required Field       | Student Sees? |
| ------------------ | -------------------- | ------------- |
| Listening Exercise | `status: "active"`   | ✅ YES        |
| Listening Exercise | `status: "draft"`    | ❌ NO         |
| Quiz               | `isPublished: true`  | ✅ YES        |
| Quiz               | `isPublished: false` | ❌ NO         |
| Quiz               | `status: "active"`   | ✅ YES        |
| Homework           | `status: "active"`   | ✅ YES        |
| Homework           | `status: "draft"`    | ❌ NO         |

---

## 🚀 Quick Fix Steps (Most Common Solution)

If you're developing locally and want to see existing data:

### Step 1: Switch Server to Local MongoDB

**Edit:** `server/.env`

**Comment Azure lines, uncomment local lines:**

```properties
# 🏠 LOCAL DEVELOPMENT CONFIGURATION
CLIENT_URL=http://localhost:3000
MONGO_URI=mongodb://localhost:27017/forum-academy

# 🌐 AZURE PRODUCTION CONFIGURATION (COMMENTED OUT)
# CLIENT_URL=https://wonderful-meadow-0e35b381e.6.azurestaticapps.net
# MONGO_URI=mongodb+srv://Meshaka77:Forumteam2@forumacademy-db.global.mongocluster.cosmos.azure.com/forum-academy?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000
```

### Step 2: Restart Server

```powershell
# Stop current server (Ctrl+C in server terminal)
# Then restart:
cd C:\SchoolWebsiteProject\forum-academy\server
npm run dev
```

### Step 3: Verify Database Connection

Open: http://localhost:5000/api/test-db

Should show:

```json
{
  "database": {
    "state": "connected",
    "name": "forum-academy",
    "host": "localhost" // ← Must be localhost
  }
}
```

### Step 4: Refresh Student Dashboard

1. Hard refresh browser: **Ctrl + Shift + R**
2. Login again if needed
3. Check dashboard - should now show data!

---

## 📋 Troubleshooting Common Errors

### Error: "Token is not valid"

**Solution:** Login again to get a fresh token

### Error: "Failed to fetch: 401"

**Solution:**

1. Clear localStorage: `localStorage.clear()`
2. Refresh page
3. Login again

### Error: "Network request failed"

**Solution:**

1. Check server is running: http://localhost:5000/api/health
2. Check CORS settings in `server/server.js`
3. Verify `REACT_APP_API_URL` in `client/.env`

### Error: Data shows in MongoDB but not in dashboard

**Solution:**

1. Check `status` field: must be `"active"` (not `"draft"`)
2. Check `isPublished` field for quizzes: must be `true`
3. Verify course is populated: `course` field must have valid ObjectId

---

## 🎯 Expected Results After Fix

Once configured correctly, you should see:

### Dashboard Statistics

```
Active Listening Exercises: 3
Available Quizzes: 2
Pending Homework: 5
My Grades: 8
```

### Browser Console

```
📚 Listening Exercises Response: Array(3)
✅ Active Listening Exercises: 3
📝 Quizzes Response: Array(2)
✅ Active Quizzes: 2
📋 Homework Response: Array(5)
✅ Active Homework: 5
🏆 Progress Response: {progress: Array(8)}
✅ Progress Records: 8
```

### Server Logs

```
📥 GET /api/listening-exercises - 200 OK
📥 GET /api/quizzes - 200 OK
📥 GET /api/homework - 200 OK
📥 GET /api/progress - 200 OK
```

---

## 🆘 Still Not Working?

If you've tried all the above and still see no data:

### Option A: Check Current Database for Data

Run this in your browser console (Student Dashboard page):

```javascript
async function debugDatabase() {
  const token = localStorage.getItem("token");

  // Check database connection
  const dbStatus = await fetch("http://localhost:5000/api/test-db").then((r) =>
    r.json()
  );
  console.log("📊 Database Status:", dbStatus);

  // Test each endpoint
  const endpoints = [
    "/api/listening-exercises",
    "/api/quizzes",
    "/api/homework",
    "/api/progress",
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log(`✅ ${endpoint}:`, {
        status: response.status,
        count: Array.isArray(data) ? data.length : "N/A",
        data: data,
      });
    } catch (error) {
      console.error(`❌ ${endpoint}:`, error);
    }
  }
}

debugDatabase();
```

### Option B: Create Test Data

Use the test data script provided in **Option 3** above.

### Option C: Contact Support

If nothing works, provide:

1. Browser console output (from debug script above)
2. Server logs (from terminal running `npm run dev`)
3. Database host (from `/api/test-db` response)
4. Screenshot of error messages

---

## 📚 Related Documentation

- `STUDENT_DASHBOARD_DATA_SYNC_FIX.md` - API response format fix
- `STUDENT_DASHBOARD_REDESIGN.md` - Complete redesign documentation
- `TEACHER_CONTENT_VISIBILITY_GUIDE.md` - Content visibility rules

---

**Last Updated:** October 13, 2025  
**Status:** Debugging Guide Created  
**Next Step:** Follow Option 1 (Switch to Local MongoDB) for immediate solution
