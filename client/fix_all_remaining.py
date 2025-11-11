#!/usr/bin/env python3
import re
import os

def fix_file(filepath, remove_imports=[], remove_vars=[]):
    """Remove unused imports and variables"""
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return False
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Remove unused imports
        for imp in remove_imports:
            content = re.sub(r',\s*' + re.escape(imp), '', content)
            content = re.sub(re.escape(imp) + r'\s*,\s*', '', content)
        
        # Remove unused variable declarations (simple patterns)
        for var in remove_vars:
            # Remove const var = ...;
            pattern = r'^\s*const\s+' + re.escape(var) + r'\s*=\s*[^;]+;\s*$'
            content = re.sub(pattern, '', content, flags=re.MULTILINE)
            # Remove destructuring like const { var, ... } =
            content = re.sub(r',\s*' + re.escape(var) + r'(?=\s*[,}])', '', content)
            content = re.sub(re.escape(var) + r'\s*,\s*', '', content)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed: {os.path.basename(filepath)}")
        return True
    except Exception as e:
        print(f"Error fixing {filepath}: {e}")
        return False

base = r'c:\SchoolWebsiteProject\forum-academy\client\src'

# Admin components
admin_files = {
    'components/admin/AdminAnalyticsReports.js': {
        'imports': ['Divider', 'Doughnut', 'Radar', 'UserOutlined', 'BookOutlined', 'FallOutlined', 'WarningOutlined', 'homeworkSubmissionAPI'],
        'vars': ['context', 'setRefreshInterval']
    },
    'components/admin/AdminAnnouncement.js': {
        'imports': ['Tooltip'],
        'vars': ['viewModalVisible', 'lastError']
    },
    'components/admin/AdminHeader.js': {
        'vars': ['onRefreshNotifications', 'getImageSrc', 'tt']
    },
    'components/admin/AdminLayout.js': {
        'vars': ['currentUser', 'getImageSrc', 'onLogout']
    },
    'components/admin/AdminSetting.js': {
        'imports': ['Badge', 'Spin', 'ReloadOutlined', 'WarningOutlined'],
        'vars': ['context', 'setSystemStatus']
    },
    'components/admin/AdminStudentProgress.js': {
        'imports': ['Statistic', 'Divider', 'Radio', 'Popconfirm', 'SettingOutlined', 'CloseOutlined', 'homeworkSubmissionAPI'],
        'vars': ['context', 'submissions', 'setSubmissions', 'totalFilteredStudents', 'status']
    },
    'components/admin/Adminapplicationanduser.js': {
        'imports': ['Statistic'],
        'vars': ['tt', 'dashboardStats']
    },
    'components/admin/Admincoursemanagement.js': {
        'imports': ['Statistic', 'Avatar', 'Divider', 'CheckCircleOutlined', 'UserOutlined', 'RiseOutlined', 'FallOutlined']
    },
    'components/admin/Admincoursematerials.js': {
        'imports': ['Statistic', 'Avatar', 'BookOutlined'],
        'vars': ['context', 'isMaterialModalVisible', 'isPreviewModalVisible', 'headers']
    },
    'components/admin/Admindashboardoverview.js': {
        'imports': ['Line', 'Statistic', 'Timeline', 'List', 'Avatar', 'Popover', 'TeamOutlined', 'UserOutlined', 'BookOutlined', 'FolderOutlined', 'FormOutlined', 'AudioOutlined', 'UsergroupAddOutlined', 'SolutionOutlined', 'DollarOutlined', 'CheckCircleOutlined'],
        'vars': ['contextDashboardStats', 'contextFetchDashboardStats', 'sessionStartTime', 'currentLanguage']
    },
    'components/admin/Adminenrollmentmonitoring.js': {
        'imports': ['Modal', 'UsergroupAddOutlined', 'CheckCircleOutlined', 'CheckSquareOutlined', 'LineChartOutlined', 'WarningOutlined', 'VideoCameraOutlined', 'PhoneOutlined', 'getArrayFromData'],
        'vars': ['enrollmentLogs', 'setProgressRecords', 'selectedView', 'enrollmentAnalytics', 'enrollmentStats', 'videoCallModalVisible', 'selectedCallUser', 'callType', 'isCallActive', 'callDuration', 'saveCurrentView', 'applyView', 'handleVideoCall', 'startVideoCall', 'endVideoCall', 'formatCallDuration']
    }
}

