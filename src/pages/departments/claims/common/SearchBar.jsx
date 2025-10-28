// components/SearchBar.jsx
import React, { useState } from 'react';
import { Input, Button, Space } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';

const SearchBar = ({ onSearch, onOpenAdvanced, searchText, placeholder = "Search patients..." }) => {
  const [localSearchText, setLocalSearchText] = useState(searchText || '');

  const handleSearch = (value) => {
    setLocalSearchText(value);
    onSearch(value);
  };

  const handleClear = () => {
    setLocalSearchText('');
    onSearch('');
  };

  return (
    <div className="flex space-x-2 mb-4">
      <Input
        placeholder={placeholder}
        value={localSearchText}
        onChange={(e) => setLocalSearchText(e.target.value)}
        onPressEnter={() => handleSearch(localSearchText)}
        suffix={
          localSearchText && (
            <Button
              type="text"
              size="small"
              onClick={handleClear}
              style={{ color: '#999' }}
            >
              ✕
            </Button>
          )
        }
        className="flex-2"
      />
      <Button
        icon={<SearchOutlined />}
        onClick={() => handleSearch(localSearchText)}
      >
        Search
      </Button>
      <Button
        icon={<FilterOutlined />}
        onClick={onOpenAdvanced}
      >
        Filters
      </Button>
    </div>
  );
};

export default SearchBar;