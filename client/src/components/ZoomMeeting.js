import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, message, Spin, Alert, Tag } from 'antd';
import { VideoCameraOutlined, PhoneOutlined, AudioOutlined, AudioMutedOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import zoomApiService from '../services/zoomApiService';

// Add CSS for pulse animation
const pulseAnimation = `
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

// Inject the CSS
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = pulseAnimation;
  document.head.appendChild(style);
}

const ZoomMeeting = ({ 
  meetingId, 
  meetingData, 
  onMeetingEnd, 
  onAttendanceUpdate,
  isHost = false 
}) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [isJoined, setIsJoined] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [error, setError] = useState(null);
  const [sdkSignature, setSdkSignature] = useState(null);
  const [meetingDuration, setMeetingDuration] = useState(0);
  const [participantCount, setParticipantCount] = useState(1);
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const zoomContainerRef = useRef(null);
  const zoomClientRef = useRef(null);

  // Load Zoom Web SDK
  useEffect(() => {
    loadZoomSDK();
  }, []);

  useEffect(() => {
    if (isSDKLoaded) {
      initializeZoomSDK();
    }
    
    return () => {
      // Cleanup on unmount
      if (zoomClientRef.current) {
        try {
          zoomClientRef.current.leave();
        } catch (err) {
          console.error('Error leaving meeting on unmount:', err);
        }
      }
    };
  }, [meetingId, isSDKLoaded]);

  // Timer for meeting duration
  useEffect(() => {
    let interval;
    if (isJoined) {
      interval = setInterval(() => {
        setMeetingDuration(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isJoined]);

  // Format meeting duration
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const loadZoomSDK = () => {
    // Check if Zoom SDK is already loaded
    if (window.ZoomMtg) {
      console.log('✅ Zoom SDK already loaded');
      setIsSDKLoaded(true);
      return;
    }

    console.log('📥 Loading Zoom Web SDK...');
    
    // For now, we'll use a simpler approach until Zoom credentials are configured
    // This prevents runtime errors while still showing the UI
    console.log('⚠️ Using simplified Zoom interface (configure ZOOM_API_KEY and ZOOM_API_SECRET for full features)');
    
    // Set SDK as "loaded" but in demo mode
    setTimeout(() => {
      setIsSDKLoaded(true);
    }, 500);
  };

  const initializeZoomSDK = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🎥 Initializing Zoom meeting...');
      
      // Get SDK signature
      const signatureResponse = await zoomApiService.getSDKSignature(
        meetingData.meetingId, 
        isHost ? 1 : 0 // 1 for host, 0 for participant
      );

      if (!signatureResponse.success) {
        throw new Error(signatureResponse.message || t('zoom.meeting.error.signature'));
      }

      console.log('✅ SDK signature received');
      setSdkSignature(signatureResponse);
      
      // Check if in demo mode
      if (signatureResponse.demoMode) {
        console.log('⚠️ Demo mode detected:', signatureResponse.message);
        message.info(signatureResponse.message);
        
        // Start demo mode with functional UI
        startDemoMode();
      } else {
        // Join real Zoom meeting
        joinMeeting(signatureResponse);
      }

    } catch (error) {
      console.error('❌ Error initializing Zoom SDK:', error);
      setError(error.message || t('zoom.meeting.error.initialize'));
      setIsLoading(false);
    }
  };

  const startDemoMode = () => {
    // Simulate successful connection in demo mode
    setTimeout(() => {
      setIsJoined(true);
      setIsLoading(false);
      message.success(
        isHost 
          ? t('zoom.meeting.success.started') + ' (Demo Mode)' 
          : t('zoom.meeting.success.joined') + ' (Demo Mode)'
      );
      
      // Notify attendance update
      if (onAttendanceUpdate) {
        const userName = localStorage.getItem('userName') || meetingData.userName || 'User';
        onAttendanceUpdate({
          action: 'join',
          studentId: meetingData.userId,
          studentName: userName
        });
      }
    }, 1000);
  };

  const joinMeeting = (signature) => {
    try {
      const { ZoomMtg } = window;

      if (!ZoomMtg) {
        throw new Error(t('zoom.meeting.error.loadSDK'));
      }

      console.log('🔧 Configuring Zoom SDK...');

      // Configure Zoom SDK
      ZoomMtg.setZoomJSLib('https://source.zoom.us/2.18.2/lib', '/av');
      ZoomMtg.preLoadWasm();
      ZoomMtg.prepareWebSDK();

      // Get user info from localStorage or meetingData
      const userEmail = localStorage.getItem('userEmail') || meetingData.userEmail || '';
      const userName = localStorage.getItem('userName') || meetingData.userName || 'User';

      console.log('🚀 Initializing Zoom SDK...');
      
      // Initialize Zoom SDK
      ZoomMtg.init({
        leaveUrl: window.location.href,
        success: (success) => {
          console.log('✅ Zoom SDK initialized successfully', success);
          
          console.log('🚪 Joining meeting...');
          // Join meeting
          ZoomMtg.join({
            signature: signature.signature,
            meetingNumber: signature.meetingNumber,
            userName: userName,
            sdkKey: signature.apiKey,
            userEmail: userEmail,
            passWord: meetingData.meetingPassword || meetingData.password || '',
            success: (res) => {
              console.log('✅ Successfully joined meeting:', res);
              setIsJoined(true);
              setIsLoading(false);
              message.success(isHost ? t('zoom.meeting.success.started') : t('zoom.meeting.success.joined'));
              
              // Notify attendance update
              if (onAttendanceUpdate) {
                onAttendanceUpdate({
                  action: 'join',
                  studentId: meetingData.userId,
                  studentName: userName
                });
              }

              // Get initial participant count
              try {
                const participants = ZoomMtg.getAttendeeslist();
                setParticipantCount(participants?.length || 1);
              } catch (err) {
                console.log('Could not get initial participant count', err);
              }
            },
            error: (res) => {
              console.error('❌ Failed to join meeting:', res);
              setError(res.result || t('zoom.meeting.error.join'));
              setIsLoading(false);
            }
          });
        },
        error: (res) => {
          console.error('❌ Failed to initialize Zoom SDK:', res);
          setError(res.result || t('zoom.meeting.error.initialize'));
          setIsLoading(false);
        }
      });

      // Set up event listeners
      ZoomMtg.inMeetingServiceListener('onMeetingStatus', (data) => {
        console.log('📊 Meeting status:', data);
        if (data.meetingStatus === 3) { // Meeting ended
          handleMeetingEnd();
        }
      });

      ZoomMtg.inMeetingServiceListener('onUserJoin', (data) => {
        console.log('👋 User joined:', data);
        // Update participant count
        try {
          const participants = ZoomMtg.getAttendeeslist();
          setParticipantCount(participants?.length || participantCount + 1);
        } catch (err) {
          setParticipantCount(prev => prev + 1);
        }
        
        // Update attendance
        if (onAttendanceUpdate) {
          onAttendanceUpdate({
            action: 'join',
            studentId: data.userId,
            studentName: data.userName
          });
        }
      });

      ZoomMtg.inMeetingServiceListener('onUserLeave', (data) => {
        console.log('👋 User left:', data);
        // Update participant count
        try {
          const participants = ZoomMtg.getAttendeeslist();
          setParticipantCount(participants?.length || Math.max(1, participantCount - 1));
        } catch (err) {
          setParticipantCount(prev => Math.max(1, prev - 1));
        }
        
        // Update attendance
        if (onAttendanceUpdate) {
          onAttendanceUpdate({
            action: 'leave',
            studentId: data.userId,
            studentName: data.userName
          });
        }
      });

      zoomClientRef.current = ZoomMtg;

    } catch (error) {
      console.error('❌ Error joining meeting:', error);
      setError(error.message || t('zoom.meeting.error.join'));
      setIsLoading(false);
    }
  };

  const handleMeetingEnd = () => {
    console.log('🔚 Meeting ended');
    setIsJoined(false);
    message.info(t('zoom.meeting.success.ended'));
    if (onMeetingEnd) {
      onMeetingEnd();
    }
  };

  const toggleMute = () => {
    // Demo mode or real Zoom - both work
    if (isMuted) {
      if (zoomClientRef.current) {
        window.ZoomMtg.unmuteMyAudio();
      }
      setIsMuted(false);
      message.success(t('zoom.meeting.controls.unmute'));
    } else {
      if (zoomClientRef.current) {
        window.ZoomMtg.muteMyAudio();
      }
      setIsMuted(true);
      message.success(t('zoom.meeting.controls.mute'));
    }
  };

  const toggleVideo = () => {
    // Demo mode or real Zoom - both work
    if (isVideoOn) {
      if (zoomClientRef.current) {
        window.ZoomMtg.stopVideo();
      }
      setIsVideoOn(false);
      message.success(t('zoom.meeting.controls.stopVideo'));
    } else {
      if (zoomClientRef.current) {
        window.ZoomMtg.startVideo();
      }
      setIsVideoOn(true);
      message.success(t('zoom.meeting.controls.startVideo'));
    }
  };

  const leaveMeeting = () => {
    if (zoomClientRef.current) {
      const { ZoomMtg } = window;
      ZoomMtg.leaveMeeting({});
    }
    
    setIsJoined(false);
    message.info(t('zoom.meeting.controls.leaveMeeting'));
    
    // Notify attendance update
    if (onAttendanceUpdate) {
      const userName = localStorage.getItem('userName') || meetingData.userName || 'User';
      onAttendanceUpdate({
        action: 'leave',
        studentId: meetingData.userId,
        studentName: userName
      });
    }
    
    // Call onMeetingEnd callback
    if (onMeetingEnd) {
      onMeetingEnd();
    }
  };

  if (error) {
    return (
      <Card style={{ margin: '20px 0' }}>
        <Alert
          message={t('error')}
          description={error}
          type="error"
          showIcon
        />
        <Button 
          type="primary" 
          onClick={() => window.location.reload()}
          style={{ marginTop: 16 }}
        >
          {t('zoom.meeting.error.retry')}
        </Button>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card style={{ margin: '20px 0', textAlign: 'center' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <p>{t('zoom.meeting.loading')}</p>
          <p style={{ fontSize: '12px', color: '#666' }}>
            {t('zoom.meeting.pleaseWait')}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <VideoCameraOutlined style={{ color: '#4f46e5', fontSize: '20px' }} />
          <span>{t('zoom.meeting.title')}: {meetingData.title}</span>
          {sdkSignature?.demoMode && (
            <Tag color="orange" style={{ marginLeft: 'auto' }}>
              Demo Mode
            </Tag>
          )}
        </div>
      }
      style={{ margin: '20px 0' }}
    >
      {sdkSignature?.demoMode && (
        <Alert
          message="Demo Mode Active"
          description="Configure ZOOM_API_KEY and ZOOM_API_SECRET in server/.env to enable real Zoom meetings."
          type="info"
          showIcon
          closable
          style={{ marginBottom: 16 }}
        />
      )}
      
      <div style={{ marginBottom: 16 }}>
        <p><strong>{t('zoom.meeting.info.meetingId')}:</strong> {meetingData.meetingId}</p>
        <p><strong>{t('zoom.meeting.info.status')}:</strong> {isJoined ? t('zoom.meeting.connected') : t('zoom.meeting.connecting')}</p>
        {isJoined && (
          <>
            <p><strong>{t('zoom.meeting.duration')}:</strong> {formatDuration(meetingDuration)}</p>
            <p><strong>{t('zoom.meeting.participants')}:</strong> {participantCount}</p>
          </>
        )}
      </div>

      {/* Zoom Meeting Container - SDK will inject UI here */}
      <div 
        ref={zoomContainerRef}
        id="zmmtg-root"
        style={{
          width: '100%',
          minHeight: '500px',
          marginBottom: 16
        }}
      >
        {!isJoined && (
          <div style={{ 
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '500px',
            background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
            borderRadius: '8px'
          }}>
            <Spin size="large" style={{ marginBottom: '16px' }} />
            <p style={{ 
              margin: '0',
              fontSize: '16px',
              color: '#374151',
              fontWeight: '500'
            }}>
              {t('zoom.meeting.joiningMeeting')}
            </p>
            <p style={{ 
              margin: '8px 0 0 0',
              fontSize: '12px',
              color: '#6b7280'
            }}>
              {t('zoom.meeting.pleaseWaitConnect')}
            </p>
          </div>
        )}
        
        {/* Demo Mode Interface */}
        {isJoined && sdkSignature?.demoMode && (
          <div style={{ 
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '500px',
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            borderRadius: '8px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Animated background effect */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '300px',
              height: '300px',
              background: 'radial-gradient(circle, rgba(79, 70, 229, 0.2) 0%, transparent 70%)',
              animation: 'pulse 3s ease-in-out infinite'
            }}></div>
            
            <VideoCameraOutlined style={{ 
              fontSize: '80px', 
              color: '#4f46e5',
              marginBottom: '24px',
              zIndex: 1
            }} />
            <p style={{ 
              margin: '0',
              fontSize: '24px',
              color: '#f1f5f9',
              fontWeight: '600',
              zIndex: 1
            }}>
              {t('zoom.meeting.connected')}
            </p>
            <p style={{ 
              margin: '8px 0 0 0',
              fontSize: '14px',
              color: '#94a3b8',
              zIndex: 1
            }}>
              {isHost ? 'ホストとして接続中' : '参加者として接続中'}
            </p>
            
            {/* Status indicators */}
            <div style={{
              display: 'flex',
              gap: '16px',
              marginTop: '32px',
              zIndex: 1
            }}>
              <div style={{
                padding: '8px 16px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                color: '#f1f5f9',
                fontSize: '12px',
                backdropFilter: 'blur(10px)'
              }}>
                {isVideoOn ? '📹 ビデオ ON' : '📹 ビデオ OFF'}
              </div>
              <div style={{
                padding: '8px 16px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                color: '#f1f5f9',
                fontSize: '12px',
                backdropFilter: 'blur(10px)'
              }}>
                {isMuted ? '🔇 ミュート' : '🔊 音声 ON'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Meeting Controls */}
      {isJoined && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '12px',
          padding: '16px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px'
        }}>
          <Button
            type={isMuted ? 'default' : 'primary'}
            icon={isMuted ? <AudioMutedOutlined /> : <AudioOutlined />}
            onClick={toggleMute}
            size="large"
          >
            {isMuted ? t('zoom.meeting.controls.unmute') : t('zoom.meeting.controls.mute')}
          </Button>
          
          <Button
            type={isVideoOn ? 'primary' : 'default'}
            icon={<VideoCameraOutlined />}
            onClick={toggleVideo}
            size="large"
          >
            {isVideoOn ? t('zoom.meeting.controls.stopVideo') : t('zoom.meeting.controls.startVideo')}
          </Button>
          
          <Button
            type="primary"
            danger
            icon={<PhoneOutlined />}
            onClick={leaveMeeting}
            size="large"
          >
            {isHost ? t('zoom.meeting.controls.endMeeting') : t('zoom.meeting.controls.leaveMeeting')}
          </Button>
        </div>
      )}
    </Card>
  );
};

export default ZoomMeeting;
