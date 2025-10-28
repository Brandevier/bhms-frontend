import React from 'react';
import { Table, Button, Tag, Badge, Tooltip } from 'antd';
import { ExperimentOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
import moment from 'moment';

const LabTestsTable = ({ data, loading, onEnterResults }) => {
    const columns = [
        {
            title: 'Patient Information',
            key: 'patient',
            width: 200,
            render: (_, record) => (
                <div className="flex flex-col">
                    <div className="flex items-center font-medium text-gray-900">
                        <UserOutlined className="mr-1 text-gray-400" />
                        {record.patientName}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                        Att. #{record.attendanceNumber}
                    </div>
                </div>
            ),
        },
        {
            title: 'Test Details',
            dataIndex: 'testName',
            key: 'testName',
            width: 250,
            render: (testName) => (
                <Tooltip title={testName}>
                    <span className="font-medium text-blue-600">{testName}</span>
                </Tooltip>
            ),
        },
        {
            title: 'Billing Information',
            key: 'billing',
            width: 200,
            render: (_, record) => (
                <div className="flex flex-col space-y-1">
                    <Badge 
                        count={`NHIA: GHC ${record.nhiaAmount}`}
                        style={{ 
                            backgroundColor: '#10b981',
                            fontSize: '11px',
                            padding: '2px 8px'
                        }}
                    />
                    <Badge 
                        count={`Patient: GHC ${record.patientAmount}`}
                        style={{ 
                            backgroundColor: '#3b82f6',
                            fontSize: '11px',
                            padding: '2px 8px'
                        }}
                    />
                </div>
            ),
        },
        {
            title: 'Request Date',
            dataIndex: 'requestedDate',
            key: 'requestedDate',
            width: 150,
            render: (date) => (
                <div className="flex flex-col">
                    <span className="font-medium">{moment(date).format('DD/MM/YY')}</span>
                    <span className="text-xs text-gray-500">
                        {moment(date).format('HH:mm')}
                    </span>
                </div>
            ),
            sorter: (a, b) => moment(a.requestedDate) - moment(b.requestedDate),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (status) => (
                <Tag 
                    color="orange" 
                    icon={<ClockCircleOutlined />}
                    className="flex items-center justify-center font-medium"
                >
                    PENDING
                </Tag>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            width: 150,
            render: (_, record) => (
                <Button
                    type="primary"
                    icon={<ExperimentOutlined />}
                    onClick={() => onEnterResults(record)}
                    className="bg-green-500 hover:bg-green-600 border-green-500"
                    size="middle"
                >
                    Enter Results
                </Button>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={data}
            loading={loading}
            pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => 
                    `${range[0]}-${range[1]} of ${total} tests`,
            }}
            scroll={{ x: 1000 }}
            className="lab-tests-table"
            rowClassName="hover:bg-blue-50 transition-colors duration-200"
        />
    );
};

export default LabTestsTable;