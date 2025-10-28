// RecordsList.jsx
import React from 'react';
import { Card, List, Tag, Empty } from 'antd';
import { FileTextOutlined, CalendarOutlined } from '@ant-design/icons';

const RecordsList = ({ records }) => {
  return (
    <Card title="Medical Records">
      <List
        dataSource={records}
        renderItem={(record) => (
          <List.Item>
            <List.Item.Meta
              avatar={<FileTextOutlined className="text-2xl text-purple-500" />}
              title={record.record_type || 'Medical Record'}
              description={
                <div className="space-y-1">
                  <Tag color="purple">Record ID: {record.id || 'N/A'}</Tag>
                  {record.createdAt && (
                    <div className="text-xs text-gray-500">
                      <CalendarOutlined /> Created: {new Date(record.createdAt).toLocaleDateString()}
                    </div>
                  )}
                  {record.status && (
                    <Tag color={record.status === 'completed' ? 'green' : 'blue'}>
                      Status: {record.status}
                    </Tag>
                  )}
                </div>
              }
            />
          </List.Item>
        )}
        locale={{ emptyText: <Empty description="No medical records in this department" /> }}
      />
    </Card>
  );
};

export default RecordsList;