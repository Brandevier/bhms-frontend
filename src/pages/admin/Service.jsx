import React, { useEffect, useState } from "react";
import { Table, Button, Tooltip, Input, Modal, Form, message } from "antd";
import { InfoCircleOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchServices, createService, updatePatientInvoice, deleteService } from "../../redux/slice/serviceSlice";
import BhmsButton from "../../heroComponents/BhmsButton";


const Service = () => {
    const dispatch = useDispatch();
    const { services, loading } = useSelector((state) => state.service);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        dispatch(fetchServices()); // Fetch services on component mount
    }, [dispatch]);

    // Show Modal to Add or Edit Service
    const showModal = (service = null) => {
        setEditingService(service);
        form.setFieldsValue(service || { name: "", description: "", cost: "" });
        setIsModalOpen(true);
    };

    // Handle Submit (Create or Update)
    const handleSubmit = () => {
        form.validateFields()
            .then((values) => {
                if (editingService) {
                    dispatch(updatePatientInvoice({ id: editingService.id, ...values }))
                        .unwrap()
                        .then(() => message.success("Service updated successfully"))
                        .catch(() => message.error("Failed to update service"));
                } else {
                    dispatch(createService(values))
                        .unwrap()
                        .then(function () {
                            dispatch(fetchServices());
                            return message.success("Service created successfully");
                        })
                        .catch(() => message.error("Failed to create service"));
                }
                setIsModalOpen(false);
                form.resetFields();
            });
    };

    // Handle Delete Service
    const handleDelete = (id) => {
        Modal.confirm({
            title: "Are you sure you want to delete this service?",
            okText: "Yes",
            okType: "danger",
            cancelText: "No",
            onOk: () => {
                dispatch(deleteService(id))
                    .unwrap()
                    .then(() => message.success("Service deleted"))
                    .catch(() => message.error("Failed to delete service"));
            },
        });
    };

    const columns = [
        {
            title: "Service Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            render: (text) => (
                <Tooltip title={text}>
                    <InfoCircleOutlined style={{ color: "#1890ff", cursor: "pointer" }} />
                </Tooltip>
            ),
        },
        {
            title: "Cost (GHC)",
            dataIndex: "cost",
            key: "cost",
            render: (cost) => `${cost?.toFixed(2)}`,
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <>
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => showModal(record)}
                    />
                    <Button
                        type="link"
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() => handleDelete(record.id)}
                    />
                </>
            ),
        },
    ];

    return (
        <div style={{ padding: 20 }}>
            <div className="flex justify-between w-full mb-10">
                {/* Title with Info Icon */}
                <Tooltip title="These are services rendered by your institution. Each service has a predefined cost.">
                    <h2 style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                        Institution Services
                        <InfoCircleOutlined style={{ color: "#1890ff", cursor: "pointer" }} />
                    </h2>
                </Tooltip>
                {/* Add Service Button */}
                <BhmsButton
                    block={false}
                    size="medium"
                    icon={<PlusOutlined />}
                    onClick={() => showModal()}
                    style={{ float: "right" }} // Aligns button to the right
                >
                    Add Service
                </BhmsButton>
            </div>



            {/* Services Table */}
            <Table
                columns={columns}
                dataSource={services}
                loading={loading}
                rowKey="id"
                pagination={{ pageSize: 10 }}
            />

            {/* Modal for Adding/Editing Services */}
            <Modal
                title={editingService ? "Edit Service" : "Add Service"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)} 
                onOk={handleSubmit}
                okText={editingService ? "Update" : "Create"}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Service Name" rules={[{ required: true, message: "Please enter service name" }]}>
                        <Input placeholder="Enter service name" />
                    </Form.Item>
                    <Form.Item name="description" label="Description" rules={[{ required: true, message: "Please enter description" }]}>
                        <Input.TextArea placeholder="Enter service description" />
                    </Form.Item>
                    <Form.Item name="cost" label="Cost (GHC)" rules={[{ required: true, message: "Please enter cost" }]}>
                        <Input type="number" placeholder="Enter cost" min={0} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Service;
