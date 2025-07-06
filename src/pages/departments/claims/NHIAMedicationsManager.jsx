import React, { useEffect, useState } from 'react';
import {
    Table, Button, Card, Tag, Space, Modal, Form, Input,
    Select, Divider, notification, Popconfirm, Typography,
    Row, Col, Statistic, Badge, InputNumber, DatePicker
} from 'antd';
import {
    PlusOutlined, EditOutlined, DeleteOutlined,
    SearchOutlined, SyncOutlined, MedicineBoxOutlined,
    DollarOutlined, BarcodeOutlined, FormOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';

import {

    fetchMedications, createMedication,
    updateMedication, deleteMedication,
    selectAllMedications, selectPagination,
    selectLoading, selectError, resetCurrentMedication
} from '../../../redux/slice/nhia_medicationsSlice';


const { Title, Text } = Typography;
const { Option } = Select;

const NHIAMedicationsManager = () => {
    const dispatch = useDispatch();
    const medications = useSelector(selectAllMedications);
    const pagination = useSelector(selectPagination);
    const loading = useSelector(selectLoading);
    const error = useSelector(selectError);
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingMed, setEditingMed] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Columns configuration
    const columns = [
        {
            title: 'Code',
            dataIndex: 'code',
            key: 'code',
            width: 120,
            render: (code) => <Tag icon={<BarcodeOutlined />} color="blue">{code}</Tag>,
            sorter: (a, b) => a.code.localeCompare(b.code),
        },
        {
            title: 'Medication Name',
            dataIndex: 'generic_name',
            key: 'generic_name',
            render: (text) => <Text strong>{text}</Text>,
        },
        {
            title: 'Unit of Pricing',
            dataIndex: 'unit_of_pricing', // Must match API response field
            key: 'unit_of_pricing',
            render: (text) => (
                <Space>
                    {text ? (
                        <Tag color="blue">{text}</Tag>
                    ) : (
                        <Text type="secondary">Not specified</Text>
                    )}
                </Space>
            ),
        },
        {
            title: 'Price (GHS)',
            dataIndex: 'price_ghc',
            key: 'price_ghc',
            align: 'right',
            render: (price_gh) => (
                <Statistic
                    value={price_gh}
                    precision={2}
                    prefix={<DollarOutlined />}
                    valueStyle={{ fontSize: 14 }}
                />
            ),
            sorter: (a, b) => a.price - b.price,
        },
        {
            title: 'Prescribing Level',
            dataIndex: 'prescribing_level',
            key: 'prescribing_level',
            width: 150,
            render: (level) => level ? <Tag color="geekblue">{level}</Tag> : '-',
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 120,
            render: (_, record) => (
                <Space>
                    <Button
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    />
                    <Popconfirm
                        title="Delete this medication?"
                        onConfirm={() => dispatch(deleteMedication(record.code))}
                    >
                        <Button
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                            loading={loading}
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    // Filter medications based on search
    const filteredMeds = medications.filter(med =>
        med.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (med.form && med.form.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Handle form submission
    const handleSubmit = () => {
        form.validateFields()
            .then(values => {
                if (editingMed) {
                    dispatch(updateMedication({ code: editingMed.code, ...values }));
                } else {
                    dispatch(createMedication(values));
                }
                setIsModalVisible(false);
                form.resetFields();
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    };

    // Edit medication handler
    const handleEdit = (medication) => {
        setEditingMed(medication);
        form.setFieldsValue(medication);
        setIsModalVisible(true);
    };

    // Reset modal
    const handleModalClose = () => {
        setIsModalVisible(false);
        setEditingMed(null);
        form.resetFields();
        dispatch(resetCurrentMedication());
    };

    // Notification for errors
    useEffect(() => {
        if (error) {
            notification.error({
                message: 'Operation Failed',
                description: error.message || error,
                placement: 'bottomRight',
            });
        }
    }, [error]);

    // Initial data load
    useEffect(() => {
        dispatch(fetchMedications({ page: 1, pageSize: 10 }));
    }, [dispatch]);

    return (
        <div className="nhia-medications-manager" style={{ padding: 24 }}>
            {/* Header Card */}
            <Card
                bordered={false}
                title={
                    <Space>
                        <MedicineBoxOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                        <Title level={4} style={{ margin: 0 }}>NHIA Medications</Title>
                    </Space>
                }
                extra={
                    <Space>
                        <Input
                            placeholder="Search medications..."
                            prefix={<SearchOutlined />}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: 250 }}
                            allowClear
                        />
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => setIsModalVisible(true)}
                        >
                            Add Medication
                        </Button>
                        <Button
                            icon={<SyncOutlined />}
                            onClick={() => dispatch(fetchMedications({
                                page: pagination.currentPage,
                                pageSize: pagination.pageSize
                            }))}
                        />
                    </Space>
                }
            >
                {/* Summary Stats */}
                <Row gutter={16} style={{ marginBottom: 24 }}>
                    <Col span={6}>
                        <Card size="small">
                            <Statistic
                                title="Total Medications"
                                value={pagination.totalItems}
                                prefix={<MedicineBoxOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card size="small">
                            <Statistic
                                title="Average Price"
                                value={medications.reduce((sum, med) => sum + med.price, 0) / medications.length || 0}
                                precision={2}
                                prefix={<DollarOutlined />}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Medications Table */}
                <Table
                    columns={columns}
                    dataSource={filteredMeds}
                    rowKey="code"
                    loading={loading}
                    pagination={{
                        current: pagination.currentPage,
                        pageSize: pagination.pageSize,
                        total: pagination.totalItems,
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '50', '100'],
                        onChange: (page, pageSize) => {
                            dispatch(fetchMedications({ page, pageSize }));
                        }
                    }}
                    scroll={{ x: 1200 }}
                />
            </Card>

            {/* Add/Edit Medication Modal */}
            <Modal
                title={
                    <Space>
                        <FormOutlined />
                        {editingMed ? 'Edit Medication' : 'Add New Medication'}
                    </Space>
                }
                visible={isModalVisible}
                onOk={handleSubmit}
                onCancel={handleModalClose}
                confirmLoading={loading}
                width={700}
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{ prescribing_level: 'C' }}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="code"
                                label="Medication Code"
                                rules={[
                                    { required: true, message: 'Please input the medication code!' },
                                    { pattern: /^[A-Z0-9]+$/, message: 'Only uppercase letters and numbers allowed' }
                                ]}
                            >
                                <Input
                                    placeholder="e.g. ACETAZIN1"
                                    disabled={!!editingMed}
                                    prefix={<BarcodeOutlined />}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="name"
                                label="Medication Name"
                                rules={[{ required: true, message: 'Please input the medication name!' }]}
                            >
                                <Input placeholder="e.g. Acetazolamide" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="form"
                                label="Formulation"
                            >
                                <Input placeholder="e.g. Injection, 500 mg" />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name="unit"
                                label="Unit"
                            >
                                <Input placeholder="e.g. Ampoule" />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name="price"
                                label="Price (GHS)"
                                rules={[
                                    { required: true, message: 'Please input the price!' },
                                    { type: 'number', min: 0, message: 'Price must be positive' }
                                ]}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    min={0}
                                    step={0.01}
                                    precision={2}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="prescribing_level"
                        label="Prescribing Level"
                    >
                        <Select placeholder="Select level">
                            <Option value="A">A - General</Option>
                            <Option value="B1">B1 - Specialist Initiation</Option>
                            <Option value="B2">B2 - Specialist Continuation</Option>
                            <Option value="C">C - Hospital Specialist</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default NHIAMedicationsManager;