// Update DiagnosisStats.js to include doctor's notes stats
import React from "react";
import { Row, Col, Card, Statistic, Typography } from "antd";
import { 
  FileTextOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined,
  BookOutlined,
  LockOutlined,
  EditOutlined
} from "@ant-design/icons";

const { Text } = Typography;

const DiagnosisStats = ({ diagnoses = [], doctorsNotes = [] }) => {
  const totalDiagnoses = diagnoses.length;
  const confirmedDiagnoses = diagnoses.filter(d => d.type === 'confirmed_diagnosis').length;
  const provisionalDiagnoses = diagnoses.filter(d => d.type === 'provisional_diagnosis').length;
  
  const totalNotes = doctorsNotes.length;
  const signedNotes = doctorsNotes.filter(n => n.is_signed).length;
  const unsignedNotes = doctorsNotes.filter(n => !n.is_signed).length;

  return (
    <Card size="small" style={{ marginBottom: 24 }}>
      <Row gutter={[16, 16]}>
        {/* Diagnosis Stats */}
        <Col xs={12} sm={6}>
          <Statistic
            title="Total Diagnoses"
            value={totalDiagnoses}
            prefix={<FileTextOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Col>
        <Col xs={12} sm={6}>
          <Statistic
            title="Confirmed"
            value={confirmedDiagnoses}
            prefix={<CheckCircleOutlined />}
            valueStyle={{ color: '#52c41a' }}
          />
        </Col>
        <Col xs={12} sm={6}>
          <Statistic
            title="Provisional"
            value={provisionalDiagnoses}
            prefix={<ClockCircleOutlined />}
            valueStyle={{ color: '#fa8c16' }}
          />
        </Col>
        
        {/* Doctor's Note Stats */}
        <Col xs={12} sm={6}>
          <Statistic
            title="Doctor's Notes"
            value={totalNotes}
            prefix={<BookOutlined />}
            valueStyle={{ color: '#722ed1' }}
          />
        </Col>
        <Col xs={12} sm={6}>
          <Statistic
            title="Signed Notes"
            value={signedNotes}
            prefix={<LockOutlined />}
            valueStyle={{ color: '#52c41a' }}
          />
        </Col>
        <Col xs={12} sm={6}>
          <Statistic
            title="Draft Notes"
            value={unsignedNotes}
            prefix={<EditOutlined />}
            valueStyle={{ color: '#faad14' }}
          />
        </Col>
        <Col xs={12} sm={6}>
          <Statistic
            title="Total Records"
            value={totalDiagnoses + totalNotes}
            prefix={<FileTextOutlined />}
            valueStyle={{ color: '#1890ff', fontWeight: 'bold' }}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default DiagnosisStats;