import React from 'react';
import { Row, Col, Typography, Tag, Divider, Empty } from 'antd';
import { MedicineBoxOutlined, FileTextOutlined } from '@ant-design/icons';
import PrescriptionCard from './PrescriptionCard';

const { Title, Text } = Typography;

const PatientPrescriptionDetails = ({ prescriptions, patient }) => {
  const dispensedPrescriptions = prescriptions.filter(p => p.is_dispensed);
  const pendingPrescriptions = prescriptions.filter(p => !p.is_dispensed);

  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <FileTextOutlined className="text-blue-600 text-2xl" />
          <div>
            <Title level={4} className="!mb-1">
              Prescription Details
            </Title>
            <Text type="secondary">
              {prescriptions.length} total prescriptions for {patient.first_name} {patient.last_name}
            </Text>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Tag color="green">{dispensedPrescriptions.length} Dispensed</Tag>
          <Tag color="orange">{pendingPrescriptions.length} Pending</Tag>
          {prescriptions.some(p => p.is_emergency) && (
            <Tag color="red">Emergency Case</Tag>
          )}
        </div>
      </div>

      {/* Dispensed Prescriptions */}
      {dispensedPrescriptions.length > 0 && (
        <div className="mb-8">
          <Title level={5} className="flex items-center !mb-4">
            <MedicineBoxOutlined className="text-green-500 mr-2" />
            Dispensed Medications ({dispensedPrescriptions.length})
          </Title>
          <Row gutter={[16, 16]}>
            {dispensedPrescriptions.map((prescription) => (
              <Col key={prescription.id} xs={24} lg={12} xl={8}>
                <PrescriptionCard prescription={prescription} />
              </Col>
            ))}
          </Row>
        </div>
      )}

      {/* Pending Prescriptions */}
      {pendingPrescriptions.length > 0 && (
        <div>
          {dispensedPrescriptions.length > 0 && <Divider />}
          
          <Title level={5} className="flex items-center !mb-4">
            <MedicineBoxOutlined className="text-orange-500 mr-2" />
            Pending Dispensing ({pendingPrescriptions.length})
          </Title>
          <Row gutter={[16, 16]}>
            {pendingPrescriptions.map((prescription) => (
              <Col key={prescription.id} xs={24} lg={12} xl={8}>
                <PrescriptionCard prescription={prescription} />
              </Col>
            ))}
          </Row>
        </div>
      )}

      {prescriptions.length === 0 && (
        <Empty 
          description="No prescriptions found"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}
    </div>
  );
};

export default PatientPrescriptionDetails;