// src/components/drawers/DiagnosisDrawer.js
import React, { useState, useEffect, useRef } from 'react';
import { Drawer, Typography, Select, Form, Input, Divider, Button, Tag, Spin, Alert, message } from 'antd';
import { ManOutlined, WomanOutlined, TeamOutlined, SearchOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { searchDiagnoses, clearSearchResults } from '../redux/slice/icd10DdiangosisSlice';
import SpeechTextArea from '../components/common/SpeechTextArea';
import { addDiagnosis } from '../redux/slice/diagnosisSlice';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const DiagnosisDrawer = ({ visible, onClose, gender, visit_id, claim_id,onFinished }) => {
  const dispatch = useDispatch();
  const {
    searchResults: diagnoses = [],
    searchMeta = {},
    searchLoading = false,
    error,
  } = useSelector((state) => state.icd10);
  
  const form = useRef(null);
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [doctorsEvaluation, setDoctorsEvaluation] = useState('');
  const [selectedDiagnoses, setSelectedDiagnoses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Debounce search input
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchQuery]);

  // Reset state when drawer opens/closes
  useEffect(() => {
    if (visible) {
      setIsInitialLoad(true);
      setSelectedDiagnoses([]);
      setSearchQuery('');
      setDebouncedQuery('');
      if (form.current) form.current.resetFields();
    } else {
      dispatch(clearSearchResults());
    }
  }, [visible, dispatch]);

  // Perform search when debounced query changes
  useEffect(() => {
    if (!visible) return;

    if (debouncedQuery.length >= 2 || (gender && debouncedQuery.length > 0)) {
      dispatch(searchDiagnoses({
        q: debouncedQuery,
        gender: gender || undefined,
        limit: 20,
        offset: 0
      }));
      setIsInitialLoad(false);
    } else if (!isInitialLoad) {
      dispatch(clearSearchResults());
    }
  }, [debouncedQuery, gender, dispatch, visible, isInitialLoad]);

  // Gender icon renderer
  const renderGenderIcon = (genderCode) => {
    switch(genderCode) {
      case 'M': return <ManOutlined style={{ color: '#1890ff', marginLeft: 5 }} />;
      case 'F': return <WomanOutlined style={{ color: '#eb2f96', marginLeft: 5 }} />;
      case 'B': return <TeamOutlined style={{ color: '#52c41a', marginLeft: 5 }} />;
      default: return null;
    }
  };

  const handleSubmit = (values) => {
    const diagnosisData = {
      visit_id,
      claim_id,
      chief_complain: chiefComplaint,
      doctor_evaluation: doctorsEvaluation,
      system_diagnosis_ids: selectedDiagnoses, // Now passing array of IDs
      
    };
    
    dispatch(addDiagnosis(diagnosisData))
      .unwrap().then(() => {
        message.success('Diagnosis saved successfully');
        onFinished()
        onClose();
      })
      .catch((err) => {
        console.error('Error saving diagnosis:', err);
        message.error('Failed to save diagnosis');
      });
    console.log('Submitting diagnosis data:', diagnosisData);
  };

  const handleScroll = (event) => {
    const { target } = event;
    const { scrollTop, clientHeight, scrollHeight } = target;
    const isNearBottom = scrollHeight - scrollTop <= clientHeight * 1.5;

    if (isNearBottom && !searchLoading && diagnoses.length < searchMeta.total) {
      dispatch(searchDiagnoses({
        q: debouncedQuery,
        gender: gender || undefined,
        limit: 20,
        offset: diagnoses.length
      }));
    }
  };

  return (
    <Drawer
      title="Patient Diagnosis"
      placement="right"
      width={700}
      onClose={() => {
        dispatch(clearSearchResults());
        onClose();
      }}
      open={visible}
      destroyOnClose
      forceRender
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button 
            onClick={() => {
              dispatch(clearSearchResults());
              onClose();
            }} 
            style={{ marginRight: 8 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={() => form.current?.submit()} 
            type="primary"
            loading={searchLoading}
          >
            Save Diagnosis
          </Button>
        </div>
      }
    >
      <Form ref={form} layout="vertical" onFinish={handleSubmit}>
        {/* Chief Complaint Section */}
        <Divider orientation="left" plain>
          <Text strong>Chief Complaint (CC)</Text>
        </Divider>
        <Form.Item
          name="chiefComplaint"
          rules={[{ required: true, message: 'Please enter chief complaint' }]}
        >
          <SpeechTextArea
            value={chiefComplaint}
            onChange={setChiefComplaint}
            placeholder="Describe the patient's chief complaint or use microphone..."
            showMentions={false}
            recordingControlsPosition="below"
            autoSize={{ minRows: 3 }}
          />
        </Form.Item>

        {/* Diagnosis Selection */}
        <Divider orientation="left" plain>
          <Text strong>Diagnosis</Text>
        </Divider>
        <Form.Item
          name="diagnoses"
          rules={[{ required: true, message: 'Please select at least one diagnosis' }]}
        >
          <Select
            mode="multiple"
            showSearch
            placeholder={
              <span>
                <SearchOutlined /> Search diagnoses (type at least 2 characters)
              </span>
            }
            filterOption={false}
            onSearch={setSearchQuery}
            loading={searchLoading}
            onChange={setSelectedDiagnoses}
            style={{ width: '100%' }}
            optionLabelProp="label"
            onPopupScroll={handleScroll}
            notFoundContent={
              searchLoading ? (
                <Spin size="small" />
              ) : error ? (
                <Alert message={error} type="error" showIcon />
              ) : debouncedQuery.length < 2 ? (
                <Text type="secondary">Type at least 2 characters to search</Text>
              ) : (
                <Text type="secondary">No diagnoses found</Text>
              )
            }
          >
            {diagnoses.map(diagnosis => (
              <Option 
                key={diagnosis.id} // Use id as key
                value={diagnosis.id} // Use id as value
                label={`${diagnosis.icd_10_code} - ${diagnosis.diagnosis_name}`}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>
                    <Tag color="blue">{diagnosis.icd_10_code}</Tag>
                    {diagnosis.diagnosis_name}
                  </span>
                  {renderGenderIcon(diagnosis.gender)}
                </div>
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Display selected diagnoses */}
        {selectedDiagnoses.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <Text strong>Selected Diagnoses:</Text>
            <div style={{ marginTop: 8 }}>
              {selectedDiagnoses.map(id => {
                const diagnosis = diagnoses.find(d => d.id === id) || {};
                return (
                  <div key={id} style={{ marginBottom: 4 }}>
                    <Tag color="blue">{diagnosis.icd_10_code || 'N/A'}</Tag>
                    {diagnosis.diagnosis_name || 'Unknown diagnosis'}
                    {renderGenderIcon(diagnosis.gender)}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Doctor's Evaluation */}
        <Divider orientation="left" plain>
          <Text strong>Doctor's Evaluation</Text>
        </Divider>
        <Form.Item
          name="doctorsEvaluation"
          rules={[{ required: true, message: 'Please enter your evaluation' }]}
        >
          <SpeechTextArea
            value={doctorsEvaluation}
            onChange={setDoctorsEvaluation}
            placeholder="Record your evaluation findings or use microphone..."
            showMentions={false}
            recordingControlsPosition="below"
            autoSize={{ minRows: 4 }}
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default DiagnosisDrawer;