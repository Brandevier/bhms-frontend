import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import {
  createMedicalHistory,
  updateMedicalHistory,
  deleteMedicalHistory,
} from "../../../../redux/slice/medicalHistorySlice";
import {
  Card,
  Empty,
  List,
  Button,
  Modal,
  Form,
  Input,
  Switch,
  Popconfirm,
  message,
  Spin,
} from "antd";
import {
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const PatientMedicalHistory = ({ data, patient_id, generalSubmit }) => {
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();

  const { loading } = useSelector((state) => state.medicalHistory);

  // Show modal for adding or editing
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

  // Close modal
  const closeModal = () => {
    setIsModalVisible(false);
    setIsEditing(false);
    setEditingRecord(null);
    form.resetFields();
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      if (isEditing) {
        await dispatch(
          updateMedicalHistory({ id: editingRecord.id, updatedData: values })
        ).unwrap();
        message.success("Medical history updated successfully!");
      } else {
        await dispatch(createMedicalHistory({ ...values, patient_id })).unwrap();
        message.success("Medical history added successfully!");
      }
      generalSubmit();
      closeModal();
    } catch (error) {
      message.error(error.message || "Something went wrong!");
    }
  };

  // Handle delete medical history
  const handleDelete = async (id) => {
    try {
      await dispatch(deleteMedicalHistory(id)).unwrap();
      message.success("Medical history deleted successfully!");
      generalSubmit();
    } catch (error) {
      message.error(error.message || "Failed to delete medical history!");
    }
  };

  return (
    <Card
      title="Medical History"
      bordered={false}
      extra={
        <Button
          type="primary"
          shape="circle"
          icon={<PlusCircleOutlined />}
          onClick={() => showModal()}
          disabled={loading}
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
                <Button
                  icon={<EditOutlined />}
                  onClick={() => showModal(item)}
                  disabled={loading}
                />,
                <Popconfirm
                  title="Are you sure to delete this medical history?"
                  onConfirm={() => handleDelete(item.id)}
                  okText="Yes"
                  cancelText="No"
                  disabled={loading}
                >
                  <Button danger icon={<DeleteOutlined />} disabled={loading} />
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                title={`Condition ${index + 1}`}
                description={
                  <>
                    <p><strong>Chronic Conditions:</strong> {item.chronic_conditions || "N/A"}</p>
                    <p><strong>Past Surgeries:</strong> {item.past_surgeries || "N/A"}</p>
                    <p><strong>Blood Transfusions:</strong> {item.blood_transfusions ? "Yes" : "No"}</p>
                    <p><strong>Allergies:</strong> {item.allergies || "N/A"}</p>
                    <p><strong>Medications:</strong> {item.medications || "N/A"}</p>
                    <p style={{ fontSize: "12px", color: "gray" }}>
                      <strong>Updated:</strong> {moment(item.updatedAt).fromNow()}
                    </p>
                  </>
                }
              />
            </List.Item>
          )}
        />
      ) : (
        <Empty description="No Medical History Available" />
      )}

      {/* Modal for Add / Edit Medical History */}
      <Modal
        title={isEditing ? "Edit Medical History" : "Add Medical History"}
        open={isModalVisible}
        onCancel={closeModal}
        onOk={() => form.submit()}
        okText={isEditing ? "Update" : "Save"}
        confirmLoading={loading} // Show loading spinner while submitting
      >
        <Spin spinning={loading}>
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item name="chronic_conditions" label="Chronic Conditions">
              <Input.TextArea placeholder="E.g., Diabetes, Hypertension" />
            </Form.Item>

            <Form.Item name="past_surgeries" label="Past Surgeries">
              <Input.TextArea placeholder="E.g., Appendectomy, Knee Surgery" />
            </Form.Item>

            <Form.Item
              name="blood_transfusions"
              label="Blood Transfusions"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item name="allergies" label="Allergies">
              <Input.TextArea placeholder="E.g., Penicillin, Nuts" />
            </Form.Item>

            <Form.Item name="medications" label="Medications">
              <Input.TextArea placeholder="E.g., Insulin, Aspirin" />
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </Card>
  );
};

export default PatientMedicalHistory;
