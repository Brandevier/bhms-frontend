import React, { useState,useEffect } from 'react';
import { Tabs, Card, Row, Col } from 'antd';

import PatientList from './components/PatientList';
import PreOpChecklist from './components/PreOpChecklist';
import AnesthesiaEvaluation from './components/AnesthesiaEvaluation';
import RiskAssessment from './components/RiskAssessment';
import PatientEducation from './components/PatientEducation';
import MedicationReconciliation from './components/MedicationReconciliation';
import NursingDocumentation from './components/NursingDocumentation';
import { fetchAllProcedures } from '../../../../redux/slice/procedureSlice'; 
import { useDispatch,useSelector } from 'react-redux';


const { TabPane } = Tabs;

const PreOpManagement = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const dispatch = useDispatch();
  const {procedures,loading} = useSelector((state) => state.procedure);

  useEffect(() => {
    // Fetch all procedures when component mounts
    dispatch(fetchAllProcedures());
  }
  , [dispatch]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Pre-Operative Management</h1>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <PatientList 
            onSelectPatient={setSelectedPatient} 
            selectedPatient={selectedPatient}
          />
        </Col>
        
        <Col xs={24} lg={16}>
          <Card className="shadow-sm">
            {selectedPatient ? (
              <Tabs 
                activeKey={activeTab} 
                onChange={setActiveTab}
                tabPosition="left"
                className="h-[600px]"
              >
                <TabPane tab="Checklist" key="1">
                  <PreOpChecklist patient={selectedPatient} />
                </TabPane>
                <TabPane tab="Anesthesia Eval" key="2">
                  <AnesthesiaEvaluation patient={selectedPatient} />
                </TabPane>
                <TabPane tab="Risk Assessment" key="3">
                  <RiskAssessment patient={selectedPatient} />
                </TabPane>
                <TabPane tab="Patient Education" key="4">
                  <PatientEducation patient={selectedPatient} />
                </TabPane>
                <TabPane tab="Medications" key="5">
                  <MedicationReconciliation patient={selectedPatient} />
                </TabPane>
                <TabPane tab="Nursing Docs" key="6">
                  <NursingDocumentation patient={selectedPatient} />
                </TabPane>
              </Tabs>
            ) : (
              <div className="flex items-center justify-center h-[600px] text-gray-500">
                Please select a patient from the list
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PreOpManagement;