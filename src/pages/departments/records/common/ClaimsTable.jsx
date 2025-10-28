import React from 'react';
import { Table } from 'antd';

const ClaimsTable = ({ claims }) => {
  if (claims.length === 0) {
    return <div className="text-center py-4">No claims found</div>;
  }

  return (
    <Table
      columns={[
        { title: 'Claim Number', dataIndex: 'claim_reference_number' },
        { title: 'Status', dataIndex: 'claim_status' },
        { title: 'Submission Date', dataIndex: 'submission_date' },
      ]}
      dataSource={claims}
      rowKey="id"
    />
  );
};

export default ClaimsTable;