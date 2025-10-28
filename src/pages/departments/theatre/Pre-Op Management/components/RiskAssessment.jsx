import React from 'react';
import { Card, Table, Progress, Tag, Divider } from 'antd';
import { 
  AlertOutlined,
  BarChartOutlined,
  CalculatorOutlined 
} from '@ant-design/icons';

const RiskAssessment = ({ patient }) => {
  const riskScores = [
    {
      key: '1',
      name: 'Cardiac Risk Index (RCRI)',
      score: 2,
      max: 5,
      interpretation: 'Intermediate risk (1.3-3.6% major cardiac complications)',
      color: 'orange'
    },
    {
      key: '2',
      name: 'ASA Physical Status',
      score: 2,
      max: 5,
      interpretation: 'ASA II - Mild systemic disease',
      color: 'blue'
    },
    {
      key: '3',
      name: 'STOP-BANG (OSA Risk)',
      score: 4,
      max: 8,
      interpretation: 'High risk of obstructive sleep apnea',
      color: 'red'
    },
    {
      key: '4',
      name: 'Caprini VTE Risk',
      score: 7,
      max: 12,
      interpretation: 'High risk (6.0-8.5% risk of VTE)',
      color: 'red'
    },
  ];

  const riskFactors = [
    { factor: 'Hypertension', status: 'controlled', severity: 'moderate' },
    { factor: 'Type 2 Diabetes', status: 'controlled', severity: 'moderate' },
    { factor: 'BMI > 35', status: 'current', severity: 'high' },
    { factor: 'Former Smoker', status: '10 years quit', severity: 'low' },
  ];

  const columns = [
    {
      title: 'Risk Assessment Tool',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: 'Score',
      key: 'score',
      render: (_, record) => (
        <div>
          <Progress
            percent={(record.score / record.max) * 100}
            showInfo={false}
            strokeColor={
              record.color === 'red' ? '#ff4d4f' : 
              record.color === 'orange' ? '#faad14' : '#1890ff'
            }
          />
          <div>
            {record.score} / {record.max}
          </div>
        </div>
      ),
    },
    {
      title: 'Interpretation',
      dataIndex: 'interpretation',
      key: 'interpretation',
      render: (text, record) => (
        <Tag color={record.color}>{text}</Tag>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">
          <AlertOutlined className="mr-2" />
          Risk Assessment for {patient.name}
        </h2>
        <div className="flex items-center">
          <CalculatorOutlined className="mr-2" />
          <span className="text-gray-600">Overall Risk: </span>
          <Tag color="orange" className="ml-2 font-medium">Moderate</Tag>
        </div>
      </div>
      
      <Divider orientation="left" className="text-sm">
        Procedure: {patient.procedure} | Scheduled: {patient.surgeryDate}
      </Divider>
      
      <Card title="Risk Scores" className="mb-4 shadow-sm">
        <Table 
          columns={columns} 
          dataSource={riskScores} 
          pagination={false}
          size="small"
        />
      </Card>
      
      <Card title="Identified Risk Factors" className="mb-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {riskFactors.map((risk, index) => (
            <Card 
              key={index} 
              size="small"
              className={`border-l-4 ${
                risk.severity === 'high' ? 'border-red-500' : 
                risk.severity === 'moderate' ? 'border-orange-500' : 'border-blue-500'
              }`}
            >
              <div className="flex justify-between">
                <span className="font-medium">{risk.factor}</span>
                <Tag 
                  color={
                    risk.severity === 'high' ? 'red' : 
                    risk.severity === 'moderate' ? 'orange' : 'blue'
                  }
                >
                  {risk.severity} risk
                </Tag>
              </div>
              <div className="text-gray-600 mt-1">{risk.status}</div>
            </Card>
          ))}
        </div>
      </Card>
      
      <Card 
        title={
          <span className="text-green-600">
            <BarChartOutlined className="mr-2" />
            Risk Mitigation Recommendations
          </span>
        } 
        className="shadow-sm"
      >
        <ul className="list-disc pl-5">
          <li className="mb-2">Consider preoperative beta-blocker therapy for cardiac risk reduction</li>
          <li className="mb-2">Aggressive VTE prophylaxis required - consider mechanical and pharmacological methods</li>
          <li className="mb-2">Postoperative continuous positive airway pressure (CPAP) for OSA management</li>
          <li className="mb-2">Intraoperative blood glucose monitoring</li>
          <li>Consider anesthesia premedication for anxiety reduction</li>
        </ul>
      </Card>
    </div>
  );
};

export default RiskAssessment;