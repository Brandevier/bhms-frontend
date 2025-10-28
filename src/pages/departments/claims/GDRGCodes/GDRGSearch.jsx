import React from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const GDRGSearch = ({ value, onChange }) => {
  return (
    <Input
      placeholder="Search codes..."
      prefix={<SearchOutlined />}
      value={value}
      onChange={onChange}
      className="w-64"
      allowClear
    />
  );
};

export default GDRGSearch;