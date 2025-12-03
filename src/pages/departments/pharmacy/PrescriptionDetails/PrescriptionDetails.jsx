import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Card, Button, Space, Row, Col, Typography, message, Modal } from 'antd';
import { MedicineBoxOutlined, UploadOutlined, CheckOutlined } from '@ant-design/icons';
import { fetchPrescriptionsByVisit } from '../../../../redux/slice/prescriptionSlice';
import CompactDiagnosisView from './components/CompactDiagnosisView';
import PrescriptionList from './components/PrescriptionList';
import BulkDispenseModal from './components/BulkDispenseModal';

const { Title } = Typography;

const PrescriptionDetails = () => { 
  const dispatch = useDispatch();
  const { visit_id } = useParams();
  const [bulkModalVisible, setBulkModalVisible] = useState(false);
  const [selectedPrescriptions, setSelectedPrescriptions] = useState([]);

  // Redux selectors
  const { prescriptions, loading } = useSelector((state) => ({
    prescriptions: state.prescription.prescriptions,
    loading: state.prescription.loading
  }));

  const patientInfo = prescriptions?.[0]?.visit?.patient || {};
  const patientDiagnosis = prescriptions?.[0]?.visit?.diagnosis || [];

  useEffect(() => {
    if (visit_id) {
      dispatch(fetchPrescriptionsByVisit(visit_id));
    }
  }, [visit_id, dispatch]);

  // Get pending prescriptions for bulk dispense
  const pendingPrescriptions = prescriptions.filter(p => p.status === 'pending');

  const handleBulkDispenseClick = () => {
    if (pendingPrescriptions.length === 0) {
      message.info('No pending prescriptions to dispense');
      return;
    }
    setBulkModalVisible(true);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Card
        className="mb-6"
        title={
          <Space>
            <MedicineBoxOutlined className="text-blue-500" />
            <Title level={4} className="m-0">Prescription Management</Title>
          </Space>
        }
        extra={
          <Space>
            <Button
              icon={<CheckOutlined />}
              type="primary"
              onClick={handleBulkDispenseClick}
              disabled={pendingPrescriptions.length === 0}
            >
              Bulk Dispense ({pendingPrescriptions.length})
            </Button>
          </Space>
        }
      >
        {/* Patient Diagnosis Section */}
        <CompactDiagnosisView diagnosis={patientDiagnosis} />

        {/* Patient Info */}
        {patientInfo && (
          <Card size="small" className="mt-4 bg-gray-50">
            <Row gutter={16}>
              <Col span={8}>
                <span className="font-semibold">Patient: </span>
                <span>{patientInfo.firstName} {patientInfo.lastName}</span>
              </Col>
              <Col span={8}>
                <span className="font-semibold">Visit ID: </span>
                <span className="font-mono text-sm">{visit_id}</span>
              </Col>
              <Col span={8}>
                <span className="font-semibold">Status: </span>
                <span className={`px-2 py-1 rounded text-xs ${
                  pendingPrescriptions.length > 0 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {pendingPrescriptions.length > 0 ? 'Pending Dispense' : 'All Dispensed'}
                </span>
              </Col>
            </Row>
          </Card>
        )}
      </Card>

      {/* Prescriptions List */}
      <PrescriptionList 
        prescriptions={prescriptions} 
        loading={loading} 
        visitId={visit_id}
      />

      {/* Bulk Dispense Modal */}
      <BulkDispenseModal
        visible={bulkModalVisible}
        onCancel={() => setBulkModalVisible(false)}
        prescriptions={pendingPrescriptions}
        visitId={visit_id}
      />
    </div>
  );
};

export default PrescriptionDetails;