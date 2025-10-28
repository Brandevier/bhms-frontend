import React from 'react';
import { Table, Tag, Button, Descriptions } from 'antd';
import { 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  ExclamationCircleOutlined,
  ClockCircleOutlined as PendingIcon
} from '@ant-design/icons';
import dayjs from 'dayjs';

const getStatusTag = (status) => {
  let color, icon;
  switch (status) {
    case 'Approved':
      color = 'green';
      icon = <CheckCircleOutlined />;
      break;
    case 'Rejected':
      color = 'red';
      icon = <CloseCircleOutlined />;
      break;
    case 'Pending':
      color = 'orange';
      icon = <PendingIcon />;
      break;
    case 'Cancelled':
      color = 'gray';
      icon = <ExclamationCircleOutlined />;
      break;
    default:
      color = 'blue';
  }
  return (
    <Tag color={color} icon={icon}>
      {status}
    </Tag>
  );
};

const LeaveTable = ({ data }) => {
  const columns = [
    {
      title: 'Leave Type',
      dataIndex: 'leaveType',
      key: 'leaveType',
      render: (text) => <Tag color="blue">{text}</Tag>
    },
    {
      title: 'Date Range',
      key: 'dateRange',
      render: (_, record) => (
        `${dayjs(record.startDate).format('MMM D')} - ${dayjs(record.endDate).format('MMM D, YYYY')}`
      )
    },
    {
      title: 'Duration',
      dataIndex: 'durationDays',
      key: 'durationDays',
      render: (days) => `${days} day${days !== 1 ? 's' : ''}`
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
      ellipsis: true
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: getStatusTag
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button type="link" size="small">
          View Details
        </Button>
      )
    }
  ];

  return (
    <Table 
      dataSource={data} 
      columns={columns} 
      rowKey="id"
      expandable={{
        expandedRowRender: record => (
          <Descriptions bordered size="small" column={1}>
            <Descriptions.Item label="Reason">{record.reason}</Descriptions.Item>
            {record.approvedAt && (
              <Descriptions.Item label="Approved On">
                {dayjs(record.approvedAt).format('MMM D, YYYY h:mm A')}
              </Descriptions.Item>
            )}
            {record.documentUrl && (
              <Descriptions.Item label="Document">
                <a href={record.documentUrl} target="_blank" rel="noopener noreferrer">
                  View Document
                </a>
              </Descriptions.Item>
            )}
          </Descriptions>
        ),
        rowExpandable: record => record.reason || record.documentUrl
      }}
    />
  );
};

export default LeaveTable;