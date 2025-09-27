// Debug Authentication Helper
// You can run this in the browser console to check your authentication status

const checkAuthStatus = () => {
  const token = localStorage.getItem('token') || localStorage.getItem('authToken');
  console.log('=== Authentication Status ===');
  console.log('Token exists:', !!token);
  if (token) {
    console.log('Token preview:', token.substring(0, 20) + '...');
    console.log('Token length:', token.length);
    
    // Try to decode JWT to check expiration
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Token payload:', payload);
      console.log('Token expires:', new Date(payload.exp * 1000));
      console.log('Token is valid:', payload.exp * 1000 > Date.now());
    } catch (e) {
      console.log('Could not decode token:', e.message);
    }
  } else {
    console.log('No token found');
  }
  console.log('==========================');
};

// Test API endpoint
const testAudioEndpoint = async (exerciseId) => {
  console.log('=== Testing Audio Endpoint ===');
  try {
    const response = await fetch(`https://forum-backend-cnfrb6eubggucqda.canadacentral-01.azurewebsites.net/api/listening-exercises/audio/${exerciseId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || localStorage.getItem('authToken')}`,
        'Accept': 'audio/mpeg, audio/wav, audio/ogg, audio/*'
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      console.log('✅ Audio endpoint accessible');
      const blob = await response.blob();
      console.log('Audio blob size:', blob.size);
      console.log('Audio blob type:', blob.type);
    } else {
      console.log('❌ Audio endpoint error:', response.statusText);
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
  console.log('============================');
};

// Export functions to window for console access
window.checkAuthStatus = checkAuthStatus;
window.testAudioEndpoint = testAudioEndpoint;

console.log('🔧 Debug helpers loaded!');
console.log('Run checkAuthStatus() to check authentication');
console.log('Run testAudioEndpoint("YOUR_EXERCISE_ID") to test audio access');