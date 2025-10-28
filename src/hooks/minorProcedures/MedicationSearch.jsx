import React from 'react';
import { AutoComplete, Input, Tag, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const MedicationSearch = ({ 
  searchQuery, 
  onSearch, 
  onSelect, 
  searchResults = [],
  loading
}) => {
  return (
    <div className="medication-search">
      <AutoComplete
        style={{ width: '100%' }}
        placeholder="Search medication by NHIA code"
        value={searchQuery}
        onChange={onSearch}
        onSelect={(value, option) => {
          // Pass both the value and the full medication object
          onSelect(value, option.med);
        }}
        options={searchResults.map(med => ({
          value: med.code, // What shows in input after selection
          label: (
            <div className="medication-option">
              <Tag color="blue">{med.code}</Tag>
              <span>{med.generic_name}</span>
              <Tag color="green" style={{ marginLeft: 'auto' }}>
                GH₵{med.price_ghc}
              </Tag>
            </div>
          ),
          med: med // Store the full medication object
        }))}
      >
        <Input 
          size="large"
          suffix={<SearchOutlined />}
          placeholder="Search medication by NHIA code"
        />
      </AutoComplete>
    </div>
  );
};

export default MedicationSearch;