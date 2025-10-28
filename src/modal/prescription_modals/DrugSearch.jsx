import React from 'react';
import { Select, Spin } from 'antd';

const { Option } = Select;

const DrugSearch = ({ 
  medications = [], 
  loading = false, 
  onSearch, 
  onSelect, 
  value 
}) => {
  return (
    <Select
      showSearch
      value={value}
      placeholder="Type drug name or code"
      onSearch={onSearch}
      onChange={onSelect}
      filterOption={false}
      notFoundContent={loading ? <Spin size="small" /> : null}
      optionLabelProp="label"
      labelInValue
      style={{ width: '100%' }}
    >
      {medications.map(medication => (
        <Option key={medication.code} value={medication.code} data={medication}>
          <div className="flex justify-between">
            <span>{medication.generic_name}</span>
            <span className="text-gray-500 ml-2">{medication.code}</span>
          </div>
          <div className="text-xs text-gray-500">
            {medication.strength} • {medication.unit_of_pricing}
          </div>
        </Option>
      ))}
    </Select>
  );
};

export default DrugSearch;