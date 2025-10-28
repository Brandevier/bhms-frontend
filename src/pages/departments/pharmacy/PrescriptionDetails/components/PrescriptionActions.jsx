import React from 'react';
import { Button, Space, Tag, Badge } from 'antd';
import {
    CheckOutlined,
    CloseOutlined,
    WarningOutlined,
    FileTextOutlined
} from '@ant-design/icons';
import moment from 'moment';

const PrescriptionActions = ({
    prescription,
    onIssueMedication,
    onReject,
    onInterventionClick,
    onAIRecommendation
}) => {
    if (prescription.status !== 'dispensed') {
        return (
            <div style={{ marginTop: '24px', textAlign: 'right' }}>
                <Space>
                    <Button
                        type="primary"
                        icon={<CheckOutlined />}
                        onClick={() => onIssueMedication(prescription)}
                    >
                        Issue Medication
                    </Button>
                    <Button
                        danger
                        icon={<CloseOutlined />}
                        onClick={() => onReject(prescription.id)}
                    >
                        Withhold
                    </Button>
                    <Button
                        type="text"
                        icon={<WarningOutlined />}
                        onClick={() => onInterventionClick(prescription)}
                        danger={prescription.clinicalInterventions?.length > 0}
                    >
                        Clinical Intervention
                        {prescription.clinicalInterventions?.length > 0 && (
                            <Badge 
                                count={prescription.clinicalInterventions.length} 
                                style={{ marginLeft: '8px' }}
                            />
                        )}
                    </Button>
                    <Button
                        type="dashed"
                        icon={<FileTextOutlined />}
                        onClick={onAIRecommendation}
                    >
                        AI Review
                    </Button>
                </Space>
            </div>
        );
    }

    return (
        <div style={{ marginTop: '24px', textAlign: 'right' }}>
            <Tag icon={<CheckOutlined />} color="success" style={{ padding: '8px 16px', fontSize: '14px' }}>
                Medication Dispensed on {moment(prescription.updatedAt).format('MMM D, YYYY')}
            </Tag>
            <Button
                type="text"
                icon={<FileTextOutlined />}
                style={{ marginLeft: '8px' }}
            >
                View Receipt
            </Button>
        </div>
    );
};

export default PrescriptionActions;