import React from 'react';
import { List, Typography, Card } from 'antd';
import ClaimCard from './ClaimCard';

const { Title } = Typography;

const ClaimsList = ({ claims, onSelectClaim }) => {
  return (
    <Card>
      <Title level={4} style={{ marginBottom: 16 }}>Insurance Claims</Title>
      
      <List
        dataSource={claims}
        renderItem={(claim) => (
          <List.Item key={claim.id} style={{ padding: '8px 0' }}>
            <ClaimCard 
              claim={claim} 
              onViewDetails={() => onSelectClaim(claim)}
            />
          </List.Item>
        )}
        pagination={{
          pageSize: 5,
          showSizeChanger: false,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} of ${total} claims`,
        }}
      />
    </Card>
  );
};

export default ClaimsList;