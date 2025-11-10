#!/usr/bin/env python3
import re
import os

def remove_unused_imports(filepath, unused_imports):
    """Remove unused imports from a file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        new_lines = []
        for line in lines:
            skip = False
            for unused in unused_imports:
                if unused in line and 'import' in line:
                    # Remove the specific import from the line
                    line = re.sub(r',\s*' + re.escape(unused), '', line)
                    line = re.sub(re.escape(unused) + r'\s*,\s*', '', line)
                    # If line becomes empty import, skip it
                    if re.match(r'^\s*import\s*\{\s*\}\s*from', line):
                        skip = True
                        break
            if not skip:
                new_lines.append(line)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
        print(f"Fixed imports in: {filepath}")
        return True
    except Exception as e:
        print(f"Error: {e}")
        return False

def remove_unused_vars(filepath, unused_vars):
    """Remove unused variable declarations"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        for var in unused_vars:
            # Remove const declarations
            pattern1 = r'^\s*const\s+' + re.escape(var) + r'\s*=.*?;\s*\n'
            content = re.sub(pattern1, '', content, flags=re.MULTILINE)
            # Remove destructuring
            pattern2 = r'^\s*const\s+\{[^}]*' + re.escape(var) + r'[^}]*\}\s*=.*?;\s*\n'
            content = re.sub(pattern2, '', content, flags=re.MULTILINE)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed variables in: {filepath}")
        return True
    except Exception as e:
        print(f"Error: {e}")
        return False

base = r'c:\SchoolWebsiteProject\forum-academy\client\src'

# StudentDashboard.js - has MANY unused imports
student_dashboard = os.path.join(base, 'components', 'StudentDashboard.js')
student_unused_imports = [
    'Select', 'Progress', 'Divider', 'DatePicker', 'Switch', 'InputNumber',
    'Rate', 'Tooltip', 'Popconfirm', 'Steps', 'Collapse', 'PlusOutlined',
    'EditOutlined', 'DeleteOutlined', 'DownloadOutlined', 'CloseCircleOutlined',
    'FilterOutlined', 'TeamOutlined', 'ReadOutlined', 'CheckSquareOutlined',
    'LineChartOutlined', 'HeartOutlined', 'LikeOutlined', 'DashboardOutlined',
    'InfoCircleOutlined', 'PhoneOutlined', 'MailOutlined'
]
student_unused_vars = ['authAPI', 'TabPane', 'currentLanguage', 'isTablet', 'unreadCount', 'markZoomNotificationAsRead']

remove_unused_imports(student_dashboard, student_unused_imports)
remove_unused_vars(student_dashboard, student_unused_vars)

# TeacherDashboard.js
teacher_dashboard = os.path.join(base, 'components', 'TeacherDashboard.js')
remove_unused_vars(teacher_dashboard, ['currentLanguage'])

# ZoomMeetingCard.js
zoom_card = os.path.join(base, 'components', 'ZoomMeetingCard.js')
remove_unused_imports(zoom_card, ['Divider', 'Tooltip'])

print("Completed fixing dashboard files!")
