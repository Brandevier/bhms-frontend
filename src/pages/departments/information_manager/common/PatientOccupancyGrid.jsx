// components/bed/PatientOccupancyGrid.js
import React, { useState } from 'react';
import { Card, Row, Col, Tooltip, Modal, Typography, Empty } from 'antd';
import { UserOutlined, BoxPlotFilled } from '@ant-design/icons';

const { Text } = Typography;

const PatientOccupancyGrid = ({ patientDetails, totalBeds }) => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  if (!patientDetails || patientDetails.length === 0) {
    return (
      <Card title="Bed Occupancy" className="mb-6">
        <Empty description="No patients currently occupying beds" />
      </Card>
    );
  }

  const handleBedClick = (patient) => {
    setSelectedPatient(patient);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedPatient(null);
  };

  // Create a grid of beds
  const renderBedGrid = () => {
    const beds = [];
    const occupiedBedsMap = patientDetails.reduce((acc, patient) => {
      acc[patient.bed_number] = patient;
      return acc;
    }, {});

    // Assuming bed numbers are sequential or you have a way to get all bed numbers
    for (let i = 1; i <= totalBeds; i++) {
      const patient = occupiedBedsMap[i];
      const isOccupied = !!patient;
      
      beds.push(
        <Col key={i} xs={8} sm={6} md={4} lg={3} className="p-2">
          <Tooltip
            title={isOccupied ? `Bed ${i}: Occupied - Click for details` : `Bed ${i}: Available`}
          >
            <div
              className={`w-full h-20 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
                isOccupied 
                  ? 'bg-red-100 border-2 border-red-300 hover:bg-red-200 hover:shadow-md' 
                  : 'bg-green-100 border-2 border-green-300 hover:bg-green-200 hover:shadow-md'
              }`}
              onClick={() => isOccupied && handleBedClick(patient)}
            >
              <div className={`text-2xl ${isOccupied ? 'text-red-500' : 'text-green-500'}`}>
                {isOccupied ? <UserOutlined /> : <BoxPlotFilled />}
              </div>
              <Text className="text-xs mt-1">Bed {i}</Text>
              {isOccupied && (
                <div className="w-3 h-3 bg-red-500 rounded-full absolute top-1 right-1"></div>
              )}
            </div>
          </Tooltip>
        </Col>
      );
    }

    return beds;
  };

  return (
    <>
      <Card title="Bed Occupancy Grid" className="mb-6">
        <Text type="secondary" className="block mb-4">
          Click on occupied beds (red) to view patient details
        </Text>
        <Row gutter={[8, 8]}>
          {renderBedGrid()}
        </Row>
      </Card>

      <Modal
        title={`Bed ${selectedPatient?.bed_number} Details`}
        visible={modalVisible}
        onCancel={handleCloseModal}
        footer={null}
        width={400}
      >
        {selectedPatient && (
          <div className="space-y-4">
            <div>
              <Text strong>Bed Number: </Text>
              <Text>{selectedPatient.bed_number}</Text>
            </div>
            <div>
              <Text strong>Department: </Text>
              <Text>{selectedPatient.department}</Text>
            </div>
            <div>
              <Text strong>Institution: </Text>
              <Text>{selectedPatient.institution}</Text>
            </div>
            {selectedPatient.visit?.patient && (
              <>
                <Divider />
                <div>
                  <Text strong>Patient: </Text>
                  <Text>{selectedPatient.visit.patient.name}</Text>
                </div>
                <div>
                  <Text strong>Visit Date: </Text>
                  <Text>{new Date(selectedPatient.visit.visit_date).toLocaleDateString()}</Text>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>
    </>
  );
};

export default PatientOccupancyGrid;