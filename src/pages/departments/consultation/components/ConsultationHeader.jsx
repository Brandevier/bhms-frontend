import React from 'react';
import { Input, Card, Typography, Space, Tag, Row, Col } from 'antd';
import { SearchOutlined, TeamOutlined, ClockCircleOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title, Text } = Typography;
const { Search } = Input;

const ConsultationHeader = ({ 
  searchTerm, 
  onSearchChange, 
  totalCount, 
  filteredCount,
  data = [] 
}) => {
  const calculateAverageWaitTime = () => {
    if (!data.length) return '0m';
    
    const totalWaitTime = data.reduce((total, record) => {
      if (!record.visit_date) return total;
      const visitTime = moment(record.visit_date);
      const now = moment();
      return total + now.diff(visitTime, 'minutes');
    }, 0);
    
    const averageMinutes = Math.floor(totalWaitTime / data.length);
    
    if (averageMinutes > 60) {
      const hours = Math.floor(averageMinutes / 60);
      const minutes = averageMinutes % 60;
      return `${hours}h ${minutes}m`;
    }
    return `${averageMinutes}m`;
  };

  return (
    <Card className="border-0 shadow-sm rounded-xl mb-6 bg-gradient-to-r from-green-50 to-blue-50">
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} md={14} lg={16}>
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-green-500 to-blue-500 p-3 rounded-xl flex-shrink-0">
              <TeamOutlined className="text-white text-2xl" />
            </div>
            <div className="flex-1 min-w-0">
              <Title level={3} className="text-gray-800 m-0 truncate">
                Consultation Queue
              </Title>
              <Text type="secondary" className="text-base block mb-2">
                Outpatients waiting for doctor consultation
              </Text>
              <Space size="small" wrap>
                <Tag color="blue">{totalCount} Total</Tag>
                {searchTerm && <Tag color="green">{filteredCount} Filtered</Tag>}
                <span className="flex items-center text-sm text-gray-600">
                  <ClockCircleOutlined className="mr-1" />
                  Avg wait: {calculateAverageWaitTime()}
                </span>
              </Space>
            </div>
          </div>
        </Col>
        
        <Col xs={24} md={10} lg={8}>
          <Search
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            enterButton={<SearchOutlined />}
            allowClear
            size="large"
          />
        </Col>
      </Row>
    </Card>
  );
};

export default ConsultationHeader;