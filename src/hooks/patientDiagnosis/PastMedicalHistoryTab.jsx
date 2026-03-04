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
  Modal,
  message,
  Spin
} from 'antd';
import {
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  HistoryOutlined
} from '@ant-design/icons';

import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPastMedicalHistories,
  createPastMedicalHistory,
  updatePastMedicalHistory,
  deletePastMedicalHistory
} from '../../redux/slice/pastMedicalHistorySlice';

import PastMedicalHistoryFormModal from './modals/PastMedicalHistoryFormModal';

const { Title, Text } = Typography;

const PastMedicalHistoryTab = ({ visitId }) => {
  const dispatch = useDispatch();
  const { pastMedicalHistories, loading, error } = useSelector(
    (state) => state.pastMedicalHistory
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  // FETCH DATA
  useEffect(() => {
    if (visitId) {
      dispatch(fetchPastMedicalHistories(visitId));
    }
  }, [visitId, dispatch]);

  useEffect(() => {
    if (error) {
      message.error(error.message || 'Something went wrong');
    }
  }, [error]);

  // ADD / EDIT
  const handleSubmit = (values) => {
    if (editingRecord) {
      dispatch(
        updatePastMedicalHistory({
          id: editingRecord.id,
          payload: values
        })
      ).then(() => {
        message.success('Past medical history updated');
      });
    } else {
      dispatch(
        createPastMedicalHistory({
          ...values,
          visit_id: visitId
        })
      ).then(() => {
        message.success('Past medical history created');
      });
    }

    setModalOpen(false);
    setEditingRecord(null);
  };

  // DELETE
  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Delete Past Medical History',
      content: 'Are you sure you want to delete this medical history record?',
      okType: 'danger',
      onOk: () => {
        dispatch(deletePastMedicalHistory(id)).then(() => {
          message.success('Past medical history deleted');
        });
      }
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'orange';
      case 'controlled':
        return 'green';
      case 'resolved':
        return 'default';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: 'Medical Condition',
      dataIndex: 'condition',
      key: 'condition',
      render: (text) => (
        <Text strong style={{ color: '#722ed1' }}>
          {text}
        </Text>
      )
    },
    {
      title: 'Diagnosis Date',
      dataIndex: 'diagnosis_date',
      key: 'diagnosis_date',
      width: 120,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status?.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Treatment',
      dataIndex: 'treatment',
      key: 'treatment',
      width: 150,
      ellipsis: true,
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
              onClick={() =>
                Modal.info({
                  title: 'Past Medical History Details',
                  content: (
                    <div>
                      <p><strong>Condition:</strong> {record.condition}</p>
                      <p><strong>Diagnosis Date:</strong> {record.diagnosis_date || 'N/A'}</p>
                      <p><strong>Status:</strong> {record.status}</p>
                      <p><strong>Treatment:</strong> {record.treatment || 'N/A'}</p>
                      <p><strong>Notes:</strong> {record.notes || 'N/A'}</p>
                    </div>
                  ),
                  width: 600,
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
    <div>
      <Card
        title={
          <Space>
            <HistoryOutlined />
            <span>Past Medical History (PMH)</span>
            <Button
              type="primary"
              size="small"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingRecord(null);
                setModalOpen(true);
              }}
            >
              Add PMH
            </Button>
          </Space>
        }
      >
        {loading ? (
          <Spin />
        ) : pastMedicalHistories.length === 0 ? (
          <Empty
            description="No past medical history recorded"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setModalOpen(true)}
            >
              Add First PMH Record
            </Button>
          </Empty>
        ) : (
          <Table
            columns={columns}
            dataSource={pastMedicalHistories}
            rowKey="id"
            pagination={false}
            size="small"
          />
        )}
      </Card>

      <PastMedicalHistoryFormModal
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          setEditingRecord(null);
        }}
        onSubmit={handleSubmit}
        initialValues={editingRecord}
        loading={loading}
      />
    </div>
  );
};

export default PastMedicalHistoryTab;

