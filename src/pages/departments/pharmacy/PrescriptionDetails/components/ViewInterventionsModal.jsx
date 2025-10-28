
import React from 'react';
import { Modal, List, Typography, Tag, Button } from 'antd';
import { WarningOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Text } = Typography;

const ViewInterventionsModal = ({ visible, prescription, onClose }) => {
    const getSeverityColor = (severity) => {
        const colors = {
            'minor': 'blue',
            'moderate': 'orange',
            'major': 'red',
            'life-threatening': '#f5222d'
        };
        return colors[severity] || 'gray';
    };

    const handleDeleteIntervention = (interventionId) => {
        // Implement delete functionality
        console.log('Delete intervention:', interventionId);
    };

    return (
        <Modal
            title={`Clinical Interventions - ${prescription?.medicine?.generic_name}`}
            visible={visible}
            onCancel={onClose}
            footer={null}
            width={700}
        >
            <List
                itemLayout="horizontal"
                dataSource={prescription?.clinicalInterventions || []}
                renderItem={(intervention) => (
                    <List.Item
                        actions={[
                            <Button
                                danger
                                size="small"
                                icon={<DeleteOutlined />}
                                onClick={() => handleDeleteIntervention(intervention.id)}
                            >
                                Delete
                            </Button>
                        ]}
                    >
                        <List.Item.Meta
                            avatar={
                                <WarningOutlined 
                                    style={{ 
                                        fontSize: '20px', 
                                        color: getSeverityColor(intervention.severity) 
                                    }} 
                                />
                            }
                            title={
                                <Space>
                                    <Text strong>
                                        {intervention.issue_type.replace('_', ' ').toUpperCase()}
                                    </Text>
                                    <Tag color={getSeverityColor(intervention.severity)}>
                                        {intervention.severity}
                                    </Tag>
                                </Space>
                            }
                            description={
                                <>
                                    <Text>{intervention.description}</Text>
                                    <br />
                                    <Text type="secondary" style={{ fontSize: '12px' }}>
                                        {moment(intervention.intervention_date).format('DD MMM YYYY h:mm a')}
                                    </Text>
                                </>
                            }
                        />
                    </List.Item>
                )}
                locale={{ emptyText: 'No clinical interventions found' }}
            />
        </Modal>
    );
};

export default ViewInterventionsModal;
