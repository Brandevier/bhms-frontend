// src/components/staff/layout/HeaderComponents/VideoCallSection.js
import React from 'react';
import { useSelector } from 'react-redux';
import VideoCallButton from '../VideoCallButton';
import VideoCallModal from '../VideoCallModal';
import { useVideoCall } from '../useVideoCall';

const VideoCallSection = () => {
  const { user } = useSelector((state) => state.auth);
  const {
    videoModalVisible,
    pendingCalls,
    loading: videoLoading,
    showVideoModal,
    hideVideoModal,
    handleStartVideoCall,
  } = useVideoCall();

  return (
    <>
      <VideoCallButton 
        onClick={showVideoModal}
        pendingCalls={pendingCalls}
      />

      <VideoCallModal
        visible={videoModalVisible}
        onCancel={hideVideoModal}
        currentUser={user}
        onStartCall={handleStartVideoCall}
        loading={videoLoading}
        availableStaff={[]}
      />
    </>
  );
};

export default VideoCallSection;