import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, List, Avatar, Select, Tag, Modal, Badge, Divider } from 'antd';
import { PhoneOutlined, UserAddOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';

const { Option } = Select;

const CallComponent = () => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [callStatus, setCallStatus] = useState('idle'); // 'idle', 'calling', 'ringing', 'in-call'
  const [currentCall, setCurrentCall] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const peerConnection = useRef(null);
  const localStream = useRef(null);
  const remoteAudio = useRef(null);

  const user = useSelector((state) => state.auth.user);
  const admin = useSelector((state) => state.auth.admin);

  const currentUser = user || admin;
  const role = user ? 'staff' : 'admin';

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io('http://localhost:7000', {
      withCredentials: true,
      transports: ['websocket'], // Force WebSocket transport
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });


    newSocket.emit('register', {
      userId: currentUser.id,
      department: user?.department?.id || null, // only user has department
      role: role,
    });

    newSocket.on('online-users', (users) => {
      setOnlineUsers(users);
      // Extract unique departments
      const uniqueDepartments = [...new Set(users.map(user => user.department))];
      setDepartments(uniqueDepartments);
    });

    newSocket.on('incoming-call', (callData) => {
      setIncomingCall(callData);
      setCallStatus('ringing');
    });

    newSocket.on('call-accepted', (data) => {
      setCallStatus('in-call');
      setCurrentCall(data);
    });

    newSocket.on('call-rejected', () => {
      setCallStatus('idle');
      Modal.info({
        title: 'Call Rejected',
        content: 'The recipient rejected your call',
      });
    });

    newSocket.on('call-ended', () => {
      endCall();
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [currentUser]);

  const startCall = async () => {
    if (selectedUsers.length === 0) {
      Modal.warning({
        title: 'No Users Selected',
        content: 'Please select at least one user to call',
      });
      return;
    }

    try {
      // Get user media
      localStream.current = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Initialize WebRTC
      peerConnection.current = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });

      // Setup WebRTC handlers
      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate && socket) {
          socket.emit('signal', {
            targetSocketId: currentCall?.calleeSocketId,
            signal: event.candidate
          });
        }
      };

      peerConnection.current.ontrack = (event) => {
        if (remoteAudio.current) {
          remoteAudio.current.srcObject = event.streams[0];
        }
      };

      // Add local stream
      localStream.current.getTracks().forEach(track => {
        peerConnection.current.addTrack(track, localStream.current);
      });

      // Initiate call
      socket.emit('initiate-call', {
        targetUserIds: selectedUsers,
        callerId: currentUser.id,
        callerName: currentUser.name
      });

      setCallStatus('calling');
    } catch (error) {
      console.error('Error starting call:', error);
      Modal.error({
        title: 'Call Failed',
        content: 'Could not access microphone or start call',
      });
    }
  };

  const answerCall = async () => {
    try {
      localStream.current = await navigator.mediaDevices.getUserMedia({ audio: true });

      peerConnection.current = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });

      // Setup WebRTC handlers (similar to startCall)
      // ...

      socket.emit('accept-call', {
        callId: incomingCall.callId,
        callerSocketId: incomingCall.callerSocketId
      });

      setCallStatus('in-call');
      setCurrentCall({
        callId: incomingCall.callId,
        callerId: incomingCall.callerId,
        isInitiator: false
      });
      setIncomingCall(null);
    } catch (error) {
      console.error('Error answering call:', error);
    }
  };

  const rejectCall = () => {
    socket.emit('reject-call', {
      callId: incomingCall.callId,
      callerSocketId: incomingCall.callerSocketId
    });
    setIncomingCall(null);
    setCallStatus('idle');
  };

  const endCall = () => {
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    if (localStream.current) {
      localStream.current.getTracks().forEach(track => track.stop());
      localStream.current = null;
    }
    if (remoteAudio.current) {
      remoteAudio.current.srcObject = null;
    }

    if (callStatus === 'in-call' && currentCall) {
      socket.emit('end-call', { callId: currentCall.callId });
    }

    setCallStatus('idle');
    setCurrentCall(null);
  };

  const filterOption = (inputValue, option) => {
    return option.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
  };

  const handleUserSelect = (value) => {
    setSelectedUsers(value);
  };

  const handleDepartmentFilter = (value) => {
    setSelectedDepartment(value);
  };

  const filteredUsers = onlineUsers.filter(user =>
    user.userId !== currentUser.id &&
    (!selectedDepartment || user.department === selectedDepartment)
  );

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Card title="Audio Call System" bordered={false}>
        {/* User Selection Panel */}
        <div className="mb-6">
          <div className="flex gap-4 mb-4">
            <Select
              showSearch
              placeholder="Filter by department"
              optionFilterProp="children"
              onChange={handleDepartmentFilter}
              filterOption={filterOption}
              className="w-64"
              allowClear
            >
              {departments.map(dept => (
                <Option key={dept} value={dept}>{dept}</Option>
              ))}
            </Select>

            <Select
              mode="multiple"
              placeholder="Select users to call"
              value={selectedUsers}
              onChange={handleUserSelect}
              className="flex-1"
              showSearch
              filterOption={filterOption}
              optionLabelProp="label"
            >
              {filteredUsers.map(user => (
                <Option
                  key={user.userId}
                  value={user.userId}
                  label={
                    <div className="flex items-center">
                      <span>{user.userId}</span>
                      <Tag color="blue" className="ml-2">{user.department}</Tag>
                      {user.role === 'admin' && <Tag color="gold">Admin</Tag>}
                    </div>
                  }
                >
                  <div className="flex items-center">
                    <Avatar size="small" className="mr-2">{user.userId.charAt(0)}</Avatar>
                    <span>{user.userId}</span>
                    <Tag color="blue" className="ml-2">{user.department}</Tag>
                    {user.role === 'admin' && <Tag color="gold">Admin</Tag>}
                  </div>
                </Option>
              ))}
            </Select>
          </div>

          <Button
            type="primary"
            icon={<PhoneOutlined />}
            onClick={startCall}
            disabled={callStatus !== 'idle'}
          >
            Start Call
          </Button>
        </div>

        <Divider />

        {/* Online Users List */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Online Users</h3>
          <List
            bordered
            dataSource={filteredUsers}
            renderItem={user => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar>{user.userId.charAt(0)}</Avatar>}
                  title={
                    <div className="flex items-center">
                      <span>{user.userId}</span>
                      <Tag color="blue" className="ml-2">{user.department}</Tag>
                      {user.role === 'admin' && <Tag color="gold">Admin</Tag>}
                    </div>
                  }
                  description={`Status: ${user.status}`}
                />
              </List.Item>
            )}
          />
        </div>

        {/* Call Status Panel */}
        {callStatus !== 'idle' && (
          <div className="mt-6 p-4 border rounded-lg bg-gray-50">
            {callStatus === 'calling' && (
              <div className="text-center">
                <p className="text-lg">Calling {selectedUsers.length} user(s)...</p>
                <Button danger onClick={endCall} className="mt-3">
                  <CloseOutlined /> Cancel Call
                </Button>
              </div>
            )}

            {callStatus === 'ringing' && incomingCall && (
              <div className="text-center">
                <p className="text-lg">Incoming call from {incomingCall.callerName}</p>
                <div className="flex justify-center gap-4 mt-3">
                  <Button type="primary" onClick={answerCall}>
                    <CheckOutlined /> Answer
                  </Button>
                  <Button danger onClick={rejectCall}>
                    <CloseOutlined /> Reject
                  </Button>
                </div>
              </div>
            )}

            {callStatus === 'in-call' && (
              <div className="text-center">
                <p className="text-lg">
                  In call with {currentCall.isInitiator ?
                    selectedUsers.join(', ') : incomingCall?.callerName}
                </p>
                <audio ref={remoteAudio} autoPlay controls className="w-full mt-3" />
                <Button danger onClick={endCall} className="mt-3">
                  <CloseOutlined /> End Call
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default CallComponent;