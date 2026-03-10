// components/DepartmentList.jsx
import React from 'react';
import { List, Avatar, Typography, Badge, Skeleton } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';


const { Text } = Typography;

const DepartmentList = ({ 
  departments, 
  selectedDepartment, 
  onSelectDepartment, 
  loading, 
  connectionStatus 
}) => {
    const unreadCounts = useSelector((state) => state.chat.unreadCounts || {});

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <Text strong className="text-gray-800 text-lg">Departments</Text>
          <Badge
            status={connectionStatus === 'connected' ? 'success' : 'error'}
            text={
              <Text 
                className={`text-xs ${connectionStatus === 'connected' ? 'text-green-600' : 'text-red-600'}`}
              >
                {connectionStatus === 'connected' ? 'Online' : 'Offline'}
              </Text>
            }
          />
        </div>
      </div>

      {/* Departments List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4">
            {[1, 2, 3, 4, 5].map(item => (
              <div key={item} className="flex items-center p-3 mb-2">
                <Skeleton.Avatar active size="large" className="mr-3" />
                <Skeleton.Input active style={{ width: '70%' }} />
              </div>
            ))}
          </div>
        ) : (
          <List
            dataSource={departments}
            className="bg-white"
            renderItem={(department) => (
              <List.Item
                key={department.id}
                className={`p-3 cursor-pointer border-b border-gray-100 hover:bg-blue-50 transition-all duration-200 ${
                  selectedDepartment?.id === department.id 
                    ? 'bg-blue-50 border-l-4 border-l-blue-500' 
                    : ''
                }`}
                onClick={() => onSelectDepartment(department)}
                style={{ border: 'none' }}
              >
                <div className="flex items-center w-full">
                  <Badge count={unreadCounts[department.id] || 0} overflowCount={99} size="small">
                    <Avatar
                      size={48}
                      className="bg-blue-500 text-white mr-3 flex-shrink-0"
                      style={{ 
                        backgroundColor: selectedDepartment?.id === department.id ? '#1890ff' : '#6b7280'
                      }}
                    >
                      {department.name?.charAt(0)?.toUpperCase() || 'D'}
                    </Avatar>
                  </Badge>
                  
                  <div className="flex-1 min-w-0 mx-2">
                    <div className="flex justify-between items-center">
                      <Text 
                        strong 
                        className={`block truncate ${
                          selectedDepartment?.id === department.id ? 'text-blue-600' : 'text-gray-800'
                        }`}
                      >
                        {department.name}
                      </Text>
                      {selectedDepartment?.id === department.id && (
                        <CheckOutlined className="text-blue-500 ml-2" />
                      )}
                    </div>
                    
                    <Text 
                      className={`text-sm truncate block ${
                        selectedDepartment?.id === department.id ? 'text-blue-400' : 'text-gray-500'
                      }`}
                    >
                      {department.departmentType || 'Department'}
                    </Text>
                  </div>
                </div>
              </List.Item>
            )}
            locale={{ emptyText: 'No departments available' }}
          />
        )}
      </div>
    </div>
  );
};

export default DepartmentList;