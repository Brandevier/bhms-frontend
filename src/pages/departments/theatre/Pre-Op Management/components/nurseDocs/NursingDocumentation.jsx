import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Divider, Alert, Space, Badge, Tag, Button } from 'antd';
import { UserOutlined, MedicineBoxOutlined, CalendarOutlined, FileTextOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { createVitalSignsRecord, fetchVitalSignsRecordByPatientId } from '../../../../../../redux/slice/vitalSignsSlice';

import PatientHeader from './components/PatientHeader';
import VitalSignsCard from './components/VitalSignsCard';
import AllergiesCard from './components/AllergiesCard';
import PreOpAssessmentCard from './components/PreOpAssessmentCard';
import PreOpChecklistCard from './components/PreOpChecklistCard';

const NursingDocumentation = ({ patient }) => {
  const dispatch = useDispatch();
  const { loading, currentRecord } = useSelector((state) => state.vitals);
  const [vitals, setVitals] = useState([]);

  // Fetch existing vitals when patient changes
  useEffect(() => {
    if (patient?.patient?.id) {
      dispatch(fetchVitalSignsRecordByPatientId(patient.patient.id));
    }
  }, [patient, dispatch]);

  // Update local vitals state when Redux data changes
  useEffect(() => {
    if (currentRecord && currentRecord.vitals) {
      setVitals(currentRecord.vitals);
    }
  }, [currentRecord]);

  // Handle case when no patient is selected
  if (!patient) {
    return (
      <div className="flex justify-center items-center h-64">
        <Alert
          message="No Patient Selected"
          description="Please select a patient from the theatre list to document nursing care."
          type="info"
          showIcon
        />
      </div>
    );
  }

  // Handle new vital sign submission
  const handleNewVital = (newVital) => {
    console.log(patient)
    const updatedVitals = [...vitals, newVital];
    setVitals(updatedVitals);
    
    // Save to Redux/backend
    if (patient?.patient?.id) {
      dispatch(createVitalSignsRecord({
        patient_id: patient.patient.id,
        updatedVitals,
        visit_id: patient.visit.id
      }));
    }
  };

  return (
    <div className="p-4">
      {/* Header Section */}
      <PatientHeader patient={patient} />

      <Divider className="my-4" onClick={()=>console.log(patient)}/>

      <Row gutter={[16, 16]}>
        {/* Left Column */}
        <Col xs={24} lg={12}>
          <VitalSignsCard 
            vitals={vitals} 
            onNewVital={handleNewVital}
            loading={loading}
          />
          
          <AllergiesCard />
        </Col>
        
        {/* Right Column */}
        <Col xs={24} lg={12}>
          <PreOpAssessmentCard />
          
          <PreOpChecklistCard />
        </Col>
      </Row>
    </div>
  );
};

export default NursingDocumentation;