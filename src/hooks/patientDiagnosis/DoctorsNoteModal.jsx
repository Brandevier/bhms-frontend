// DoctorsNoteModal.js
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
  Divider
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
 BookOutlined
} from "@ant-design/icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const DoctorsNoteModal = ({ visible, onClose, onSave,loading }) => {
  const [form] = Form.useForm();
  const [content, setContent] = useState("");

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const noteData = {
        ...values,
        note:content,
        type: "doctors_note",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      onSave(noteData);
      message.success("Doctor's note saved successfully");
      handleClose();
    } catch (error) {
      console.error("Error saving note:", error);
      message.error("Failed to save doctor's note");
    } finally {
      
    }
  };

  const handleClose = () => {
    form.resetFields();
    setContent("");
    onClose();
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
        ['link', 'image', 'video'],
        ['blockquote', 'code-block'],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        ['clean']
      ],
      handlers: {
        // Add custom handlers here if needed
      }
    }
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet',
    'align', 'link', 'image', 'video',
    'blockquote', 'code-block'
  ];

  // Custom toolbar buttons
  const CustomToolbar = () => (
    <div className="custom-toolbar">
      <Row gutter={[8, 8]} style={{ marginBottom: 16, padding: "8px 0", borderBottom: "1px solid #f0f0f0" }}>
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
        
        {/* Undo/Redo */}
        <Col>
          <Space>
            <Tooltip title="Undo">
              <Button type="text" size="small" icon={<UndoOutlined />} />
            </Tooltip>
            <Tooltip title="Redo">
              <Button type="text" size="small" icon={<RedoOutlined />} />
            </Tooltip>
          </Space>
        </Col>
      </Row>
    </div>
  );

  return (
    <Modal
      title={
        <Row justify="start" align="middle">
          <Col>
            <Title level={4} style={{ margin: 0 }}>
              <BookOutlined style={{ marginRight: 8 }} />
              Add Doctor's Note
            </Title>
            <Text type="secondary">Create a detailed medical note</Text>
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
      visible={visible}
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
          category: "general"
        }}
      >
        <Row gutter={[24, 16]}>
          <Col span={24}>
            <Card size="small" style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={12}>
                 
                </Col>
                <Col span={6}>
                  <Form.Item
                    label="Priority"
                    name="priority"
                  >
                    <Select size="large">
                      <Option value="low">Low</Option>
                      <Option value="medium">Medium</Option>
                      <Option value="high">High</Option>
                      <Option value="critical">Critical</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label="Category"
                    name="category"
                  >
                    <Select size="large">
                      <Option value="general">General</Option>
                      <Option value="followup">Follow-up</Option>
                      <Option value="consultation">Consultation</Option>
                      <Option value="procedure">Procedure</Option>
                      <Option value="assessment">Assessment</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

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
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Word Count: {content.replace(/<[^>]*>/g, '').length}
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
                  onChange={setContent}
                  modules={modules}
                  formats={formats}
                  style={{ height: "40vh", marginBottom: 50 }}
                  placeholder="Start typing your note here..."
                />
              </Form.Item>
            </Card>
          </Col>

          
        </Row>

        {/* Footer Actions */}
        <Row justify="space-between" style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid #f0f0f0" }}>
          <Col>
            <Space>
              <Button
                icon={<CloseOutlined />}
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                icon={<SaveOutlined />}
                type="primary"
                loading={loading}
                onClick={handleSave}
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
              <Button
                type="primary"
                loading={loading}
                onClick={handleSave}
              >
                Save & Publish
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default DoctorsNoteModal;