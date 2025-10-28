import React from "react";
import { Modal, Button, Tag, Typography, Spin } from "antd";
import { CheckCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import moment from "moment";

const { Text } = Typography;

const InterventionModal = ({
  intervention,
  visible,
  onCancel,
  onResponse,
  loading
}) => {
  // Safe access with fallbacks
  const issueType = intervention?.issue_type || 'Not specified';
  const severity = intervention?.severity || 'unknown';
  const description = intervention?.description || 'No description provided';
  const intervenedBy = intervention?.intervened_by || 'Unknown staff member';
  
  // Safe date handling
  const interventionDate = intervention?.intervention_date 
    ? moment(intervention.intervention_date).isValid() 
      ? moment(intervention.intervention_date).format('LLL')
      : 'Invalid date'
    : 'Date not available';

  const severityColor = {
    minor: 'green',
    moderate: 'orange',
    major: 'red',
    critical: 'darkred',
    unknown: 'gray'
  }[severity] || 'gray';

  return (
    <Modal
      title="Prescription Intervention"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button
          key="accept"
          type="primary"
          icon={<CheckCircleOutlined />}
          loading={loading}
          onClick={() => onResponse(intervention?.id, 'accepted')}
          disabled={!intervention?.id} // Disable if no ID
        >
          Accept Intervention
        </Button>,
        <Button
          key="reject"
          danger
          loading={loading}
          onClick={() => onResponse(intervention?.id, 'rejected')}
          disabled={!intervention?.id} // Disable if no ID
        >
          Reject Intervention
        </Button>,
      ]}
    >
      {intervention ? (
        <div>
          <p><Text strong>Issue Type:</Text> {issueType}</p>
          <p>
            <Text strong>Severity:</Text>{' '}
            <Tag color={severityColor}>
              {severity.toUpperCase()}
            </Tag>
          </p>
          <p><Text strong>Description:</Text> {description}</p>
          <p><Text strong>Intervened By:</Text> {intervenedBy}</p>
          <p><Text strong>Date:</Text> {interventionDate}</p>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <ExclamationCircleOutlined style={{ fontSize: '24px', color: '#faad14', marginBottom: '16px' }} />
          <p>No intervention data available</p>
        </div>
      )}
    </Modal>
  );
};

export default InterventionModal;