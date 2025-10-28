import React from 'react';
import { Descriptions, Tag } from 'antd';

const ProcedureInfo = ({ patient, procedure, status }) => (
  <div className="procedure-info">
    <Descriptions bordered size="small" column={2}>
      <Descriptions.Item label="Patient">
        <Tag color="blue">{patient.name}</Tag>
        {patient.id}
      </Descriptions.Item>
      <Descriptions.Item label="Procedure">
        <Tag color="purple">{procedure.type}</Tag>
        {procedure.tooth}
      </Descriptions.Item>
      <Descriptions.Item label="Provider">
        {procedure.provider}
      </Descriptions.Item>
      <Descriptions.Item label="Status">
        <Tag color={status === 'Completed' ? 'green' : 'orange'}>
          {status}
        </Tag>
      </Descriptions.Item>
    </Descriptions>
  </div>
);

export default ProcedureInfo;