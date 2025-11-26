import React from 'react';
import { 
    Card, 
    Typography, 
    Tag, 
    Space, 
    Row, 
    Col, 
    Empty,
    Timeline,
    Badge,
    Divider
} from 'antd';
import { 
    FileTextOutlined, 
    CalendarOutlined, 
    UserOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import moment from 'moment';

const { Title, Text } = Typography;

const PatientDiagnosisPanel = ({ diagnosis }) => {
    if (!diagnosis || diagnosis.length === 0) {
        return (
            <Card 
                style={{ 
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    border: '1px solid #f0f0f0'
                }}
            >
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

    const getSeverityIcon = (diagnosis) => {
        if (diagnosis.status === 'Active') {
            return <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />;
        }
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
    };

    // Sort by date (newest first)
    const sortedDiagnosis = [...diagnosis].sort((a, b) => 
        new Date(b.diagnosis_date) - new Date(a.diagnosis_date)
    );

    return (
        <Card 
            title={
                <Space>
                    <FileTextOutlined style={{ color: '#1890ff' }} />
                    <span>Patient Diagnosis</span>
                    <Badge 
                        count={diagnosis.length} 
                        style={{ backgroundColor: '#1890ff' }} 
                    />
                </Space>
            }
            style={{ 
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                border: 'none',
                marginBottom: '24px'
            }}
            bodyStyle={{ padding: '0' }}
        >
            {/* Timeline View */}
            <div style={{ padding: '24px' }}>
                <Timeline>
                    {sortedDiagnosis.map((item, index) => (
                        <Timeline.Item
                            key={item.id}
                            dot={getSeverityIcon(item)}
                            color={getStatusColor(item.status) === 'red' ? '#ff4d4f' : '#52c41a'}
                        >
                            <div style={{ marginBottom: '16px' }}>
                                <Row gutter={16} align="middle">
                                    <Col flex="auto">
                                        <Space direction="vertical" size={2}>
                                            {/* Diagnosis Name */}
                                            <Title level={5} style={{ margin: 0 }}>
                                                {item?.systemDiagnosis?.diagnosis_name || 'Unspecified Diagnosis'}
                                            </Title>
                                            
                                            {/* ICD-10 Code and Status */}
                                            <Space size="middle">
                                                {item?.systemDiagnosis?.icd_10_code && (
                                                    <Tag color="blue" style={{ margin: 0 }}>
                                                        ICD-10: {item.systemDiagnosis.icd_10_code}
                                                    </Tag>
                                                )}
                                                <Tag 
                                                    color={getStatusColor(item.status)}
                                                    style={{ 
                                                        margin: 0,
                                                        fontWeight: 600
                                                    }}
                                                >
                                                    {item.status}
                                                </Tag>
                                            </Space>

                                            {/* Dates */}
                                            <Space size="small">
                                                <CalendarOutlined style={{ color: '#8c8c8c', fontSize: '12px' }} />
                                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                                    Diagnosed: {moment(item.diagnosis_date).format("MMM DD, YYYY • hh:mm A")}
                                                </Text>
                                            </Space>

                                            {/* Chief Complaint */}
                                            {item.chief_complain && (
                                                <div style={{ marginTop: '8px' }}>
                                                    <Text strong style={{ fontSize: '13px' }}>
                                                        Chief Complaint:
                                                    </Text>
                                                    <Text style={{ fontSize: '13px', marginLeft: '8px' }}>
                                                        {item.chief_complain}
                                                    </Text>
                                                </div>
                                            )}

                                            {/* Doctor Evaluation */}
                                            {item.doctor_evaluation && (
                                                <div style={{ marginTop: '4px' }}>
                                                    <Text strong style={{ fontSize: '12px' }}>
                                                        Clinical Notes:
                                                    </Text>
                                                    <Text 
                                                        type="secondary" 
                                                        style={{ 
                                                            fontSize: '12px', 
                                                            marginLeft: '8px',
                                                            display: 'block'
                                                        }}
                                                        ellipsis={{ tooltip: item.doctor_evaluation }}
                                                    >
                                                        {item.doctor_evaluation}
                                                    </Text>
                                                </div>
                                            )}
                                        </Space>
                                    </Col>
                                </Row>
                            </div>
                            
                            {index < sortedDiagnosis.length - 1 && (
                                <Divider style={{ margin: '16px 0' }} />
                            )}
                        </Timeline.Item>
                    ))}
                </Timeline>
            </div>

            {/* Summary Stats */}
            <div 
                style={{ 
                    backgroundColor: '#fafafa',
                    padding: '16px 24px',
                    borderTop: '1px solid #f0f0f0',
                    borderBottomLeftRadius: '12px',
                    borderBottomRightRadius: '12px'
                }}
            >
                <Row gutter={16}>
                    <Col span={8}>
                        <div style={{ textAlign: 'center' }}>
                            <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                                {diagnosis.length}
                            </Title>
                            <Text type="secondary">Total Diagnoses</Text>
                        </div>
                    </Col>
                    <Col span={8}>
                        <div style={{ textAlign: 'center' }}>
                            <Title level={4} style={{ margin: 0, color: '#ff4d4f' }}>
                                {diagnosis.filter(d => d.status === 'Active').length}
                            </Title>
                            <Text type="secondary">Active</Text>
                        </div>
                    </Col>
                    <Col span={8}>
                        <div style={{ textAlign: 'center' }}>
                            <Title level={4} style={{ margin: 0, color: '#52c41a' }}>
                                {diagnosis.filter(d => d.status === 'Resolved').length}
                            </Title>
                            <Text type="secondary">Resolved</Text>
                        </div>
                    </Col>
                </Row>
            </div>
        </Card>
    );
};

export default PatientDiagnosisPanel;