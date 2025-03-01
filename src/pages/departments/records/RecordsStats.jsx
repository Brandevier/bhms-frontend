import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getStats } from '../../../redux/slice/recordSlice';
import { Card, Row, Col, Button, Skeleton, Table } from 'antd';
import { Bar, Pie } from 'react-chartjs-2';
import { DownloadOutlined } from '@ant-design/icons';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const RecordsStats = () => {
  const dispatch = useDispatch();
  const { statistics, loading } = useSelector((state) => state.records);

  useEffect(() => {
    dispatch(getStats());
  }, [dispatch]);

  const handleDownloadReport = () => {
    // Implement report download logic (e.g., generate PDF)
    console.log("Downloading report...");
  };

  const columns = [
    { title: 'Department', dataIndex: 'department', key: 'department' },
    { title: 'Patients', dataIndex: 'count', key: 'count' },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={[16, 16]}>
        {loading ? (
          <>
            <Skeleton active />
            <Skeleton active />
          </>
        ) : (
          <>
            <Col span={6}><Card title="Total Patients">{statistics?.general?.totalPatients}</Card></Col>
            <Col span={6}><Card title="Active Records">{statistics?.general?.activeRecords}</Card></Col>
            <Col span={6}><Card title="Inactive Records">{statistics?.general?.inactiveRecords}</Card></Col>
          </>
        )}
      </Row>
      
      <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
        <Col span={12}>
          {loading ? <Skeleton active /> : (
            <Card title="Visit Trends">
              <Bar data={{
                labels: ['Daily Visits', 'Monthly Visits'],
                datasets: [{
                  label: 'Visits',
                  data: [statistics?.trends?.dailyVisits, statistics?.trends?.monthlyVisits],
                  backgroundColor: ['#1890ff', '#f5222d']
                }]
              }} />
            </Card>
          )}
        </Col>
        <Col span={12}>
          {loading ? <Skeleton active /> : (
            <Card title="Patient Distribution">
              <Pie data={{
                labels: ['Inpatients', 'Outpatients'],
                datasets: [{
                  data: [statistics?.general?.inpatientCount, statistics?.general?.outpatientCount],
                  backgroundColor: ['#52c41a', '#faad14']
                }]
              }} />
            </Card>
          )}
        </Col>
      </Row>

      <Row style={{ marginTop: '20px' }}>
        <Col span={24}>
          {loading ? <Skeleton active /> : (
            <Card title="Patients Per Department">
              <Table dataSource={statistics?.department?.patientsPerDepartment || []} columns={columns} rowKey="department" />
            </Card>
          )}
        </Col>
      </Row>

      <Button type="primary" icon={<DownloadOutlined />} style={{ marginTop: '20px' }} onClick={()=>console.log(statistics)}>
        Download Report
      </Button>
    </div>
  );
};

export default RecordsStats;
