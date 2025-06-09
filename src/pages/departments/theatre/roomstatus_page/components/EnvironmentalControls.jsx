import React from 'react';
import { Card, Row, Col, Progress } from 'antd';
import { 
  RocketFilled as TemperatureHighOutlined, 
  SunOutlined as HumidityOutlined 
} from '@ant-design/icons';

const EnvironmentalControls = ({ rooms }) => {
  const activeRooms = rooms.filter(room => room.status !== 'available');
  
  return (
    <Card title="Environmental Conditions" bordered={false} className="shadow-sm">
      <Row gutter={[16, 16]}>
        {activeRooms.length > 0 ? (
          activeRooms.map(room => (
            <Col span={24} key={room.id}>
              <div className="font-medium mb-2">{room.name}</div>
              <Row gutter={16}>
                <Col span={12}>
                  <div className="flex items-center text-gray-600 mb-1">
                    <TemperatureHighOutlined className="mr-2" />
                    <span>Temperature</span>
                  </div>
                  <Progress 
                    percent={(room.temp / 30) * 100} 
                    format={() => `${room.temp}°C`}
                    status="normal"
                    strokeColor="#ff4d4f"
                  />
                </Col>
                <Col span={12}>
                  <div className="flex items-center text-gray-600 mb-1">
                    <HumidityOutlined className="mr-2" />
                    <span>Humidity</span>
                  </div>
                  <Progress 
                    percent={room.humidity} 
                    format={() => `${room.humidity}%`}
                    status="normal"
                    strokeColor="#1890ff"
                  />
                </Col>
              </Row>
            </Col>
          ))
        ) : (
          <Col span={24} className="text-gray-500 text-center py-4">
            No active rooms with environmental data
          </Col>
        )}
      </Row>
    </Card>
  );
};

export default EnvironmentalControls;