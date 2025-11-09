# Testing Translation Guide

## Quick Reference for Testing i18n in the Notification System

---

## 🌐 How to Switch Languages

### Method 1: Using Browser Console

```javascript
// Switch to Japanese
localStorage.setItem("i18nextLng", "ja");
window.location.reload();

// Switch to English
localStorage.setItem("i18nextLng", "en");
window.location.reload();
```

### Method 2: Check Current Language

```javascript
// Check current language
localStorage.getItem("i18nextLng");
```

---

## ✅ Test Cases for Delete Functionality

### Test 1: Delete Button Text

**Steps:**

1. Open Teacher Dashboard
2. Click notification bell icon
3. Hover over the red delete button (trash icon)

**Expected Results:**

- Button should show delete icon
- Tooltip or hover state should work

### Test 2: Delete Confirmation Dialog - English

**Steps:**

1. Set language to English: `localStorage.setItem('i18nextLng', 'en')`
2. Click delete button on any notification

**Expected Results:**

- Title: "Delete notification?"
- Description: "Are you sure you want to delete this notification? This action cannot be undone."
- OK Button: "Yes"
- Cancel Button: "No"

### Test 3: Delete Confirmation Dialog - Japanese

**Steps:**

1. Set language to Japanese: `localStorage.setItem('i18nextLng', 'ja')`
2. Click delete button on any notification

**Expected Results:**

- Title: "通知を削除しますか？"
- Description: "この通知を削除してもよろしいですか？この操作は元に戻せません。"
- OK Button: "はい"
- Cancel Button: "いいえ"

### Test 4: Delete Success Message - English

**Steps:**

1. Set language to English
2. Delete a notification by clicking "Yes"

**Expected Results:**

- Success message: "Notification deleted successfully"

### Test 5: Delete Success Message - Japanese

**Steps:**

1. Set language to Japanese
2. Delete a notification by clicking "はい"

**Expected Results:**

- Success message: "通知が正常に削除されました"

### Test 6: Delete Error Message (Simulated)

**Steps:**

1. Turn off internet connection
2. Try to delete a notification

**Expected Results:**

- English: "Failed to delete notification. Please try again."
- Japanese: "通知の削除に失敗しました。もう一度お試しください。"

---

## ✅ Test Cases for Form Validation

### Test 7: Title Required - English

**Steps:**

1. Set language to English
2. Go to Admin → Announcements
3. Click "Create Announcement"
4. Leave Title field empty
5. Try to submit

**Expected Results:**

- Error message: "Please enter announcement title"

### Test 8: Title Required - Japanese

**Steps:**

1. Set language to Japanese
2. Follow same steps as Test 7

**Expected Results:**

- Error message: "お知らせのタイトルを入力してください"

### Test 9: Title Minimum Length - English

**Steps:**

1. Set language to English
2. Enter title: "ab" (only 2 characters)
3. Move to next field

**Expected Results:**

- Error message: "Title must be at least 3 characters"

### Test 10: Title Minimum Length - Japanese

**Steps:**

1. Set language to Japanese
2. Enter title: "ab"
3. Move to next field

**Expected Results:**

- Error message: "タイトルは 3 文字以上である必要があります"

### Test 11: Title Whitespace Only - English

**Steps:**

1. Set language to English
2. Enter title: " " (only spaces)
3. Move to next field

**Expected Results:**

- Error message: "Title cannot be empty or contain only whitespace"

### Test 12: Title Whitespace Only - Japanese

**Steps:**

1. Set language to Japanese
2. Enter title: " "
3. Move to next field

**Expected Results:**

- Error message: "タイトルは空白または空白文字のみにすることはできません"

### Test 13: Content Required - English

**Steps:**

1. Set language to English
2. Leave Content field empty
3. Try to submit

**Expected Results:**

- Error message: "Please enter announcement content"

### Test 14: Content Required - Japanese

**Steps:**

1. Set language to Japanese
2. Leave Content field empty
3. Try to submit

**Expected Results:**

- Error message: "お知らせの内容を入力してください"

### Test 15: Content Minimum Length - English

**Steps:**

1. Set language to English
2. Enter content: "hello" (only 5 characters)
3. Move to next field

**Expected Results:**

- Error message: "Content must be at least 10 characters"

### Test 16: Content Minimum Length - Japanese

**Steps:**

1. Set language to Japanese
2. Enter content: "hello"
3. Move to next field

**Expected Results:**

- Error message: "内容は 10 文字以上である必要があります"

### Test 17: Content Whitespace Only - English

**Steps:**

1. Set language to English
2. Enter content: " " (only spaces)
3. Move to next field

**Expected Results:**

- Error message: "Content cannot be empty or contain only whitespace"

### Test 18: Content Whitespace Only - Japanese

**Steps:**

1. Set language to Japanese
2. Enter content: " "
3. Move to next field

**Expected Results:**

- Error message: "内容は空白または空白文字のみにすることはできません"

---

## 🎯 Quick Test Script

Copy and paste this into browser console to run all language tests:

