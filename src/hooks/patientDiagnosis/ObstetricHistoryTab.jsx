import React, { useState } from 'react';
import {
  Card,
  Button,
  Empty,
  Typography,
  Space,
  Table,
  Tag,
  Tooltip,
  Modal
} from 'antd';
import {
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  HeartOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const ObstetricHistoryTab = ({ visitId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const mockData = [
    {
      id: 1,
      pregnancy_number: 2,
      delivery_date: "2020-08-15",
      delivery_type: "Normal vaginal delivery",
      birth_weight: "3.2kg",
      complications: "None",
      outcome: "Live birth"
    },
    {
      id: 2,
      pregnancy_number: 3,
      delivery_date: "2022-05-20",
      delivery_type: "Cesarean section",
      birth_weight: "3.5kg",
      complications: "Gestational diabetes",
      outcome: "Live birth"
    }
  ];

  const columns = [
    {
      title: 'Pregnancy #',
      dataIndex: 'pregnancy_number',
      key: 'pregnancy_number',
      width: 100,
      render: (number) => (
        <Tag color="purple">P{number}</Tag>
      )
    },
    {
      title: 'Delivery Date',
      dataIndex: 'delivery_date',
      key: 'delivery_date',
      width: 120,
    },
    {
      title: 'Delivery Type',
      dataIndex: 'delivery_type',
      key: 'delivery_type',
      width: 150,
    },
    {
      title: 'Birth Weight',
      dataIndex: 'birth_weight',
      key: 'birth_weight',
      width: 100,
    },
    {
      title: 'Outcome',
      dataIndex: 'outcome',
      key: 'outcome',
      width: 100,
      render: (outcome) => (
        <Tag color={outcome === 'Live birth' ? 'green' : 'red'}>
          {outcome}
        </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleView(record)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  const handleView = (record) => {
    Modal.info({
      title: 'Obstetric History Details',
      content: (
        <div>
          <p><strong>Pregnancy Number:</strong> {record.pregnancy_number}</p>
          <p><strong>Delivery Date:</strong> {record.delivery_date}</p>
          <p><strong>Delivery Type:</strong> {record.delivery_type}</p>
          <p><strong>Birth Weight:</strong> {record.birth_weight}</p>
          <p><strong>Complications:</strong> {record.complications}</p>
          <p><strong>Outcome:</strong> {record.outcome}</p>
        </div>
      ),
      width: 600,
    });
  };

  const handleAddNew = () => {
    console.log('Add new obstetric history');
  };

  const handleEdit = (record) => {
    console.log('Edit obstetric record:', record);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Delete Obstetric History',
      content: 'Are you sure you want to delete this obstetric history record?',
      onOk: () => {
        console.log('Delete record:', id);
      }
    });
  };

  return (
    <div>
      <Card
        title={
          <Space>
            <HeartOutlined />
            <span>Obstetric History (OH)</span>
            <Button
              type="primary"
              size="small"
              icon={<PlusOutlined />}
              onClick={handleAddNew}
            >
              Add OH Record
            </Button>
          </Space>
        }
      >
        {mockData.length === 0 ? (
          <Empty
            description="No obstetric history recorded"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
              Add First OH Record
            </Button>
          </Empty>
        ) : (
          <Table
            columns={columns}
            dataSource={mockData}
            rowKey="id"
            pagination={false}
            size="small"
          />
        )}
      </Card>
    </div>
  );
};

export default ObstetricHistoryTab;