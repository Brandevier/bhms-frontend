import React from 'react';
import { Card, Empty, Spin, Typography } from 'antd';
import PrescriptionItem from './PrescriptionItem';
import { useDispatch } from 'react-redux';
import { fetchPrescriptionsByVisit } from '../../../../../redux/slice/prescriptionSlice';

const { Title } = Typography; 

const PrescriptionList = ({ prescriptions, loading, visitId }) => {
  const dispatch = useDispatch();

  const handleSuccess = () => {
    dispatch(fetchPrescriptionsByVisit(visitId));
  };

  if (loading) {
    return (
      <Card className="mt-4">
        <div className="flex justify-center items-center py-12">
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  if (prescriptions.length === 0) {
    return (
      <Card className="mt-4">
        <Empty description="No prescriptions found for this visit" />
      </Card>
    );
  }

  // Separate pending and dispensed prescriptions
  const pendingPrescriptions = prescriptions.filter(p => p.status === 'pending');
  const dispensedPrescriptions = prescriptions.filter(p => p.status === 'dispensed');

  return (
    <div className="space-y-6">
      {/* Pending Prescriptions Section */}
      {pendingPrescriptions.length > 0 && (
        <Card title={<Title level={5}>Pending Dispense ({pendingPrescriptions.length})</Title>}>
          <div className="space-y-3">
            {pendingPrescriptions.map(prescription => (
              <PrescriptionItem
                key={prescription.id}
                prescription={prescription}
                visitId={visitId}
                onSuccess={handleSuccess}
              />
            ))}
          </div>
        </Card>
      )}

      {/* Dispensed Prescriptions Section */}
      {dispensedPrescriptions.length > 0 && (
        <Card title={<Title level={5}>Already Dispensed ({dispensedPrescriptions.length})</Title>}>
          <div className="space-y-3">
            {dispensedPrescriptions.map(prescription => (
              <Card
                key={prescription.id}
                size="small"
                className="mb-2 border-l-4 border-l-green-500 bg-green-50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{prescription.medicine?.generic_name}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      <span>Quantity: {prescription.quantity}</span>
                      {prescription.pharmacist_note && (
                        <span className="ml-4">Notes: {prescription.pharmacist_note}</span>
                      )}
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                    DISPENSED
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default PrescriptionList;