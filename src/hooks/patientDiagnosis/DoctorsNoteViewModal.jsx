// DoctorsNoteViewModal.js
import React from "react";
import {
  Modal,
  Row,
  Col,
  Typography,
  Tag,
  Avatar,
  Space,
  Divider,
  Button,
  Card,
  Badge
} from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  LockOutlined,
  CopyOutlined,
  DownloadOutlined,
  FileTextOutlined
} from "@ant-design/icons";
import { format } from "date-fns";

const { Title, Text } = Typography;

const DoctorsNoteViewModal = ({ visible, note, onClose }) => {
  if (!note) return null;

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy 'at' HH:mm");
    } catch (error) {
      return dateString;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical':
        return 'red';
      case 'high':
        return 'orange';
      case 'medium':
        return 'blue';
      case 'low':
        return 'green';
      default:
        return 'default';
    }
  };

  return (
    <Modal
      title={
        <Row justify="space-between" align="middle" style={{ width: '100%' }}>
          <Col>
            <Space>
              <FileTextOutlined />
              <Title level={4} style={{ margin: 0 }}>
                {note.title || "Untitled Note"}
              </Title>
              {note.is_signed && (
                <Tag icon={<CheckCircleOutlined />} color="green">
                  Signed & Locked
                </Tag>
              )}
            </Space>
          </Col>
          <Col>
            <Button icon={<CopyOutlined />} size="small">
              Copy
            </Button>
          </Col>
        </Row>
      }
      open={visible}
      onCancel={onClose}
      width="80%"
      style={{ top: 20 }}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
        <Button key="download" type="primary" icon={<DownloadOutlined />}>
          Download as PDF
        </Button>
      ]}
    >
      <Row gutter={[24, 16]}>
        {/* Note Metadata */}
        <Col span={24}>
          <Card size="small">
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Space direction="vertical" size="small">
                  <Text type="secondary">Priority</Text>
                  <Tag color={getPriorityColor(note.priority)}>
                    {note.priority?.toUpperCase()}
                  </Tag>
                </Space>
              </Col>
              <Col span={8}>
                <Space direction="vertical" size="small">
                  <Text type="secondary">Category</Text>
                  <Text strong>{note.category}</Text>
                </Space>
              </Col>
              <Col span={8}>
                <Space direction="vertical" size="small">
                  <Text type="secondary">Created</Text>
                  <Space>
                    <CalendarOutlined />
                    <Text strong>{formatDate(note.createdAt || note.created_at)}</Text>
                  </Space>
                </Space>
              </Col>
              
              {note.is_signed && note.signed_at && (
                <>
                  <Col span={12}>
                    <Space direction="vertical" size="small">
                      <Text type="secondary">Signed Date</Text>
                      <Space>
                        <ClockCircleOutlined />
                        <Text strong>{formatDate(note.signed_at)}</Text>
                      </Space>
                    </Space>
                  </Col>
                  <Col span={12}>
                    <Space direction="vertical" size="small">
                      <Text type="secondary">Signed By</Text>
                      <Space>
                        <Avatar 
                          size="small" 
                          src={note.staff?.profileImage}
                          icon={<UserOutlined />}
                          onClick={()=>console.log(note)}
                        />
                        <Text strong>
                          Dr. {note.Staff?.firstName} {note.Staff?.lastName}
                        </Text>
                      </Space>
                    </Space>
                  </Col>
                </>
              )}
            </Row>
          </Card>
        </Col>

        {/* Note Content */}
        <Col span={24}>
          <Card 
            title={<Text strong>Note Content</Text>}
            size="small"
            style={{ minHeight: 300 }}
          >
            <div
              style={{ padding: 16 }}
              dangerouslySetInnerHTML={{ __html: note.note || "<em>No content</em>" }}
            />
          </Card>
        </Col>

        {/* Tags and Summary */}
        <Col span={24}>
          <Card size="small">
            <Row gutter={[16, 16]}>
              {note.tags && note.tags.length > 0 && (
                <Col span={12}>
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <Text type="secondary">Tags</Text>
                    <Space wrap>
                      {note.tags.map((tag, index) => (
                        <Tag key={index}>{tag}</Tag>
                      ))}
                    </Space>
                  </Space>
                </Col>
              )}
              
              {note.summary && (
                <Col span={12}>
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <Text type="secondary">Summary</Text>
                    <Text>{note.summary}</Text>
                  </Space>
                </Col>
              )}
            </Row>
          </Card>
        </Col>
      </Row>
    </Modal>
  );
};

export default DoctorsNoteViewModal;