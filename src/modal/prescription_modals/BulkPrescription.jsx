import React, { useState } from 'react';
import { Card, Button, List, Tag, Space } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import PrescriptionModal from './PrescriptionModal';

const BulkPrescription = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [prescriptions, setPrescriptions] = useState([]);

  const handleSavePrescription = (prescription) => {
    setPrescriptions(prev => [...prev, { ...prescription, id: Date.now() }]);
    setModalVisible(false);
  };

  const removePrescription = (id) => {
    setPrescriptions(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-4">
      <Card
        title="Medication Prescriptions"
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setModalVisible(true)}
          >
            Add Medication
          </Button>
        }
      >
        {prescriptions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No medications prescribed yet. Click "Add Medication" to start.
          </div>
        ) : (
          <List
            dataSource={prescriptions}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button 
                    type="link" 
                    danger 
                    icon={<DeleteOutlined />}
                    onClick={() => removePrescription(item.id)}
                  >
                    Remove
                  </Button>
                ]}
              >
                <List.Item.Meta
                  title={
                    <Space>
                      <span>{item.medication_data.generic_name}</span>
                      {item.is_emergency && <Tag color="red">Emergency</Tag>}
                    </Space>
                  }
                  description={
                    <div>
                      <div>
                        {item.dosage} {item.doseUnitType} • {item.frequency}x daily • {item.duration} days
                      </div>
                      <div>
                        <strong>Quantity:</strong> {item.quantity} • <strong>Route:</strong> {item.route}
                      </div>
                      {item.notes && (
                        <div><strong>Instructions:</strong> {item.notes}</div>
                      )}
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>

      {prescriptions.length > 0 && (
        <div className="flex justify-end space-x-3">
          <Button onClick={() => setPrescriptions([])}>
            Clear All
          </Button>
          <Button type="primary">
            Save All Prescriptions ({prescriptions.length})
          </Button>
        </div>
      )}

      <PrescriptionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSavePrescription}
        isBulk={true}
      />
    </div>
  );
};

export default BulkPrescription;