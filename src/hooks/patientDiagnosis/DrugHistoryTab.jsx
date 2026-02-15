import React, { useEffect, useState } from "react";
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
} from "antd";
import {
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  MedicineBoxOutlined
} from "@ant-design/icons";

import { useDispatch, useSelector } from "react-redux";
import {
  fetchDrugHistories,
  createDrugHistory,
  updateDrugHistory,
  deleteDrugHistory
} from "../../redux/slice/drugHistorySlice";

import DrugHistoryFormModal from "./modals/DrugHistoryFormModal";

const { Text } = Typography;

const DrugHistoryTab = ({ visitId }) => {
  const dispatch = useDispatch();
  const { drugHistories, loading, error } = useSelector(
    (state) => state.drugHistory
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  // FETCH DATA
  useEffect(() => {
    if (visitId) {
      dispatch(fetchDrugHistories(visitId));
    }
  }, [visitId, dispatch]);

  useEffect(() => {
    if (error) {
      message.error(error.message || "Something went wrong");
    }
  }, [error]);

  // ADD / EDIT
  const handleSubmit = (values) => {
    if (editingRecord) {
      dispatch(
        updateDrugHistory({
          id: editingRecord.id,
          payload: values
        })
      ).then(() => {
        message.success("Drug history updated");
      });
    } else {
      dispatch(
        createDrugHistory({
          ...values,
          visit_id: visitId
        })
      ).then(() => {
        message.success("Drug history created");
      });
    }

    setModalOpen(false);
    setEditingRecord(null);
  };

  // DELETE
  const handleDelete = (id) => {
    Modal.confirm({
      title: "Delete Drug History",
      content: "Are you sure you want to delete this record?",
      okType: "danger",
      onOk: () => {
        dispatch(deleteDrugHistory(id)).then(() => {
          message.success("Drug history deleted");
        });
      }
    });
  };

  const columns = [
    {
      title: "Drug Name",
      dataIndex: "drug_name",
      render: (text) => (
        <Text strong style={{ color: "#f5222d" }}>
          {text}
        </Text>
      )
    },
    {
      title: "Dosage",
      dataIndex: "dosage"
    },
    {
      title: "Frequency",
      dataIndex: "frequency"
    },
    {
      title: "Status",
      render: (_, record) => (
        <Tag color={record.end_date ? "default" : "blue"}>
          {record.end_date ? "PAST" : "CURRENT"}
        </Tag>
      )
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="View">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() =>
                Modal.info({
                  title: "Drug History Details",
                  content: (
                    <>
                      <p><b>Drug:</b> {record.drug_name}</p>
                      <p><b>Dosage:</b> {record.dosage}</p>
                      <p><b>Frequency:</b> {record.frequency}</p>
                      <p><b>Route:</b> {record.route}</p>
                      <p><b>Indication:</b> {record.indication}</p>
                      <p><b>Start:</b> {record.start_date}</p>
                      <p><b>End:</b> {record.end_date || "Ongoing"}</p>
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
            <MedicineBoxOutlined />
            <span>Drug History (DH)</span>
            <Button
              type="primary"
              size="small"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingRecord(null);
                setModalOpen(true);
              }}
            >
              Add Drug
            </Button>
          </Space>
        }
      >
        {loading ? (
          <Spin />
        ) : drugHistories.length === 0 ? (
          <Empty
            description="No drug history recorded"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setModalOpen(true)}
            >
              Add First Drug Record
            </Button>
          </Empty>
        ) : (
          <Table
            columns={columns}
            dataSource={drugHistories}
            rowKey="id"
            pagination={false}
            size="small"
          />
        )}
      </Card>

      <DrugHistoryFormModal
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

export default DrugHistoryTab;
