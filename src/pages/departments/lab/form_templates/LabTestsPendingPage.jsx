import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Tag, DatePicker, Select, Input, Space, Modal, Form, InputNumber } from 'antd';
import { SearchOutlined, ExperimentOutlined } from '@ant-design/icons';
import { fetchTestResults } from '../../../../redux/slice/labSlice';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

const LabTestsPendingPage = () => {
    const { results, loading } = useSelector((state) => state.lab);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentTest, setCurrentTest] = useState(null);
    const [formValues, setFormValues] = useState({});
    const [searchParams, setSearchParams] = useState({
        patientName: '',
        folderNumber: '',
        testName: '',
        dateRange: [],
    });
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchTestResults());
    }, [dispatch]);

    // Filter pending tests and format for display
    const pendingTests = results
        ?.filter(result => result.status === 'pending')
        ?.map(result => ({
            id: result.id, 
            patientName: `${result.visit?.patient?.first_name} ${result.visit?.patient?.middle_name || ''} ${result.visit?.patient?.last_name}` || 'Unknown',
            attendance_number: result.visit?.attendance_number || 'N/A',
            testName: result.template?.name || 'Unknown Test',
            requestedDate: moment(result.createdAt).format('YYYY-MM-DD HH:mm:ss'),
            status: result.status,
            originalData: result // Keep reference to original data
        })) || [];

    const handleEnterResults = (record) => {
        setCurrentTest(record.originalData);
        setIsModalVisible(true);
        // Initialize form values with empty strings for each field
        const initialValues = {};
        record.originalData.template?.fields?.forEach(field => {
            initialValues[field.id] = '';
        });
        setFormValues(initialValues);

    };

    const handleSearch = () => {
        // Implement search functionality here
        console.log('Searching with:', searchParams);
    };

    const handleReset = () => {
        setSearchParams({
            patientName: '',
            folderNumber: '',
            testName: '',
            dateRange: [],
        });
    };

    const handleFormChange = (fieldId, value) => {
        setFormValues(prev => ({
            ...prev,
            [fieldId]: value
        }));
    };

    const handleSubmitResults = () => {
        console.log('Submitting results:', formValues);
        // Here you would dispatch an action to save the results
        setIsModalVisible(false);
    };

    const renderFormField = (field) => {
        const commonProps = {
            value: formValues[field.id] || '',
            onChange: (e) => handleFormChange(field.id, e.target.value),
            required: field.required
        };

        switch (field.fieldType) {
            case 'number':
                return (
                    <InputNumber
                        {...commonProps}
                        style={{ width: '100%' }}
                        onChange={(value) => handleFormChange(field.id, value)}
                    />
                );
            case 'textarea':
                return <TextArea {...commonProps} rows={4} />;
            case 'select':
                return (
                    <Select {...commonProps} style={{ width: '100%' }}>
                        {field.options.map(option => (
                            <Option key={option} value={option}>{option}</Option>
                        ))}
                    </Select>
                );
            case 'checkbox':
            case 'radio':
                // Implement checkbox/radio group here
                return null;
            default: // text
                return <Input {...commonProps} />;
        }
    };

    const columns = [
        {
            title: 'Patient Name',
            dataIndex: 'patientName',
            key: 'patientName',
        },
        {
            title: 'Folder Number',
            dataIndex: 'folderNumber',
            key: 'folderNumber',
        },
        {
            title: 'Test Name',
            dataIndex: 'testName',
            key: 'testName',
        },
        {
            title: 'Requested Date',
            dataIndex: 'requestedDate',
            key: 'requestedDate',
            render: (date) => new Date(date).toLocaleString(),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'pending' ? 'orange' : 'green'}>
                    {status.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button
                    type="primary"
                    icon={<ExperimentOutlined />}
                    onClick={() => handleEnterResults(record)}
                >
                    Enter Results
                </Button>
            ),
        },
    ];

    return (
        <div className="lab-tests-pending">
            <Card title="Pending Lab Tests" bordered={false}>
                <div className="search-filters" style={{ marginBottom: 20 }}>
                    <Space size="middle" wrap>
                        <Input
                            placeholder="Patient Name"
                            value={searchParams.patientName}
                            onChange={(e) => setSearchParams({ ...searchParams, patientName: e.target.value })}
                            style={{ width: 200 }}
                        />
                        <Input
                            placeholder="Folder Number"
                            value={searchParams.folderNumber}
                            onChange={(e) => setSearchParams({ ...searchParams, folderNumber: e.target.value })}
                            style={{ width: 200 }}
                        />
                        <Input
                            placeholder="Test Name"
                            value={searchParams.testName}
                            onChange={(e) => setSearchParams({ ...searchParams, testName: e.target.value })}
                            style={{ width: 200 }}
                        />
                        <RangePicker
                            value={searchParams.dateRange}
                            onChange={(dates) => setSearchParams({ ...searchParams, dateRange: dates })}
                            style={{ width: 250 }}
                        />
                        <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                            Search
                        </Button>
                        <Button onClick={handleReset}>Reset</Button>
                    </Space>
                </div>

                <Table
                    columns={columns}
                    dataSource={pendingTests}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                />
            </Card>

            {/* Modal for entering test results */}
            {currentTest && (
                <Modal
                    title={`Enter Results - ${currentTest.template?.name}`}
                    visible={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    footer={[
                        <Button key="cancel" onClick={() => setIsModalVisible(false)}>
                            Cancel
                        </Button>,
                        <Button key="submit" type="primary" onClick={handleSubmitResults}>
                            Save Results
                        </Button>,
                    ]}
                    width={800}
                >
                    <div className="patient-info" style={{ marginBottom: 20 }}>
                        <p>
                            <strong>Patient:</strong> {currentTest.visit?.patient?.name || 'Unknown'}
                        </p>
                        <p>
                            <strong>Folder #:</strong> {currentTest.visit?.attendance_number || 'N/A'}
                        </p>
                        <p>
                            <strong>Test:</strong> {currentTest.template?.name}
                        </p>
                    </div>

                    <Form layout="vertical">
                        {currentTest.template?.fields
                            ?.slice() // Create a shallow copy of the array first
                            ?.sort((a, b) => a.order - b.order)
                            ?.map((field) => (
                                <Form.Item
                                    key={field.id}
                                    label={field.label}
                                    required={field.required}
                                    rules={[
                                        {
                                            required: field.required,
                                            message: `${field.label} is required`
                                        }
                                    ]}
                                >
                                    {renderFormField(field)}
                                </Form.Item>
                            ))}
                        <Form.Item label="Notes">
                            <TextArea
                                rows={4}
                                value={formValues.notes}
                                onChange={(e) => handleFormChange('notes', e.target.value)}
                            />
                        </Form.Item>
                    </Form>
                </Modal>
            )}
        </div>
    );
};

export default LabTestsPendingPage;