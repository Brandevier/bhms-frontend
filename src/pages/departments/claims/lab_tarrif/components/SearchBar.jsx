// SearchBar.js
import React from 'react';
import { Input, Button } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';

const SearchBar = ({ onSearch, onAddNew }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="w-64">
        <Input
          placeholder="Search investigations..."
          prefix={<SearchOutlined />}
          onChange={(e) => onSearch(e.target.value)}
          allowClear
        />
      </div>
      <Button 
        type="primary" 
        icon={<PlusOutlined />} 
        onClick={onAddNew}
        className="bg-blue-600 hover:bg-blue-700"
      >
        Add New
      </Button>
    </div>
  );
};

export default SearchBar;