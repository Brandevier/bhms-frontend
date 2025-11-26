import React, { useState } from 'react';
import { 
    Card, 
    Typography, 
    Tag, 
    Space, 
    Row, 
    Col, 
    Empty,
    Collapse,
    Badge,
    Button
} from 'antd';
import { 
    FileTextOutlined, 
    CalendarOutlined, 
    CaretRightOutlined,
    UserOutlined
} from '@ant-design/icons';
import moment from 'moment';

const { Title, Text } = Typography;
const { Panel } = Collapse;

const CompactDiagnosisView = ({ diagnosis }) => {
    const [activeKey, setActiveKey] = useState(['0']);

    if (!diagnosis || diagnosis.length === 0) {
        return (
            <Card style={{ borderRadius: '8px' }}>
                <Empty 
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="No diagnosis records available"
                />
            </Card>
        );
    }

    const getStatusColor = (status) => {
        const statusMap = {
            'Active': 'red',
            'Resolved': 'green',
            'Chronic': 'orange',
            'Pending': 'blue'
        };
        return statusMap[status] || 'default';
    };

    const sortedDiagnosis = [...diagnosis].sort((a, b) => 
        new Date(b.diagnosis_date) - new Date(a.diagnosis_date)
    );

    return (
        <Card 
            title={
                <Space>
                    <FileTextOutlined style={{ color: '#1890ff' }} />
                    <span>Patient Diagnosis Overview</span>
                    <Badge count={diagnosis.length} />
                </Space>
            }
            style={{ 
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
            }}
            bodyStyle={{ padding: '0' }}
        >
            <Collapse 
                activeKey={activeKey}
                onChange={setActiveKey}
                expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                ghost
            >
                {sortedDiagnosis.map((item, index) => (
                    <Panel 
                        key={index}
                        header={
                            <Row justify="space-between" align="middle" style={{ width: '100%' }}>
                                <Col>
                                    <Space>
                                        <Text strong>
                                            {item?.systemDiagnosis?.diagnosis_name || 'Unspecified Diagnosis'}
                                        </Text>
                                        <Tag color={getStatusColor(item.status)}>
                                            {item.status}
                                        </Tag>
                                        {item?.systemDiagnosis?.icd_10_code && (
                                            <Tag color="blue" style={{ fontSize: '11px' }}>
                                                {item.systemDiagnosis.icd_10_code}
                                            </Tag>
                                        )}
                                    </Space>
                                </Col>
                                <Col>
                                    <Text type="secondary" style={{ fontSize: '12px' }}>
                                        {moment(item.diagnosis_date).format("MMM DD, YYYY")}
                                    </Text>
                                </Col>
                            </Row>
                        }
                    >
                        <Space direction="vertical" style={{ width: '100%' }} size={8}>
                            {item.chief_complain && (
                                <div>
                                    <Text strong>Chief Complaint: </Text>
                                    <Text>{item.chief_complain}</Text>
                                </div>
                            )}
                            
                            {item.doctor_evaluation && (
                                <div>
                                    <Text strong>Clinical Notes: </Text>
                                    <Text type="secondary">{item.doctor_evaluation}</Text>
                                </div>
                            )}
                            
                            <div>
                                <Text strong>Diagnosis Date: </Text>
                                <Text type="secondary">
                                    {moment(item.diagnosis_date).format("MMMM DD, YYYY • hh:mm A")}
                                </Text>
                            </div>
                        </Space>
                    </Panel>
                ))}
            </Collapse>
        </Card>
    );
};

export default CompactDiagnosisView;