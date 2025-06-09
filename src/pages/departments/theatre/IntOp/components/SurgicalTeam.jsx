import React from 'react';
import { Card, Table, Tag, Avatar, Space,Button } from 'antd';
import { 
  TeamOutlined,
  UserOutlined,
  PlusOutlined
} from '@ant-design/icons';

const SurgicalTeam = () => {
  const teamMembers = [
    {
      key: '1',
      name: 'Dr. Smith',
      role: 'Surgeon',
      status: 'scrubbed',
      avatar: 'S'
    },
    {
      key: '2',
      name: 'Dr. Johnson',
      role: 'Assistant',
      status: 'scrubbed',
      avatar: 'J'
    },
    {
      key: '3',
      name: 'Dr. Chen',
      role: 'Anesthesiologist',
      status: 'present',
      avatar: 'C'
    },
    {
      key: '4',
      name: 'Nurse Brown',
      role: 'Scrub Nurse',
      status: 'scrubbed',
      avatar: 'B'
    }
  ];

  const columns = [
    {
      title: 'Team Member',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <Avatar>{record.avatar}</Avatar>
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'scrubbed' ? 'green' : 'blue'}>
          {status === 'scrubbed' ? 'Scrubbed In' : 'Present'}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <Button type="link">Details</Button>
      ),
    },
  ];

  return (
    <Card
      title={
        <span>
          <TeamOutlined className="mr-2" />
          Surgical Team
        </span>
      }
      bordered={false}
      className="shadow-sm"
      extra={
        <Button icon={<PlusOutlined />}>Add Member</Button>
      }
    >
      <Table
        columns={columns}
        dataSource={teamMembers}
        pagination={false}
        size="middle"
      />
    </Card>
  );
};

export default SurgicalTeam;