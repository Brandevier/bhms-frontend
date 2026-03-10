// ChatUI.jsx
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Drawer, Spin, message } from 'antd';
import { useMediaQuery } from 'react-responsive';
import moment from 'moment';
import toast from 'react-hot-toast';

import { fetchDepartments, fetchRecentChats } from '../../redux/slice/chatSlice';
import { initializeSocket, getSocket, disconnectSocket } from '../../service/socketService';
import AllPatientModal from '../../modal/AllPatientModal';

import DepartmentList from './components/DepartmentList';
import ChatHeader from './components/ChatHeader';
import MessagesArea from './components/MessagesArea';
import MessageInput from './components/MessageInput';
import EmptyChatState from './components/EmptyChatState';

const ChatUI = () => {
  const dispatch = useDispatch();
  const { departments = [], loading } = useSelector((state) => state.chat);
  const { auth } = useSelector((state) => state);
  const [messages, setMessages] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [showMobileDepartments, setShowMobileDepartments] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const isMobile = useMediaQuery({ maxWidth: 768 });
  const currentUser = auth?.user || auth?.admin;
  const isAdmin = !!auth?.admin;

  // WebSocket and data fetching effects remain the same...
  useEffect(() => {
    if (auth?.token) {
      const socket = initializeSocket({
        token: auth.token,
        userId: currentUser?.id,
        role: isAdmin ? 'admin' : 'staff',
        name: currentUser?.username || `${currentUser?.firstName} ${currentUser?.lastName}`,
        avatar: currentUser?.avatar
      }, {
        chatHandlers: {
          onNewMessage: (newMessage) => {
            if (
              newMessage.receiverDepartmentId === selectedDepartment?.id ||
              newMessage.senderDepartmentId === selectedDepartment?.id
            ) {
              setMessages(prev => [...prev, { ...newMessage, status: 'delivered' }]);
              scrollToBottom();
            } else {
              // Increment unread count for another department
              dispatch({
                type: 'chat/incrementUnread',
                payload: newMessage.senderDepartmentId,
              });
            }
          },
          onDepartmentMessageNotification: (notification) => {
            console.log('Department message notification received in ChatUI:', notification);
            // Don't show toast if we're viewing this department
            if (selectedDepartment?.id === notification.receiverDepartmentId) {
              return;
            }
            // Don't show toast for own messages
            if (notification.senderId === currentUser?.id) {
              return;
            }
            
            // Show toast notification
            const messagePreview = notification.text?.length > 50 
              ? notification.text.substring(0, 50) + '...' 
              : notification.text;

            toast.custom(
              (t) => (
                <div
                  className={`${
                    t.visible ? 'animate-enter' : 'animate-leave'
                  } flex items-start gap-3 bg-white shadow-lg rounded-lg p-4 border-l-4 border-blue-500 max-w-sm cursor-pointer hover:shadow-xl transition-shadow`}
                  onClick={() => {
                    toast.dismiss(t.id);
                    window.location.href = '/shared/chat';
                  }}
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">
                      {notification.senderDepartmentName}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {notification.senderName}
                    </p>
                    <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                      {messagePreview}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Click to view in chat
                    </p>
                  </div>
                </div>
              ),
              {
                duration: 5000,
                position: 'top-right'
              }
            );
            
            // Increment unread count for the department
            dispatch({
              type: 'chat/incrementUnread',
              payload: notification.receiverDepartmentId,
            });
          },
          onMessageSent: (sentMessage) => {
            setMessages(prev => prev.map(msg =>
              msg.tempId === sentMessage.tempId ? { ...msg, id: sentMessage.id, status: 'delivered' } : msg
            ));
          },
          onUnreadCountUpdated: (updatedCounts) => {
            dispatch({
              type: 'chat/updateUnreadCounts',
              payload: updatedCounts
            });
          },
        }
      });

      // Listen for unread count events
      socket.on('unread-count-updated', (updatedCounts) => {
        dispatch({ type: 'chat/updateUnreadCounts', payload: updatedCounts });
      });

      socket.on('connect', () => {
        setConnectionStatus('connected');
        console.log('WebSocket connected');
      });

      socket.on('disconnect', () => {
        setConnectionStatus('disconnected');
        console.log('WebSocket disconnected');
      });

      return () => {
        disconnectSocket();
      };
    }
  }, [auth.token, currentUser, isAdmin, selectedDepartment?.id]);

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  useEffect(() => {
    if (selectedDepartment) {
      setMessages([]);
      dispatch(fetchRecentChats({ departmentId: selectedDepartment.id }))
        .unwrap()
        .then((initialMessages) => {
          const departmentMessages = initialMessages.filter(msg =>
            msg?.receiverDepartmentId === selectedDepartment.id
          );
          setMessages(departmentMessages.map(msg => ({ ...msg, status: 'delivered' })));
          scrollToBottom();
        });

      const socket = getSocket();
      if (!socket) return;

      const handleReconnect = () => {
        if (selectedDepartment?.id) {
          socket.emit('join-chat-room', {
            userId: currentUser?.id,
            departmentId: selectedDepartment.id
          });
        }
      };

      socket.on('reconnect', handleReconnect);
      return () => {
        socket.off('reconnect', handleReconnect);
      };
    }
  }, [selectedDepartment, dispatch]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !selectedDepartment || isSending) return;

    const tempId = Date.now();
    const messageData = {
      receiverDepartmentId: selectedDepartment.id,
      text: chatInput,
      senderId: isAdmin ? null : currentUser?.id,
      senderDepartmentId: isAdmin ? null : currentUser?.department.id,
      senderAdminId: isAdmin ? currentUser?.id : null,
      institution_id: currentUser?.institution?.id,
      timestamp: new Date().toISOString(),
      tempId
    };

    setMessages(prev => [...prev, {
      ...messageData,
      Sender: isAdmin ? null : currentUser,
      SenderAdmin: isAdmin ? currentUser : null,
      createdAt: new Date().toISOString(),
      status: 'sending'
    }]);

    setChatInput('');
    setIsSending(true);
    scrollToBottom();

    try {
      const socket = getSocket();
      if (socket?.connected) {
        socket.emit('send-message', messageData, (ack) => {
          if (ack?.success) {
            setMessages(prev => prev.map(msg =>
              msg.tempId === tempId ? { ...msg, id: ack.messageId, status: 'delivered' } : msg
            ));
          } else {
            setMessages(prev => prev.map(msg =>
              msg.tempId === tempId ? { ...msg, status: 'failed' } : msg
            ));
            message.error(ack?.error || 'Failed to send message');
          }
        });
      } else {
        throw new Error('Connection not established');
      }
    } catch (error) {
      setMessages(prev => prev.map(msg =>
        msg.tempId === tempId ? { ...msg, status: 'failed' } : msg
      ));
      message.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredMessages = useMemo(() => {
    if (!selectedDepartment) return [];
    return messages.filter(msg =>
      msg.receiverDepartmentId === selectedDepartment.id ||
      msg.senderDepartmentId === selectedDepartment.id
    ).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }, [messages, selectedDepartment]);

  return (
    <div className="flex h-screen ">
      {/* Mobile Department Drawer */}
      {isMobile && (
        <Drawer
          title="Departments"
          placement="left"
          closable={true}
          onClose={() => setShowMobileDepartments(false)}
          visible={showMobileDepartments}
          width={280}
          bodyStyle={{ padding: 0, backgroundColor: 'white' }}
          headerStyle={{ backgroundColor: 'white', border: 'none' }}
        >
          <DepartmentList
            departments={departments}
            selectedDepartment={selectedDepartment}
            onSelectDepartment={(dept) => {
              
              setSelectedDepartment(dept);
              const socket = getSocket();
              if (socket?.connected) {
                socket.emit('mark-as-read', {
                  userId: currentUser?.id,
                  departmentId: dept.id,
                });
                setShowMobileDepartments(false);
              }
              dispatch({ type: 'chat/clearUnread', payload: dept.id });
            }}
            loading={loading}
            connectionStatus={connectionStatus}
          />
        </Drawer>
      )}

      {/* Desktop Department List */}
      {!isMobile && (
        <div className="w-[30%] border-r border-gray-200 bg-white">
          <DepartmentList
            departments={departments}
            selectedDepartment={selectedDepartment}
            onSelectDepartment={setSelectedDepartment}
            loading={loading}
            connectionStatus={connectionStatus}
          />
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedDepartment ? (
          <>
            <ChatHeader
              department={selectedDepartment}
              isMobile={isMobile}
              onMenuClick={() => setShowMobileDepartments(true)}
              onAddUsers={() => setIsModalVisible(true)}
            />

            <MessagesArea
              messages={filteredMessages}
              currentUser={currentUser}
              loading={loading}
              messagesEndRef={messagesEndRef}
            />

            <MessageInput
              chatInput={chatInput}
              setChatInput={setChatInput}
              onSendMessage={handleSendMessage}
              isSending={isSending}
              disabled={!selectedDepartment}
            />
          </>
        ) : (
          <EmptyChatState
            isMobile={isMobile}
            onSelectDepartment={() => setShowMobileDepartments(true)}
          />
        )}
      </div>

      <AllPatientModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </div>
  );
};

export default ChatUI;