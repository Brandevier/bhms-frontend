// components/common/FaceScanModal.js
import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button, Spin, Alert, Typography, Progress, Result } from 'antd';
import { 
  CameraOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  LoadingOutlined 
} from '@ant-design/icons';
import { useFaceIdentification } from '../../../redux/hooks/useFaceRecognition';

const { Title, Text } = Typography;

const FaceScanModal = ({ visible, onClose, user }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [scanResult, setScanResult] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [stream, setStream] = useState(null);
  
  const { identify, data, loading, error, clearError, clearData } = useFaceIdentification();

  // Initialize camera when modal opens
  useEffect(() => {
    if (visible) {
      startCamera();
      setScanResult(null);
      setScanning(false);
      setImageData(null);
      clearError();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [visible, clearError]);

  // Clean up data when component unmounts
  useEffect(() => {
    return () => {
      clearData('identify');
    };
  }, [clearData]);

  // Handle scan results
  useEffect(() => {
    if (data && !loading) {
      setScanning(false);
      if (data.success) {
        setScanResult({
          success: true,
          staffId: data.matchedStaffId,
          confidence: data.confidence || (data.bestDistance ? Math.round((1 - data.bestDistance) * 100) : null),
          message: 'Attendance recorded successfully!'
        });
        stopCamera();
      } else {
        setScanResult({
          success: false,
          message: data.message || 'Face recognition failed. Please try again.'
        });
      }
    }
  }, [data, loading]);

  // Handle errors
  useEffect(() => {
    if (error) {
      setScanning(false);
      setScanResult({
        success: false,
        message: error.message || 'An error occurred during face scanning'
      });
    }
  }, [error]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user" 
        } 
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Camera error:', err);
      setScanResult({
        success: false,
        message: 'Camera access denied. Please allow camera permissions.'
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return null;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to base64 image
    const imageSrc = canvas.toDataURL('image/jpeg', 0.8);
    setImageData(imageSrc);
    
    return imageSrc;
  };

  const startScan = async () => {
    setScanning(true);
    clearError();
    
    try {
      const image = captureImage();
      
      if (!image) {
        throw new Error('Failed to capture image');
      }

      // Convert base64 to blob
      const byteString = atob(image.split(",")[1]);
      const mimeString = image.split(",")[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });
      const file = new File([blob], "face.jpg", { type: mimeString });

      // Call identify function
      identify(file);
    } catch (err) {
      setScanning(false);
      setScanResult({
        success: false,
        message: err.message || 'Failed to process image. Please try again.'
      });
    }
  };

  const handleRetry = () => {
    setScanResult(null);
    setImageData(null);
    clearError();
    clearData('identify');
    startCamera();
  };

  const handleClose = () => {
    stopCamera();
    setScanResult(null);
    setScanning(false);
    setImageData(null);
    clearError();
    clearData('identify');
    onClose();
  };

  return (
    <Modal
      title="Face Scan Attendance"
      open={visible}
      onCancel={handleClose}
      footer={null}
      width={500}
      centered
      closable={!scanning}
      maskClosable={!scanning}
    >
      <div className="text-center">
        {/* Hidden canvas for capturing images */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        
        {!scanResult && !scanning && (
          <>
            <Title level={4} className="mb-2">Face Recognition</Title>
            <Text className="text-gray-600 block mb-4">
              Position your face in the frame and click scan
            </Text>
            
            <div className="relative my-4 mx-auto" style={{ width: 320, height: 240 }}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="rounded-lg border-2 border-gray-200 w-full h-full object-cover"
                style={{ transform: 'scaleX(-1)' }} // Mirror the video
              />
            </div>
            
            <Button
              type="primary"
              size="large"
              icon={<CameraOutlined />}
              onClick={startScan}
              className="mt-2"
              disabled={!stream}
            >
              Scan Face
            </Button>
          </>
        )}

        {scanning && (
          <>
            <Spin 
              indicator={<LoadingOutlined className="text-2xl text-blue-500" spin />} 
              className="my-6" 
            />
            <Title level={4} className="text-blue-600">Processing</Title>
            <Text>Verifying your identity, please wait...</Text>
          </>
        )}

        {scanResult && (
          <>
            {scanResult.success ? (
              <Result
                status="success"
                title="Success"
                subTitle={scanResult.message}
                extra={[
                  scanResult.confidence && (
                    <div key="confidence" className="mb-4">
                      <Text>Confidence: {scanResult.confidence}%</Text>
                      <Progress 
                        percent={scanResult.confidence} 
                        status="active" 
                        className="w-48 mx-auto mt-2"
                      />
                    </div>
                  ),
                  <Button type="primary" key="close" onClick={handleClose}>
                    Done
                  </Button>
                ]}
              />
            ) : (
              <Result
                status="error"
                title="Failed"
                subTitle={scanResult.message}
                extra={[
                  <Button type="primary" key="retry" onClick={handleRetry}>
                    Try Again
                  </Button>,
                  <Button key="close" onClick={handleClose}>
                    Close
                  </Button>
                ]}
              />
            )}
          </>
        )}

        {error && !scanResult && (
          <Alert
            message="Error"
            description={error.message}
            type="error"
            showIcon
            className="my-4"
            closable
            onClose={() => clearError('identify')}
          />
        )}

        {!stream && !scanResult && !scanning && (
          <Alert
            message="Camera Access"
            description="Please allow camera access to use face recognition"
            type="warning"
            showIcon
            className="my-4"
          />
        )}
      </div>
    </Modal>
  );
};

export default FaceScanModal;