// src/components/staff/layout/HeaderComponents/MeetingJoinModal.js
import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Card, Tag, Avatar, Divider, Switch, Select, Input, message } from 'antd';
import { 
  VideoCameraOutlined, 
  UserOutlined, 
  CloseOutlined,
  SettingOutlined,
  AudioOutlined,
  VideoCameraFilled,
  ShareAltOutlined,
  ExpandOutlined,
  ShrinkOutlined
} from '@ant-design/icons';

const { Option } = Select;

const MeetingJoinModal = ({
  visible,
  onClose,
  meetingData,
  currentUser
}) => {
  const [userSettings, setUserSettings] = useState({
    audioEnabled: true,
    videoEnabled: true,
    displayName: '',
    avatarUrl: ''
  });
  const [selectedCamera, setSelectedCamera] = useState('');
  const [selectedMicrophone, setSelectedMicrophone] = useState('');
  const [selectedSpeaker, setSelectedSpeaker] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMeetingStarted, setIsMeetingStarted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef(null);

  // Initialize user settings
  useEffect(() => {
    if (currentUser) {
      setUserSettings(prev => ({
        ...prev,
        displayName: `${currentUser.firstName} ${currentUser.lastName}`,
        avatarUrl: currentUser.profile_pic || ''
      }));
    }
  }, [currentUser]);

  // Reset meeting state when modal closes
  useEffect(() => {
    if (!visible) {
      setIsMeetingStarted(false);
      setIsFullscreen(false);
    }
  }, [visible]);

  const handleJoinMeeting = () => {
    if (!meetingData?.video_url) {
      message.error('No meeting URL provided');
      return;
    }
    setIsMeetingStarted(true);
  };

  const handleLeaveMeeting = () => {
    setIsMeetingStarted(false);
    // Additional cleanup if needed
  };

  const handleSettingsToggle = (setting) => {
    setUserSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const getJitsiEmbedUrl = (url) => {
    // Convert Jitsi URL to embed-friendly format
    if (url.includes('meet.jit.si')) {
      const roomName = url.split('/').pop();
      return `https://meet.jit.si/${roomName}#config.startWithAudioMuted=${!userSettings.audioEnabled}&config.startWithVideoMuted=${!userSettings.videoEnabled}&userInfo.displayName=${encodeURIComponent(userSettings.displayName)}`;
    }
    return url;
  };

  const renderMeetingInfo = () => (
    <Card size="small" className="mb-4">
      <div className="flex items-center gap-3">
        <Avatar 
          size={48} 
          icon={<VideoCameraOutlined />}
          style={{ backgroundColor: '#52c41a' }}
        />
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-800 mb-1">
            {meetingData?.title || 'Meeting Invitation'}
          </h3>
          <p className="text-gray-600 text-sm">
            {meetingData?.description || 'You have been invited to join a meeting'}
          </p>
          {meetingData?.fromStaff && (
            <p className="text-gray-500 text-xs mt-1">
              From: {meetingData.fromStaff.firstName} {meetingData.fromStaff.lastName}
            </p>
          )}
        </div>
        <Tag color="green" className="text-sm">
          Jitsi Meet
        </Tag>
      </div>
    </Card>
  );

  const renderUserSettings = () => (
    <Card 
      size="small" 
      title={
        <div className="flex items-center gap-2">
          <SettingOutlined />
          <span>Meeting Settings</span>
        </div>
      }
      className="mb-4"
      extra={
        <Button 
          type="link" 
          size="small" 
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
        >
          {isSettingsOpen ? 'Hide' : 'Show'} Settings
        </Button>
      }
    >
      {isSettingsOpen && (
        <div className="space-y-4">
          {/* Audio/Video Toggles */}
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Audio</span>
                <Switch
                  checked={userSettings.audioEnabled}
                  onChange={() => handleSettingsToggle('audioEnabled')}
                  checkedChildren={<AudioOutlined />}
                  unCheckedChildren={<AudioOutlined />}
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Video</span>
                <Switch
                  checked={userSettings.videoEnabled}
                  onChange={() => handleSettingsToggle('videoEnabled')}
                  checkedChildren={<VideoCameraFilled />}
                  unCheckedChildren={<VideoCameraFilled />}
                />
              </div>
            </div>
          </div>

          {/* Display Name */}
          <div>
            <label className="text-sm font-medium mb-1 block">Display Name</label>
            <Input
              value={userSettings.displayName}
              onChange={(e) => setUserSettings(prev => ({ ...prev, displayName: e.target.value }))}
              placeholder="Enter your display name"
              prefix={<UserOutlined className="text-gray-400" />}
            />
          </div>

          {/* Device Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-sm font-medium mb-1 block">Camera</label>
              <Select
                value={selectedCamera}
                onChange={setSelectedCamera}
                placeholder="Select camera"
                style={{ width: '100%' }}
                size="small"
              >
                <Option value="default">Default Camera</Option>
                <Option value="front">Front Camera</Option>
                <Option value="back">Back Camera</Option>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Microphone</label>
              <Select
                value={selectedMicrophone}
                onChange={setSelectedMicrophone}
                placeholder="Select microphone"
                style={{ width: '100%' }}
                size="small"
              >
                <Option value="default">Default Microphone</Option>
                <Option value="external">External Microphone</Option>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Speaker</label>
              <Select
                value={selectedSpeaker}
                onChange={setSelectedSpeaker}
                placeholder="Select speaker"
                style={{ width: '100%' }}
                size="small"
              >
                <Option value="default">Default Speaker</Option>
                <Option value="headphones">Headphones</Option>
              </Select>
            </div>
          </div>
        </div>
      )}
    </Card>
  );

  const renderMeetingInterface = () => {
    if (!isMeetingStarted) {
      return (
        <Card size="small" title="Meeting Preview" className="mb-4">
          <div className="bg-gray-100 rounded-lg p-8 text-center">
            <VideoCameraOutlined className="text-6xl text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg mb-2">
              Ready to join the meeting?
            </p>
            <p className="text-gray-500 text-sm mb-4">
              Configure your settings and click "Start Meeting" to begin
            </p>
            <Button
              type="primary"
              size="large"
              icon={<VideoCameraOutlined />}
              onClick={handleJoinMeeting}
              style={{
                background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
                border: 'none',
                borderRadius: '6px',
                height: '44px'
              }}
            >
              Start Meeting
            </Button>
          </div>
        </Card>
      );
    }

    return (
      <Card 
        size="small" 
        title={
          <div className="flex justify-between items-center">
            <span>Live Meeting</span>
            <Button
              icon={isFullscreen ? <ShrinkOutlined /> : <ExpandOutlined />}
              onClick={toggleFullscreen}
              size="small"
            >
              {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            </Button>
          </div>
        }
        className="mb-4"
      >
        <div 
          className={`bg-black rounded-lg overflow-hidden ${
            isFullscreen ? 'h-96' : 'h-80'
          }`}
        >
          <iframe
            ref={iframeRef}
            src={getJitsiEmbedUrl(meetingData.video_url)}
            style={{
              width: '100%',
              height: '100%',
              border: 'none'
            }}
            allow="camera; microphone; display-capture"
            title="Jitsi Meeting"
          />
        </div>
      </Card>
    );
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-3">
          <VideoCameraOutlined className="text-green-500 text-xl" />
          <span className="text-lg font-semibold">
            {isMeetingStarted ? 'Live Meeting' : 'Join Meeting'}
          </span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={isFullscreen ? '95vw' : 800}
      style={isFullscreen ? { maxWidth: '95vw', height: '95vh' } : {}}
      bodyStyle={isFullscreen ? { height: 'calc(95vh - 108px)', padding: 0 } : {}}
      centered
      maskClosable={false}
      keyboard={false}
      closeIcon={<CloseOutlined className="text-gray-500" />}
      className="meeting-join-modal"
    >
      <div className="space-y-4" style={isFullscreen ? { height: '100%' } : {}}>
        {/* Meeting Information - Hide in fullscreen */}
        {!isFullscreen && renderMeetingInfo()}

        {/* User Settings - Hide when meeting started and in fullscreen */}
        {!isMeetingStarted && !isFullscreen && renderUserSettings()}

        {/* Meeting Interface */}
        <div style={isFullscreen ? { height: '100%' } : {}}>
          {renderMeetingInterface()}
        </div>

        {/* Action Buttons - Hide in fullscreen */}
        {!isFullscreen && (
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="flex gap-2">
              <Button 
                icon={<ShareAltOutlined />}
                onClick={() => {
                  if (meetingData?.video_url) {
                    navigator.clipboard.writeText(meetingData.video_url);
                    message.success('Meeting link copied to clipboard!');
                  }
                }}
              >
                Copy Link
              </Button>
              
              {isMeetingStarted && (
                <Button 
                  danger
                  onClick={handleLeaveMeeting}
                >
                  Leave Meeting
                </Button>
              )}
            </div>
            
            <div className="flex gap-3">
              {!isMeetingStarted && (
                <Button onClick={onClose}>
                  Cancel
                </Button>
              )}
              {!isMeetingStarted && (
                <Button
                  type="primary"
                  icon={<VideoCameraOutlined />}
                  onClick={handleJoinMeeting}
                  size="large"
                  style={{
                    background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '0 24px',
                    height: '40px'
                  }}
                >
                  Start Meeting
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Quick Tips - Hide when meeting started */}
        {!isMeetingStarted && !isFullscreen && (
          <div className="bg-blue-50 p-3 rounded-lg mt-4">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">💡 Tips for better meeting experience:</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Ensure you have a stable internet connection</li>
              <li>• Test your audio and video before joining</li>
              <li>• Use headphones for better audio quality</li>
              <li>• Close unnecessary applications for better performance</li>
              <li>• Allow camera and microphone permissions when prompted</li>
            </ul>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default MeetingJoinModal;