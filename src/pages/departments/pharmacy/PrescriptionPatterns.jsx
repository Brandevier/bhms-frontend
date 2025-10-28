import React, { useEffect } from 'react';
import { Card, Row, Col, Divider, Typography, Tabs } from 'antd';
import { MedicineBoxOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPharmacyDashboardStats } from '../../../redux/slice/prescriptionSlice';
import FiltersSection from './common/FiltersSection';
import KPICards from './common/KPICards';
import DrugAnalysisTab from './common/DrugAnalysisTab';
import PrescriberAnalysisTab from './common/PrescriberAnalysisTab';
import DepartmentAnalysisTab from './common/DepartmentAnalysisTab';
// import TrendsTab from './common/TrendsTab';
import CategoriesTab from './common/CategoriesTab';
import RedFlagsTab from './common/RedFlagsTab';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const PrescriptionPatterns = () => {
  const dispatch = useDispatch();
  const { dashboardStats, loading, error } = useSelector(state => state.prescription);

  useEffect(() => {
    dispatch(fetchPharmacyDashboardStats());
  }, [dispatch]);

  if (loading) {
    return <div style={{ padding: 24 }}>Loading prescription data...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <Text type="danger">Error loading data: {error}</Text>
      </div>
    );
  }

  if (!dashboardStats) {
    return <div style={{ padding: 24 }}>No data available</div>;
  }

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>
        <MedicineBoxOutlined /> Prescription Patterns Analysis
      </Title>
      <Text type="secondary">
        Track prescribing trends, identify outliers, and optimize medication use
      </Text>
      <Divider />

      <FiltersSection />
      <KPICards stats={dashboardStats} />
      
      <Tabs defaultActiveKey="1">
        <TabPane tab="By Drug" key="1">
          <DrugAnalysisTab data={dashboardStats} />
        </TabPane>
        
        <TabPane tab="By Department" key="2">
          <DepartmentAnalysisTab data={dashboardStats} />
        </TabPane>
        
        <TabPane tab="Categories" key="3">
          <CategoriesTab data={dashboardStats} />
        </TabPane>
        
        <TabPane tab="Red Flags" key="4">
          <RedFlagsTab data={dashboardStats} />
        </TabPane>

        <TabPane tab="Charts" key="5">
          <PrescriberAnalysisTab data={dashboardStats} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default PrescriptionPatterns;