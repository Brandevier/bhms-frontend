// components/maternity/ANCRegistration.js
import React from 'react';
import { Card, Typography } from 'antd';
import { BarChartOutlined } from '@ant-design/icons';
import { useANCData } from './hooks/useANCData';
import ANCStatistics from './common/ANCStatistics';
import ANCFilters from './common/ANCFilters';
import ANCTable from './common/ANCTable';
import { fetchVisitByType } from '../../../../redux/slice/recordSlice';
import { useDispatch } from 'react-redux';

const { Title } = Typography;

const ANCRegistration = () => {
  const { data, loading, statistics, filters, setFilters } = useANCData();
  const dispatch = useDispatch();


  const handleOnsave = () => {
    // Refresh data after saving a new ANC record
   dispatch(fetchVisitByType({ visit_type: 'Maternity', attendance_type: 'New' }));
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mx-auto">
        <Title level={3} className="mb-6 flex items-center">
          <BarChartOutlined className="mr-2" />
          ANC Registration
        </Title>
        
        {/* Statistics Cards */}
        <ANCStatistics statistics={statistics} />
        
        {/* Filter and Search Section */}
        <ANCFilters filters={filters} setFilters={setFilters} />
        
        {/* Patients Table */}
        <Card>
          <ANCTable data={data} loading={loading} onSave={handleOnsave}/>
        </Card>
      </div>
    </div>
  );
};

export default ANCRegistration;