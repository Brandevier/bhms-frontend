import React from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Space, 
  Tag, 
  Badge, 
  Avatar, 
  Button, 
  Tooltip, 
  Typography 
} from 'antd';
import { 
  FileTextOutlined, 
  EyeOutlined, 
  EditOutlined, 
  DeleteOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import moment from 'moment';
import { getStatusColor, getDiagnosisTypeInfo, isNewDiagnosis } from './utils';
import { styles } from './style';

// Extract Text component from Typography
const { Text } = Typography;

const DiagnosisCard = ({ 
  item, 
  onViewDetails, 
  onEdit, 
  onDelete, 
  loadingId 
}) => {
  const diagnosisType = getDiagnosisTypeInfo(item.diagnosis_type);
  
  return (
    <Card 
      className="diagnosis-card"
      style={{
        ...styles.card,
        ...(item.diagnosis_type === 'confirmed_diagnosis' 
          ? styles.confirmedCard 
          : styles.provisionalCard)
      }}
      hoverable
      onClick={() => onViewDetails(item)}
      bodyStyle={{ padding: '20px' }}
    >
      <Row gutter={16} align="middle">
        <Col flex="none">
          <Badge 
            dot 
            color={getStatusColor(item.status)}
            offset={[-5, 5]}
          >
            <Avatar 
              size={48}
              icon={
                item.diagnosis_type === 'confirmed_diagnosis' 
                  ? <CheckCircleOutlined /> 
                  : <ClockCircleOutlined />
              }
              style={{ 
                backgroundColor: diagnosisType.color + '20',
                color: diagnosisType.color
              }}
            />
          </Badge>
        </Col>
        
        <Col flex="auto">
          <Space direction="vertical" size={2} style={{ width: '100%' }}>
            <Row justify="space-between" align="middle">
              <Col>
                <Space>
                  <Tag color={diagnosisType.badgeColor}>
                    {diagnosisType.label}
                  </Tag>
                  <Text strong style={{ fontSize: '16px' }}>
                    {item?.systemDiagnosis?.diagnosis_name || 'Unspecified Diagnosis'}
                  </Text>
                  {isNewDiagnosis(item.diagnosis_date) && (
                    <Badge count="NEW" style={{ backgroundColor: '#52c41a' }} />
                  )}
                </Space>
              </Col>
              <Col>
                <Tag 
                  color={getStatusColor(item.status)}
                  style={{ 
                    margin: 0,
                    borderRadius: 12,
                    fontWeight: 600
                  }}
                >
                  {item.status}
                </Tag>
              </Col>
            </Row>

            <Row justify="space-between" align="middle">
              <Col>
                <Space size="middle">
                  <Space size={4}>
                    <CalendarOutlined style={{ color: '#8c8c8c' }} />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {moment(item.diagnosis_date).format("MMM DD, YYYY • hh:mm A")}
                    </Text>
                  </Space>
                  
                  {item?.systemDiagnosis?.icd_10_code && (
                    <Tag color="blue" style={{ margin: 0, fontSize: '11px' }}>
                      ICD-10: {item.systemDiagnosis.icd_10_code}
                    </Tag>
                  )}
                </Space>
              </Col>
            </Row>

            {item.chief_complain && (
              <div style={{ marginTop: 8 }}>
                <Text type="secondary" style={{ fontSize: '13px' }}>
                  <strong>Chief Complaint:</strong> {item.chief_complain}
                </Text>
              </div>
            )}

            {item.doctor_evaluation && (
              <div style={{ marginTop: 4 }}>
                <Text type="secondary" style={{ fontSize: '12px' }} ellipsis={{ tooltip: item.doctor_evaluation }}>
                  <strong>Evaluation:</strong> {item.doctor_evaluation}
                </Text>
              </div>
            )}
            
            <div style={{ marginTop: 8 }}>
              <Tag style={{ backgroundColor: '#1890ff' }}>
                <strong className="text-white">Doctor:</strong> {item.staff?.firstName || 'N/A'} {item.staff?.lastName || 'N/A'}
              </Tag>
            </div>
          </Space>
        </Col>

        <Col flex="none">
          <Space direction="vertical">
            <Tooltip title="View Details">
              <Button 
                type="text" 
                icon={<EyeOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails(item);
                }}
              />
            </Tooltip>
            
            <Tooltip title="Edit Diagnosis">
              <Button 
                type="text" 
                icon={<EditOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(item);
                }}
              />
            </Tooltip>

            <Tooltip title="Delete Diagnosis">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                loading={loadingId === item.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.id);
                }}
              />
            </Tooltip>
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

export default DiagnosisCard;