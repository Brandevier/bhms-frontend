import React from 'react';
import { Avatar, Tag, Divider, Typography } from 'antd';
import { UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

const { Text } = Typography;

const ProfileSidebar = ({ user }) => {
  // Get session values from Redux
  const { showWarning, warningCountdown } = useSelector(
    (state) => state.sessionManager
  );

  return (
    <div className="w-full md:w-1/4">
      <div className="text-center">
        <Avatar 
          size={120} 
          src={user.profile_pic} 
          icon={<UserOutlined />}
          className="mb-4 mx-auto"
        />
        <h2 className="text-2xl font-semibold">{user.firstName} {user.lastName}</h2>
        <p className="text-gray-600">{user.role?.name}</p>
        <Tag color="blue" className="mt-2">{user.staffID}</Tag>

        <Divider />

        {/* ✅ Session Timer Section */}
        <div className="mb-4">
          <h4 className="font-medium text-gray-500 flex items-center justify-center gap-2">
            <ClockCircleOutlined /> Session
          </h4>
          {showWarning ? (
            <Text type="danger" strong>
              Auto logout in {warningCountdown}s
            </Text>
          ) : (
            <Text type="success">Active</Text>
          )}
        </div>

        <Divider />

        <div className="text-left space-y-3">
          <div>
            <h4 className="font-medium text-gray-500">Department</h4>
            <p>{user.department?.name}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-500">Institution</h4>
            <p>{user.institution?.name}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-500">Phone</h4>
            <p>{user.phone_number || 'Not provided'}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-500">Email</h4>
            <p>{user.email || 'Not provided'}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-500">Last Login</h4>
            <p>{dayjs(user.last_login).format('MMM D, YYYY h:mm A')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;
