import React, { useEffect } from 'react';
import { Card, Row, Col, Typography, Alert, Spin, Button } from 'antd';
import { SafetyCertificateOutlined, ReloadOutlined } from '@ant-design/icons';
import XMLUploadSection from './common/XMLUploadSection';
import VettingResults from './common/VettingResults';
import useNHIAVetting from '../../../../redux/hooks/useNHIAVetting';



const { Title, Text } = Typography;

const NHIAVettingModule = () => {
  const {
    uploadXMLFile,
    uploadStatus,
    uploadError,
    uploadResult,
    isUploadLoading,
    isUploadSuccess,
    isUploadFailed,
    resetUploadState,
    clearAllErrors,
    validationSummary,
    claims,
    overallStatus
  } = useNHIAVetting();

  const handleXMLUpload = async (file) => {
    // Clear any previous errors
    clearAllErrors();
    
    // Use the Redux action to upload the file
    uploadXMLFile(file);
  };

  const handleSaveChanges = (updatedData) => {
    // Handle saving edited data
    console.log('Saving changes:', updatedData);
    // You might want to dispatch another action here for saving changes
  };

  const handleRetry = () => {
    resetUploadState();
    clearAllErrors();
  };

  // Convert Redux status to local status for the XMLUploadSection
  const getUploadStatus = () => {
    if (isUploadLoading) return 'uploading';
    if (isUploadSuccess) return 'success';
    if (isUploadFailed) return 'error';
    return 'idle';
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
            <SafetyCertificateOutlined style={{ fontSize: 24, color: '#1890ff', marginRight: 12 }} />
            <Title level={3} style={{ margin: 0 }}>NHIA Claims Vetting</Title>
          </div>
          <Text type="secondary">
            Upload NHIA XML claims file for validation and vetting
          </Text>
        </Col>
      </Row>

      {/* Upload Section */}
      <XMLUploadSection 
        onFileUpload={handleXMLUpload}
        status={getUploadStatus()}
        disabled={isUploadLoading}
      />

      {/* Results Section */}
    {isUploadSuccess && uploadResult?.data && (
        <VettingResults
          results={uploadResult.data}
          onSaveChanges={handleSaveChanges}
        />
      )}

      {/* Loading State */}
      {isUploadLoading && (
        <Card style={{ marginTop: 24, textAlign: 'center' }}>
          <Spin size="large" />
          <Text style={{ display: 'block', marginTop: 16 }}>Processing XML file...</Text>
        </Card>
      )}

      {/* Error State */}
      {isUploadFailed && (
        <Card style={{ marginTop: 24 }}>
          <Alert
            message="Upload Failed"
            description={
              <div>
                <p>{uploadError?.error || 'Failed to process the XML file'}</p>
                <p>Please ensure it's a valid NHIA claims XML format.</p>
              </div>
            }
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
          <Button
            icon={<ReloadOutlined />}
            onClick={handleRetry}
            type="primary"
          >
            Try Again
          </Button>
        </Card>
      )}

      {/* Success Summary */}
      {isUploadSuccess && validationSummary && (
        <Card style={{ marginTop: 16, background: '#f6ffed', borderColor: '#b7eb8f' }}>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Text strong>Total Claims: </Text>
              <Text>{validationSummary.totalClaims}</Text>
            </Col>
            <Col span={8}>
              <Text strong>Total Services: </Text>
              <Text>{validationSummary.totalServices}</Text>
            </Col>
            <Col span={8}>
              <Text strong>Success Rate: </Text>
              <Text type={overallStatus === 'pass' ? 'success' : 'warning'}>
                {validationSummary.successRate}%
              </Text>
            </Col>
            <Col span={24}>
              <Text strong>Overall Status: </Text>
              <Text type={overallStatus === 'pass' ? 'success' : 'danger'}>
                {overallStatus?.toUpperCase()}
              </Text>
            </Col>
          </Row>
        </Card>
      )}
    </div>
  );
};

export default NHIAVettingModule;