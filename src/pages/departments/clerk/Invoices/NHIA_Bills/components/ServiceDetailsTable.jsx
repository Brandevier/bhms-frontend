import React from 'react';
import { Table, Tag, Space, Badge } from 'antd';
import { 
    MedicineBoxOutlined,
    ExperimentOutlined,
    ToolOutlined,
    CalendarOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const ServiceDetailsTable = ({ services }) => {
    const getServiceTypeIcon = (type) => {
        const icons = {
            Medication: <MedicineBoxOutlined className="text-blue-500" />,
            LabTest: <ExperimentOutlined className="text-green-500" />,
            Procedure: <ToolOutlined className="text-purple-500" />,
        };
        return icons[type] || <MedicineBoxOutlined />;
    };

    const getServiceTypeColor = (type) => {
        const colors = {
            Medication: 'blue',
            LabTest: 'green',
            Procedure: 'purple',
        };
        return colors[type] || 'default';
    };

    const columns = [
        {
            title: 'Service Type',
            key: 'service_type',
            render: (record) => (
                <Space>
                    {getServiceTypeIcon(record.service_type)}
                    <Tag color={getServiceTypeColor(record.service_type)}>
                        {record.service_type}
                    </Tag>
                </Space>
            ),
            width: 150,
        },
        {
            title: 'Service Details',
            key: 'service_details',
            render: (record) => (
                <Space direction="vertical" size={0}>
                    <div className="font-medium">
                        {record.serviceDetails?.medication_id ? 'Medication' : 
                         record.serviceDetails?.test_id ? 'Lab Test' : 'Service'}
                    </div>
                    <div className="text-xs text-gray-500">
                        ID: {record.service_id}
                    </div>
                    {record.serviceDetails?.pharmacist_note && (
                        <div className="text-xs text-gray-600 mt-1">
                            Note: {record.serviceDetails.pharmacist_note}
                        </div>
                    )}
                </Space>
            ),
        },
        {
            title: 'NHIA Amount',
            dataIndex: 'nhia_amount',
            key: 'nhia_amount',
            render: (amount) => (
                <span className="font-semibold text-green-600">
                    ₵{parseFloat(amount || 0).toFixed(2)}
                </span>
            ),
            align: 'right',
            width: 120,
        },
        {
            title: 'Total Amount',
            dataIndex: 'total_amount',
            key: 'total_amount',
            render: (amount) => `₵${parseFloat(amount || 0).toFixed(2)}`,
            align: 'right',
            width: 120,
        },
        {
            title: 'Date',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (date) => (
                <Space>
                    <CalendarOutlined className="text-gray-400" />
                    <span className="text-sm">
                        {dayjs(date).format('MMM DD, YYYY')}
                    </span>
                </Space>
            ),
            width: 140,
        },
        {
            title: 'Status',
            key: 'status',
            render: (record) => (
                <Tag color={record.serviceDetails?.is_dispensed ? 'green' : 'blue'}>
                    {record.serviceDetails?.is_dispensed ? 'Dispensed' : 'Pending'}
                </Tag>
            ),
            align: 'center',
            width: 120,
        },
    ];

    const totalAmount = services?.reduce((sum, service) => 
        sum + parseFloat(service.nhia_amount || 0), 0
    ) || 0;

    return (
        <div>
            <Table
                columns={columns}
                dataSource={services || []}
                rowKey="id"
                pagination={false}
                size="small"
                summary={() => (
                    <Table.Summary>
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={0} colSpan={2}>
                                <strong>Total NHIA Coverage for Services</strong>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={1} align="right">
                                <strong className="text-lg text-green-600">
                                    ₵{totalAmount.toFixed(2)}
                                </strong>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={2} colSpan={3} />
                        </Table.Summary.Row>
                    </Table.Summary>
                )}
            />
            
            <div className="mt-3 p-2 bg-blue-50 rounded text-center">
                <Badge 
                    count={services?.length || 0} 
                    showZero 
                    style={{ backgroundColor: '#1890ff' }}
                />
                <span className="text-sm text-gray-600 ml-2">
                    service items for this patient
                </span>
            </div>
        </div>
    );
};

export default ServiceDetailsTable;