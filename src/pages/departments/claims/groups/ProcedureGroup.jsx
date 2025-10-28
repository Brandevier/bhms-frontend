import React, { useState } from 'react';
import { List, Card, Space, Typography, Tag, Button } from 'antd';
import { EditOutlined, ExperimentOutlined } from '@ant-design/icons';
import EditProcedureModal from '../editModals/EditProcedureModal';

const { Text } = Typography;

const ProcedureGroup = ({ items, onItemUpdate, readOnly = false }) => {
  const [editingItem, setEditingItem] = useState(null);

  const handleEdit = (item) => {
    setEditingItem(item);
  };

  const handleSave = (updatedItem) => {
    onItemUpdate?.(updatedItem);
    setEditingItem(null);
  };

  return (
    <div className="procedure-group">
      <List
        dataSource={items}
        renderItem={(item) => (
          <List.Item>
            <Card size="small" style={{ width: '100%' }}>
              <div className="flex justify-between items-start">
                <Space direction="vertical" size="small">
                  <Space>
                    <ExperimentOutlined style={{ color: '#52c41a' }} />
                    <Text strong>{item.description}</Text>
                    <Tag color="green">{item.gdrg_code}</Tag>
                  </Space>
                  <Space wrap>
                    <Text type="secondary">Performed by: {item.staff?.name || 'N/A'}</Text>
                    <Text strong>Amount: GHC {item.nhia_amount}</Text>
                    <Text type="secondary">
                      Date: {new Date(item.date_performed).toLocaleDateString()}
                    </Text>
                  </Space>
                  
                  {/* Procedure Details */}
                  {item.procedure && (
                    <Space wrap>
                      <Text type="secondary">Type: {item.procedure.type}</Text>
                      <Text type="secondary">Duration: {item.procedure.duration}</Text>
                    </Space>
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

      <EditProcedureModal
        item={editingItem}
        visible={!!editingItem}
        onSave={handleSave}
        onCancel={() => setEditingItem(null)}
      />
    </div>
  );
};

export default ProcedureGroup;