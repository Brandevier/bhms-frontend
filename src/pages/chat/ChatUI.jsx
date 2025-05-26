import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDepartments, fetchRecentChats, sendMessage } from "../../redux/slice/chatSlice";
import { Layout, List, Input, Button, Upload, Typography, Avatar, Spin, Tooltip, Badge } from "antd";
import { SendOutlined, PaperClipOutlined, UsergroupAddOutlined, MenuOutlined } from "@ant-design/icons";
import moment from "moment";
import AllPatientModal from "../../modal/AllPatientModal";
import { useMediaQuery } from "react-responsive";

const { Content } = Layout;
const { Text } = Typography;

const ChatUI = () => {
  const dispatch = useDispatch();
  const { chats, departments = [], loading, chatLoading } = useSelector((state) => state.chat);
  const { auth } = useSelector((state) => state);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [ws, setWs] = useState(null);
  const currentUser = auth?.user || auth?.admin;
  const isAdmin = !!auth?.admin;
  const [chatInput, setChatInput] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [showMobileDepartments, setShowMobileDepartments] = useState(false);

  const isMobile = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    dispatch(fetchDepartments());
    const socket = new WebSocket("ws://localhost:3000");
    setWs(socket);
    socket.onopen = () => console.log("Connected to WebSocket");
    socket.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      if (newMessage.receiverDepartmentId === selectedDepartment?.id) {
        dispatch(sendMessage(newMessage));
      }
    };
    socket.onclose = () => console.log("WebSocket disconnected, attempting to reconnect...");

    return () => socket.close();
  }, [dispatch, selectedDepartment]);

  useEffect(() => {
    if (selectedDepartment) {
      dispatch(fetchRecentChats({ departmentId: selectedDepartment.id }));
    }
  }, [selectedDepartment, dispatch]);

  const handleSendMessage = () => {
    if (!chatInput.trim() || !selectedDepartment) return;

    const messageData = { 
      receiverDepartmentId: selectedDepartment.id, 
      text: chatInput, 
    };
    
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(messageData));
    }

    setChatInput("");
  };

  const groupMessagesByDate = (messages = []) => {
    return messages.reduce((acc, message) => {
      if (!message) return acc;
      const date = moment(message.createdAt).format("YYYY-MM-DD");
      if (!acc[date]) acc[date] = [];
      acc[date].push(message);
      return acc;
    }, {});
  };

  const groupedMessages = groupMessagesByDate(chats);
  const sortedDates = Object.keys(groupedMessages).sort((a, b) => moment(a).diff(moment(b)));
  const reversedGroupedMessages = sortedDates.reduce((acc, date) => {
    acc[date] = groupedMessages[date].reverse();
    return acc;
  }, {});

  return (
    <div style={{ 
      height: "90vh", 
      border: "1px solid #E5E7EB", 
      borderRadius: 8,
      display: "flex", // Main container as flex
      flexDirection: isMobile ? "column" : "row" // Column for mobile, row for desktop
    }}>
      {/* Mobile Department Toggle */}
      {isMobile && (
        <div style={{ padding: "8px 16px", borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center" }}>
          <Button 
            icon={<MenuOutlined />} 
            onClick={() => setShowMobileDepartments(!showMobileDepartments)}
            style={{ marginRight: 8 }}
          />
          <Text strong>{selectedDepartment?.name || "Select Department"}</Text>
        </div>
      )}

      {/* Mobile Department List */}
      {isMobile && showMobileDepartments && (
        <div style={{ 
          padding: "8px", 
          borderBottom: "1px solid #E5E7EB",
          overflowX: "auto",
          whiteSpace: "nowrap",
          background: "#F7F9FC"
        }}>
          {departments.map(department => (
            <Tooltip key={department.id} title={department.name} placement="bottom">
              <Avatar
                size="large"
                style={{ 
                  margin: "0 8px",
                  cursor: "pointer",
                  backgroundColor: selectedDepartment?.id === department.id ? "#1890ff" : "#E5E7EB",
                  color: selectedDepartment?.id === department.id ? "#fff" : "#000"
                }}
                onClick={() => {
                  setSelectedDepartment(department);
                  setShowMobileDepartments(false);
                }}
              >
                {department.name?.charAt(0) || "?"}
              </Avatar>
            </Tooltip>
          ))}
        </div>
      )}

      {/* Department List - Desktop */}
      {!isMobile && (
        <div style={{ 
          width: 250,
          minWidth: 250, // Ensure it doesn't shrink
          background: "#F7F9FC", 
          padding: "16px", 
          borderRight: "1px solid #E5E7EB",
          overflowY: "auto",
          height: "100%"
        }}>
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
        </div>
      )}

      {/* Chat Section */}
      <div style={{ 
        flex: 1, // Takes remaining space
        display: "flex",
        flexDirection: "column",
        background: "#fff",
        height: "100%",
        overflow: "hidden"
      }}>
        {selectedDepartment ? (
          <>
            {/* Chat Header */}
            <div style={{
              padding: "12px 16px",
              borderBottom: "1px solid #E5E7EB",
              fontWeight: "bold",
              background: "#F5F5F5",
              flexShrink: 0 // Prevent header from shrinking
            }}>
              Chat with {selectedDepartment.name}
            </div>

            {/* Chat Messages */}
            <div style={{ 
              flex: 1, 
              overflowY: "auto", 
              padding: "16px"
            }}>
              {chatLoading ? (
                <Spin size="large" style={{ display: "block", textAlign: "center", marginTop: 50 }} />
              ) : (
                Object.entries(reversedGroupedMessages).map(([date, messages]) => (
                  <div key={date}>
                    <Text type="secondary" style={{ display: "block", textAlign: "center", marginBottom: 8 }}>
                      {moment(date).calendar()}
                    </Text>
                    
                    <List
                      dataSource={messages}
                      renderItem={(msg) => {
                        if (!msg) return null;

                        const isSender = msg.Sender?.id === currentUser?.id || msg.SenderAdmin?.id === currentUser?.id;
                        const fromAdmin = !!msg.SenderAdmin?.id;
                        const senderName = 
                          msg.SenderAdmin?.username || 
                          `${msg.Sender?.firstName} ${msg.Sender?.lastName}` ||  
                          "Unknown";

                        return (
                          <List.Item style={{ 
                            display: "flex", 
                            justifyContent: isSender ? "flex-end" : "flex-start",
                            padding: "4px 0"
                          }}>
                            <div
                              style={{
                                padding: "10px 14px",
                                borderRadius: 12,
                                background: isSender ? "#DCF8C6" : "#E5E7EB",
                                maxWidth: isMobile ? "85%" : "70%",
                                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                                position: "relative",
                              }}
                            >
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
            </div>

            {/* Chat Input */}
            <div style={{ 
              display: "flex", 
              padding: "12px 16px", 
              borderTop: "1px solid #E5E7EB", 
              background: "#fff",
              flexShrink: 0 // Prevent input from shrinking
            }}>
              <Upload showUploadList={false} beforeUpload={() => false}>
                <Button icon={<PaperClipOutlined />} style={{ marginRight: 8 }} />
              </Upload>
              <Button icon={<UsergroupAddOutlined />} style={{ marginRight: 8 }} onClick={() => setIsModalVisible(true)}/>
              <Input
                placeholder="Type a message..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onPressEnter={handleSendMessage}
                style={{ flex: 1, borderRadius: 6 }}
              />
              <Tooltip title="Send message">
                <Button type="primary" icon={<SendOutlined />} onClick={handleSendMessage} style={{ marginLeft: 8 }} />
              </Tooltip>
            </div>
          </>
        ) : (
          <div style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#888",
            fontSize: 16,
          }}>
            {isMobile ? (
              <Button type="primary" onClick={() => setShowMobileDepartments(true)}>
                Select Department
              </Button>
            ) : (
              "Please select a department to start chatting."
            )}
          </div>
        )}
      </div>
      <AllPatientModal visible={isModalVisible} onClose={() => setIsModalVisible(false)} />
    </div>
  );
};

export default ChatUI;

