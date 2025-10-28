// components/GDRGSearchSelect.js
import React, { useState, useEffect } from 'react';
import { Select, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllGDRGCodes } from '../../../../redux/slice/claims_dgrg';

const { Option } = Select;

const GDRGSearchSelect = ({ value, onChange, placeholder = "Search procedure..." }) => {
  const dispatch = useDispatch();
  const { codes, loading } = useSelector((state) => state.dgrgCodes);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchAllGDRGCodes());
  }, [dispatch]);

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const handleChange = (value, option) => {
    if (onChange) {
      onChange(value, option);
    }
  };

  const filteredCodes = codes.filter(code =>
    code.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    code.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Select
      showSearch
      value={value}
      placeholder={placeholder}
      defaultActiveFirstOption={false}
      showArrow={false}
      filterOption={false}
      onSearch={handleSearch}
      onChange={handleChange}
      notFoundContent={loading ? <Spin size="small" /> : null}
      optionLabelProp="label"
      style={{ width: '100%' }}
    >
      {filteredCodes.map((code) => (
        <Option key={code.id} value={code.code} label={`${code.code} - ${code.description}`}>
          <div>
            <div><strong>{code.code}</strong> - {code.description}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              Category: {code.category} | NHIA Price: GHC {code.nhia_price}
            </div>
          </div>
        </Option>
      ))}
    </Select>
  );
};

export default GDRGSearchSelect;