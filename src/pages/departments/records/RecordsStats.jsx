import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getStats } from '../../../redux/slice/recordSlice';
import { Card, Row, Col, Button, Skeleton, Table, message, Tag } from 'antd';
import { Bar, Pie } from 'react-chartjs-2';
import { DownloadOutlined } from '@ant-design/icons';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { useMediaQuery } from 'react-responsive';
import { motion } from 'framer-motion';
import { staggerContainer,fadeIn } from '../../../util/motion';
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const RecordsStats = () => {
  const dispatch = useDispatch();
  const { statistics, loading } = useSelector((state) => state.records);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  useEffect(() => { 
    dispatch(getStats());
  }, [dispatch]);

  const handleDownloadReport = () => {
    message.info('Report download functionality will be implemented soon');
  };

  const columns = [
    { 
      title: 'Department', 
      dataIndex: 'department', 
      key: 'department',
      render: (text) => <motion.span 
        style={{ fontWeight: 500 }}
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {text}
      </motion.span>
    },
    { 
      title: 'Patients', 
      dataIndex: 'count', 
      key: 'count',
      render: (count) => (
        <motion.div whileHover={{ scale: 1.1 }}>
          <Tag color="blue">{count}</Tag>
        </motion.div>
      )
    },
  ];

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
        },
        animation: {
          animateScale: true
        }
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeOutQuart'
    }
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      style={{ padding: isMobile ? '10px' : '20px' }}
    >
      {/* Stats Cards with staggered animations */}
      <Row gutter={[16, 16]}>
        {loading ? (
          <Col span={24}>
            <Skeleton active paragraph={{ rows: 4 }} />
          </Col>
        ) : (
          <>
            {[
              { title: 'Total Patients', value: statistics?.general?.totalPatients, color: '#1890ff' },
              { title: 'Active Records', value: statistics?.general?.activeRecords, color: '#52c41a' },
              { title: 'Inactive Records', value: statistics?.general?.inactiveRecords, color: '#f5222d' },
              { title: "Today's Visits", value: statistics?.trends?.dailyVisits, color: '#faad14' }
            ].map((stat, index) => (
              <Col key={stat.title} xs={24} sm={12} md={8} lg={6}>
                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    title={stat.title}
                    hoverable
                    headStyle={{ backgroundColor: '#f0f2f5' }}
                    className="hover-card"
                  >
                    <motion.div 
                      style={{ fontSize: 24, fontWeight: 'bold', color: stat.color }}
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {stat.value || 0}
                    </motion.div>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </>
        )}
      </Row> 
      
      {/* Charts with fade-in animations */}
      <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
        <Col xs={24} lg={12}>
          {loading ? (
            <Skeleton active paragraph={{ rows: 8 }} />
          ) : (
            <motion.div variants={fadeIn('right', 'tween', 0.2, 1)}>
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
            </motion.div>
          )}
        </Col>
        <Col xs={24} lg={12}>
          {loading ? (
            <Skeleton active paragraph={{ rows: 8 }} />
          ) : (
            <motion.div variants={fadeIn('left', 'tween', 0.4, 1)}>
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
            </motion.div>
          )}
        </Col>
      </Row>

      {/* Department Table with slide-up animation */}
      <Row style={{ marginTop: '20px' }}>
        <Col span={24}>
          {loading ? (
            <Skeleton active paragraph={{ rows: 6 }} />
          ) : (
            <motion.div variants={fadeIn('up', 'tween', 0.6, 1)}>
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
            </motion.div>
          )}
        </Col>
      </Row>

      {/* Download Button with pulse animation */}
      <motion.div 
        style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          marginTop: '20px' 
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
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
      </motion.div>
    </motion.div>
  );
};

export default RecordsStats;