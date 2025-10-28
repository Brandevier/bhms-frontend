import React, { useState } from 'react';
import { List, Card, Space, Typography, Tag, Button } from 'antd';
import { EditOutlined, ExperimentOutlined, FileTextOutlined } from '@ant-design/icons';
import EditLabTestModal from '../editModals/EditLabTestModal';

const { Text } = Typography;

const LabTestGroup = ({ items, onItemUpdate, readOnly = false }) => {
  const [editingItem, setEditingItem] = useState(null);

  const handleEdit = (item) => {
    setEditingItem(item);
  };

  const handleSave = (updatedItem) => {
    onItemUpdate?.(updatedItem);
    setEditingItem(null);
  };

  return (
    <div className="labtest-group">
      <List
        dataSource={items}
        renderItem={(item) => (
          <List.Item>
            <Card size="small" style={{ width: '100%' }}>
              <div className="flex justify-between items-start">
                <Space direction="vertical" size="small">
                  <Space>
                    <ExperimentOutlined style={{ color: '#fa8c16' }} />
                    <Text strong>{item.description}</Text>
                    <Tag color="orange">{item.gdrg_code}</Tag>
                  </Space>
                  <Space wrap>
                    <Text type="secondary">Test Type: {item.labTest?.test_type || 'N/A'}</Text>
                    <Text strong>Amount: GHC {item.nhia_amount}</Text>
                    <Text type="secondary">
                      Date: {new Date(item.date_performed).toLocaleDateString()}
                    </Text>
                  </Space>
                  
                  {/* Lab Test Details */}
                  {item.labTest && (
                    <Card size="small" type="inner" style={{ backgroundColor: '#fff7e6' }}>
                      <Space direction="vertical" size="small">
                        <Text strong>Lab Results:</Text>
                        <Space wrap>
                          <Text>Result: {item.labTest.result_value || 'Pending'}</Text>
                          <Text>Unit: {item.labTest.result_unit || 'N/A'}</Text>
                          <Text>Status: {item.labTest.status || 'N/A'}</Text>
                        </Space>
                        {item.labTest.reference_range && (
                          <Text type="secondary">Ref Range: {item.labTest.reference_range}</Text>
                        )}
                        {item.labTest.notes && (
                          <Text type="secondary">Notes: {item.labTest.notes}</Text>
                        )}
                      </Space>
                    </Card>
                  )}
                </Space>
                
                {!readOnly && (
                  <Button 
                    type="link" 
                    icon={<EditOutlined />}
                    onClick={() => handleEdit(item)}
                    size="small"
                  >
                    Edit
                  </Button>
                )}
              </div>
            </Card>
          </List.Item>
        )}
      />

      <EditLabTestModal
        item={editingItem}
        visible={!!editingItem}
        onSave={handleSave}
        onCancel={() => setEditingItem(null)}
      />
    </div>
  );
};

export default LabTestGroup;