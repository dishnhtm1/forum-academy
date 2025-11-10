#!/usr/bin/env python3
import re
import os

def fix_file(filepath, fixes):
    """Apply fixes to a file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        for fix in fixes:
            if 'remove_line' in fix:
                lines = content.split('\n')
                pattern = fix['remove_line']
                lines = [line for line in lines if not re.search(pattern, line)]
                content = '\n'.join(lines)
            elif 'replace' in fix:
                content = re.sub(fix['pattern'], fix['replace'], content, flags=re.MULTILINE)
        
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Fixed: {filepath}")
            return True
        return False
    except Exception as e:
        print(f"Error fixing {filepath}: {e}")
        return False

# Base path
base = r'c:\SchoolWebsiteProject\forum-academy\client\src'

# Define all fixes
all_fixes = [
    # App.js - remove unused t, i18n
    {
        'file': os.path.join(base, 'App.js'),
        'fixes': [
            {'remove_line': r'^\s*const\s+\{\s*t\s*,\s*i18n\s*\}\s*=\s*useTranslation\(\);?\s*$'}
        ]
    },
    # AboutSection.js - remove activeFeature
    {
        'file': os.path.join(base, 'components', 'AboutSection.js'),
        'fixes': [
            {'remove_line': r'^\s*const\s+\[activeFeature.*useState\(null\)'}
        ]
    },
    # AdminFacultyDashboard.js
    {
        'file': os.path.join(base, 'components', 'AdminFacultyDashboard.js'),
        'fixes': [
            {'pattern': r',\s*useRef', 'replace': ''},
            {'remove_line': r"import i18n from '../i18n';"},
            {'pattern': r'AdminContext,\s*', 'replace': ''},
            {'remove_line': r'^\s*const currentLanguage = i18n\.language'}
        ]
    },
    # ApplicationForm.js - remove Heart
    {
        'file': os.path.join(base, 'components', 'ApplicationForm.js'),
        'fixes': [
            {'pattern': r',\s*Heart', 'replace': ''}
        ]
    },
    # CourseModal.js - fix t destructuring
    {
        'file': os.path.join(base, 'components', 'CourseModal.js'),
        'fixes': [
            {'remove_line': r'^\s*const\s+\{\s*t\s*\}\s*=\s*useTranslation\(\);?\s*$'}
        ]
    },
    # Footer.js - remove Fax
    {
        'file': os.path.join(base, 'components', 'Footer.js'),
        'fixes': [
            {'pattern': r',\s*Fax', 'replace': ''}
        ]
    },
    # Header.js - remove many unused imports
    {
        'file': os.path.join(base, 'components', 'Header.js'),
        'fixes': [
            {'pattern': r',\s*useNavigate', 'replace': ''},
            {'remove_line': r"import logoWhiteImage from"},
            {'pattern': r',\s*Shield', 'replace': ''},
            {'pattern': r',\s*Cloud', 'replace': ''},
            {'pattern': r',\s*Cpu', 'replace': ''},
            {'pattern': r',\s*Star', 'replace': ''},
            {'pattern': r',\s*Sparkles', 'replace': ''},
            {'pattern': r',\s*Zap', 'replace': ''},
            {'pattern': r',\s*BookMarked', 'replace': ''},
            {'pattern': r',\s*Phone', 'replace': ''},
            {'remove_line': r'^\s*const\s+\[hoveredItem.*useState'},
            {'remove_line': r'^\s*const\s+openModal\s*='},
            {'remove_line': r'^\s*const\s+handleAnchorClick\s*='}
        ]
    },
    # Hero.js
    {
        'file': os.path.join(base, 'components', 'Hero.js'),
        'fixes': [
            {'pattern': r',\s*Users', 'replace': ''},
            {'pattern': r',\s*Award', 'replace': ''},
            {'pattern': r',\s*Globe', 'replace': ''}
        ]
    },
    # RegisterPage.js
    {
        'file': os.path.join(base, 'components', 'RegisterPage.js'),
        'fixes': [
            {'remove_line': r'^\s*const\s+history\s*=\s*useHistory'}
        ]
    },
]

# Run all fixes
fixed_count = 0
for item in all_fixes:
    if os.path.exists(item['file']):
        if fix_file(item['file'], item['fixes']):
            fixed_count += 1
    else:
        print(f"File not found: {item['file']}")

print(f"\nFixed {fixed_count} files")
