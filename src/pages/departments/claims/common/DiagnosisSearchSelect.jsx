// components/DiagnosisSearchSelect.js
import React, { useState, useEffect } from 'react';
import { Select, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { searchDiagnoses, clearSearchResults } from '../../../../redux/slice/icd10DdiangosisSlice';

const { Option } = Select;

const DiagnosisSearchSelect = ({ value, onChange, placeholder = "Search diagnosis..." }) => {
  const dispatch = useDispatch();
  const { searchResults: diagnoses, loading } = useSelector((state) => state.icd10);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search input
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      dispatch(searchDiagnoses({
        q: debouncedQuery,
        limit: 20,
        offset: 0
      }));
    } else {
      dispatch(clearSearchResults());
    }
  }, [debouncedQuery, dispatch]);

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const handleChange = (value, option) => {
    if (onChange) {
      onChange(value, option);
    }
  };

  return (
    <Select
      showSearch
      value={value} // this will now be ID
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
      {diagnoses.map((diagnosis) => (
        <Option
          key={diagnosis.id}
          value={diagnosis.id}              // ✅ ID stored in DB
          label={diagnosis.diagnosis_name}  // ✅ name shown to user
        >
          <div>
            <div><strong>{diagnosis.icd_10_code}</strong> - {diagnosis.diagnosis_name}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {diagnosis.diagnosis_name}
            </div>
          </div>
        </Option>
      ))}
    </Select>

  );
};

export default DiagnosisSearchSelect;