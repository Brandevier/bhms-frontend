import React from 'react';
import { Table, Tag, Space, Badge, Button, Tooltip,Card } from 'antd';
import { 
    UserOutlined, 
    FileTextOutlined, 
    EyeOutlined,
    InsuranceOutlined
} from '@ant-design/icons';
import ServiceDetailsTable from './ServiceDetailsTable';

const ClaimsTable = ({ nhiaClaims, onViewDetails, loading }) => {
    // Format patient name from patient object or patientName
    const formatPatientName = (record) => {
        if (record.patientName) return record.patientName;
        if (record.patient) {
            const { first_name, middle_name, last_name } = record.patient;
            return [first_name, middle_name, last_name].filter(Boolean).join(' ');
        }
        return 'Unknown Patient';
    };

    // Calculate age from date of birth
    const calculateAge = (dateOfBirth) => {
        if (!dateOfBirth) return 'N/A';
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    // Format gender
    const formatGender = (gender) => {
        return gender === 'M' ? 'Male' : gender === 'F' ? 'Female' : 'Other';
    };

    const columns = [
        {
            title: 'Patient Information',
            key: 'patient',
            render: (record) => (
                <Space direction="vertical" size={2}>
                    <div className="flex items-center">
                        <UserOutlined className="text-blue-500 mr-2" />
                        <span className="font-semibold">{formatPatientName(record)}</span>
                        <Tag color="blue" className="ml-2 text-xs">
                            {record.patient?.folder_number || 'N/A'}
                        </Tag>
                    </div>
                    <div className="text-xs text-gray-500">
                        {formatGender(record.patient?.gender)} • {calculateAge(record.patient?.date_of_birth)} years
                    </div>
                    <div className="text-xs">
                        <Tag 
                            color={record.patient?.has_insurance ? 'green' : 'orange'} 
                            size="small"
                            icon={record.patient?.has_insurance ? <InsuranceOutlined /> : null}
                        >
                            {record.services?.[0].patient?.has_insurance ? 'Insured' : 'No Insurance'}
                        </Tag>
                        <Tag 
                            color={record.patient?.status === 'active' ? 'green' : 'red'} 
                            size="small"
                        >
                            {record.services?.[0].patient?.status || 'Unknown'}
                        </Tag>
                    </div>
                </Space>
            ),
            fixed: 'left',
            width: 280,
        },
        {
            title: 'Service Claims',
            key: 'claims',
            render: (record) => (
                <Space direction="vertical" size={2} align="center">
                    <Badge 
                        count={record.services?.length || 0} 
                        showZero 
                        style={{ 
                            backgroundColor: '#1890ff',
                            fontSize: '12px'
                        }}
                    />
                    <div className="text-xs text-gray-500">
                        Service Items
                    </div>
                </Space>
            ),
            align: 'center',
            width: 120,
        },
        {
            title: 'Total Claim Amount',
            key: 'amount',
            render: (record) => (
                <Space direction="vertical" size={2} align="center">
                    <div className="text-lg font-bold text-green-600">
                        ₵{(record.total_nhia_amount || 0).toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">
                        NHIA Coverage
                    </div>
                </Space>
            ),
            align: 'center',
            sorter: (a, b) => (a.total_nhia_amount || 0) - (b.total_nhia_amount || 0),
            width: 150,
        },
        {
            title: 'Insurance Status',
            key: 'insurance',
            render: (record) => (
                <Space direction="vertical" size={2} align="center">
                    {record.patient?.has_insurance ? (
                        <Tag icon={<InsuranceOutlined />} color="green">
                            Active Coverage
                        </Tag>
                    ) : (
                        <Tag color="orange">No NHIA Coverage</Tag>
                    )}
                    <div className="text-xs text-gray-500">
                        {record.patient?.has_insurance ? 'Eligible' : 'Self-Pay'}
                    </div>
                </Space>
            ),
            align: 'center',
            width: 160,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (record) => (
                <Space>
                    <Tooltip title="View Detailed Claims">
                        <Button 
                            type="primary" 
                            icon={<EyeOutlined />}
                            size="small"
                            onClick={() => onViewDetails(record)}
                        >
                            Details
                        </Button>
                    </Tooltip>
                    <Tooltip title="Process Claims">
                        <Button 
                            type="default"
                            size="small"
                            disabled={!record.patient?.has_insurance}
                        >
                            Process
                        </Button>
                    </Tooltip>
                </Space>
            ),
            align: 'center',
            fixed: 'right',
            width: 180,
        },
    ];

    // Expanded row renderer for service details
    const expandedRowRender = (record) => {
        return (
            <div className="p-4 bg-gray-50">
                <h4 className="font-semibold mb-3">Service Details</h4>
                <ServiceDetailsTable services={record.services} />
            </div>
        );
    };

    return (
        <Card 
            title={
                <Space>
                    <FileTextOutlined />
                    Patient Claims Summary
                    <Badge 
                        count={nhiaClaims?.length || 0} 
                        showZero 
                        style={{ backgroundColor: '#1890ff' }}
                    />
                </Space>
            }
            className="shadow-lg"
            extra={
                <Space>
                    <span className="text-sm text-gray-500">
                        Total Claims: ₵{(nhiaClaims || []).reduce((sum, claim) => sum + (claim.total_nhia_amount || 0), 0).toFixed(2)}
                    </span>
                </Space>
            }
        >
            <Table
                columns={columns}
                dataSource={nhiaClaims || []}
                rowKey="patient_id"
                loading={loading}
                expandable={{
                    expandedRowRender,
                    rowExpandable: (record) => record.services && record.services.length > 0,
                    expandIcon: ({ expanded, onExpand, record }) =>
                        record.services && record.services.length > 0 ? (
                            <Button 
                                type="link" 
                                onClick={(e) => onExpand(record, e)}
                                style={{ padding: 0 }}
                            >
                                {expanded ? '▲ Hide Services' : '▼ Show Services'}
                            </Button>
                        ) : null,
                }}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => 
                        `${range[0]}-${range[1]} of ${total} patients`
                }}
                scroll={{ x: 1000 }}
                size="middle"
            />
        </Card>
    );
};

export default ClaimsTable;