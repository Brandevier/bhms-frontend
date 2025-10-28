// DiagnosisStats.js
import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { 
  FileTextOutlined, 
  ManOutlined, 
  WomanOutlined,
  QuestionOutlined 
} from '@ant-design/icons';

const DiagnosisStats = ({ diagnoses }) => {
  const totalDiagnoses = diagnoses.length;
  const maleDiagnoses = diagnoses.filter(d => d.gender === 'Male').length;
  const femaleDiagnoses = diagnoses.filter(d => d.gender === 'Female').length;
  const nonGenderSpecific = diagnoses.filter(d => !d.gender).length;

  return (
    <Row gutter={16} style={{ marginBottom: 24 }}>
      <Col span={6}>
        <Card size="small">
          <Statistic
            title="Total Diagnoses"
            value={totalDiagnoses}
            prefix={<FileTextOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card size="small">
          <Statistic
            title="Male Specific"
            value={maleDiagnoses}
            prefix={<ManOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card size="small">
          <Statistic
            title="Female Specific"
            value={femaleDiagnoses}
            prefix={<WomanOutlined />}
            valueStyle={{ color: '#eb2f96' }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card size="small">
          <Statistic
            title="Non-Gender Specific"
            value={nonGenderSpecific}
            prefix={<QuestionOutlined />}
            valueStyle={{ color: '#52c41a' }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default DiagnosisStats;