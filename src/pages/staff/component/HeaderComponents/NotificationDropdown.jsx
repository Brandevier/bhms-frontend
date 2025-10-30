// src/components/staff/layout/HeaderComponents/NotificationDropdown.js
import React, { useEffect, useState } from 'react';
import { Dropdown, Badge, List, Button, Avatar, message, Tag } from 'antd';
import { BellOutlined, UserOutlined, VideoCameraOutlined, PlayCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications } from '../../../../redux/slice/notificationSlice';
import MeetingJoinModal from './MeetingJoinModal';

const NotificationDropdown = () => {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.notification);
  const { user } = useSelector((state) => state.auth);
  
  const [joinModalVisible, setJoinModalVisible] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  // Count unread notifications
  const unreadCount = list?.filter((item) => !item.is_read).length || 0;

  const handleMarkAsRead = (notificationId) => {
    // TODO: Implement mark as read API call
    message.info('Mark as read functionality to be implemented');
  };

  const handleViewAllNotifications = () => {
    message.info("View all notifications page will be implemented");
  };

  const handleJoinMeeting = (notification) => {
    setSelectedMeeting(notification);
    setJoinModalVisible(true);
  };

  const isMeetingNotification = (notification) => {
    return notification.title?.includes('Meeting') || 
           notification.description?.includes('meeting') ||
           notification.type === 'meeting' ||
           notification.video_url;
  };

  const getNotificationAvatar = (notification) => {
    if (notification.fromStaff) {
      return (
        <Avatar 
          src={notification.fromStaff.profile_pic} 
          icon={<UserOutlined />}
        />
      );
    }
    
    if (isMeetingNotification(notification)) {
      return <Avatar style={{ backgroundColor: '#52c41a' }}><VideoCameraOutlined /></Avatar>;
    }
    
    return <Avatar style={{ backgroundColor: '#f56a00' }}>🔔</Avatar>;
  };

  const getNotificationDescription = (notification) => {
    if (notification.fromStaff) {
      return `From: ${notification.fromStaff.firstName} ${notification.fromStaff.lastName}`;
    }
    return notification.description;
  };

  const renderNotificationActions = (notification) => {
    if (isMeetingNotification(notification)) {
      return (
        <div className="mt-2 flex justify-between items-center">
          <Button
            type="primary"
            size="small"
            icon={<PlayCircleOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              handleJoinMeeting(notification);
            }}
            className="flex items-center gap-1"
          >
            Join Meeting
          </Button>
          {!notification.is_read && (
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          )}
        </div>
      );
    }

    return (
      !notification.is_read && (
        <div className="mt-2 flex justify-end">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        </div>
      )
    );
  };

  const notificationMenu = (
    <div className="w-96 bg-white shadow-lg rounded-lg">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">Notifications</h3>
          {unreadCount > 0 && (
            <span className="text-sm text-blue-600">
              {unreadCount} unread
            </span>
          )}
        </div>
      </div>
      
      <div className="max-h-80 overflow-y-auto">
        {list && list.length > 0 ? (
          <List
            dataSource={list.slice(0, 5)}
            loading={loading}
            renderItem={(item) => (
              <List.Item
                key={item.id}
                className={`p-3 cursor-pointer border-b hover:bg-gray-50 transition-colors ${
                  !item.is_read ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
                }`}
                onClick={() => handleMarkAsRead(item.id)}
              >
                <List.Item.Meta
                  avatar={getNotificationAvatar(item)}
                  title={
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-gray-800">
                          {item.title}
                        </span>
                        {isMeetingNotification(item) && (
                          <Tag color="green" size="small">
                            <VideoCameraOutlined className="mr-1" />
                            Meeting
                          </Tag>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 ml-2">
                        {moment(item.createdAt).fromNow()}
                      </span>
                    </div>
                  }
                  description={
                    <div className="space-y-1">
                      <p className="text-xs text-gray-600">
                        {item.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          {getNotificationDescription(item)}
                        </span>
                        {item.priority && (
                          <span 
                            className={`text-xs px-2 py-1 rounded ${
                              item.priority === 'High' 
                                ? 'bg-red-100 text-red-800' 
                                : item.priority === 'Medium'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {item.priority}
                          </span>
                        )}
                      </div>
                      {item.type && (
                        <span className="text-xs text-gray-400">
                          Type: {item.type}
                        </span>
                      )}
                      
                      {/* Action Buttons */}
                      {renderNotificationActions(item)}
                    </div>
                  }
                />
              </List.Item>
            )}
            locale={{ emptyText: "No notifications" }}
          />
        ) : (
          <div className="p-6 text-center text-gray-500">
            <BellOutlined className="text-3xl mb-3 text-gray-300" />
            <p className="text-sm">No notifications</p>
            <p className="text-xs text-gray-400 mt-1">
              You're all caught up!
            </p>
          </div>
        )}
      </div>

      {list && list.length > 5 && (
        <div className="p-3 border-t bg-gray-50">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">
              Showing 5 of {list.length} notifications
            </span>
            <Button 
              type="link" 
              size="small" 
              className="text-blue-500 text-xs"
              onClick={handleViewAllNotifications}
            >
              View All Notifications
            </Button>
          </div>
        </div>
      )}

      {list && list.length > 0 && list.length <= 5 && (
        <div className="p-3 border-t">
          <Button 
            type="link" 
            className="w-full text-center text-blue-500 text-sm"
            onClick={handleViewAllNotifications}
          >
            View All Notifications
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <>
      <Dropdown overlay={notificationMenu} trigger={["click"]} placement="bottomRight">
        <Badge count={unreadCount} overflowCount={9} size="small">
          <div className="p-2 cursor-pointer text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors">
            <BellOutlined className="text-xl" />
          </div>
        </Badge>
      </Dropdown>

      <MeetingJoinModal
        visible={joinModalVisible}
        onClose={() => setJoinModalVisible(false)}
        meetingData={selectedMeeting}
        currentUser={user}
      />
    </>
  );
};

export default NotificationDropdown;