import React from 'react';
import { Card, Table, Progress, Tag, Divider, Alert, Space, Badge } from 'antd';
import { 
  AlertOutlined,
  BarChartOutlined,
  CalculatorOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  CalendarOutlined
} from '@ant-design/icons';

const RiskAssessment = ({ patient }) => {
  // Handle case when no patient is selected
  if (!patient) {
    return (
      <div className="flex justify-center items-center h-64">
        <Alert
          message="No Patient Selected"
          description="Please select a patient from the theatre list to view risk assessment."
          type="info"
          showIcon
        />
      </div>
    );
  }

  // Safely extract patient data with fallbacks
  const patientName = patient.patient?.name || 'Unknown Patient';
  const primaryProcedure = patient.procedure?.primary || 'No procedure specified';
  const surgeryDate = patient.schedule?.formattedDate || 'Not scheduled';
  const surgeryTime = patient.schedule?.formattedTime || '';
  const patientAge = patient.patient?.age || 'N/A';
  const patientGender = patient.patient?.gender || 'N/A';
  const folderNumber = patient.patient?.folderNumber || 'N/A';
  const isEmergency = patient.isEmergency || false;

  // Mock risk scores data - in real app, this would come from calculations
  const riskScores = [
    {
      key: '1',
      name: 'Cardiac Risk Index (RCRI)',
      score: patientAge > 60 ? 2 : 1,
      max: 5,
      interpretation: patientAge > 60 ? 
        'Intermediate risk (1.3-3.6% major cardiac complications)' : 
        'Low risk (<1% major cardiac complications)',
      color: patientAge > 60 ? 'orange' : 'green'
    },
    {
      key: '2',
      name: 'ASA Physical Status',
      score: isEmergency ? 3 : 2,
      max: 5,
      interpretation: isEmergency ? 
        'ASA III - Severe systemic disease' : 
        'ASA II - Mild systemic disease',
      color: isEmergency ? 'orange' : 'blue'
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
    {
      key: '5',
      name: 'Surgical Complexity',
      score: 3,
      max: 5,
      interpretation: 'Intermediate complexity procedure',
      color: 'orange'
    },
  ];

  // Mock risk factors based on patient data
  const riskFactors = [
    { 
      factor: 'Age > 60 years', 
      status: patientAge > 60 ? 'present' : 'absent', 
      severity: patientAge > 60 ? 'moderate' : 'low' 
    },
    { 
      factor: 'Emergency Surgery', 
      status: isEmergency ? 'present' : 'absent', 
      severity: isEmergency ? 'high' : 'low' 
    },
    { 
      factor: 'Major Procedure', 
      status: 'present', 
      severity: 'high' 
    },
    { 
      factor: 'General Anesthesia', 
      status: 'planned', 
      severity: 'moderate' 
    },
  ].filter(risk => risk.status !== 'absent');

  const columns = [
    {
      title: 'Risk Assessment Tool',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <span className="font-medium text-gray-800">{text}</span>,
    },
    {
      title: 'Score',
      key: 'score',
      width: 150,
      render: (_, record) => (
        <div className="text-center">
          <Progress
            percent={Math.round((record.score / record.max) * 100)}
            showInfo={false}
            strokeColor={
              record.color === 'red' ? '#ff4d4f' : 
              record.color === 'orange' ? '#faad14' : 
              record.color === 'green' ? '#52c41a' : '#1890ff'
            }
            size="small"
          />
          <div className="text-sm font-medium mt-1">
            {record.score} / {record.max}
          </div>
        </div>
      ),
    },
    {
      title: 'Risk Level',
      dataIndex: 'interpretation',
      key: 'interpretation',
      render: (text, record) => (
        <Tag 
          color={record.color} 
          className="capitalize font-medium"
        >
          {text}
        </Tag>
      ),
    },
  ];

  // Calculate overall risk level
  const calculateOverallRisk = () => {
    const highRiskCount = riskScores.filter(score => score.color === 'red').length;
    const moderateRiskCount = riskScores.filter(score => score.color === 'orange').length;
    
    if (highRiskCount >= 2) return { level: 'High', color: 'red' };
    if (highRiskCount >= 1 || moderateRiskCount >= 2) return { level: 'Moderate-High', color: 'orange' };
    if (moderateRiskCount >= 1) return { level: 'Moderate', color: 'orange' };
    return { level: 'Low', color: 'green' };
  };

  const overallRisk = calculateOverallRisk();

  return (
    <div className="p-4">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-semibold flex items-center">
            <AlertOutlined className="mr-3 text-red-600" />
            Surgical Risk Assessment
          </h2>
          <div className="mt-2 space-y-1 text-gray-600">
            <div className="flex items-center">
              <UserOutlined className="mr-2" />
              <span className="font-medium">{patientName}</span>
              <Badge 
                count={folderNumber} 
                style={{ backgroundColor: '#1890ff', marginLeft: 8 }}
              />
              {isEmergency && (
                <Tag color="red" className="ml-2">Emergency</Tag>
              )}
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <span>Age: {patientAge}</span>
              <span>Gender: {patientGender}</span>
            </div>
            <div className="flex items-center">
              <MedicineBoxOutlined className="mr-2" />
              <span>{primaryProcedure}</span>
            </div>
            <div className="flex items-center">
              <CalendarOutlined className="mr-2" />
              <span>
                {surgeryDate} 
                {surgeryTime && ` at ${surgeryTime}`}
              </span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center justify-end">
            <CalculatorOutlined className="mr-2 text-gray-600" />
            <span className="text-gray-600">Overall Risk: </span>
          </div>
          <Tag 
            color={overallRisk.color} 
            className="text-lg font-bold mt-1 px-3 py-1"
          >
            {overallRisk.level}
          </Tag>
        </div>
      </div>

      <Divider className="my-4" />

      {/* Risk Scores Table */}
      <Card 
        title={
          <Space>
            <BarChartOutlined />
            Risk Assessment Scores
          </Space>
        } 
        className="mb-6 shadow-sm border"
        extra={<Tag color="blue">{riskScores.length} assessments</Tag>}
      >
        <Table 
          columns={columns} 
          dataSource={riskScores} 
          pagination={false}
          size="middle"
          className="risk-assessment-table"
        />
      </Card>

      {/* Identified Risk Factors */}
      <Card 
        title="Identified Risk Factors" 
        className="mb-6 shadow-sm border"
        extra={<Tag color="orange">{riskFactors.length} factors</Tag>}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {riskFactors.map((risk, index) => (
            <Card 
              key={index} 
              size="small"
              className={`border-l-4 hover:shadow-md transition-shadow ${
                risk.severity === 'high' ? 'border-red-500 bg-red-50' : 
                risk.severity === 'moderate' ? 'border-orange-500 bg-orange-50' : 
                'border-blue-500 bg-blue-50'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="font-medium text-gray-900">{risk.factor}</span>
                <Tag 
                  color={
                    risk.severity === 'high' ? 'red' : 
                    risk.severity === 'moderate' ? 'orange' : 'blue'
                  }
                  className="capitalize"
                >
                  {risk.severity} risk
                </Tag>
              </div>
              <div className={`text-sm mt-1 ${
                risk.severity === 'high' ? 'text-red-700' : 
                risk.severity === 'moderate' ? 'text-orange-700' : 
                'text-blue-700'
              }`}>
                Status: <span className="font-medium">{risk.status}</span>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Risk Mitigation Recommendations */}
      <Card 
        title={
          <span className="flex items-center text-green-600">
            <BarChartOutlined className="mr-2" />
            Risk Mitigation Recommendations
          </span>
        } 
        className="shadow-sm border"
      >
        <div className="space-y-3">
          {overallRisk.level.includes('High') && (
            <Alert
              message="High Risk Case - Special Considerations Required"
              description="This patient requires comprehensive preoperative optimization and specialized intraoperative management."
              type="warning"
              showIcon
              className="mb-4"
            />
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Preoperative</h4>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                <li>Cardiology consultation for risk stratification</li>
                <li>Optimize blood pressure and glucose control</li>
                <li>Consider preoperative beta-blocker therapy</li>
                <li>Anesthesia preoperative assessment</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Intraoperative</h4>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                <li>Invasive hemodynamic monitoring</li>
                <li>Aggressive VTE prophylaxis</li>
                <li>Blood conservation strategies</li>
                <li>Temperature management</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4">
            <h4 className="font-medium text-gray-800 mb-2">Postoperative</h4>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>ICU/HDU admission consideration</li>
              <li>Enhanced recovery protocol</li>
              <li>Multimodal analgesia</li>
              <li>Early mobilization and respiratory care</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Summary Section */}
      <Card 
        size="small" 
        className="mt-6 bg-gray-50 border-0"
      >
        <div className="text-center text-gray-600">
          <p className="font-medium">
            Risk assessment completed for {patientName} | 
            Overall Risk: <Tag color={overallRisk.color}>{overallRisk.level}</Tag> | 
            Recommendations generated {new Date().toLocaleDateString()}
          </p>
        </div>
      </Card>
    </div>
  );
};

export default RiskAssessment;