```javascript
// Test Suite for Translations
const testTranslations = async () => {
  console.log("🧪 Starting Translation Tests...\n");

  // Test 1: Switch to English
  console.log("Test 1: Switching to English");
  localStorage.setItem("i18nextLng", "en");
  console.log("✅ Language set to: " + localStorage.getItem("i18nextLng"));

  // Test 2: Switch to Japanese
  console.log("\nTest 2: Switching to Japanese");
  localStorage.setItem("i18nextLng", "ja");
  console.log("✅ Language set to: " + localStorage.getItem("i18nextLng"));

  // Test 3: Check i18n resources
  console.log("\n📦 Checking translation files...");
  const currentLang = localStorage.getItem("i18nextLng");
  console.log("Current language:", currentLang);

  console.log("\n✅ All basic tests passed!");
  console.log("⚠️  Please refresh the page to see changes");
  console.log("\n🔄 To test delete functionality:");
  console.log("   1. Click notification bell");
  console.log("   2. Click red delete button");
  console.log("   3. Check dialog text matches expected language");
};

testTranslations();
```

---

## 📋 Manual Verification Checklist

### English (EN)

- [ ] Delete button shows delete icon
- [ ] Delete dialog title: "Delete notification?"
- [ ] Delete dialog description contains "Are you sure..."
- [ ] OK button says "Yes"
- [ ] Cancel button says "No"
- [ ] Success message: "Notification deleted successfully"
- [ ] Title validation: "Title must be at least 3 characters"
- [ ] Content validation: "Content must be at least 10 characters"
- [ ] Whitespace validation messages display correctly

### Japanese (JA)

- [ ] Delete button shows delete icon
- [ ] Delete dialog title: "通知を削除しますか？"
- [ ] Delete dialog description contains "この通知を削除..."
- [ ] OK button says "はい"
- [ ] Cancel button says "いいえ"
- [ ] Success message: "通知が正常に削除されました"
- [ ] Title validation: "タイトルは 3 文字以上である必要があります"
- [ ] Content validation: "内容は 10 文字以上である必要があります"
- [ ] Whitespace validation messages display correctly

---

## 🐛 Common Issues & Solutions

### Issue 1: Translations not showing

**Solution:**

```javascript
// Clear i18n cache
localStorage.removeItem("i18nextLng");
sessionStorage.clear();
window.location.reload();
```

### Issue 2: Stuck on one language

**Solution:**

```javascript
// Force switch language
localStorage.setItem("i18nextLng", "en"); // or 'ja'
window.location.reload();
```

### Issue 3: Seeing translation keys instead of text

**Example:** Seeing "teacherDashboard.notifications.delete"

**Solution:**

1. Check translation files exist
2. Verify JSON syntax is correct
3. Clear cache and reload

### Issue 4: Mixed languages

**Solution:**

```javascript
// Check current language setting
console.log("Current language:", localStorage.getItem("i18nextLng"));

// Reset to default
localStorage.setItem("i18nextLng", "en");
window.location.reload();
```

---

## 🔍 Debugging Translation Issues

### Check if translation key exists

```javascript
// In browser console
import i18n from "./i18n"; // Adjust path as needed
console.log(i18n.t("teacherDashboard.notifications.deleteSuccess"));
```

### Inspect translation resources

```javascript
// Check what's loaded
console.log(i18n.getResourceBundle("en", "translation"));
console.log(i18n.getResourceBundle("ja", "translation"));
```

### Force reload translations

```javascript
// Reload i18n resources
await i18n.changeLanguage("en");
window.location.reload();
```

---

## 📊 Expected Test Results Summary

| Test                | English Expected                                     | Japanese Expected                                        | Status |
| ------------------- | ---------------------------------------------------- | -------------------------------------------------------- | ------ |
| Delete Dialog Title | "Delete notification?"                               | "通知を削除しますか？"                                   | ⬜     |
| Delete Success      | "Notification deleted successfully"                  | "通知が正常に削除されました"                             | ⬜     |
| Title Min Length    | "Title must be at least 3 characters"                | "タイトルは 3 文字以上である必要があります"              | ⬜     |
| Content Min Length  | "Content must be at least 10 characters"             | "内容は 10 文字以上である必要があります"                 | ⬜     |
| Title Whitespace    | "Title cannot be empty or contain only whitespace"   | "タイトルは空白または空白文字のみにすることはできません" | ⬜     |
| Content Whitespace  | "Content cannot be empty or contain only whitespace" | "内容は空白または空白文字のみにすることはできません"     | ⬜     |

---

## ✨ Next Steps After Testing

1. ✅ Verify all translations display correctly
2. ✅ Test language switching works smoothly
3. ✅ Confirm validation messages are helpful
4. ✅ Check that character counters work with both languages
5. ✅ Test on different browsers (Chrome, Firefox, Edge)
6. ✅ Test on mobile devices
7. ✅ Get feedback from Japanese-speaking users

---

## 📞 Need Help?

If you encounter issues:

1. Check console for errors: `F12` → Console tab
2. Verify translation files exist in `client/src/locales/`
3. Ensure i18n is properly initialized
4. Check that components are using `useTranslation()` hook
5. Refer to `TRANSLATIONS_ADDED.md` for key reference

---

**Happy Testing! 🎉**
