import React, { useState, useEffect } from 'react';
import { FileSyncOutlined,HeartOutlined,CheckCircleOutlined } from '@ant-design/icons';
import { Card, Tabs, Divider,Tag } from 'antd';
import { useParams } from 'react-router-dom';
// import PatientOverview from './PatientOverview';
// import VitalsRecoveryTab from './VitalsRecoveryTab';
// import DischargeReadinessTab from './DischargeReadinessTab';

import PatientOverview from './components/PatientOverview';
import VitalsRecoveryTab from './components/VitalsRecoveryTab';
import DischargeReadinessTab from './components/DischargeReadinessTab';


const { TabPane } = Tabs;

const PostOpTracking = () => {
  const { patientId } = useParams();
  const [activeTab, setActiveTab] = useState('1');
  const [patient, setPatient] = useState(null);
  const [vitals, setVitals] = useState([]);
  const [medications, setMedications] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [dischargeChecklist, setDischargeChecklist] = useState([]);

  // Mock data - replace with API calls
  useEffect(() => {
    setPatient({
      id: patientId,
      name: 'John Smith',
      mrn: 'MRN123456',
      procedure: 'Laparoscopic Cholecystectomy',
      surgeryTime: '2023-07-15 08:30',
      pacuAdmission: '2023-07-15 10:45',
      surgeon: 'Dr. Lee',
      anesthesiologist: 'Dr. Chen'
    });

    setVitals([
      { time: '11:00', bp: '118/76', hr: 82, rr: 16, temp: 36.9, spo2: 98, pain: 4 },
      { time: '11:30', bp: '124/80', hr: 78, rr: 15, temp: 37.0, spo2: 99, pain: 3 },
      { time: '12:00', bp: '130/82', hr: 76, rr: 14, temp: 37.1, spo2: 99, pain: 2 }
    ]);

    setMedications([
      { medication: 'Ondansetron', dose: '4 mg', route: 'IV', time: '11:15', givenBy: 'Nurse Brown' },
      { medication: 'Acetaminophen', dose: '650 mg', route: 'PO', time: '11:30', givenBy: 'Nurse Brown' },
      { medication: 'Hydromorphone', dose: '0.5 mg', route: 'IV', time: '11:45', givenBy: 'Nurse Lee' }
    ]);

    setAlerts([
      { id: 1, type: 'pain', message: 'Pain score >4 at 11:00', resolved: false, priority: 'high' },
      { id: 2, type: 'nausea', message: 'Patient reported nausea', resolved: true, priority: 'medium' }
    ]);

    setDischargeChecklist([
      { id: 1, item: 'Vital signs stable for 2 hours', completed: true },
      { id: 2, item: 'Pain controlled (score ≤3)', completed: true },
      { id: 3, item: 'Able to tolerate oral intake', completed: false },
      { id: 4, item: 'Voided successfully', completed: false },
      { id: 5, item: 'Discharge instructions given', completed: false }
    ]);
  }, [patientId]);

  const handleResolveAlert = (alertId) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
  };

  const handleChecklistItem = (itemId) => {
    setDischargeChecklist(dischargeChecklist.map(item => 
      item.id === itemId ? { ...item, completed: !item.completed } : item
    ));
  };

  return (
    <div className="p-4">
      <div className="flex items-center mb-4">
        <FileSyncOutlined className="text-2xl mr-2 text-blue-500" />
        <h1 className="text-2xl font-bold">Post-Operative Tracking</h1>
        <Tag color="blue" className="ml-4">
          PACU Phase II
        </Tag>
      </div>

      <PatientOverview patient={patient} />
      
      <Divider />

      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        type="card"
      >
        <TabPane 
          tab={
            <span>
              <HeartOutlined />
              Vitals & Recovery
            </span>
          } 
          key="1"
        >
          <VitalsRecoveryTab 
            vitals={vitals}
            alerts={alerts}
            medications={medications}
            onResolveAlert={handleResolveAlert}
          />
        </TabPane>

        <TabPane 
          tab={
            <span>
              <CheckCircleOutlined />
              Discharge Readiness
            </span>
          } 
          key="2"
        >
          <DischargeReadinessTab 
            dischargeChecklist={dischargeChecklist}
            onChecklistItemChange={handleChecklistItem}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default PostOpTracking;