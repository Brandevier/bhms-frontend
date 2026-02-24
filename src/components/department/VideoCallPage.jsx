import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  Button, 
  Avatar, 
  Space, 
  Typography, 
  Card, 
  Tooltip, 
  Badge,
  message 
} from 'antd';
import { 
  AudioMutedOutlined, 
  AudioOutlined,
  VideoCameraOutlined,
  VideoCameraAddOutlined,
  PhoneOutlined,
  PhoneFilled as PhoneInTalkOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  DesktopOutlined,
  UserOutlined,
  TeamOutlined,
  ExpandOutlined,
  CompressOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { toggleAudio, toggleVideo, setCallStatus, resetCallState } from '../../redux/slice/callSlice';
import socketService from '../../service/socketService';

const { Text, Title } = Typography;

const VideoCallPage = ({ currentUser, onCallEnded }) => {
  const dispatch = useDispatch();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);
  
  const { currentCall, isAudioEnabled, isVideoEnabled, callStatus } = useSelector((state) => state.call);
  
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [participants, setParticipants] = useState([]);

  // Timer for call duration
  useEffect(() => {
    let interval;
    if (callStatus === 'connected') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  // Format duration as MM:SS
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Initialize local media stream
  const initializeMedia = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: isVideoEnabled,
        audio: isAudioEnabled
      });
      
      localStreamRef.current = stream;
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      // Create peer connection
      createPeerConnection();
      
      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      message.error('Failed to access camera/microphone. Please check permissions.');
    }
  }, [isVideoEnabled, isAudioEnabled]);

  // Create WebRTC peer connection
  const createPeerConnection = () => {
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    };

    const pc = new RTCPeerConnection(configuration);
    peerConnectionRef.current = pc;

    // Add local tracks to connection
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        pc.addTrack(track, localStreamRef.current);
      });
    }

    // Handle incoming tracks
    pc.ontrack = (event) => {
      console.log('Received remote track:', event.streams[0]);
      if (remoteVideoRef.current && event.streams[0]) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socketService.sendWebRTCSignal(currentCall?.id, {
          type: 'candidate',
          candidate: event.candidate
        });
      }
    };

    // Handle connection state changes
    pc.onconnectionstatechange = () => {
      console.log('Connection state:', pc.connectionState);
      if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        handleEndCall();
      }
    };

    return pc;
  };

  // Handle WebRTC signaling events
  useEffect(() => {
    const handleSignal = (event) => {
      const data = event.detail;
      if (!peerConnectionRef.current || data.callId !== currentCall?.id) return;

      if (data.signal.type === 'offer') {
        peerConnectionRef.current.setRemoteDescription(data.signal)
          .then(() => peerConnectionRef.current.createAnswer())
          .then(answer => peerConnectionRef.current.setLocalDescription(answer))
          .then(() => {
            socketService.sendWebRTCSignal(currentCall.id, {
              type: 'answer',
              signal: peerConnectionRef.current.localDescription
            });
          });
      } else if (data.signal.type === 'answer') {
        peerConnectionRef.current.setRemoteDescription(data.signal);
      } else if (data.signal.type === 'candidate') {
        peerConnectionRef.current.addIceCandidate(data.signal.candidate);
      }
    };

    window.addEventListener('webrtc-signal', handleSignal);
    return () => window.removeEventListener('webrtc-signal', handleSignal);
  }, [currentCall]);

  // Start the call
  useEffect(() => {
    if (currentCall && callStatus === 'ringing') {
      startCall();
    }
  }, [currentCall, callStatus]);

  const startCall = async () => {
    await initializeMedia();
    
    if (peerConnectionRef.current) {
      // Create and send offer
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);
      
      socketService.sendWebRTCSignal(currentCall.id, {
        type: 'offer',
        signal: offer
      });
    }
    
    dispatch(setCallStatus('connected'));
    socketService.joinCallRoom(currentCall?.room_name || currentCall?.id);
  };

  // Handle toggle audio
  const handleToggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        dispatch(toggleAudio());
      }
    }
  };

  // Handle toggle video
  const handleToggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        dispatch(toggleVideo());
      }
    }
  };

  // Handle end call
  const handleEndCall = async () => {
    // Stop all tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }

    // Notify server
    if (currentCall?.id) {
      socketService.endCall(currentCall.id);
      socketService.leaveCallRoom(currentCall?.room_name || currentCall?.id);
    }

    // Reset state
    dispatch(resetCallState());
    
    if (onCallEnded) {
      onCallEnded();
    }
  };

  // Handle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const isVideoCall = currentCall?.call_type === 'video';
  const isConnected = callStatus === 'connected';

  return (
    <Card className="video-call-page" style={{ height: '100%' }}>
      {/* Remote Video / Avatar */}
      <div className="video-container" style={{ 
        position: 'relative', 
        height: '60vh', 
        background: '#000', 
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 16
      }}>
        {isConnected && isVideoEnabled ? (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover' 
            }}
          />
        ) : (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%',
            flexDirection: 'column'
          }}>
            <Avatar size={150} icon={<UserOutlined />} />
            <Text style={{ color: '#fff', marginTop: 16, fontSize: 18 }}>
              {currentCall?.receiver_name || currentCall?.caller_name || 'Connecting...'}
            </Text>
          </div>
        )}

        {/* Call Duration Badge */}
        {isConnected && (
          <Badge 
            count={formatDuration(callDuration)} 
            style={{ 
              position: 'absolute', 
              top: 16, 
              left: 16,
              background: 'rgba(0,0,0,0.6)'
            }}
          />
        )}

        {/* Fullscreen Button */}
        <Tooltip title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}>
          <Button
            type="text"
            icon={isFullscreen ? <CompressOutlined /> : <ExpandOutlined />}
            onClick={toggleFullscreen}
            style={{ 
              position: 'absolute', 
              top: 16, 
              right: 16,
              color: '#fff',
              background: 'rgba(0,0,0,0.5)'
            }}
          />
        </Tooltip>
      </div>

      {/* Local Video (Picture-in-Picture) */}
      <div className="local-video" style={{ 
        position: 'absolute', 
        bottom: 100, 
        right: 24, 
        width: 200, 
        height: 150,
        background: '#000',
        borderRadius: 8,
        overflow: 'hidden',
        border: '2px solid #fff',
        zIndex: 10
      }}>
        {isVideoEnabled ? (
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              transform: 'scaleX(-1)' // Mirror effect
            }}
          />
        ) : (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%' 
          }}>
            <Avatar size={60} icon={<UserOutlined />} />
          </div>
        )}
        
        <div style={{
          position: 'absolute',
          bottom: 4,
          left: 8,
          color: '#fff',
          fontSize: 12
        }}>
          You
        </div>
      </div>

      {/* Call Controls */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: 16,
        padding: '16px 0'
      }}>
        {/* Mute/Unmute Audio */}
        <Tooltip title={isAudioEnabled ? 'Mute' : 'Unmute'}>
          <Button
            type={isAudioEnabled ? 'default' : 'primary'}
            shape="circle"
            size="large"
            icon={isAudioEnabled ? <AudioOutlined /> : <AudioMutedOutlined />}
            onClick={handleToggleAudio}
            danger={!isAudioEnabled}
            style={{ 
              width: 56, 
              height: 56,
              background: isAudioEnabled ? '#fff' : '#ff4d4f',
              borderColor: isAudioEnabled ? '#d9d9d9' : '#ff4d4f'
            }}
          />
        </Tooltip>

        {/* Enable/Disable Video */}
        {isVideoCall && (
          <Tooltip title={isVideoEnabled ? 'Turn Off Camera' : 'Turn On Camera'}>
            <Button
              type={isVideoEnabled ? 'default' : 'primary'}
              shape="circle"
              size="large"
              icon={isVideoEnabled ? <VideoCameraOutlined /> : <VideoCameraAddOutlined />}
              onClick={handleToggleVideo}
              danger={!isVideoEnabled}
              style={{ 
                width: 56, 
                height: 56,
                background: isVideoEnabled ? '#fff' : '#ff4d4f',
                borderColor: isVideoEnabled ? '#d9d9d9' : '#ff4d4f'
              }}
            />
          </Tooltip>
        )}

        {/* End Call */}
        <Tooltip title="End Call">
          <Button
            type="primary"
            danger
            shape="circle"
            size="large"
            icon={<PhoneOutlined />}
            onClick={handleEndCall}
            style={{ 
              width: 64, 
              height: 64,
              fontSize: 24
            }}
          />
        </Tooltip>
      </div>

      {/* Call Info */}
      <div style={{ textAlign: 'center' }}>
        <Space>
          <PhoneInTalkOutlined style={{ color: '#52c41a' }} />
          <Text>
            {isConnected 
              ? `Connected with ${currentCall?.receiver_name || currentCall?.caller_name || 'Unknown'}`
              : callStatus === 'ringing' ? 'Calling...' : 'Connecting...'
            }
          </Text>
        </Space>
        
        {currentCall?.receiver_department_name && (
          <div style={{ marginTop: 8 }}>
            <TeamOutlined /> {currentCall.receiver_department_name}
          </div>
        )}
      </div>
    </Card>
  );
};

export default VideoCallPage;
