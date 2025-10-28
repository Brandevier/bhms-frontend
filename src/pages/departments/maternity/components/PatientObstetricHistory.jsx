import React, { useState } from "react";
import { Card, List, Button, Modal, Form, InputNumber, Switch, Input, message, Popconfirm } from "antd";
import { PlusCircleOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { createObstetricHistory, updateObstetricHistory, deleteObstetricHistory } from "../../../../redux/slice/obstetricHistorySlice";

const PatientObstetricHistory = ({ data, patient_id,generalSubmit }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingHistory, setEditingHistory] = useState(null);
    const [form] = Form.useForm();
    const { loading } = useSelector((state) => state.patientObstetricHistory);
    const dispatch = useDispatch();

    // Show modal (for Add/Edit)
    const showModal = (history = null) => {
        setEditingHistory(history);
        if (history) {
            form.setFieldsValue(history);
        } else {
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    // Close modal
    const closeModal = () => {
        setIsModalVisible(false);
        setEditingHistory(null);
        form.resetFields();
    };

    // Handle form submission
    const handleSubmit = async (values) => {
        try {
            if (editingHistory) {
                await dispatch(updateObstetricHistory({ id: editingHistory.id, ...values })).unwrap();
                message.success("Obstetric history updated successfully");
            } else {
                await dispatch(createObstetricHistory({ ...values, patient_id })).unwrap();
                message.success("Obstetric history added successfully");
            }
            generalSubmit()
            closeModal();
        } catch (error) {
            message.error(error.message || "Failed to save obstetric history");
        }
    };

    // Handle delete
    const handleDelete = async (id) => {
        try {
            await dispatch(deleteObstetricHistory(id)).unwrap();
            message.success("Obstetric history deleted successfully");
            generalSubmit()
        } catch (error) {
            message.error(error.message || "Failed to delete");
        }
    };

    return (
        <Card
            title="Obstetric History"
            bordered={false}
            extra={
                <Button type="primary" shape="circle" icon={<PlusCircleOutlined />} onClick={() => showModal()} />
            }
        >
            {data && data.length > 0 ? (
                <List
                    itemLayout="horizontal"
                    dataSource={data}
                    renderItem={(item, index) => (
                        <List.Item
                            actions={[
                                <Button type="link" icon={<EditOutlined />} onClick={() => showModal(item)}>
                                    Edit
                                </Button>,
                                <Popconfirm
                                    title="Are you sure to delete this record?"
                                    onConfirm={() => handleDelete(item.id)}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button type="link" danger icon={<DeleteOutlined />}>
                                        Delete
                                    </Button>
                                </Popconfirm>,
                            ]}
                        >
                            <List.Item.Meta
                                title={`Pregnancy ${index + 1}`}
                                description={
                                    <>
                                        <p><strong>Gravida:</strong> {item.gravida}</p>
                                        <p><strong>Parity:</strong> {item.parity}</p>
                                        <p><strong>Miscarriages:</strong> {item.miscarriages || 0}</p>
                                        <p><strong>Stillbirths:</strong> {item.stillbirths || 0}</p>
                                        <p><strong>C-Section:</strong> {item.c_section ? "Yes" : "No"}</p>
                                        <p><strong>Complications:</strong> {item.complications || "None"}</p>
                                    </>
                                }
                            />
                        </List.Item>
                    )}
                />
            ) : (
                <p style={{ textAlign: "center", color: "#aaa" }}>No Obstetric History Available</p>
            )}

            {/* Add/Edit Modal */}
            <Modal
                title={editingHistory ? "Edit Obstetric History" : "Add Obstetric History"}
                open={isModalVisible}
                onCancel={closeModal}
                onOk={() => form.submit()}
                okText={loading ? "Saving..." : "Save"}
                confirmLoading={loading}
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item name="gravida" label="Gravida" rules={[{ required: true, message: "Please enter gravida" }]}>
                        <InputNumber placeholder="Number of times pregnant" style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item name="parity" label="Parity" rules={[{ required: true, message: "Please enter parity" }]}>
                        <InputNumber placeholder="Number of births" style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item name="miscarriages" label="Miscarriages">
                        <InputNumber placeholder="Number of miscarriages" style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item name="stillbirths" label="Stillbirths">
                        <InputNumber placeholder="Number of stillbirths" style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item name="c_section" label="C-Section" valuePropName="checked">
                        <Switch />
                    </Form.Item>

                    <Form.Item name="complications" label="Complications">
                        <Input.TextArea placeholder="Any complications?" />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default PatientObstetricHistory;
