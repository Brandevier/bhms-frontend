import React, { useState } from "react";
import { 
  Card, 
  List, 
  Typography, 
  Button, 
  Space, 
  Tag, 
  Popconfirm, 
  message, 
  Empty, 
  Badge,
  Row,
  Col,
  Divider,
  Timeline,
  Modal,
  Descriptions,
  Avatar,
  Progress,
  Tooltip
} from "antd";
import { 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined, 
  CalendarOutlined,
  UserOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  ArrowRightOutlined,
  MoreOutlined
} from "@ant-design/icons";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { deleteDiagnosis } from "../redux/slice/diagnosisSlice";

const { Title, Text } = Typography;

const PatientDiagnosis = ({ diagnosis, onSubmit }) => {
  const dispatch = useDispatch();
  const [visibleCount, setVisibleCount] = useState(3);
  const [loadingId, setLoadingId] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
  const { loading } = useSelector((state) => state.diagnosis);

  // Sort diagnoses by date (newest first)
  const sortedDiagnoses = [...(diagnosis || [])].sort((a, b) => 
    new Date(b.diagnosis_date) - new Date(a.diagnosis_date)
  );

  // Check if diagnosis is new (within last 7 days)
  const isNewDiagnosis = (date) => {
    return moment().diff(moment(date), 'days') <= 7;
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return '#52c41a';
      case 'resolved': return '#1890ff';
      case 'chronic': return '#fa8c16';
      case 'critical': return '#f5222d';
      default: return '#d9d9d9';
    }
  };

  const getSeverityLevel = (diagnosis) => {
    // You can implement your own logic based on diagnosis data
    if (diagnosis?.status === 'Critical') return 'high';
    if (diagnosis?.systemDiagnosis?.icd_10_code?.startsWith('E27')) return 'medium';
    return 'low';
  };

  const handleViewMore = () => {
    setVisibleCount(sortedDiagnoses.length);
  };

  const handleViewDetails = (diagnosis) => {
    setSelectedDiagnosis(diagnosis);
    setDetailModalVisible(true);
  };

  const handleEdit = (diagnosis) => {
    console.log("Edit Diagnosis:", diagnosis);
  };

  const handleDelete = async (id) => {
    setLoadingId(id);
    try {
      await dispatch(deleteDiagnosis(id)).unwrap();
      message.success("Diagnosis deleted successfully");
      onSubmit();
    } catch (error) {
      message.error("Failed to delete diagnosis");
    } finally {
      setLoadingId(null);
    }
  };

  const DiagnosisCard = ({ item }) => (
    <Card 
      className="diagnosis-card"
      style={{ 
        marginBottom: 16, 
        borderRadius: 12,
        border: `1px solid #f0f0f0`,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        transition: 'all 0.3s ease',
        cursor: 'pointer'
      }}
      hoverable
      onClick={() => handleViewDetails(item)}
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
              icon={<FileTextOutlined />}
              style={{ 
                backgroundColor: getStatusColor(item.status) + '20',
                color: getStatusColor(item.status)
              }}
            />
          </Badge>
        </Col>
        
        <Col flex="auto">
          <Space direction="vertical" size={2} style={{ width: '100%' }}>
            <Row justify="space-between" align="middle">
              <Col>
                <Space>
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
                  handleViewDetails(item);
                }}
              />
            </Tooltip>
            
            <Tooltip title="Edit Diagnosis">
              <Button 
                type="text" 
                icon={<EditOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(item);
                }}
              />
            </Tooltip>

            <Popconfirm
              title="Delete Diagnosis"
              description="Are you sure you want to delete this diagnosis record?"
              onConfirm={(e) => {
                e?.stopPropagation();
                handleDelete(item.id);
              }}
              onCancel={(e) => e?.stopPropagation()}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ danger: true }}
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                loading={loadingId === item.id}
                onClick={(e) => e.stopPropagation()}
              />
            </Popconfirm>
          </Space>
        </Col>
      </Row>
    </Card>
  );

  const DiagnosisTimelineView = () => (
    <div style={{ marginTop: 24 }}>
      <Title level={5} style={{ marginBottom: 20 }}>Diagnosis Timeline</Title>
      <Timeline>
        {sortedDiagnoses.slice(0, visibleCount).map((item, index) => (
          <Timeline.Item
            key={item.id}
            color={getStatusColor(item.status)}
            dot={
              <Avatar 
                size={32}
                icon={<FileTextOutlined />}
                style={{ 
                  backgroundColor: getStatusColor(item.status) + '20',
                  color: getStatusColor(item.status)
                }}
              />
            }
          >
            <Card 
              size="small" 
              style={{ marginBottom: 16, borderLeft: `4px solid ${getStatusColor(item.status)}` }}
              bodyStyle={{ padding: '12px 16px' }}
            >
              <Space direction="vertical" size={1} style={{ width: '100%' }}>
                <Text strong>{item?.systemDiagnosis?.diagnosis_name}</Text>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {moment(item.diagnosis_date).format("MMM DD, YYYY • hh:mm A")}
                </Text>
                {item.chief_complain && (
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {item.chief_complain}
                  </Text>
                )}
              </Space>
            </Card>
          </Timeline.Item>
        ))}
      </Timeline>
    </div>
  );

  const DiagnosisDetailModal = () => (
    <Modal
      title={
        <Space>
          <FileTextOutlined />
          <span>Diagnosis Details</span>
        </Space>
      }
      open={detailModalVisible}
      onCancel={() => setDetailModalVisible(false)}
      footer={[
        <Button key="edit" icon={<EditOutlined />} onClick={() => handleEdit(selectedDiagnosis)}>
          Edit Diagnosis
        </Button>,
        <Button key="close" onClick={() => setDetailModalVisible(false)}>
          Close
        </Button>
      ]}
      width={700}
      centered
    >
      {selectedDiagnosis && (
        <Descriptions bordered column={2} size="middle">
          <Descriptions.Item label="Diagnosis Name" span={2}>
            <Text strong>{selectedDiagnosis?.systemDiagnosis?.diagnosis_name}</Text>
          </Descriptions.Item>
          
          <Descriptions.Item label="ICD-10 Code">
            {selectedDiagnosis?.systemDiagnosis?.icd_10_code || 'N/A'}
          </Descriptions.Item>
          
          <Descriptions.Item label="Status">
            <Tag color={getStatusColor(selectedDiagnosis.status)}>
              {selectedDiagnosis.status}
            </Tag>
          </Descriptions.Item>
          
          <Descriptions.Item label="Diagnosis Date" span={2}>
            {moment(selectedDiagnosis.diagnosis_date).format("MMMM DD, YYYY • hh:mm A")}
          </Descriptions.Item>
          
          <Descriptions.Item label="Chief Complaint" span={2}>
            {selectedDiagnosis.chief_complain || 'Not specified'}
          </Descriptions.Item>
          
          <Descriptions.Item label="Doctor Evaluation" span={2}>
            {selectedDiagnosis.doctor_evaluation || 'Not provided'}
          </Descriptions.Item>
          
          <Descriptions.Item label="Last Updated">
            {moment(selectedDiagnosis.updatedAt).format("MMM DD, YYYY")}
          </Descriptions.Item>
          
          <Descriptions.Item label="Record ID">
            <Text code>{selectedDiagnosis.id}</Text>
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );

  return (
    <div style={{ padding: '24px' }}>
      <Card 
        style={{ 
          borderRadius: 16,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          border: 'none'
        }}
        bodyStyle={{ padding: '24px' }}
      >
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <Space>
              <Title level={3} style={{ margin: 0 }}>Patient Diagnosis</Title>
              <Badge 
                count={sortedDiagnoses.length} 
                showZero 
                style={{ backgroundColor: '#1890ff' }}
              />
            </Space>
          </Col>
          <Col>
            <Space>
              <Text type="secondary">
                {sortedDiagnoses.length} diagnosis records
              </Text>
            </Space>
          </Col>
        </Row>

        {sortedDiagnoses.length === 0 ? (
          <Empty 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No diagnosis records available"
            style={{ margin: '40px 0' }}
          />
        ) : (
          <>
            <div className="diagnosis-list">
              {sortedDiagnoses.slice(0, visibleCount).map((item) => (
                <DiagnosisCard key={item.id} item={item} />
              ))}
            </div>

            {sortedDiagnoses.length > 3 && visibleCount < sortedDiagnoses.length && (
              <div style={{ textAlign: 'center', marginTop: 16 }}>
                <Button 
                  type="link" 
                  icon={<EyeOutlined />} 
                  onClick={handleViewMore}
                  size="large"
                >
                  View All {sortedDiagnoses.length} Diagnoses
                </Button>
              </div>
            )}

            <Divider />

            <DiagnosisTimelineView />
          </>
        )}

        <DiagnosisDetailModal />
      </Card>
    </div>
  );
};

export default PatientDiagnosis;