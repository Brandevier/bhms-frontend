// src/components/staff/video/VideoCallModal.js
import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Select,
  Input,
  Button,
  List,
  Avatar,
  Tag,
  Card,
  Divider,
  Space,
  message,
  Spin,
} from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  SearchOutlined,
  PlayCircleOutlined,
  VideoCameraOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { Search } = Input;

const VideoCallModal = ({
  visible,
  onCancel,
  availableDepartments,
  currentUser,
  onStartCall,
  loading = false,
}) => {
  const [form] = Form.useForm();
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [callTitle, setCallTitle] = useState('');

  useEffect(() => {
    if (visible) {
      // Reset form when modal opens
      form.resetFields();
      setSelectedDepartments([]);
      setSearchTerm('');
      setCallTitle('');
    }
  }, [visible, form]);

  const filteredDepartments = availableDepartments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDepartmentSelect = (department) => {
    if (!selectedDepartments.find(dept => dept.id === department.id)) {
      setSelectedDepartments(prev => [...prev, department]);
    }
  };

  const handleRemoveDepartment = (departmentId) => {
    setSelectedDepartments(prev => prev.filter(dept => dept.id !== departmentId));
  };

  const handleStartCall = () => {
    if (selectedDepartments.length === 0) {
      message.error('Please select at least one department');
      return;
    }

    if (!callTitle.trim()) {
      message.error('Please enter a call title');
      return;
    }

    onStartCall({
      title: callTitle,
      departments: selectedDepartments,
      initiator: currentUser,
      timestamp: new Date().toISOString(),
    });
  };

  const getAccessTypeColor = (accessType) => {
    const colors = {
      full: 'green',
      limited: 'orange',
      read_only: 'red',
    };
    return colors[accessType] || 'blue';
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <VideoCameraOutlined style={{ color: '#1890ff' }} />
          <span>Start Video Conference</span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
      destroyOnClose
      className="video-call-modal"
    >
      <Spin spinning={loading}>
        <div className="space-y-6">
          {/* Call Configuration Section */}
          <Card size="small" title="Call Configuration">
            <Form form={form} layout="vertical">
              <Form.Item
                label="Call Title"
                required
                tooltip="Enter a descriptive title for this video call"
              >
                <Input
                  placeholder="e.g., Emergency Meeting, Daily Standup, Patient Consultation"
                  value={callTitle}
                  onChange={(e) => setCallTitle(e.target.value)}
                  size="large"
                />
              </Form.Item>

              <Form.Item label="Selected Departments">
                <div className="space-y-2">
                  {selectedDepartments.length === 0 ? (
                    <div className="text-gray-400 text-center py-4">
                      No departments selected yet
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {selectedDepartments.map(dept => (
                        <Tag
                          key={dept.id}
                          closable
                          onClose={() => handleRemoveDepartment(dept.id)}
                          color="blue"
                          style={{ padding: '4px 8px', borderRadius: '6px' }}
                        >
                          <TeamOutlined className="mr-1" />
                          {dept.name}
                          <Tag
                            color={getAccessTypeColor(dept.access_type)}
                            style={{ marginLeft: '4px', fontSize: '10px' }}
                          >
                            {dept.access_type}
                          </Tag>
                        </Tag>
                      ))}
                    </div>
                  )}
                </div>
              </Form.Item>
            </Form>
          </Card>

          {/* Available Departments Section */}
          <Card
            size="small"
            title={
              <div className="flex items-center justify-between">
                <span>Available Departments</span>
                <Search
                  placeholder="Search departments..."
                  prefix={<SearchOutlined />}
                  style={{ width: 200 }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  size="small"
                />
              </div>
            }
          >
            <div className="max-h-64 overflow-y-auto">
              <List
                dataSource={filteredDepartments}
                renderItem={department => (
                  <List.Item
                    className={`p-3 cursor-pointer hover:bg-blue-50 transition-colors rounded-lg ${
                      selectedDepartments.find(d => d.id === department.id) 
                        ? 'bg-blue-50 border border-blue-200' 
                        : ''
                    }`}
                    onClick={() => handleDepartmentSelect(department)}
                    actions={[
                      <Button
                        type="link"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDepartmentSelect(department);
                        }}
                        disabled={selectedDepartments.find(d => d.id === department.id)}
                      >
                        Add
                      </Button>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          icon={<TeamOutlined />}
                          style={{
                            backgroundColor: selectedDepartments.find(d => d.id === department.id) 
                              ? '#1890ff' 
                              : '#f0f0f0',
                            color: selectedDepartments.find(d => d.id === department.id) 
                              ? 'white' 
                              : '#666',
                          }}
                        />
                      }
                      title={
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{department.name}</span>
                          <Tag color="default" size="small">
                            {department.type}
                          </Tag>
                        </div>
                      }
                      description={
                        <div className="text-xs text-gray-500">
                          Code: {department.code} | Access: {department.access_type}
                        </div>
                      }
                    />
                  </List.Item>
                )}
                locale={{ emptyText: 'No departments available' }}
              />
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button onClick={onCancel} size="large">
              Cancel
            </Button>
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={handleStartCall}
              size="large"
              disabled={selectedDepartments.length === 0 || !callTitle.trim()}
              style={{
                background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
                border: 'none',
                borderRadius: '6px',
              }}
            >
              Start Video Call
            </Button>
          </div>

          {/* Quick Tips */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="text-sm font-semibold mb-2">💡 Quick Tips</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>Select departments that need to join the video conference</li>
              <li>Ensure all participants have the necessary access permissions</li>
              <li>Use a clear, descriptive title for easy identification</li>
            </ul>
          </div>
        </div>
      </Spin>
    </Modal>
  );
};

export default VideoCallModal;