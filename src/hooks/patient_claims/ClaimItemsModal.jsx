import React from 'react';
import { Modal, List, Typography, Tag, Divider } from 'antd';
import { 
  MedicineBoxOutlined, 
  ExperimentOutlined, 
  DashboardOutlined 
} from '@ant-design/icons';

const { Title, Text } = Typography;

const ClaimItemsModal = ({ claim, onClose }) => {
  const getItemIcon = (itemType) => {
    switch (itemType) {
      case 'Medicine': return <MedicineBoxOutlined />;
      case 'LabTest': return <ExperimentOutlined />;
      case 'Procedure': return <DashboardOutlined />;
      default: return <MedicineBoxOutlined />;
    }
  };

  return (
    <Modal
      title={`Claim Details - ${claim.claim_reference_number}`}
      open={!!claim}
      onCancel={onClose}
      width={700}
      footer={null}
    >
      <div style={{ marginBottom: 16 }}>
        <Text strong>Status: </Text>
        <Tag color={claim.claim_status === 'Pending' ? 'orange' : 'green'}>
          {claim.claim_status}
        </Tag>
        
        <Text strong style={{ marginLeft: 16 }}>Total Amount: </Text>
        <Text strong style={{ color: '#52c41a' }}>₵{claim.total_amount}</Text>
      </div>

      <Divider />

      <Title level={5}>Claim Items</Title>
      <List
        dataSource={claim.items}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={getItemIcon(item.item_type)}
              title={
                <Text strong>
                  {item.item_type}: {item.description || 'No description'}
                </Text>
              }
              description={
                <Space direction="vertical" size="small">
                  <Text type="secondary">GDRG: {item.gdrg_code || 'N/A'}</Text>
                  <Text>Amount: ₵{item.amount || 0}</Text>
                  {item.date_performed && (
                    <Text type="secondary">
                      Performed: {new Date(item.date_performed).toLocaleDateString()}
                    </Text>
                  )}
                </Space>
              }
            />
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default ClaimItemsModal;