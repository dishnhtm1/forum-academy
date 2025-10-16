import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, message, Spin, Alert } from 'antd';
import { VideoCameraOutlined, PhoneOutlined, AudioOutlined, AudioMutedOutlined } from '@ant-design/icons';
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
  const [isLoading, setIsLoading] = useState(true);
  const [isJoined, setIsJoined] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [error, setError] = useState(null);
  const [sdkSignature, setSdkSignature] = useState(null);
  const [meetingDuration, setMeetingDuration] = useState(0);
  const [participantCount, setParticipantCount] = useState(1);
  const zoomContainerRef = useRef(null);
  const zoomClientRef = useRef(null);

  useEffect(() => {
    initializeZoomSDK();
    return () => {
      // Cleanup on unmount
      if (zoomClientRef.current) {
        zoomClientRef.current.leave();
      }
    };
  }, [meetingId]);

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

  // Simulate participant count changes
  useEffect(() => {
    let interval;
    if (isJoined) {
      interval = setInterval(() => {
        setParticipantCount(prev => {
          // Simulate random participant changes (1-5 participants)
          const change = Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0;
          const newCount = Math.max(1, Math.min(5, prev + change));
          return newCount;
        });
      }, 10000); // Change every 10 seconds
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

  const initializeZoomSDK = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // For testing purposes, simulate SDK initialization without actual Zoom SDK
      console.log('🎥 Initializing Zoom meeting (Test Mode)');
      
      // Simulate getting SDK signature
      const signatureResponse = await zoomApiService.getSDKSignature(
        meetingData.meetingId, 
        isHost ? 1 : 0 // 1 for host, 0 for participant
      );

      if (!signatureResponse.success) {
        throw new Error(signatureResponse.message || 'Failed to get SDK signature');
      }

      setSdkSignature(signatureResponse.signature);
      
      // Simulate successful initialization for testing
      setTimeout(() => {
        setIsJoined(true);
        setIsLoading(false);
        message.success(isHost ? 'Meeting started successfully!' : 'Joined meeting successfully!');
      }, 1000);

    } catch (error) {
      console.error('Error initializing Zoom SDK:', error);
      setError(error.message);
      setIsLoading(false);
    }
  };

  const joinMeeting = (signature) => {
    try {
      const { ZoomMtg } = window;

      if (!ZoomMtg) {
        throw new Error('Zoom SDK not loaded');
      }

      // Configure Zoom SDK
      ZoomMtg.setZoomJSLib('https://source.zoom.us/lib', '/av');
      ZoomMtg.preLoadWasm();
      ZoomMtg.prepareWebSDK();

      // Initialize Zoom SDK
      ZoomMtg.init({
        leaveOnPageUnload: true,
        patchJsMedia: true,
        success: () => {
          console.log('Zoom SDK initialized successfully');
          
          // Join meeting
          ZoomMtg.join({
            signature: signature.signature,
            meetingNumber: signature.meetingNumber,
            userName: meetingData.userName || 'User',
            apiKey: signature.apiKey,
            userEmail: meetingData.userEmail || '',
            passWord: meetingData.password || '',
            success: (res) => {
              console.log('Successfully joined meeting:', res);
              setIsJoined(true);
              setIsLoading(false);
              
              // Notify attendance update
              if (onAttendanceUpdate) {
                onAttendanceUpdate({
                  action: 'join',
                  studentId: meetingData.userId,
                  studentName: meetingData.userName
                });
              }
            },
            error: (res) => {
              console.error('Failed to join meeting:', res);
              setError(res.result || 'Failed to join meeting');
              setIsLoading(false);
            }
          });
        },
        error: (res) => {
          console.error('Failed to initialize Zoom SDK:', res);
          setError(res.result || 'Failed to initialize Zoom SDK');
          setIsLoading(false);
        }
      });

      // Set up event listeners
      ZoomMtg.on('meeting-status', (data) => {
        console.log('Meeting status:', data);
        if (data.meetingStatus === 3) { // Meeting ended
          handleMeetingEnd();
        }
      });

      ZoomMtg.on('user-join', (data) => {
        console.log('User joined:', data);
        // Update attendance
        if (onAttendanceUpdate) {
          onAttendanceUpdate({
            action: 'join',
            studentId: data.userId,
            studentName: data.userName
          });
        }
      });

      ZoomMtg.on('user-leave', (data) => {
        console.log('User left:', data);
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
      console.error('Error joining meeting:', error);
      setError(error.message);
      setIsLoading(false);
    }
  };

  const handleMeetingEnd = () => {
    setIsJoined(false);
    if (onMeetingEnd) {
      onMeetingEnd();
    }
  };

  const toggleMute = () => {
    if (zoomClientRef.current) {
      if (isMuted) {
        zoomClientRef.current.unmute();
        setIsMuted(false);
      } else {
        zoomClientRef.current.mute();
        setIsMuted(true);
      }
    }
  };

  const toggleVideo = () => {
    if (zoomClientRef.current) {
      if (isVideoOn) {
        zoomClientRef.current.stopVideo();
        setIsVideoOn(false);
      } else {
        zoomClientRef.current.startVideo();
        setIsVideoOn(true);
      }
    }
  };

  const leaveMeeting = () => {
    if (zoomClientRef.current) {
      zoomClientRef.current.leave();
      setIsJoined(false);
      
      // Notify attendance update
      if (onAttendanceUpdate) {
        onAttendanceUpdate({
          action: 'leave',
          studentId: meetingData.userId,
          studentName: meetingData.userName
        });
      }
    }
  };

  if (error) {
    return (
      <Card style={{ margin: '20px 0' }}>
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
        />
        <Button 
          type="primary" 
          onClick={() => window.location.reload()}
          style={{ marginTop: 16 }}
        >
          Retry
        </Button>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card style={{ margin: '20px 0', textAlign: 'center' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <p>Loading Zoom meeting...</p>
          <p style={{ fontSize: '12px', color: '#666' }}>
            Please wait while we initialize the meeting room
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
          <span>Live Meeting: {meetingData.title}</span>
        </div>
      }
      style={{ margin: '20px 0' }}
    >
      <div style={{ marginBottom: 16 }}>
        <p><strong>Meeting ID:</strong> {meetingData.meetingId}</p>
        <p><strong>Status:</strong> {isJoined ? 'Connected' : 'Connecting...'}</p>
      </div>

      {/* Zoom Meeting Container */}
      <div 
        ref={zoomContainerRef}
        id="zoom-meeting-container"
        style={{
          width: '100%',
          height: '500px',
          backgroundColor: '#f5f5f5',
          border: '1px solid #d9d9d9',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16
        }}
      >
        {isJoined ? (
          <div style={{ 
            width: '100%', 
            height: '100%', 
            position: 'relative',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            {/* Main Video Area */}
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              {/* Simulated Video Feed */}
              <div style={{
                width: '80%',
                height: '80%',
                background: 'rgba(0, 0, 0, 0.8)',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #4f46e5',
                boxShadow: '0 8px 32px rgba(79, 70, 229, 0.3)'
              }}>
                {/* Video Icon */}
                <VideoCameraOutlined style={{ 
                  fontSize: '64px', 
                  color: '#4f46e5',
                  marginBottom: '16px'
                }} />
                
                {/* Meeting Info */}
                <div style={{ textAlign: 'center', color: 'white' }}>
                  <h3 style={{ 
                    color: '#4f46e5', 
                    margin: '0 0 8px 0',
                    fontSize: '18px',
                    fontWeight: '600'
                  }}>
                    Live Meeting Active
                  </h3>
                  <p style={{ 
                    margin: '0 0 4px 0',
                    fontSize: '14px',
                    opacity: 0.9
                  }}>
                    Meeting ID: {meetingData.meetingId}
                  </p>
                  <p style={{ 
                    margin: '0',
                    fontSize: '12px',
                    opacity: 0.7
                  }}>
                    {isHost ? 'You are the host' : 'Connected as participant'}
                  </p>
                </div>
              </div>
            </div>

            {/* Video Status Indicators */}
            <div style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              display: 'flex',
              gap: '8px'
            }}>
              {/* Recording Indicator */}
              <div style={{
                background: '#dc2626',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '10px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <div style={{
                  width: '6px',
                  height: '6px',
                  background: 'white',
                  borderRadius: '50%',
                  animation: 'pulse 1.5s infinite'
                }}></div>
                REC
              </div>

              {/* Live Indicator */}
              <div style={{
                background: '#16a34a',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '10px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <div style={{
                  width: '6px',
                  height: '6px',
                  background: 'white',
                  borderRadius: '50%',
                  animation: 'pulse 1.5s infinite'
                }}></div>
                LIVE
              </div>
            </div>

            {/* Participant Count */}
            <div style={{
              position: 'absolute',
              bottom: '12px',
              left: '12px',
              background: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '500'
            }}>
              👥 {participantCount} participant{participantCount !== 1 ? 's' : ''}
            </div>

            {/* Meeting Duration */}
            <div style={{
              position: 'absolute',
              bottom: '12px',
              right: '12px',
              background: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '500'
            }}>
              ⏱️ {formatDuration(meetingDuration)}
            </div>
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)'
          }}>
            <Spin size="large" style={{ marginBottom: '16px' }} />
            <p style={{ 
              margin: '0',
              fontSize: '16px',
              color: '#374151',
              fontWeight: '500'
            }}>
              Joining meeting...
            </p>
            <p style={{ 
              margin: '8px 0 0 0',
              fontSize: '12px',
              color: '#6b7280'
            }}>
              Please wait while we connect you
            </p>
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
            {isMuted ? 'Unmute' : 'Mute'}
          </Button>
          
          <Button
            type={isVideoOn ? 'primary' : 'default'}
            icon={<VideoCameraOutlined />}
            onClick={toggleVideo}
            size="large"
          >
            {isVideoOn ? 'Stop Video' : 'Start Video'}
          </Button>
          
          <Button
            type="primary"
            danger
            icon={<PhoneOutlined />}
            onClick={leaveMeeting}
            size="large"
          >
            Leave Meeting
          </Button>
        </div>
      )}
    </Card>
  );
};

export default ZoomMeeting;
