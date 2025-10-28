import React from 'react';
import { Modal, Avatar, Divider, Card, Tag, Button, Row, Col, Empty, List, Badge, Collapse } from 'antd';
import { 
  UserOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  ExperimentOutlined,
  MedicineBoxOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  CheckCircleFilled,
  CloseCircleFilled
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { getStatusTag } from './utils';

const { Panel } = Collapse;

const AdmissionModal = ({ visible, record, onClose, user }) => {
  if (!record) return null;

  const diagnosis = record.diagnosis || [];
  const labTests = record.labTests || [];
  const prescriptions = record.prescriptions || [];

  const getLabTestStatus = (status) => {
    switch (status) {
      case 'completed': return { color: 'green', icon: <CheckCircleFilled />, text: 'Completed' };
      case 'pending': return { color: 'orange', icon: <ClockCircleOutlined />, text: 'Pending' };
      case 'cancelled': return { color: 'red', icon: <CloseCircleFilled />, text: 'Cancelled' };
      default: return { color: 'default', icon: <ClockCircleOutlined />, text: 'Pending' };
    }
  };

  const renderDiagnosisSection = () => (
    <div className="section">
      <div className="section-header">
        <MedicineBoxOutlined className="section-icon" />
        <h3>Diagnosis</h3>
        <Tag color={diagnosis.length > 0 ? 'blue' : 'default'}>
          {diagnosis.length} {diagnosis.length === 1 ? 'Entry' : 'Entries'}
        </Tag>
      </div>
      
      {diagnosis.length > 0 ? (
        <List
          dataSource={diagnosis}
          renderItem={(item, index) => (
            <List.Item className="diagnosis-item">
              <div className="diagnosis-content">
                <div className="diagnosis-main">
                  <span className="diagnosis-title">
                    {item.diagnosis_name || `Diagnosis #${index + 1}`}
                  </span>
                  {item.status && (
                    <Tag color={item.status === 'confirmed' ? 'green' : 'orange'}>
                      {item.status}
                    </Tag>
                  )}
                </div>
                {item.notes && (
                  <p className="diagnosis-notes">{item.notes}</p>
                )}
                {item.createdAt && (
                  <div className="diagnosis-meta">
                    <small>
                      {dayjs(item.createdAt).format('MMM D, YYYY h:mm A')}
                    </small>
                  </div>
                )}
              </div>
            </List.Item>
          )}
          locale={{ emptyText: 'No diagnosis records' }}
        />
      ) : (
        <Empty 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No diagnosis recorded"
          className="empty-state"
        />
      )}
    </div>
  );

  const renderLabTestsSection = () => (
    <div className="section">
      <div className="section-header">
        <ExperimentOutlined className="section-icon" />
        <h3>Laboratory Tests</h3>
        <Tag color={labTests.length > 0 ? 'blue' : 'default'}>
          {labTests.length} {labTests.length === 1 ? 'Test' : 'Tests'}
        </Tag>
      </div>
      
      {labTests.length > 0 ? (
        <Collapse ghost className="lab-tests-collapse">
          {labTests.map((test, index) => {
            const statusInfo = getLabTestStatus(test.status);
            return (
              <Panel 
                key={test.id || index}
                header={
                  <div className="lab-test-header">
                    <div className="lab-test-title">
                      {test.template?.description || `Lab Test #${index + 1}`}
                    </div>
                    <Badge 
                      status={statusInfo.color === 'green' ? 'success' : 
                             statusInfo.color === 'orange' ? 'processing' : 'error'}
                      text={statusInfo.text}
                    />
                  </div>
                }
                className="lab-test-panel"
              >
                <div className="lab-test-details">
                  <Row gutter={[16, 8]}>
                    <Col xs={24} sm={12}>
                      <div className="detail-field">
                        <strong>Status:</strong>
                        <Tag color={statusInfo.color} icon={statusInfo.icon}>
                          {statusInfo.text}
                        </Tag>
                      </div>
                    </Col>
                    <Col xs={24} sm={12}>
                      <div className="detail-field">
                        <strong>Requested:</strong>
                        <span>{dayjs(test.createdAt).format('MMM D, YYYY')}</span>
                      </div>
                    </Col>
                    {test.notes && (
                      <Col xs={24}>
                        <div className="detail-field">
                          <strong>Notes:</strong>
                          <p className="test-notes">{test.notes}</p>
                        </div>
                      </Col>
                    )}
                    {test.values && Object.keys(test.values).length > 0 && (
                      <Col xs={24}>
                        <div className="detail-field">
                          <strong>Results:</strong>
                          <div className="test-results">
                            {Object.entries(test.values).map(([key, value]) => (
                              <div key={key} className="result-item">
                                <span className="result-key">{key}:</span>
                                <span className="result-value">{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </Col>
                    )}
                  </Row>
                </div>
              </Panel>
            );
          })}
        </Collapse>
      ) : (
        <Empty 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No laboratory tests requested"
          className="empty-state"
        />
      )}
    </div>
  );

  const renderPrescriptionsSection = () => (
    <div className="section">
      <div className="section-header">
        <FileTextOutlined className="section-icon" />
        <h3>Prescriptions</h3>
        <Tag color={prescriptions.length > 0 ? 'blue' : 'default'}>
          {prescriptions.length} {prescriptions.length === 1 ? 'Prescription' : 'Prescriptions'}
        </Tag>
      </div>
      
      {prescriptions.length > 0 ? (
        <List
          dataSource={prescriptions}
          renderItem={(item, index) => (
            <List.Item className="prescription-item">
              <div className="prescription-content">
                <div className="prescription-main">
                  <span className="prescription-drug">
                    {item.drug_name || `Prescription #${index + 1}`}
                  </span>
                  {item.dosage && (
                    <Tag color="purple">{item.dosage}</Tag>
                  )}
                </div>
                {item.instructions && (
                  <p className="prescription-instructions">
                    <strong>Instructions:</strong> {item.instructions}
                  </p>
                )}
                <div className="prescription-meta">
                  {item.frequency && (
                    <small>Frequency: {item.frequency}</small>
                  )}
                  {item.duration && (
                    <small>Duration: {item.duration}</small>
                  )}
                </div>
              </div>
            </List.Item>
          )}
          locale={{ emptyText: 'No prescriptions' }}
        />
      ) : (
        <Empty 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No prescriptions issued"
          className="empty-state"
        />
      )}
    </div>
  );

  return (
    <Modal
      title={
        <div className="modal-title">
          <UserOutlined />
          <span>Admission Details - {record.patient?.first_name} {record.patient?.last_name}</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>
      ]}
      width={900}
      className="admission-modal"
      bodyStyle={{ padding: '20px' }}
    >
      <div className="modal-content">
        {/* Patient Header */}
        <div className="patient-header">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={8} className="text-center">
              <Avatar 
                size={80} 
                icon={<UserOutlined />} 
                src={record.patient?.profile_pic}
                className="modal-avatar"
              />
            </Col>
            <Col xs={24} sm={16}>
              <div className="header-details">
                <h2 className="patient-name">
                  {record.patient?.first_name} {record.patient?.middle_name} {record.patient?.last_name}
                </h2>
                <div className="patient-meta">
                  <Row gutter={[8, 8]}>
                    <Col xs={12} sm={8}>
                      <span className="meta-item">
                        <strong>Folder #:</strong> {record.patient?.folder_number || 'N/A'}
                      </span>
                    </Col>
                    <Col xs={12} sm={8}>
                      <span className="meta-item">
                        <strong>Age:</strong> {dayjs().diff(record.patient?.date_of_birth, 'years')} years
                      </span>
                    </Col>
                    <Col xs={12} sm={8}>
                      <span className="meta-item">
                        <strong>NHIS:</strong> {record.patient?.nhis_number || 'N/A'}
                      </span>
                    </Col>
                    <Col xs={12} sm={8}>
                      <span className="meta-item">
                        <strong>Visit Type:</strong> {record.visit_type}
                      </span>
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>
          </Row>
        </div>
        
        <Divider className="modal-divider" />
        
        {/* Admission Information */}
        <div className="section">
          <h3 className="section-title">Admission Information</h3>
          <Row gutter={[16, 12]}>
            <Col xs={24} sm={12} md={8}>
              <div className="detail-item">
                <strong>Status:</strong>
                {getStatusTag(record.admission_status)}
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className="detail-item">
                <strong>Department:</strong>
                <Tag color="blue">{record.department?.name}</Tag>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className="detail-item">
                <strong>Bed Number:</strong>
                <span>{record.bed_number || 'Not assigned'}</span>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className="detail-item">
                <strong>Admission Date:</strong>
                <span>{dayjs(record.admission_date).format('MMMM D, YYYY h:mm A')}</span>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className="detail-item">
                <strong>Attendance #:</strong>
                <span>{record.attendance_number}</span>
              </div>
            </Col>
          </Row>
        </div>

        {/* Admission Notes */}
        {record.admission_note && (
          <div className="section">
            <h3 className="section-title">Admission Notes</h3>
            <Card bordered={false} className="notes-card">
              <p>{record.admission_note}</p>
            </Card>
          </div>
        )}

        <Divider className="modal-divider" />

        {/* Medical Sections */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            {renderDiagnosisSection()}
          </Col>
          <Col xs={24} lg={12}>
            {renderLabTestsSection()}
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24}>
            {renderPrescriptionsSection()}
          </Col>
        </Row>
      </div>

      <style jsx>{`
        .admission-modal {
          max-width: 95vw;
        }
        
        .modal-title {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .patient-header {
          margin-bottom: 16px;
        }
        
        .patient-name {
          margin: 0 0 8px 0;
          font-size: 1.5rem;
          color: #1890ff;
        }
        
        .patient-meta {
          margin-top: 8px;
        }
        
        .meta-item {
          display: block;
          font-size: 0.875rem;
          color: #666;
        }
        
        .section {
          margin-bottom: 24px;
        }
        
        .section-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }
        
        .section-icon {
          color: #1890ff;
          font-size: 1.2rem;
        }
        
        .section-title {
          margin-bottom: 12px;
          color: #262626;
        }
        
        .detail-item {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }
        
        .lab-test-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }
        
        .lab-test-title {
          font-weight: 500;
        }
        
        .lab-test-details {
          padding: 8px 0;
        }
        
        .detail-field {
          margin-bottom: 8px;
        }
        
        .test-notes {
          margin: 4px 0;
          padding: 8px;
          background: #f5f5f5;
          border-radius: 4px;
        }
        
        .test-results {
          margin-top: 8px;
        }
        
        .result-item {
          display: flex;
          justify-content: space-between;
          padding: 4px 0;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .result-key {
          font-weight: 500;
        }
        
        .diagnosis-item, .prescription-item {
          border: none !important;
          padding: 12px 0 !important;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .diagnosis-content, .prescription-content {
          width: 100%;
        }
        
        .diagnosis-main, .prescription-main {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }
        
        .diagnosis-title, .prescription-drug {
          font-weight: 500;
        }
        
        .diagnosis-notes, .prescription-instructions {
          margin: 4px 0;
          color: #666;
          font-size: 0.875rem;
        }
        
        .diagnosis-meta, .prescription-meta {
          display: flex;
          gap: 12px;
          font-size: 0.75rem;
          color: #999;
        }
        
        .empty-state {
          margin: 20px 0;
        }
        
        .notes-card {
          background: #fafafa;
        }
        
        @media (max-width: 768px) {
          .patient-name {
            font-size: 1.25rem;
          }
          
          .lab-test-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
          }
          
          .diagnosis-main, .prescription-main {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
          }
        }
        
        @media (max-width: 576px) {
          .modal-content {
            padding: 8px;
          }
          
          .patient-header {
            text-align: center;
          }
          
          .detail-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
          }
        }
      `}</style>
    </Modal>
  );
};

export default AdmissionModal;