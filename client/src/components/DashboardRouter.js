import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Spin } from 'antd';

const DashboardRouter = () => {
  const history = useHistory();

  useEffect(() => {
    const redirectToDashboard = () => {
      const userRole = localStorage.getItem('userRole');
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      console.log('🔍 DashboardRouter - Role:', userRole, 'Token:', !!token);
      
      if (!token || !userRole) {
        console.log('❌ No token or role found, redirecting to login');
        history.push('/login');
        return;
      }

      // Route based on user role
      switch (userRole.toLowerCase()) {
        case 'admin':
        case 'superadmin':
        case 'faculty':
          console.log('👨‍💼 Redirecting to AdminFacultyDashboard');
          history.push('/admin/dashboard');
          break;
        case 'teacher':
          console.log('👨‍🏫 Redirecting to TeacherDashboard');
          history.push('/teacher/dashboard');
          break;
        case 'student':
          console.log('👨‍🎓 Redirecting to StudentDashboard');
          history.push('/student/dashboard');
          break;
        default:
          console.log('❓ Unknown role, defaulting to student dashboard');
          history.push('/student/dashboard');
          break;
      }
    };

    redirectToDashboard();
  }, [history]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <Spin size="large" />
      <p>Redirecting to your dashboard...</p>
    </div>
  );
};

export default DashboardRouter;