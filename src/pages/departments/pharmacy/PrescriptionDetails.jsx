import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { 
  Card, 
  Button, 
  Tag, 
  Divider, 
  Typography, 
  Space, 
  Descriptions,  
  Modal,
  Input,
  Alert
} from 'antd';
import { 
  MedicineBoxOutlined, 
  UserOutlined, 
  CalendarOutlined,
  CloseOutlined,
  CheckOutlined,
  FileTextOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { fetchPrescriptionsByVisit } from '../../../redux/slice/prescriptionSlice';

const { Title, Text } = Typography;
const { TextArea } = Input;

const PrescriptionDetails = () => {
  const dispatch = useDispatch();
  const { visit_id } = useParams();
  const [issueModalVisible, setIssueModalVisible] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [pharmacistNotes, setPharmacistNotes] = useState('');
  const [showAIRecommendation, setShowAIRecommendation] = useState(false);

  const { prescriptions, loading } = useSelector((state) => ({
    prescriptions: state.prescription.prescriptions,
    loading: state.prescription.loading
  }));

  useEffect(() => {
    if (visit_id) {
      dispatch(fetchPrescriptionsByVisit(visit_id));
    }
  }, [visit_id, dispatch]);

  const handleIssueMedication = (prescription) => {
    setSelectedPrescription(prescription);
    setIssueModalVisible(true);
  };

  const handleReject = (id) => {
    Modal.confirm({
      title: 'Confirm Rejection',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure you want to reject this prescription?',
      okText: 'Confirm Reject',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        console.log('Rejecting prescription:', id);
        // Add your rejection logic here
      },
    });
  };

  const handleAIRecommendation = () => {
    setShowAIRecommendation(true);
    // In a real app, this would call an AI service
  };

  return (
    <div style={{ padding: '24px',  margin: '0 auto' }}>
      <Title level={2} style={{ marginBottom: '24px' }}>
        <MedicineBoxOutlined /> Prescription Details
      </Title>

      {loading && <Text>Loading prescriptions...</Text>}

      {prescriptions?.map((prescription, index) => (
        <React.Fragment key={prescription.id}>
          <Card 
            title={
              <Space>
                <Text strong>Prescription #{index + 1}</Text>
                {prescription.is_emergency && (
                  <Tag icon={<ExclamationCircleOutlined />} color="red">
                    EMERGENCY
                  </Tag>
                )}
              </Space>
            }
            style={{ marginBottom: '24px' }}
            extra={
              <Space>
                <Tag color={prescription.status === 'pending' ? 'orange' : 'green'}>
                  {prescription.status.toUpperCase()}
                </Tag>
                <Text type="secondary">
                  {moment(prescription.createdAt).format('DD MMM YYYY, h:mm a')}
                </Text>
              </Space>
            }
          >
            <Descriptions bordered column={{ xs: 1, sm: 2, md: 3 }}>
              <Descriptions.Item label="Patient" span={2}>
                <Space direction="vertical">
                  <Text strong>
                    {prescription.visit.patient.first_name} {prescription.visit.patient.last_name}
                  </Text>
                  <Text type="secondary">
                    <UserOutlined /> Folder: {prescription.visit.patient.folder_number}
                  </Text>
                  <Text type="secondary">
                    <CalendarOutlined /> DOB: {moment(prescription.visit.patient.date_of_birth).format('DD/MM/YYYY')}
                  </Text>
                </Space>
              </Descriptions.Item>

              <Descriptions.Item label="Department">
                {prescription.department?.name || 'N/A'}
              </Descriptions.Item>

              <Descriptions.Item label="Medication" span={2}>
                <Space direction="vertical">
                  <Text strong>{prescription.medicine.generic_name}</Text>
                  <Text type="secondary">Code: {prescription.medicine.code}</Text>
                  <Text type="secondary">Price: GHC {prescription.medicine.price_ghc}</Text>
                </Space>
              </Descriptions.Item>

              <Descriptions.Item label="Quantity">
                <Tag color="blue">{prescription.quantity}</Tag>
              </Descriptions.Item>

              <Descriptions.Item label="Dosage Instructions" span={3}>
                <Space direction="vertical">
                  <Text>
                    <Text strong>Dosage:</Text> {prescription.dosage} mg
                  </Text>
                  <Text>
                    <Text strong>Frequency:</Text> {prescription.frequency} times daily
                  </Text>
                  <Text>
                    <Text strong>Duration:</Text> {prescription.duration} days
                  </Text>
                  <Text>
                    <Text strong>Period:</Text> {moment(prescription.start_date).format('DD/MM/YYYY')} - {moment(prescription.end_date).format('DD/MM/YYYY')}
                  </Text>
                </Space>
              </Descriptions.Item>

              <Descriptions.Item label="Prescribing Doctor">
                {prescription.doctor ? (
                  <Space>
                    <UserOutlined />
                    <Text>
                      Dr. {prescription.doctor.firstName} {prescription.doctor.lastName}
                    </Text>
                    <Tag>{prescription.doctor.staffID}</Tag>
                  </Space>
                ) : (
                  <Text type="secondary">Not specified</Text>
                )}
              </Descriptions.Item>

              <Descriptions.Item label="Notes">
                {prescription.notes || <Text type="secondary">No notes</Text>}
              </Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: '24px', textAlign: 'right' }}>
              <Space>
                <Button 
                  type="primary" 
                  icon={<CheckOutlined />}
                  onClick={() => handleIssueMedication(prescription)}
                >
                  Issue Medication
                </Button>
                <Button 
                  danger 
                  icon={<CloseOutlined />}
                  onClick={() => handleReject(prescription.id)}
                >
                  Reject
                </Button>
                <Button 
                  type="dashed" 
                  icon={<FileTextOutlined />}
                  onClick={handleAIRecommendation}
                >
                  AI Review
                </Button>
              </Space>
            </div>
          </Card>

          {showAIRecommendation && (
            <Alert
              message="AI Recommendation"
              description={
                <div>
                  <p>Based on the prescription details, here are potential considerations:</p>
                  <ul>
                    <li>Drug interaction check: No known interactions detected</li>
                    <li>Dosage appears appropriate for adult patient</li>
                    <li>Patient has no known allergies to this medication</li>
                  </ul>
                  <p style={{ fontStyle: 'italic' }}>
                    Note: This is a simulated AI recommendation. In a real application, this would connect to an AI service.
                  </p>
                </div>
              }
              type="info"
              showIcon
              closable
              onClose={() => setShowAIRecommendation(false)}
              style={{ marginBottom: '24px' }}
            />
          )}

          {index < prescriptions.length - 1 && <Divider />}
        </React.Fragment>
      ))}

      {/* Issue Medication Modal */}
      <Modal
        title={`Issue Medication - ${selectedPrescription?.medicine.generic_name}`}
        visible={issueModalVisible}
        onOk={() => {
          console.log('Issuing medication with notes:', pharmacistNotes);
          setIssueModalVisible(false);
          setPharmacistNotes('');
        }}
        onCancel={() => {
          setIssueModalVisible(false);
          setPharmacistNotes('');
        }}
        okText="Confirm Issue"
        cancelText="Cancel"
        width={700}
      >
        {selectedPrescription && (
          <div>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Patient" span={2}>
                {selectedPrescription.visit.patient.first_name} {selectedPrescription.visit.patient.last_name}
              </Descriptions.Item>
              <Descriptions.Item label="Medication">
                {selectedPrescription.medicine.generic_name}
              </Descriptions.Item>
              <Descriptions.Item label="Quantity">
                {selectedPrescription.quantity}
              </Descriptions.Item>
              <Descriptions.Item label="Dosage">
                {selectedPrescription.dosage} mg
              </Descriptions.Item>
              <Descriptions.Item label="Frequency">
                {selectedPrescription.frequency} times daily
              </Descriptions.Item>
              <Descriptions.Item label="Duration">
                {selectedPrescription.duration} days
              </Descriptions.Item>
              <Descriptions.Item label="Doctor's Notes" span={2}>
                {selectedPrescription.notes || 'None'}
              </Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: '16px' }}>
              <Text strong>Pharmacist Notes:</Text>
              <TextArea
                rows={4}
                value={pharmacistNotes}
                onChange={(e) => setPharmacistNotes(e.target.value)}
                placeholder="Add any additional notes or instructions..."
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PrescriptionDetails;