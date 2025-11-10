import React from 'react';
import { Card, Row, Col, Progress, Space, Alert } from 'antd';
import { 
    CheckCircleOutlined, 
    ClockCircleOutlined,
    ExclamationCircleOutlined 
} from '@ant-design/icons';
import QuickActions from './QuickActions';

const ClaimsOverview = ({ nhiaClaims }) => {
    const totals = React.useMemo(() => {
        if (!nhiaClaims || !Array.isArray(nhiaClaims)) {
            return { totalAmount: 0, totalClaims: 0, totalPatients: 0 };
        }

        const totalAmount = nhiaClaims.reduce((sum, claim) => sum + (claim.total_nhia_amount || 0), 0);
        const totalClaims = nhiaClaims.reduce((sum, claim) => sum + (claim.services?.length || 0), 0);
        const totalPatients = nhiaClaims.length;

        return { totalAmount, totalClaims, totalPatients };
    }, [nhiaClaims]);

    const getInsuranceStatusCounts = () => {
        if (!nhiaClaims) return { active: 0, inactive: 0 };
        
        let active = 0;
        nhiaClaims.forEach(claim => {
            if (claim.patient?.has_insurance) {
                active++;
            }
        });
        
        return { active, inactive: nhiaClaims.length - active };
    };

    const insuranceCounts = getInsuranceStatusCounts();

    return (
        <Card className="mb-6 shadow-sm" title="Claims Overview">
            <Row gutter={16}>
                <Col xs={24} md={14}>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span>Claims Processing Status</span>
                                <span>{totals.totalClaims} service claims</span>
                            </div>
                            <Progress 
                                percent={100} 
                                status="active"
                                strokeColor={{
                                    '0%': '#108ee9',
                                    '100%': '#87d068',
                                }}
                            />
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span>Amount Recovery Progress</span>
                                <span>₵{totals.totalAmount.toFixed(2)}</span>
                            </div>
                            <Progress 
                                percent={100} 
                                status="active"
                                strokeColor={{
                                    '0%': '#ff4d4f',
                                    '100%': '#52c41a',
                                }}
                            />
                        </div>
                        
                        {/* Insurance Status */}
                        <div className="mt-4">
                            <div className="flex justify-between text-sm mb-2">
                                <span>Insurance Coverage</span>
                                <span>{insuranceCounts.active} / {totals.totalPatients} patients</span>
                            </div>
                            <Space size="middle">
                                <div className="flex items-center">
                                    <CheckCircleOutlined className="text-green-500 mr-1" />
                                    <span className="text-sm">Active: {insuranceCounts.active}</span>
                                </div>
                                <div className="flex items-center">
                                    <ExclamationCircleOutlined className="text-orange-500 mr-1" />
                                    <span className="text-sm">No Coverage: {insuranceCounts.inactive}</span>
                                </div>
                            </Space>
                        </div>
                    </div>
                </Col>
                {/* <Col xs={24} md={10}>
                    <QuickActions />
                </Col> */}
            </Row>
        </Card>
    );
};

export default ClaimsOverview;