# Teacher components
teacher_files = {
    'components/teacher/TeacherAnalytics.js': {
        'imports': ['Progress', 'Statistic', 'CalendarOutlined'],
        'vars': ['Paragraph', 'actionableItems', 'messagePlaybook', 'handleCopyText']
    },
    'components/teacher/TeacherAssignmentCenter.js': {
        'vars': ['history']
    },
    'components/teacher/TeacherDashboardOverview.js': {
        'imports': ['Table', 'RiseOutlined', 'ResponsiveContainer', 'AreaChart', 'Area', 'CartesianGrid', 'XAxis', 'YAxis', 'ChartTooltip'],
        'vars': ['students', 'setSelectedMonth', 'assignmentPercent', 'performanceTrend', 'assignmentsColumns', 'monthNames', 'bestPerformers']
    },
    'components/teacher/TeacherGradingCenter.js': {
        'vars': ['history']
    },
    'components/teacher/TeacherLayout.js': {
        'vars': ['currentUser', 'onLogout', 'getTranslation']
    },
    'components/teacher/TeacherListeningExercises.js': {
        'imports': ['Progress'],
        'vars': ['history']
    },
    'components/teacher/TeacherLiveClasses.js': {
        'imports': ['useTranslation', 'CalendarOutlined'],
        'vars': ['history', 'loading']
    },
    'components/teacher/TeacherMaterials.js': {
        'vars': ['isEmptyState']
    },
    'components/teacher/TeacherMyClasses.js': {
        'vars': ['history']
    },
    'components/teacher/TeacherQuizManagement.js': {
        'imports': ['CheckCircleOutlined', 'CloseCircleOutlined'],
        'vars': ['history']
    },
    'components/teacher/TeacherSettings.js': {
        'imports': ['useTranslation', 'UploadOutlined'],
        'vars': ['history']
    },
    'components/teacher/TeacherStudentManagement.js': {
        'vars': ['isTabletView', 'updateConversationState']
    }
}

# Pages
page_files = {
    'pages/AboutPage.js': {
        'imports': ['Lightbulb', 'ArrowDown', 'School', 'Award', 'Star', 'Zap']
    },
    'pages/ApplyPage.js': {
        'vars': ['formStatus']
    },
    'pages/CareerServicesPage.js': {
        'imports': ['doccomoLogo']
    },
    'pages/ContactPage.js': {
        'imports': ['Shield'],
        'vars': ['privacyAccepted', 'setPrivacyAccepted', 'data']
    },
    'pages/CoursesPage.js': {
        'imports': ['CourseModal', 'TestModal']
    },
    'pages/HomePage.js': {
        'imports': ['Link']
    },
    'pages/NewsPage.js': {
        'vars': ['handleSearchSubmit']
    },
    'pages/Team.js': {
        'imports': ['Mail', 'Phone', 'MapPin', 'BookOpen', 'Calendar', 'Linkedin', 'Twitter', 'Github', 'Shield', 'User', 'X', 'Settings', 'Parallax'],
        'vars': ['activeCard', 'setActiveCard']
    },
    'context/AdminContext.js': {
        'vars': ['progressRecords']
    }
}

# Fix all files
count = 0
for filepath, config in {**admin_files, **teacher_files, **page_files}.items():
    full_path = os.path.join(base, filepath)
    if fix_file(full_path, config.get('imports', []), config.get('vars', [])):
        count += 1

print(f"\nFixed {count} files total")
