import React from 'react';
import { Input, Card, Typography, Space, Tag } from 'antd';
import { SearchOutlined, TeamOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Search } = Input;

const SearchHeader = ({ searchTerm, onSearchChange, totalCount, filteredCount }) => {
  return (
    <Card className="border-0 shadow-sm rounded-xl mb-6 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center space-x-4 mb-4 lg:mb-0">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl">
            <TeamOutlined className="text-white text-2xl" />
          </div>
          <div>
            <Title level={3} className="text-gray-800 m-0">
              OPD Patient Visits
            </Title>
            <Text type="secondary" className="text-lg">
              Active outpatient department visits
            </Text>
            <div className="flex items-center space-x-2 mt-2">
              <Tag color="blue">{totalCount} Total</Tag>
              {searchTerm && (
                <Tag color="green">{filteredCount} Filtered</Tag>
              )}
            </div>
          </div>
        </div>
        
        <Search
          placeholder="Search by name, folder number, or attendance number..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full lg:w-80"
          enterButton={<SearchOutlined />}
          allowClear
          size="large"
        />
      </div>
    </Card>
  );
};

export default SearchHeader;