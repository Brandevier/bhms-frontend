import React from 'react';
import { Card, Statistic, Row, Col } from 'antd';
import { 
    DollarOutlined, 
    FileTextOutlined, 
    TeamOutlined,
    PercentageOutlined 
} from '@ant-design/icons';

const StatisticsCards = ({ nhiaClaims }) => {
    const totals = React.useMemo(() => {
        if (!nhiaClaims || !Array.isArray(nhiaClaims)) {
            return { totalAmount: 0, totalClaims: 0, totalPatients: 0, averageClaim: 0 };
        }

        const totalAmount = nhiaClaims.reduce((sum, claim) => sum + (claim.total_nhia_amount || 0), 0);
        const totalClaims = nhiaClaims.reduce((sum, claim) => sum + (claim.services?.length || 0), 0);
        const totalPatients = nhiaClaims.length;
        const averageClaim = totalPatients > 0 ? totalAmount / totalPatients : 0;

        return { totalAmount, totalClaims, totalPatients, averageClaim };
    }, [nhiaClaims]);

    return (
        <Row gutter={16} className="mb-6">
            <Col xs={24} sm={12} lg={6}>
                <Card className="shadow-sm border-0">
                    <Statistic
                        title="Total Claim Amount"
                        value={totals.totalAmount}
                        prefix="₵"
                        valueStyle={{ color: '#52c41a' }}
                        precision={2}
                        suffix={<DollarOutlined className="text-gray-400" />}
                    />
                    <div className="text-xs text-gray-500 mt-2">
                        Total NHIA liability
                    </div>
                </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
                <Card className="shadow-sm border-0">
                    <Statistic
                        title="Total Service Claims"
                        value={totals.totalClaims}
                        valueStyle={{ color: '#1890ff' }}
                        suffix={<FileTextOutlined className="text-gray-400" />}
                    />
                    <div className="text-xs text-gray-500 mt-2">
                        Individual service claims
                    </div>
                </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
                <Card className="shadow-sm border-0">
                    <Statistic
                        title="Patients with Claims"
                        value={totals.totalPatients}
                        valueStyle={{ color: '#722ed1' }}
                        suffix={<TeamOutlined className="text-gray-400" />}
                    />
                    <div className="text-xs text-gray-500 mt-2">
                        Patients with NHIA coverage
                    </div>
                </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
                <Card className="shadow-sm border-0">
                    <Statistic
                        title="Average per Patient"
                        value={totals.averageClaim}
                        prefix="₵"
                        valueStyle={{ color: '#fa8c16' }}
                        precision={2}
                        suffix={<PercentageOutlined className="text-gray-400" />}
                    />
                    <div className="text-xs text-gray-500 mt-2">
                        Per patient average
                    </div>
                </Card>
            </Col>
        </Row>
    );
};

export default StatisticsCards;