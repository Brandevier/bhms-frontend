import React from "react";
import { Modal, Typography } from "antd";
import { CloseCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import BhmsButton from "../heroComponents/BhmsButton";

const { Text, Title } = Typography;

const LoginErrorModal = ({ visible, error, onClose }) => {
  // Determine if it's a network/server error or authentication error
  const isNetworkError = error?.includes("network") || error?.includes("Server");
  
  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      width={420}
      closable={false}
      className="login-error-modal"
      styles={{
        body: {
          padding: '32px',
          textAlign: 'center',
        }
      }}
    >
      {/* Error Icon */}
      <div 
        style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          backgroundColor: '#FFF1F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
        }}
      >
        <CloseCircleOutlined style={{ fontSize: 40, color: '#FF4D4F' }} />
      </div>

      {/* Error Title */}
      <Title 
        level={4} 
        style={{ 
          marginBottom: 8, 
          color: '#1F1F1F',
          fontWeight: 600 
        }}
      >
        {isNetworkError ? "Connection Error" : "Authentication Failed"}
      </Title>

      {/* Error Message */}
      <Text 
        type="secondary" 
        style={{ 
          display: 'block', 
          marginBottom: 24,
          fontSize: 14,
          lineHeight: 1.6,
          color: '#595959'
        }}
      >
        {error || "Unable to verify your credentials. Please check your information and try again."}
      </Text>

      {/* Help Text */}
      <div 
        style={{
          backgroundColor: '#F7F9FC',
          borderRadius: 8,
          padding: '12px 16px',
          marginBottom: 24,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 8,
        }}
      >
        <ExclamationCircleOutlined style={{ color: '#19417D', marginTop: 2 }} />
        <Text style={{ fontSize: 12, color: '#595959', textAlign: 'left' }}>
          If the problem persists, please contact your system administrator for assistance.
        </Text>
      </div>

      {/* Action Button */}
      <BhmsButton 
        type="primary" 
        onClick={onClose}
        block
        size="large"
        style={{ 
          height: 48,
          fontWeight: 500,
          backgroundColor: '#19417D',
        }}
      >
        Try Again
      </BhmsButton>
    </Modal>
  );
};

export default LoginErrorModal;

