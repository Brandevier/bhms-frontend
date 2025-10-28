import React, { useState } from 'react';
import { List, Card, Space, Typography, Tag, Button, Badge } from 'antd';
import { EditOutlined, MedicineBoxOutlined, CalendarOutlined } from '@ant-design/icons';
import EditMedicationModal from '../editModals/EditMedicationModal';

const { Text } = Typography;

const MedicationGroup = ({ items, onItemUpdate, readOnly = false }) => {
  const [editingItem, setEditingItem] = useState(null);

  const handleEdit = (item) => {
    setEditingItem(item);
  };

  const handleSave = (updatedItem) => {
    onItemUpdate?.(updatedItem);
    setEditingItem(null);
  };

  const handleCancel = () => {
    setEditingItem(null);
  };

  return (
    <div className="medication-group">
      <List
        dataSource={items}
        renderItem={(item) => (
          <List.Item>
            <Card size="small" style={{ width: '100%' }}>
              <Space direction="vertical" style={{ width: '100%' }} size="small">
                <div className="flex justify-between items-start">
                  <Space direction="vertical" size="small">
                    <Space>
                      <MedicineBoxOutlined style={{ color: '#1890ff' }} />
                      <Text strong>{item.description}</Text>
                      <Tag color="blue">{item.gdrg_code}</Tag>
                    </Space>
                    <Space wrap>
                      <Text type="secondary">Quantity: {item.quantity}</Text>
                      <Text strong>Amount: GHC {item.nhia_amount}</Text>
                      <Text type="secondary">
                        <CalendarOutlined /> {new Date(item.date_performed).toLocaleDateString()}
                      </Text>
                    </Space>
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

                {/* Prescription Details */}
                {item.prescription && (
                  <Card size="small" type="inner" style={{ backgroundColor: '#fafafa' }}>
                    <Space direction="vertical" size="small">
                      <Text strong>Prescription Details:</Text>
                      <Space wrap>
                        <Text>Dosage: {item.prescription.dosage} {item.prescription.doseUnitType}</Text>
                        <Text>Frequency: {item.prescription.frequency}x/day</Text>
                        <Text>Duration: {item.prescription.duration} days</Text>
                        <Text>Route: {item.prescription.route}</Text>
                      </Space>
                      {item.prescription.notes && (
                        <Text type="secondary">Notes: {item.prescription.notes}</Text>
                      )}
                    </Space>
                  </Card>
                )}
              </Space>
            </Card>
          </List.Item>
        )}
      />

      {/* Edit Modal */}
      <EditMedicationModal
        item={editingItem}
        visible={!!editingItem}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default MedicationGroup;