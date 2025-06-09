import React from 'react';
import { Card, List, Avatar } from 'antd';
import { TeamOutlined } from '@ant-design/icons';

const StaffAssignment = ({ rooms }) => {
  const staffData = rooms
    .filter(room => room.staff.length > 0)
    .flatMap(room => 
      {
            return room.staff.map(staff => ({ room: room.name, staff }))
                .slice(0, 5);
        }); // Limit to 5 for display

  return (
    <Card 
      title={
        <div className="flex items-center">
          <TeamOutlined className="mr-2" />
          <span>Staff Assignments</span>
        </div>
      } 
      bordered={false} 
      className="shadow-sm"
    >
      {staffData.length > 0 ? (
        <List
          itemLayout="horizontal"
          dataSource={staffData}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar>{item.staff.split(' ')[1][0]}</Avatar>}
                title={<a>{item.staff}</a>}
                description={`Assigned to ${item.room}`}
              />
            </List.Item>
          )}
        />
      ) : (
        <div className="text-gray-500 text-center py-4">
          No staff currently assigned
        </div>
      )}
    </Card>
  );
};

export default StaffAssignment;