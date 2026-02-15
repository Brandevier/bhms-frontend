// Enhanced PatientNoteModal.js
import React, { useState } from "react";
import {
  Modal,
  Row,
  Col,
  Button,
  Space,
  Typography,
  Tooltip,
  Select,
  Input,
  Form,
  message,
  Card,
  Divider,
  Badge,
  Tag
} from "antd";
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  StrikethroughOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  AlignLeftOutlined,
  AlignCenterOutlined,
  AlignRightOutlined,
  FontColorsOutlined,
  HighlightOutlined,
  LinkOutlined,
  PictureOutlined,
  TableOutlined,
  CodeOutlined,
  SaveOutlined,
  CloseOutlined,
  UndoOutlined,
  RedoOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  UserOutlined,
  CalendarOutlined,
  ThunderboltOutlined
} from "@ant-design/icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import BhmsButton from "../heroComponents/BhmsButton";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const PatientNoteModal = ({ visible, onClose, visit_id, onSave, status }) => {
  const [form] = Form.useForm();
  const [content, setContent] = useState("");
  const [wordCount, setWordCount] = useState(0);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      
      const noteData = {
        ...values,
        note:content,
        visit_id,
        type: "patient_note",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      onSave(noteData);
    } catch (error) {
      console.error("Validation failed:", error);
      message.error("Please fill in all required fields");
    }
  };

  const handleClose = () => {
    form.resetFields();
    setContent("");
    setWordCount(0);
    onClose();
  };

  const handleAiRewrite = () => {
    message.info("AI rewrite feature will be available when connected");
  };

  // Update word count
  const handleContentChange = (value) => {
    setContent(value);
    const text = value.replace(/<[^>]*>/g, '');
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  };

  // Custom toolbar configuration
  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'align': [] }],
        ['link', 'image'],
        ['blockquote', 'code-block'],
        ['clean']
      ],
    }
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet',
    'align', 'link', 'image',
    'blockquote', 'code-block'
  ];

  // Custom toolbar component
  const CustomToolbar = () => (
    <Card 
      size="small" 
      style={{ 
        marginBottom: 16,
        backgroundColor: '#fafafa',
        border: '1px solid #f0f0f0'
      }}
      bodyStyle={{ padding: '12px' }}
    >
      <Row gutter={[8, 8]} align="middle">
        {/* Formatting */}
        <Col>
          <Space>
            <Select 
              size="small" 
              defaultValue="Normal" 
              style={{ width: 100 }}
              dropdownRender={menu => (
                <div>
                  {menu}
                  <div style={{ padding: "4px 12px", borderTop: "1px solid #f0f0f0" }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>Font Style</Text>
                  </div>
                </div>
              )}
            >
              <Option value="normal">Normal</Option>
              <Option value="h1">Heading 1</Option>
              <Option value="h2">Heading 2</Option>
              <Option value="h3">Heading 3</Option>
            </Select>
            
            <Select 
              size="small" 
              defaultValue="Arial" 
              style={{ width: 100 }}
            >
              <Option value="arial">Arial</Option>
              <Option value="times">Times New Roman</Option>
              <Option value="calibri">Calibri</Option>
              <Option value="georgia">Georgia</Option>
            </Select>
            
            <Select 
              size="small" 
              defaultValue="12" 
              style={{ width: 70 }}
            >
              <Option value="10">10</Option>
              <Option value="12">12</Option>
              <Option value="14">14</Option>
              <Option value="16">16</Option>
              <Option value="18">18</Option>
              <Option value="24">24</Option>
            </Select>
          </Space>
        </Col>
        
        <Divider type="vertical" />
        
        {/* Text formatting buttons */}
        <Col>
          <Space>
            <Tooltip title="Bold">
              <Button type="text" size="small" icon={<BoldOutlined />} />
            </Tooltip>
            <Tooltip title="Italic">
              <Button type="text" size="small" icon={<ItalicOutlined />} />
            </Tooltip>
            <Tooltip title="Underline">
              <Button type="text" size="small" icon={<UnderlineOutlined />} />
            </Tooltip>
            <Tooltip title="Strikethrough">
              <Button type="text" size="small" icon={<StrikethroughOutlined />} />
            </Tooltip>
            <Divider type="vertical" />
            <Tooltip title="Font Color">
              <Button type="text" size="small" icon={<FontColorsOutlined />} />
            </Tooltip>
            <Tooltip title="Highlight">
              <Button type="text" size="small" icon={<HighlightOutlined />} />
            </Tooltip>
          </Space>
        </Col>
        
        <Divider type="vertical" />
        
        {/* Alignment and lists */}
        <Col>
          <Space>
            <Tooltip title="Align Left">
              <Button type="text" size="small" icon={<AlignLeftOutlined />} />
            </Tooltip>
            <Tooltip title="Align Center">
              <Button type="text" size="small" icon={<AlignCenterOutlined />} />
            </Tooltip>
            <Tooltip title="Align Right">
              <Button type="text" size="small" icon={<AlignRightOutlined />} />
            </Tooltip>
            <Divider type="vertical" />
            <Tooltip title="Numbered List">
              <Button type="text" size="small" icon={<OrderedListOutlined />} />
            </Tooltip>
            <Tooltip title="Bulleted List">
              <Button type="text" size="small" icon={<UnorderedListOutlined />} />
            </Tooltip>
          </Space>
        </Col>
        
        <Divider type="vertical" />
        
        {/* Insert options */}
        <Col>
          <Space>
            <Tooltip title="Insert Link">
              <Button type="text" size="small" icon={<LinkOutlined />} />
            </Tooltip>
            <Tooltip title="Insert Image">
              <Button type="text" size="small" icon={<PictureOutlined />} />
            </Tooltip>
            <Tooltip title="Insert Table">
              <Button type="text" size="small" icon={<TableOutlined />} />
            </Tooltip>
            <Tooltip title="Code Block">
              <Button type="text" size="small" icon={<CodeOutlined />} />
            </Tooltip>
          </Space>
        </Col>
        
        <Divider type="vertical" />
        
        {/* AI and Actions */}
        <Col>
          <Space>
            <Tooltip title="AI Rewrite">
              <Button 
                type="text" 
                size="small" 
                icon={<ThunderboltOutlined />}
                onClick={handleAiRewrite}
                style={{ color: '#1890ff' }}
              />
            </Tooltip>
            <Tooltip title="Undo">
              <Button type="text" size="small" icon={<UndoOutlined />} />
            </Tooltip>
            <Tooltip title="Redo">
              <Button type="text" size="small" icon={<RedoOutlined />} />
            </Tooltip>
          </Space>
        </Col>
        
        <Divider type="vertical" />
        
        {/* Stats */}
        <Col>
          <Space>
            <Badge 
              count={wordCount} 
              style={{ backgroundColor: '#52c41a' }}
              title="Word Count"
            />
            <Tag color="blue" style={{ fontSize: 12 }}>
              <ClockCircleOutlined /> {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Tag>
          </Space>
        </Col>
      </Row>
    </Card>
  );

  return (
    <Modal
      title={
        <Row justify="space-between" align="middle" style={{ width: '100%' }}>
          <Col>
            <Title level={4} style={{ margin: 0 }}>
              <FileTextOutlined style={{ marginRight: 8 }} />
              New Patient Note
            </Title>
            <Text type="secondary">Document patient observations and clinical notes</Text>
          </Col>
          <Col>
            <Space>
              <Button icon={<UndoOutlined />} size="small" type="text" />
              <Button icon={<RedoOutlined />} size="small" type="text" />
              <Button icon={<SaveOutlined />} size="small" type="text" />
            </Space>
          </Col>
        </Row>
      }
      open={visible}
      onCancel={handleClose}
      width="90%"
      style={{ top: 20 }}
      bodyStyle={{ padding: 24, height: "70vh", overflow: "auto" }}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          title: "",
          priority: "medium",
          category: "general",
          shift: "morning"
        }}
      >
        <Row gutter={[24, 16]}>
          {/* Header Information */}
   

          {/* Instructions */}
          <Col span={24}>
            <Card 
              size="small" 
              style={{ marginBottom: 16, backgroundColor: '#e6f7ff' }}
            >
              <Space>
                <Text type="secondary">
                  ✍️ Write your patient note here. Document observations, vital signs, medications, and patient responses.
                </Text>
                <Button 
                  icon={<ThunderboltOutlined />} 
                  onClick={handleAiRewrite}
                  type="text"
                  style={{ color: '#1890ff' }}
                  title="Rewrite with AI"
                >
                  AI Rewrite
                </Button>
              </Space>
            </Card>
          </Col>

          {/* Main Editor Area */}
          <Col span={24}>
            <Card 
              size="small" 
              title={
                <Space>
                  <Text strong>Note Content</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    (Rich Text Editor)
                  </Text>
                </Space>
              }
              extra={
                <Space>
                  <Badge 
                    count={wordCount} 
                    style={{ backgroundColor: '#52c41a' }}
                    title="Word Count"
                  />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    <CalendarOutlined /> {new Date().toLocaleDateString()}
                  </Text>
                </Space>
              }
            >
              {/* Custom Toolbar */}
              <CustomToolbar />
              
              {/* Rich Text Editor */}
              <Form.Item
                name="content"
                rules={[{ required: true, message: 'Please enter note content' }]}
              >
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={handleContentChange}
                  modules={modules}
                  formats={formats}
                  style={{ height: "25vh", marginBottom: 50 }}
                  placeholder="Start typing your patient note here..."
                />
              </Form.Item>
            </Card>
          </Col>

        
        </Row>

        {/* Footer Actions */}
        <Row justify="space-between" style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid #f0f0f0" }}>
          <Col>
            <Space>
              <BhmsButton 
                block={false} 
                size="medium" 
                outline 
                onClick={handleClose}
              >
                <CloseOutlined /> Cancel
              </BhmsButton>
              <Button
                icon={<SaveOutlined />}
                onClick={() => {
                  const values = form.getFieldsValue();
                  const noteData = {
                    ...values,
                    content,
                    visit_id,
                    status: "draft",
                    type: "patient_note",
                    createdAt: new Date().toISOString()
                  };
                  console.log("Saved as draft:", noteData);
                  message.success("Note saved as draft");
                }}
              >
                Save as Draft
              </Button>
            </Space>
          </Col>
          <Col>
            <Space>
              <Button>
                Save & Close
              </Button>
              <BhmsButton 
                icon={<SaveOutlined />}
                onClick={handleSave}
                loading={status === 'loading'}
                type="primary"
              >
                Save & Publish
              </BhmsButton>
            </Space>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default PatientNoteModal;