import React from 'react';
import { Row, Col, Card, Tabs } from 'antd';


import EquipmentInventory from './components/EquipmentInventory';
import StaffAssignmentTool from './components/StaffAssignmentTool';
import ImplantTracker from './components/ImplantTracker';
import CaseCartStatus from './components/CaseCartStatus';
import ResourceConflictAlert from './components/ResourceConflictAlert';
import AnalyticsPanel from './components/AnalyticsPanel';



const { TabPane } = Tabs;

const ResourceAllocation = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Resource Allocation Dashboard</h1>
      
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <ResourceConflictAlert /> 
        </Col>
        
        <Col xs={24} lg={16}>
          <Card className="shadow-sm">
            <Tabs defaultActiveKey="1">
              <TabPane tab="Equipment Inventory" key="1">
                <EquipmentInventory />
              </TabPane>
              <TabPane tab="Staff Assignment" key="2">
                <StaffAssignmentTool />
              </TabPane>
              <TabPane tab="Implant Tracking" key="3">
                <ImplantTracker />
              </TabPane>
            </Tabs>
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <CaseCartStatus />
            </Col>
            <Col span={24}>
              <AnalyticsPanel />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default ResourceAllocation;