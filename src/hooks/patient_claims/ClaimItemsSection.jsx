import React from 'react';
import { Collapse, Typography, Divider } from 'antd';
import ClaimItemRow from './ClaimItemRow';

const { Panel } = Collapse;
const { Title } = Typography;

const ClaimItemsSection = ({ items }) => {
  if (!items || items.length === 0) {
    return (
      <div style={{ marginTop: 16, padding: 12, background: '#f5f5f5', borderRadius: 6 }}>
        <Typography.Text type="secondary">No items found in this claim</Typography.Text>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 16 }}>
      <Divider style={{ margin: '12px 0' }} />
      
      <Title level={5} style={{ marginBottom: 12 }}>Claim Items Breakdown</Title>
      
      <Collapse defaultActiveKey={['0']} ghost>
        {items.map((item, index) => (
          <Panel 
            key={index}
            header={
              <span>
                {item.item_type}: {item.description || 'No description'}
              </span>
            }
          >
            <ClaimItemRow item={item} />
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};

export default ClaimItemsSection;