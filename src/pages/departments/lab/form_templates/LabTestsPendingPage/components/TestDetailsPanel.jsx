import React from 'react';
import { Descriptions, Tag, Badge, Card, Divider } from 'antd';
import { 
    UserOutlined, 
    ExperimentOutlined, 
    CalendarOutlined,
    DollarOutlined,
    FileTextOutlined 
} from '@ant-design/icons';
import moment from 'moment';

const TestDetailsPanel = ({ currentTest }) => {
    if (!currentTest) return null;

    return (
        <Card 
            title={
                <div className="flex items-center space-x-2">
                    <FileTextOutlined className="text-blue-500" />
                    <span>Test Information</span>
                </div>
            }
            bordered={false}
            className="shadow-sm"
        >
            <Descriptions column={1} size="small" className="test-details">
                <Descriptions.Item label={
                    <span className="font-medium flex items-center">
                        <UserOutlined className="mr-1" />
                        Patient
                    </span>
                }>
                    <div className="font-semibold text-gray-900">
                        {currentTest.visit?.patient?.first_name} {currentTest.visit?.patient?.last_name}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                        Folder: {currentTest.visit?.patient?.folder_number || 'N/A'}
                    </div>
                </Descriptions.Item>

                <Descriptions.Item label={
                    <span className="font-medium flex items-center">
                        <ExperimentOutlined className="mr-1" />
                        Test
                    </span>
                }>
                    <div className="font-semibold text-blue-600">
                        {currentTest.template?.lab_tarrif?.test_description}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                        Code: {currentTest.template?.lab_tarrif?.code || 'N/A'}
                    </div>
                </Descriptions.Item>

                <Descriptions.Item label={
                    <span className="font-medium flex items-center">
                        <CalendarOutlined className="mr-1" />
                        Timeline
                    </span>
                }>
                    <div className="space-y-1">
                        <div className="text-sm">
                            <span className="font-medium">Requested:</span>{' '}
                            {moment(currentTest.createdAt).format('DD MMM YYYY, HH:mm')}
                        </div>
                        {currentTest.updatedAt && (
                            <div className="text-sm">
                                <span className="font-medium">Last Updated:</span>{' '}
                                {moment(currentTest.updatedAt).format('DD MMM YYYY, HH:mm')}
                            </div>
                        )}
                    </div>
                </Descriptions.Item>

                <Divider className="my-3" />

                <Descriptions.Item label="Billing">
                    <div className="space-y-2">
                        <Badge 
                            count={`NHIA: GHC ${currentTest.template?.lab_tarrif?.tariff_ghc || '0.00'}`}
                            style={{ 
                                backgroundColor: '#10b981',
                                display: 'block',
                                marginBottom: '8px'
                            }}
                        />
                        <Badge 
                            count={`Patient: GHC ${currentTest.template?.lab_tarrif?.market_price || '0.00'}`}
                            style={{ 
                                backgroundColor: '#3b82f6',
                                display: 'block'
                            }}
                        />
                    </div>
                </Descriptions.Item>

                <Descriptions.Item label="Status">
                    <Tag 
                        color="orange" 
                        className="font-medium px-2 py-1"
                    >
                        {currentTest.status?.toUpperCase() || 'PENDING'}
                    </Tag>
                </Descriptions.Item>

                {currentTest.notes && (
                    <Descriptions.Item label="Request Notes">
                        <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                            {currentTest.notes}
                        </div>
                    </Descriptions.Item>
                )}
            </Descriptions>
        </Card>
    );
};

export default TestDetailsPanel;