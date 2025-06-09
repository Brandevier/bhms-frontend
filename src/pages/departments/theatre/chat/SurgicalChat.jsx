import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageOutlined, 
  UserOutlined, 
  PaperClipOutlined, 
  SendOutlined,
  CheckCircleOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { 
  Avatar, 
  Button, 
  Card, 
  Input, 
  List, 
  Space, 
  Tag, 
  Typography, 
  Upload,
  Badge,
  Divider,
  Popover
} from 'antd';
import { useParams } from 'react-router-dom';

const { Text } = Typography;
const { TextArea } = Input;

const SurgicalChat = () => {
  const { caseId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [fileList, setFileList] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const messagesEndRef = useRef(null);

  // Mock data - replace with real API calls
  useEffect(() => {
    setMessages([
      {
        id: 1,
        sender: 'Dr. Smith',
        role: 'Surgeon',
        avatar: 'S',
        content: 'Patient is under anesthesia, ready for incision',
        timestamp: '09:15 AM',
        status: 'read'
      },
      {
        id: 2,
        sender: 'Nurse Brown',
        role: 'Scrub Nurse',
        avatar: 'B',
        content: 'Instrument count correct pre-incision',
        timestamp: '09:16 AM',
        status: 'read'
      },
      {
        id: 3,
        sender: 'Dr. Chen',
        role: 'Anesthesiologist',
        avatar: 'C',
        content: 'Vitals stable, BP 120/80, HR 72',
        timestamp: '09:17 AM',
        status: 'delivered'
      }
    ]);

    setActiveUsers([
      { name: 'Dr. Smith', role: 'Surgeon', status: 'online' },
      { name: 'Dr. Chen', role: 'Anesthesiologist', status: 'online' },
      { name: 'Nurse Brown', role: 'Scrub Nurse', status: 'busy' },
      { name: 'Nurse Lee', role: 'Circulator', status: 'away' }
    ]);
  }, [caseId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const newMsg = {
      id: messages.length + 1,
      sender: 'You',
      role: 'You',
      avatar: 'Y',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  const beforeUpload = (file) => {
    setFileList([...fileList, file]);
    return false;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const UserStatusIndicator = ({ status }) => {
    const statusColor = {
      online: 'green',
      busy: 'red',
      away: 'orange',
      offline: 'gray'
    };

    return (
      <Badge 
        status={statusColor[status] || 'default'} 
        className="mr-2" 
      />
    );
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex items-center mb-4">
        <MessageOutlined className="text-2xl mr-2 text-blue-500" />
        <Text strong className="text-xl">OR Team Chat - Case #{caseId}</Text>
        <Popover
          content={
            <div className="w-64">
              <div className="font-bold mb-2 flex items-center">
                <TeamOutlined className="mr-2" />
                Active Team Members
              </div>
              <List
                size="small"
                dataSource={activeUsers}
                renderItem={user => (
                  <List.Item>
                    <div className="flex items-center w-full">
                      <UserStatusIndicator status={user.status} />
                      <span className="flex-grow">{user.name}</span>
                      <Tag color="blue">{user.role}</Tag>
                    </div>
                  </List.Item>
                )}
              />
            </div>
          }
          trigger="click"
          placement="bottomRight"
        >
          <Button 
            type="text" 
            icon={<TeamOutlined />} 
            className="ml-auto"
          >
            {activeUsers.filter(u => u.status === 'online').length} Online
          </Button>
        </Popover>
      </div>

      <Card 
        bordered={false} 
        className="flex-grow mb-4 shadow-sm overflow-hidden"
        bodyStyle={{ padding: 0, height: '100%', display: 'flex', flexDirection: 'column' }}
      >
        <div className="p-4 overflow-y-auto flex-grow" style={{ maxHeight: '60vh' }}>
          <List
            dataSource={messages}
            renderItem={message => (
              <List.Item className="!px-4 !py-3">
                <div className={`flex ${message.sender === 'You' ? 'justify-end' : ''}`}>
                  {message.sender !== 'You' && (
                    <Avatar className="mr-3" style={{ backgroundColor: '#1890ff' }}>
                      {message.avatar}
                    </Avatar>
                  )}
                  
                  <div className={`max-w-xs md:max-w-md ${message.sender === 'You' ? 'text-right' : ''}`}>
                    <div className="flex items-center">
                      {message.sender === 'You' && (
                        <CheckCircleOutlined 
                          className={`mr-1 ${message.status === 'read' ? 'text-blue-500' : 'text-gray-400'}`} 
                        />
                      )}
                      <Text strong>{message.sender}</Text>
                      <Text type="secondary" className="ml-2 text-xs">{message.timestamp}</Text>
                    </div>
                    <Tag color="blue" className="mt-1">{message.role}</Tag>
                    <div className={`mt-2 p-3 rounded-lg ${message.sender === 'You' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      {message.content}
                    </div>
                  </div>
                </div>
              </List.Item>
            )}
          />
          <div ref={messagesEndRef} />
        </div>

        <Divider className="my-0" />

        <div className="p-4">
          <div className="flex mb-2">
            <Upload
              fileList={fileList}
              beforeUpload={beforeUpload}
              onRemove={file => {
                setFileList(fileList.filter(f => f.uid !== file.uid));
              }}
              maxCount={3}
              className="mr-2"
            >
              <Button icon={<PaperClipOutlined />}>Attach</Button>
            </Upload>
            
            {fileList.length > 0 && (
              <div className="flex-grow flex items-center">
                <Text type="secondary" className="mr-2">
                  {fileList.length} file{fileList.length > 1 ? 's' : ''} attached
                </Text>
              </div>
            )}
          </div>

          <Space.Compact className="w-full">
            <TextArea
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              autoSize={{ minRows: 2, maxRows: 4 }}
              className="flex-grow"
            />
            <Button 
              type="primary" 
              icon={<SendOutlined />} 
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
            >
              Send
            </Button>
          </Space.Compact>
        </div>
      </Card>

      <div className="text-center text-gray-500 text-sm">
        Messages are encrypted and archived for medical records
      </div>
    </div>
  );
};

export default SurgicalChat;