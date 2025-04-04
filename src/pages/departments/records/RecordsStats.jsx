import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getStats } from '../../../redux/slice/recordSlice';
import { Card, Row, Col, Button, Skeleton, Table, message,Tag } from 'antd';
import { Bar, Pie } from 'react-chartjs-2';
import { DownloadOutlined } from '@ant-design/icons';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { useMediaQuery } from 'react-responsive';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const RecordsStats = () => {
  const dispatch = useDispatch();
  const { statistics, loading } = useSelector((state) => state.records);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  useEffect(() => { 
    console.log("useEffect triggered"); // Add this
    dispatch(getStats());
  }, [dispatch]);

  const handleDownloadReport = () => {
    // Implement report download logic
    message.info('Report download functionality will be implemented soon');
    console.log("Statistics data:", statistics);
  };

  const columns = [
    { 
      title: 'Department', 
      dataIndex: 'department', 
      key: 'department',
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>
    },
    { 
      title: 'Patients', 
      dataIndex: 'count', 
      key: 'count',
      render: (count) => <Tag color="blue">{count}</Tag>
    },
  ];

  // Chart options for better responsiveness
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: isMobile ? 'bottom' : 'right',
      },
      title: {
        display: true,
        font: {
          size: isMobile ? 14 : 16
        }
      }
    }
  };

  return (
    <div style={{ padding: isMobile ? '10px' : '20px' }}>
    {/* Stats Cards - Full width on mobile */}
    <Row gutter={[16, 16]}>
      {loading ? (
        <Col span={24}>
          <Skeleton active paragraph={{ rows: 4 }} />
        </Col>
      ) : (
        <>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card 
              title="Total Patients" 
              hoverable
              headStyle={{ backgroundColor: '#f0f2f5' }}
            >
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>
                {statistics?.general?.totalPatients || 0}
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card 
              title="Active Records" 
              hoverable
              headStyle={{ backgroundColor: '#f0f2f5' }}
            >
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>
                {statistics?.general?.activeRecords || 0}
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card 
              title="Inactive Records" 
              hoverable
              headStyle={{ backgroundColor: '#f0f2f5' }}
            >
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#f5222d' }}>
                {statistics?.general?.inactiveRecords || 0}
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card 
              title="Today's Visits" 
              hoverable
              headStyle={{ backgroundColor: '#f0f2f5' }}
            >
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#faad14' }}>
                {statistics?.trends?.dailyVisits || 0}
              </div>
            </Card>
          </Col>
        </>
      )}
    </Row>
    
    {/* Charts - Stack vertically on mobile */}
    <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
      <Col xs={24} lg={12}>
        {loading ? (
          <Skeleton active paragraph={{ rows: 8 }} />
        ) : (
          <Card 
            title="Visit Trends" 
            style={{ height: '100%' }}
            extra={<Tag color="processing">Last 30 days</Tag>}
          >
            <div style={{ height: isMobile ? '300px' : '400px' }}>
              <Bar 
                data={{
                  labels: ['Daily Visits', 'Monthly Visits'],
                  datasets: [{
                    label: 'Number of Visits',
                    data: [
                      statistics?.trends?.dailyVisits || 0, 
                      statistics?.trends?.monthlyVisits || 0
                    ],
                    backgroundColor: ['#1890ff', '#722ed1']
                  }]
                }} 
                options={chartOptions}
              />
            </div>
          </Card>
        )}
      </Col>
      <Col xs={24} lg={12}>
        {loading ? (
          <Skeleton active paragraph={{ rows: 8 }} />
        ) : (
          <Card 
            title="Patient Distribution" 
            style={{ height: '100%' }}
            extra={<Tag color="processing">Current</Tag>}
          >
            <div style={{ height: isMobile ? '300px' : '400px' }}>
              <Pie 
                data={{
                  labels: ['Inpatients', 'Outpatients'],
                  datasets: [{
                    data: [
                      statistics?.general?.inpatientCount || 0, 
                      statistics?.general?.outpatientCount || 0
                    ],
                    backgroundColor: ['#13c2c2', '#fa8c16']
                  }]
                }}
                options={chartOptions}
              />
            </div>
          </Card>
        )}
      </Col>
    </Row>

    {/* Department Table */}
    <Row style={{ marginTop: '20px' }}>
      <Col span={24}>
        {loading ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : (
          <Card 
            title="Patients Per Department"
            extra={<Tag color="blue">Total: {statistics?.general?.totalPatients || 0}</Tag>}
          >
            {/* <Table 
              dataSource={statistics?.department?.patientsPerDepartment || []} 
              columns={columns} 
              rowKey="department"
              scroll={{ x: isMobile ? true : false }}
              size={isMobile ? 'small' : 'middle'}
              pagination={{
                pageSize: isMobile ? 5 : 10,
                showSizeChanger: false
              }}
            /> */}
          </Card>
        )}
      </Col>
    </Row>

    {/* Download Button - Centered and full width on mobile */}
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      marginTop: '20px' 
    }}>
      <Button 
        type="primary" 
        icon={<DownloadOutlined />} 
        size="large"
        onClick={handleDownloadReport}
        style={{ width: isMobile ? '100%' : 'auto' }}
        loading={loading}
      >
        {isMobile ? 'Download' : 'Download Full Report'}
      </Button>
    </div>
  </div>
  );
};

export default RecordsStats;