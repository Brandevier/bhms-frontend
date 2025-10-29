import React from 'react';
import { Table, Space, Typography, Tag, Badge, Button, Avatar } from 'antd';
import { UserOutlined, FileTextOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import TonitelButton from '../../../../components/common/TonitelButton';
const { Text } = Typography;

const PatientTable = ({ data, loading, expandedRowRender, getStatusTag }) => {
  const navigate = useNavigate();
  
  const columns = [
    {
      title: 'Patient',
      key: 'patient',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Space>
            <Avatar 
              size="small" 
              icon={<UserOutlined />} 
              style={{ backgroundColor: '#87d068' }}
            />
            <Text strong>{record.patientName}</Text>
          </Space>
          <Text type="secondary">{record.attendanceNumber}</Text>
        </Space>
      ),
    },
    {
      title: 'Gender',
      key: 'gender',
      render: (_, record) => (
        <Tag color={record.patientGender === 'M' ? 'blue' : 'pink'}>
          {record.patientGender === 'M' ? 'Male' : 'Female'}
        </Tag>
      ),
    },
    {
      title: 'NHIS Number',
      key: 'nhis_number',
      render: (_, record) => record.visit?.patient?.insurance?.insurance_number || 'N/A',
    },
    {
      title: 'Visit Type', 
      key: 'visit_type',
      render: (_, record) => (
        <Tag color={record.visit?.visit_type === 'Outpatient' ? 'blue' : 'green'}>
          {record.visit?.visit_type || 'General OPD'}
        </Tag>
      ),
    },
    {
      title: 'Claim Details',
      key: 'claims',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Space>
            <Badge count={record.itemsCount} showZero />
            {getStatusTag && getStatusTag(record.claim_status)}
          </Space>
          <Text>Total: GHC {record.total_amount?.toFixed(2) || '0.00'}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Ref: {record.claim_reference_number}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <TonitelButton
         
          onClick={() => navigate(`/shared/records/folder/${record.visit?.patient?.id}`, { 
            state: { id: record.visit?.patient?.id } 
          })}
        >
          View Patient Folder
        </TonitelButton>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      loading={loading}
      expandable={{
        expandedRowRender,
        rowExpandable: (record) => record.items && record.items.length > 0, // FIXED: Check 'items' not 'claims'
      }}
    />
  );
};

export default PatientTable;