import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createImmunizationHistory,
  updateImmunizationHistory,
  deleteImmunizationHistory,
} from "../../../../redux/slice/ImmunizationHistorySlice";
import {
  Card,
  Empty,
  List,
  Button,
  Modal,
  Form,
  Switch,
  Popconfirm,
  message,
  Input
} from "antd";
import {
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const PatientImmunization = ({ data, patient_id, generalSubmit }) => {
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();

  const { loading } = useSelector((state) => state.immunization);

  const showModal = (record = null) => {
    if (record) {
      setIsEditing(true);
      setEditingRecord(record);
      form.setFieldsValue(record);
    } else {
      setIsEditing(false);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setIsEditing(false);
    setEditingRecord(null);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    try {
      if (isEditing) {
        await dispatch(
          updateImmunizationHistory({ id: editingRecord.id, updatedData: values })
        ).unwrap();
        message.success("Immunization history updated successfully!");
      } else {
        await dispatch(createImmunizationHistory({ ...values, patient_id })).unwrap();
        message.success("Immunization history added successfully!");
      }
      generalSubmit();
      closeModal();
    } catch (error) {
      message.error(error.message || "Something went wrong!");
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteImmunizationHistory(id)).unwrap();
      message.success("Immunization history deleted successfully!");
      generalSubmit();
    } catch (error) {
      message.error(error.message || "Failed to delete immunization history!");
    }
  };

  return (
    <Card
      title="Immunization History"
      bordered={false}
      extra={
        <Button
          type="primary"
          shape="circle"
          icon={<PlusCircleOutlined />}
          onClick={() => showModal()}
        />
      }
    >
      {data && data.length > 0 ? (
        <List
          itemLayout="horizontal"
          dataSource={data}
          renderItem={(item, index) => (
            <List.Item
              actions={[
                <Button icon={<EditOutlined />} onClick={() => showModal(item)} />,
                <Popconfirm
                  title="Are you sure to delete this immunization history?"
                  onConfirm={() => handleDelete(item.id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button danger icon={<DeleteOutlined />} />
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                title={`Record ${index + 1}`}
                description={`Recent Infections: ${item.recent_infections || "None"}`}
              />
            </List.Item>
          )}
        />
      ) : (
        <Empty description="No Immunization History Available" />
      )}

      <Modal
        title={isEditing ? "Edit Immunization History" : "Add Immunization History"}
        open={isModalVisible}
        onCancel={closeModal}
        onOk={() => form.submit()}
        okText={isEditing ? "Update" : "Save"}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="tetanus_vaccine" label="Tetanus Vaccine" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="rubella" label="Rubella" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="hepatitis_b" label="Hepatitis B" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="recent_infections" label="Recent Infections">
            <Input.TextArea placeholder="E.g., Flu, Pneumonia" />
          </Form.Item>
          <Form.Item name="hiv_syphilis_tested" label="HIV & Syphilis Tested" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default PatientImmunization;
