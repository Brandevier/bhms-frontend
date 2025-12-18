import React, { useState, useEffect } from "react";
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Tabs, 
  Button, 
  Space, 
  Badge,
  Empty,
  Divider
} from "antd";
import { 
  FileTextOutlined,
  PlusOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { deleteDiagnosis } from "../../redux/slice/diagnosisSlice";
import { message } from "antd";

// Import components
import DiagnosisCard from "./DiagnosisCard"; 
import DiagnosisDetailModal from "./DiagnosisDetailModal";
import DiagnosisStats from "./DiagnosisStats";
import { filterDiagnosesByType, sortDiagnosesByDate } from "./utils";
import { styles } from "./style";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const PatientDiagnosis = ({ diagnosis, onSubmit }) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("all");
  const [loadingId, setLoadingId] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
  const { loading } = useSelector((state) => state.diagnosis);

  // Sort diagnoses by date (newest first)
  const sortedDiagnoses = sortDiagnosesByDate(diagnosis || [], false);

  // Filter diagnoses based on active tab
  const filteredDiagnoses = filterDiagnosesByType(sortedDiagnoses, activeTab);

  const handleViewDetails = (diagnosis) => {
    setSelectedDiagnosis(diagnosis);
    setDetailModalVisible(true);
  };

  const handleEdit = (diagnosis) => {
    console.log("Edit Diagnosis:", diagnosis);
    // You can implement your edit logic here
  };

  const handleDelete = async (id) => {
    setLoadingId(id);
    try {
      await dispatch(deleteDiagnosis(id)).unwrap();
      message.success("Diagnosis deleted successfully");
      onSubmit?.();
    } catch (error) {
      message.error("Failed to delete diagnosis");
    } finally {
      setLoadingId(null);
    }
  };

  const tabItems = [
    {
      key: "all",
      label: (
        <Space>
          <FileTextOutlined />
          All Diagnoses
          <Badge 
            count={sortedDiagnoses.length} 
            showZero 
            style={{ backgroundColor: '#1890ff' }}
          />
        </Space>
      )
    },
    {
      key: "confirmed_diagnosis",
      label: (
        <Space>
          <CheckCircleOutlined style={{ color: '#52c41a' }} />
          Confirmed
          <Badge 
            count={filterDiagnosesByType(sortedDiagnoses, 'confirmed_diagnosis').length}
            style={{ backgroundColor: '#52c41a' }}
          />
        </Space>
      )
    },
    {
      key: "provisional_diagnosis",
      label: (
        <Space>
          <ClockCircleOutlined style={{ color: '#fa8c16' }} />
          Provisional
          <Badge 
            count={filterDiagnosesByType(sortedDiagnoses, 'provisional_diagnosis').length}
            style={{ backgroundColor: '#fa8c16' }}
          />
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card 
        style={styles.mainCard}
        bodyStyle={{ padding: '24px' }}
      >
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <Title level={3} style={{ margin: 0 }}>Patient Diagnosis</Title>
            <Text type="secondary">
              Review and manage patient diagnosis records
            </Text>
          </Col>
          <Col>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => console.log("Add new diagnosis")}
            >
              Add New Diagnosis
            </Button>
          </Col>
        </Row>

        {/* Statistics */}
        <DiagnosisStats diagnoses={sortedDiagnoses} />

        {/* Diagnosis Tabs */}
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          type="card"
          items={tabItems}
        />

        {/* Diagnosis List */}
        {filteredDiagnoses.length === 0 ? (
          <Empty 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div>
                <Title level={5} type="secondary">
                  No {activeTab === 'all' ? '' : activeTab.replace('_', ' ')} diagnoses found
                </Title>
                <Text type="secondary">
                  {activeTab === 'all' 
                    ? 'No diagnosis records available for this patient.'
                    : `No ${activeTab.replace('_', ' ')} diagnoses found.`
                  }
                </Text>
              </div>
            }
            style={{ margin: '40px 0' }}
          >
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => console.log("Add new diagnosis")}
            >
              Add First Diagnosis
            </Button>
          </Empty>
        ) : (
          <div className="diagnosis-list">
            {filteredDiagnoses.map((item) => (
              <DiagnosisCard
                key={item.id}
                item={item}
                onViewDetails={handleViewDetails}
                onEdit={handleEdit}
                onDelete={handleDelete}
                loadingId={loadingId}
              />
            ))}
          </div>
        )}

        {/* Detail Modal */}
        <DiagnosisDetailModal
          visible={detailModalVisible}
          diagnosis={selectedDiagnosis}
          onClose={() => setDetailModalVisible(false)}
          onEdit={handleEdit}
        />
      </Card>
    </div>
  );
};

export default PatientDiagnosis;