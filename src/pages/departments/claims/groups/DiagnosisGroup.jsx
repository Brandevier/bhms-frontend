import React, { useState } from 'react';
import { List, Card, Space, Typography, Tag, Button } from 'antd';
import { EditOutlined, HeartOutlined, FileTextOutlined } from '@ant-design/icons';
import EditDiagnosisModal from '../editModals/EditDiagnosisModal';

const { Text } = Typography;

const DiagnosisGroup = ({ items, onItemUpdate, readOnly = false }) => {
  const [editingItem, setEditingItem] = useState(null);

  const handleEdit = (item) => {
    setEditingItem(item);
  };

  const handleSave = (updatedItem) => {
    onItemUpdate?.(updatedItem);
    setEditingItem(null);
  };

  return (
    <div className="diagnosis-group">
      <List
        dataSource={items}
        renderItem={(item) => (
          <List.Item>
            <Card size="small" style={{ width: '100%' }}>
              <div className="flex justify-between items-start">
                <Space direction="vertical" size="small">
                  <Space>
                    <HeartOutlined style={{ color: '#722ed1' }} />
                    <Text strong>{item.description}</Text>
                    <Tag color="purple">{item.gdrg_code}</Tag>
                  </Space>
                  <Space wrap>
                    <Text type="secondary">Type: {item.diagnosis?.type || 'Primary'}</Text>
                    <Text strong>Amount: GHC {item.nhia_amount}</Text>
                    <Text type="secondary">
                      Date: {new Date(item.date_performed).toLocaleDateString()}
                    </Text>
                  </Space>
                  
                  {/* Diagnosis Details */}
                  {item.diagnosis && (
                    <Card size="small" type="inner" style={{ backgroundColor: '#f9f0ff' }}>
                      <Space direction="vertical" size="small">
                        <Text strong>Diagnosis Details:</Text>
                        <Space wrap>
                          <Text>ICD-10: {item.diagnosis.icd_10_code || 'N/A'}</Text>
                          <Text>Severity: {item.diagnosis.severity || 'N/A'}</Text>
                          <Text>Status: {item.diagnosis.status || 'Active'}</Text>
                        </Space>
                        {item.diagnosis.notes && (
                          <Text type="secondary">Clinical Notes: {item.diagnosis.notes}</Text>
                        )}
                        
                        {/* System Diagnosis */}
                        {item.diagnosis.systemDiagnosis && (
                          <Space wrap>
                            <Text type="secondary">
                              System: {item.diagnosis.systemDiagnosis.system_name}
                            </Text>
                            <Text type="secondary">
                              Category: {item.diagnosis.systemDiagnosis.category}
                            </Text>
                          </Space>
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

      <EditDiagnosisModal
        item={editingItem}
        visible={!!editingItem}
        onSave={handleSave}
        onCancel={() => setEditingItem(null)}
      />
    </div>
  );
};

export default DiagnosisGroup;