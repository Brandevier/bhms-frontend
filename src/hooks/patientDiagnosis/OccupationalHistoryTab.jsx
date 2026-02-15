import React, { useEffect, useState } from 'react';
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
  EyeInvisibleOutlined
} from '@ant-design/icons';

import { useDispatch, useSelector } from 'react-redux';
import {
  fetchOccupations,
  createOccupation,
  updateOccupation,
  deleteOccupation
} from '../../redux/slice/occupationHistorySlice';




import OccupationFormModal from './modals/OccupationFormModal';

const { Text } = Typography;

const OccupationalHistoryTab = ({ visitId }) => {
  const dispatch = useDispatch();
  const { occupations, loading } = useSelector(
    (state) => state.occupationHistory
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  // FETCH DATA
  useEffect(() => {
    if (visitId) {
      dispatch(fetchOccupations(visitId));
    }
  }, [visitId, dispatch]);

  // ADD / EDIT SUBMIT
  const handleSubmit = (values) => {
    if (editingRecord) {
      dispatch(updateOccupation({
        id: editingRecord.id,
        payload: values
      }));
    } else {
      dispatch(createOccupation({
        ...values,
        visit_id: visitId
      }));
    }

    setModalOpen(false);
    setEditingRecord(null);
  };

  // DELETE
  const handleDelete = (id) => {
    Modal.confirm({
      title: "Delete Occupational History",
      content: "Are you sure you want to delete this record?",
      okType: "danger",
      onOk: () => dispatch(deleteOccupation(id))
    });
  };

  const columns = [
    {
      title: 'Occupation',
      dataIndex: 'occupation',
      render: (text) => (
        <Text strong style={{ color: '#fa8c16' }}>
          {text}
        </Text>
      )
    },
    {
      title: 'Employer',
      dataIndex: 'employer',
    },
    {
      title: 'Start Date',
      dataIndex: 'start_date',
    },
    {
      title: 'End Date',
      dataIndex: 'end_date',
    },
    {
      title: 'Status',
      dataIndex: 'current',
      render: (current) => (
        <Tag color={current ? 'green' : 'default'}>
          {current ? 'Current' : 'Past'}
        </Tag>
      )
    },
    {
      title: 'Actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="View">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() =>
                Modal.info({
                  title: 'Occupational Details',
                  content: (
                    <>
                      <p><b>Occupation:</b> {record.occupation}</p>
                      <p><b>Employer:</b> {record.employer}</p>
                      <p><b>Exposure:</b> {record.exposure}</p>
                      <p><b>Hazards:</b> {record.hazards}</p>
                    </>
                  )
                })
              }
            />
          </Tooltip>

          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => {
                setEditingRecord(record);
                setModalOpen(true);
              }}
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

  return (
    <>
      <Card
        title={
          <Space>
            <EyeInvisibleOutlined />
            <span>Occupational History (ODQ)</span>
            <Button
              type="primary"
              size="small"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingRecord(null);
                setModalOpen(true);
              }}
            >
              Add Occupation
            </Button>
          </Space>
        }
      >
        {occupations.length === 0 ? (
          <Empty
            description="No occupational history recorded"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setModalOpen(true)}
            >
              Add First Occupation
            </Button>
          </Empty>
        ) : (
          <Table
            columns={columns}
            dataSource={occupations}
            rowKey="id"
            loading={loading}
            pagination={false}
            size="small"
          />
        )}
      </Card>

      <OccupationFormModal
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          setEditingRecord(null);
        }}
        onSubmit={handleSubmit}
        initialValues={editingRecord}
        loading={loading}
      />
    </>
  );
};

export default OccupationalHistoryTab;
