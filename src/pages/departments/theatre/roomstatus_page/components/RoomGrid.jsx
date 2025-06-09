import React from 'react';
import { Row, Col,Card } from 'antd';
import RoomCard from './RoomCard';

const RoomGrid = ({ rooms }) => {
  return (
    <Card title="Operating Rooms" bordered={false} className="shadow-sm">
      <Row gutter={[16, 16]}>
        {rooms.map(room => (
          <Col key={room.id} xs={24} sm={12} md={8} lg={12} xl={8}>
            <RoomCard room={room} />
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default RoomGrid;