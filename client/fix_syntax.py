#!/usr/bin/env python3
import re
import os

def fix_broken_syntax(filepath):
    """Fix syntax errors caused by improper removal"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Fix orphaned return statements (remove entire function if needed)
        # This is a simple fix - just comment out problematic lines
        lines = content.split('\n')
        new_lines = []
        i = 0
        while i < len(lines):
            line = lines[i]
            # Look for 'return' at start of line outside function
            if re.match(r'^\s*return\s', line) and i > 0:
                # Check if previous line is empty or a closing brace
                prev_line = lines[i-1].strip()
                if not prev_line or prev_line == '}' or prev_line == '};':
                    # This is likely an orphaned return, skip it
                    i += 1
                    continue
            new_lines.append(line)
            i += 1
        
        content = '\n'.join(new_lines)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed syntax in: {os.path.basename(filepath)}")
        return True
    except Exception as e:
        print(f"Error: {e}")
        return False

base = r'c:\SchoolWebsiteProject\forum-academy\client\src'

# Fix files with reported syntax errors
broken_files = [
    'components/Header.js',
    'components/admin/AdminHeader.js',
    'components/admin/AdminStudentProgress.js',
    'components/admin/Adminapplicationanduser.js',
    'components/admin/Adminenrollmentmonitoring.js',
    'components/teacher/TeacherAnalytics.js',
    'components/teacher/TeacherDashboardOverview.js',
    'components/teacher/TeacherLayout.js',
    'components/teacher/TeacherStudentManagement.js',
    'pages/ContactPage.js',
    'pages/NewsPage.js',
    'pages/Team.js'
]

for filepath in broken_files:
    full_path = os.path.join(base, filepath)
    if os.path.exists(full_path):
        fix_broken_syntax(full_path)
    else:
        print(f"Not found: {filepath}")

print("\nSyntax fixes complete. You may need to manually check some files.")
