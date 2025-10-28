import React, { useState, useRef, useEffect } from 'react';
import {
  Modal,
  Button,
  Progress,
  Card,
  Alert,
  Spin,
  Typography,
  Space,
  Divider,
  Steps
} from 'antd';
import {
  CameraOutlined,
  CheckCircleOutlined,
  UserOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import { useFaceRegistration } from '../../../redux/hooks/useFaceRecognition';
import { useFaceDetection } from './useFaceDetection';

const { Title, Text } = Typography;

const FaceRegistrationModal = ({ visible, onClose, user }) => {
  const [capturedImages, setCapturedImages] = useState([]);
  const [captureCount, setCaptureCount] = useState(0);
  const [registrationStep, setRegistrationStep] = useState('camera');
  
  const { register, loading, error, clearError, isSuccessful } = useFaceRegistration();
  const { 
    videoRef, 
    canvasRef, 
    faceDetected, 
    isCameraActive, 
    startCamera, 
    stopCamera 
  } = useFaceDetection();

  useEffect(() => {
    if (visible && registrationStep === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
  }, [visible, registrationStep, startCamera, stopCamera]);

  useEffect(() => {
    if (isSuccessful) {
      setRegistrationStep('success');
    }
  }, [isSuccessful]);

  const captureImage = () => {
    if (!faceDetected) {
      Alert.warning('Please position your face in the frame');
      return;
    }

    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        const imageFile = new File([blob], `face-capture-${Date.now()}.jpg`, {
          type: 'image/jpeg'
        });

        setCapturedImages(prev => [...prev, imageFile]);
        setCaptureCount(prev => prev + 1);

        setFaceDetected(false);
        setTimeout(() => setFaceDetected(true), 200);
      }, 'image/jpeg', 0.8);
    }
  };

  const handleRegister = async () => {
    if (capturedImages.length < 5) {
      Alert.warning('Please capture at least 5 images');
      return;
    }

    try {
      setRegistrationStep('processing');
      await register({ staffId: user.id, faceImages: capturedImages });
    } catch (err) {
      console.error('Registration failed:', err);
      setRegistrationStep('camera');
    }
  };

  const handleRetry = () => {
    setCapturedImages([]);
    setCaptureCount(0);
    setRegistrationStep('camera');
    clearError();
  };

  const handleCloseModal = () => {
    onClose();
    setCapturedImages([]);
    setCaptureCount(0);
    setRegistrationStep('camera');
    clearError();
  };

  const steps = [
    { title: 'Position Face', description: 'Center your face in the frame' },
    { title: 'Capture Images', description: 'Click capture when green box appears' },
    { title: 'Complete', description: 'Submit for registration' }
  ];

  const renderCameraContent = () => (
    <>
      <Card title={<Space><CameraOutlined />Camera Preview - Capture 5 Images</Space>} className="mb-4">
        <div className="relative">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-64 bg-gray-100 rounded-lg" style={{ transform: 'scaleX(-1)' }} />
          {faceDetected && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 border-4 border-green-500 rounded-full animate-pulse">
                <div className="absolute top-2 right-2"><div className="w-4 h-4 bg-green-500 rounded-full animate-ping" /></div>
              </div>
            </div>
          )}
          <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">{captureCount}/5 captured</div>
        </div>

        <canvas ref={canvasRef} className="hidden" />

        <div className="mt-4 text-center">
          <Button type="primary" size="large" icon={<CameraOutlined />} onClick={captureImage} disabled={!faceDetected || loading}>
            Capture Image
          </Button>
          <Text className="block mt-2 text-gray-500">
            {faceDetected ? 'Face detected - Ready to capture' : 'Please position your face in the frame'}
          </Text>
        </div>
      </Card>

      <div className="mb-4">
        <Text strong>Registration Progress</Text>
        <Progress percent={(captureCount / 5) * 100} status={captureCount === 5 ? 'success' : 'active'} format={() => `${captureCount} of 5 images captured`} />
      </div>

      {capturedImages.length > 0 && (
        <Card title="Captured Images" size="small">
          <div className="flex flex-wrap gap-2">
            {capturedImages.map((image, index) => (
              <div key={index} className="relative">
                <img src={URL.createObjectURL(image)} alt={`Capture ${index + 1}`} className="w-16 h-16 object-cover rounded border-2 border-green-400" />
                <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-1 rounded">{index + 1}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Divider />
      <div className="flex justify-between">
        <Button onClick={handleCloseModal}>Cancel</Button>
        <Space>
          <Button onClick={handleRetry}>Retry</Button>
          <Button type="primary" onClick={handleRegister} disabled={captureCount < 5} loading={loading}>
            Complete Registration
          </Button>
        </Space>
      </div>
    </>
  );

  const renderProcessingContent = () => (
    <div className="text-center py-8">
      <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
      <Title level={4} className="mt-4">Processing Your Face Registration</Title>
      <Text>Please wait while we register your facial features...</Text>
    </div>
  );

  const renderSuccessContent = () => (
    <div className="text-center py-8">
      <CheckCircleOutlined className="text-4xl text-green-500 mb-4" />
      <Title level={4} className="text-green-600">Registration Successful!</Title>
      <Text>Your face has been registered for attendance.</Text>
      <Button type="primary" className="mt-4" onClick={handleCloseModal}>Continue</Button>
    </div>
  );

  return (
    <Modal title={<Space><UserOutlined />Face Registration Required</Space>} open={visible} onCancel={handleCloseModal} footer={null} width={800} closable={registrationStep !== 'processing'} maskClosable={false}>
      <div className="p-4">
        <Steps current={registrationStep === 'success' ? 2 : registrationStep === 'processing' ? 1 : captureCount > 0 ? 1 : 0} items={steps} className="mb-6" />
        {error && <Alert message="Registration Failed" description={error.message || 'Please try again'} type="error" showIcon className="mb-4" action={<Button size="small" onClick={handleRetry}>Retry</Button>} />}
        {registrationStep === 'camera' && renderCameraContent()}
        {registrationStep === 'processing' && renderProcessingContent()}
        {registrationStep === 'success' && renderSuccessContent()}
      </div>
    </Modal>
  );
};

export default FaceRegistrationModal;