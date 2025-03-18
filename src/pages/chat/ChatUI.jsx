import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDepartments, fetchRecentChats, sendMessage } from "../../redux/slice/chatSlice";
import { Layout, List, Input, Button, Upload, Typography, Avatar, Spin, Tooltip } from "antd";
import { SendOutlined, PaperClipOutlined,UsergroupAddOutlined } from "@ant-design/icons";
import moment from "moment";

const { Sider, Content } = Layout;
const { Text } = Typography;

const ChatUI = () => {
  const dispatch = useDispatch();
  const { chats, departments = [], loading, chatLoading } = useSelector((state) => state.chat);
  const { auth } = useSelector((state) => state);

  const currentUser = auth?.user || auth?.admin; // Handle both user and admin
  const isAdmin = !!auth?.admin; // Check if the logged-in user is an admin

  const [chatInput, setChatInput] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  useEffect(() => {
    if (selectedDepartment) {
      dispatch(fetchRecentChats({ departmentId: selectedDepartment.id }));
    }
  }, [selectedDepartment, dispatch]);

  const handleSendMessage = () => {
    if (!chatInput.trim() || !selectedDepartment) return;

    const data = { 
      receiverDepartmentId: selectedDepartment.id, 
      text: chatInput, 
    };
    
    dispatch(sendMessage(data)).unwrap().then((res)=>{
        dispatch(fetchDepartments());
    });
    setChatInput("");
    
  };

  // Group messages by date
  const groupMessagesByDate = (messages = []) => {
    return messages.reduce((acc, message) => {
        if (!message) return acc; // Ignore undefined messages

        const date = moment(message.createdAt).format("YYYY-MM-DD");
        if (!acc[date]) acc[date] = [];
        acc[date].push(message); // Push the message as is
        return acc;
    }, {});
};

// Reverse the order of messages inside each date group
const groupedMessages = groupMessagesByDate(chats);
Object.keys(groupedMessages).forEach(date => {
    groupedMessages[date].reverse(); // Reverse the messages array for each date
});

console.log(groupedMessages);


  return (
    <Layout style={{ height: "90vh", border: "1px solid #E5E7EB", borderRadius: 8 }}>
      {/* Left Sidebar - Departments */}
      <Sider width={250} style={{ background: "#F7F9FC", padding: "16px", borderRight: "1px solid #E5E7EB" }}>
        <Text strong style={{ fontSize: 16, display: "block", marginBottom: 12 }}>
          Departments
        </Text>
        <List
          loading={loading}
          dataSource={departments}
          renderItem={(department) => (
            <List.Item
              key={department.id}
              style={{
                padding: "10px 16px",
                cursor: "pointer",
                background: selectedDepartment?.id === department.id ? "#E3F2FD" : "transparent",
                borderRadius: 6,
              }}
              onClick={() => setSelectedDepartment(department)}
            >
              <Avatar shape="square" size="small" style={{ backgroundColor: "#1890ff", marginRight: 10 }}>
                {department.name?.charAt(0) || "?"}
              </Avatar>
              {department.name || "Unknown"}
            </List.Item>
          )}
        />
      </Sider>

      {/* Right Chat Section */}
      <Layout style={{ background: "#fff", display: "flex", flexDirection: "column" }}>
        {selectedDepartment ? (
          <>
            {/* Chat Header */}
            <div
              style={{
                padding: "12px 16px",
                borderBottom: "1px solid #E5E7EB",
                fontWeight: "bold",
                background: "#F5F5F5",
              }}
            >
              Chat with {selectedDepartment.name}
            </div>

            {/* Chat Messages */}
            <Content style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
              {chatLoading ? (
                <Spin size="large" style={{ display: "block", textAlign: "center", marginTop: 50 }} />
              ) : (
                Object.entries(groupedMessages).map(([date, messages]) => (
                  <div key={date}>
                    {/* Date Header */}
                    <Text type="secondary" style={{ display: "block", textAlign: "center", marginBottom: 8 }}>
                      {moment(date).calendar()}
                    </Text>
                    
                    <List
                      dataSource={messages}
                      renderItem={(msg) => {
                        if (!msg) return null; // Avoid undefined messages

                        const isSender = msg.senderId === currentUser?.id || msg.SenderAdmin?.id === currentUser?.id;
                        const fromAdmin = !!msg.SenderAdmin?.id;
                        const senderName = 
                          msg.SenderAdmin?.username || 
                          msg.Sender?.name ||  
                          "Unknown";

                        return (
                          <List.Item style={{ display: "flex", justifyContent: isSender ? "flex-end" : "flex-start" }}>
                            <div
                              style={{
                                padding: "10px 14px",
                                borderRadius: 12,
                                background: isSender ? "#DCF8C6" : "#E5E7EB",
                                maxWidth: "70%",
                                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                                position: "relative",
                              }}
                            >
                              {/* Show Admin Indicator */}
                              {fromAdmin && (
                                <Text type="danger" style={{ fontSize: 12, fontWeight: "bold", position: "absolute", top: -18, right: 0 }}>
                                  Admin
                                </Text>
                              )}

                              <Text strong>{isSender ? "You" : senderName}</Text>
                              <p style={{ margin: 5 }}>{msg.text}</p>
                              <Text type="secondary" style={{ fontSize: 12, display: "block", textAlign: "right" }}>
                                {moment(msg.createdAt).format("h:mm A")}
                              </Text>
                            </div>
                          </List.Item>
                        );
                      }}
                    />
                  </div>
                ))
              )}
            </Content>

            {/* Chat Input */}
            <div style={{ display: "flex", padding: "12px 16px", borderTop: "1px solid #E5E7EB", background: "#fff" }}>
              <Upload showUploadList={false} beforeUpload={() => false}>
                <Button icon={<PaperClipOutlined />} style={{ marginRight: 8 }} />
              </Upload>
              <Button icon={<UsergroupAddOutlined />} style={{ marginRight: 8 }} />
              <Input
                placeholder="Type a message..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onPressEnter={handleSendMessage}
                style={{ flex: 1, borderRadius: 6 }}
              />
             <Tooltip title="Tag patient">
             <Button type="primary" icon={<SendOutlined />} onClick={handleSendMessage} style={{ marginLeft: 8 }} />
             </Tooltip>
            </div>
          </>
        ) : (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#888",
              fontSize: 16,
            }}
          >
            Please select a department to start chatting.
          </div>
        )}
      </Layout>
    </Layout>
  );
};

export default ChatUI;
