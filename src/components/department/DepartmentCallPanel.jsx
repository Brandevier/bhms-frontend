import React, { useState, useEffect } from 'react';
import { 
  Card, 
  List, 
  Avatar, 
  Badge, 
  Button, 
  Input, 
  Select, 
  Typography, 
  Space, 
  Tag, 
  Divider,
  Empty,
  Spin,
  Tooltip
} from 'antd';
import { 
  PhoneOutlined, 
  VideoCameraOutlined, 
  SearchOutlined,
  TeamOutlined,
  AudioOutlined,
  PhoneTwoTone as PhoneInTalkOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { getDepartmentsByInstitution } from '../../redux/slice/departmentSlice';
import { getAllStaff } from '../../redux/slice/staff_admin_managment_slice';
import socketService from '../../service/socketService';
import { openCallModal, setCurrentCall } from '../../redux/slice/callSlice';

const { Text, Title } = Typography;

const DepartmentCallPanel = ({ onCallInitiated, currentUser }) => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [callType, setCallType] = useState('video'); // 'audio' or 'video'

  const { departments } = useSelector((state) => state.department);
  const { allStaffs, loading: staffLoading } = useSelector((state) => state.adminStaffManagement);
  const { currentCall, isInCall, callStatus } = useSelector((state) => state.call);

  useEffect(() => {
    dispatch(getDepartmentsByInstitution());
    dispatch(getAllStaff());
  }, [dispatch]);

  // Filter departments based on search
  const filteredDepartments = departments?.filter(dept => 
    dept.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Get staff by department
  const getStaffByDepartment = (departmentId) => {
    return allStaffs?.filter(staff => 
      staff.staff_departments?.some(sd => sd.department?.id === departmentId)
    ) || [];
  };

  // Get staff not in the current user's department
  const getAvailableStaff = () => {
    const currentDeptId = currentUser?.staff_departments?.[0]?.department?.id;
    return allStaffs?.filter(staff => 
      staff.id !== currentUser?.id &&
      staff.staff_departments?.some(sd => sd.department?.id !== currentDeptId)
    ) || [];
  };

  const availableStaff = getAvailableStaff();

  const handleCallStaff = (staffMember) => {
    if (isInCall) {
      return; // Don't allow initiating new call while in a call
    }

    const callData = {
      caller_id: currentUser.id,
      caller_name: `${currentUser.firstName} ${currentUser.lastName}`,
      caller_department_id: currentUser.staff_departments?.[0]?.department?.id,
      receiver_id: staffMember.id,
      receiver_name: `${staffMember.firstName} ${staffMember.lastName}`,
      receiver_department_id: staffMember.staff_departments?.[0]?.department?.id,
      call_type: callType,
      institution_id: currentUser.institution?.id,
    };

    // Open call modal to confirm
    dispatch(openCallModal());
    dispatch(setCurrentCall({ ...callData, status: 'initiated' }));
    
    if (onCallInitiated) {
      onCallInitiated(callData);
    }

    // Also emit via socket for real-time notification
    socketService.initiateDepartmentCall(staffMember.staff_departments?.[0]?.department?.id, callData);
  };

  const getStatusColor = (isOnline, isInCall) => {
    if (!isOnline) return 'default';
    if (isInCall) return 'processing';
    return 'success';
  };

  const getStatusText = (isOnline, isInCall) => {
    if (!isOnline) return 'Offline';
    if (isInCall) return 'In Call';
    return 'Available';
  };

  return (
    <Card 
      className="department-call-panel"
      title={
        <Space>
          <TeamOutlined />
          <span>Inter-Department Communication</span>
        </Space>
      }
      extra={
        <Select
          value={callType}
          onChange={setCallType}
          style={{ width: 100 }}
          options={[
            { value: 'video', label: <><VideoCameraOutlined /> Video</> },
            { value: 'audio', label: <><AudioOutlined /> Audio</> },
          ]}
        />
      }
    >
      {/* Search */}
      <Input
        placeholder="Search departments..."
        prefix={<SearchOutlined />}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: 16 }}
      />

      {/* Department List */}
      <div className="department-list" style={{ maxHeight: 300, overflowY: 'auto' }}>
        {filteredDepartments.length > 0 ? (
          <List
            dataSource={filteredDepartments}
            renderItem={(dept) => {
              const deptStaff = getStaffByDepartment(dept.id);
              const onlineCount = deptStaff.filter(s => s.isOnline).length;
              
              return (
                <List.Item
                  key={dept.id}
                  className="department-item"
                  onClick={() => setSelectedDepartment(dept.id)}
                  style={{ 
                    cursor: 'pointer',
                    background: selectedDepartment === dept.id ? '#f0f5ff' : 'transparent',
                    borderRadius: 8,
                    marginBottom: 4
                  }}
                >
                  <List.Item.Meta
                    avatar={
                      <Badge count={onlineCount} size="small">
                        <Avatar 
                          style={{ backgroundColor: dept.color || '#1890ff' }}
                          icon={<TeamOutlined />}
                        />
                      </Badge>
                    }
                    title={dept.name}
                    description={`${deptStaff.length} staff members`}
                  />
                  <Tag color="blue">{onlineCount} online</Tag>
                </List.Item>
              );
            }}
          />
        ) : (
          <Empty description="No departments found" />
        )}
      </div>

      <Divider>Or Select Staff Directly</Divider>

      {/* Quick Staff List */}
      <Spin spinning={staffLoading}>
        <List
          loading={staffLoading}
          dataSource={availableStaff.slice(0, 10)}
          renderItem={(staff) => (
            <List.Item
              key={staff.id}
              className="staff-item"
              actions={[
                <Tooltip title={callType === 'video' ? 'Video Call' : 'Audio Call'}>
                  <Button
                    type="primary"
                    icon={callType === 'video' ? <VideoCameraOutlined /> : <PhoneOutlined />}
                    size="small"
                    onClick={() => handleCallStaff(staff)}
                    disabled={isInCall}
                    style={{ 
                      background: callType === 'video' ? '#1890ff' : '#52c41a',
                      borderColor: callType === 'video' ? '#1890ff' : '#52c41a'
                    }}
                  />
                </Tooltip>
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Badge status={getStatusColor(staff.isOnline, staff.isInCall)}>
                    <Avatar src={staff.profile_pic} icon={<TeamOutlined />} />
                  </Badge>
                }
                title={`${staff.firstName} ${staff.lastName}`}
                description={
                  <Space>
                    <Tag>{staff.role?.name || 'Staff'}</Tag>
                    <Tag color="blue">{staff.staff_departments?.[0]?.department?.name}</Tag>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      </Spin>

      {/* Call Status Indicator */}
      {isInCall && (
        <div style={{ marginTop: 16, padding: 12, background: '#f6ffed', borderRadius: 8, textAlign: 'center' }}>
          <PhoneInTalkOutlined spin style={{ color: '#52c41a', marginRight: 8 }} />
          <Text strong>{callStatus === 'connected' ? 'In Call' : 'Call in progress...'}</Text>
        </div>
      )}
    </Card>
  );
};

export default DepartmentCallPanel;
