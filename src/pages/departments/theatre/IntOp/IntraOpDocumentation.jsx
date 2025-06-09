import React, { useState } from 'react';
import { Tabs, Card, Row, Col, Button, Badge, Tag } from 'antd';
// import {
//   ProcedureTimeline,
//   AnesthesiaRecord,
//   SurgicalTeam,
//   BloodLossCalculator,
//   SpecimenTracking,
//   ImplantDocumentation,
//   SafetyChecks
// } from '@/components/IntraOp';

import ProcedureTimeline from './components/ProcedureTimeline';
import AnesthesiaRecord from './components/AnesthesiaRecord';
import SurgicalTeam from './components/SurgicalTeam';
import BloodLossCalculator from './components/BloodLossCalculator';
import SpecimenTracking from './components/SpecimenTracking';
import ImplantTracker from '../resourceAllocation/components/ImplantTracker';
import SafetyChecks from './components/SafetyChecks';
import ImplantDocumentation from './components/ImplantDocumentation';

import { 
  EditOutlined,
  TeamOutlined,
  MedicineBoxOutlined,
  DropboxOutlined,
  SafetyCertificateOutlined,
  DashboardOutlined
} from '@ant-design/icons';

const { TabPane } = Tabs;

const IntraOpDocumentation = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [caseStatus, setCaseStatus] = useState('in-progress'); // 'pre-op', 'in-progress', 'completed'
  const [timeoutCompleted, setTimeoutCompleted] = useState(false);

  // Mock case data
  const currentCase = {
    patient: 'John Smith (MRN123456)',
    procedure: 'Laparoscopic Cholecystectomy',
    location: 'OR 3',
    startTime: '08:45 AM',
    duration: '1:22',
    surgeon: 'Dr. Lee',
    anesthesia: 'General',
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          <EditOutlined className="mr-2" />
          Intraoperative Documentation
        </h1>
        <div className="flex items-center">
          <Badge 
            status={caseStatus === 'completed' ? 'success' : 
                   caseStatus === 'in-progress' ? 'processing' : 'warning'} 
            className="mr-2" 
          />
          <Tag color={caseStatus === 'completed' ? 'green' : 
                     caseStatus === 'in-progress' ? 'blue' : 'orange'}>
            {caseStatus === 'completed' ? 'Case Completed' : 
             caseStatus === 'in-progress' ? 'Case In Progress' : 'Pre-Op'}
          </Tag>
          <Button 
            type="primary" 
            className="ml-4"
            onClick={() => setCaseStatus('completed')}
            disabled={caseStatus === 'completed'}
          >
            Complete Case
          </Button>
        </div>
      </div>

      {/* Case Overview Card */}
      <Card className="mb-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
          <div>
            <div className="text-gray-600 text-sm">Patient</div>
            <div className="font-medium">{currentCase.patient}</div>
          </div>
          <div>
            <div className="text-gray-600 text-sm">Procedure</div>
            <div className="font-medium">{currentCase.procedure}</div>
          </div>
          <div>
            <div className="text-gray-600 text-sm">Location</div>
            <div className="font-medium">{currentCase.location}</div>
          </div>
          <div>
            <div className="text-gray-600 text-sm">Start Time</div>
            <div className="font-medium">{currentCase.startTime}</div>
          </div>
          <div>
            <div className="text-gray-600 text-sm">Duration</div>
            <div className="font-medium">{currentCase.duration}</div>
          </div>
          <div>
            <div className="text-gray-600 text-sm">Anesthesia</div>
            <div className="font-medium">{currentCase.anesthesia}</div>
          </div>
        </div>
      </Card>

      {/* Main Tabs */}
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        type="card"
      >
        <TabPane 
          tab={
            <span>
              <DashboardOutlined />
              Procedure Timeline
            </span>
          } 
          key="1"
        >
          <ProcedureTimeline 
            caseStatus={caseStatus}
            timeoutCompleted={timeoutCompleted}
            onTimeoutComplete={() => setTimeoutCompleted(true)}
          />
        </TabPane>
        <TabPane 
          tab={
            <span>
              <MedicineBoxOutlined />
              Anesthesia Record
            </span>
          } 
          key="2"
        >
          <AnesthesiaRecord />
        </TabPane>
        <TabPane 
          tab={
            <span>
              <TeamOutlined />
              Surgical Team
            </span>
          } 
          key="3"
        >
          <SurgicalTeam />
        </TabPane>
        <TabPane 
          tab={
            <span>
              <DropboxOutlined />
              Specimens & Implants
            </span>
          } 
          key="4"
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <SpecimenTracking />
            </Col>
            <Col xs={24} md={12}>
              <ImplantDocumentation />
            </Col>
          </Row>
        </TabPane>
        <TabPane 
          tab={
            <span>
              <SafetyCertificateOutlined />
              Safety Checks
            </span>
          } 
          key="5"
        >
          <SafetyChecks 
            timeoutCompleted={timeoutCompleted}
            onTimeoutComplete={() => setTimeoutCompleted(true)}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default IntraOpDocumentation;