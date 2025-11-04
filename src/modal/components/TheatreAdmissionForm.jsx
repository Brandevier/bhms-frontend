import React, { useEffect, useState } from "react";
import { Form, Select, Input, Checkbox, Divider, Card, Row, Col, TimePicker, DatePicker, Tag, Button, Spin, Space } from "antd";
import { useSelector, useDispatch } from "react-redux";
import dayjs from 'dayjs';
import { CloseOutlined, ManOutlined, WomanOutlined } from '@ant-design/icons';
import { fetchAllGDRGCodes } from "../../redux/slice/claims_dgrg";
import { searchDiagnoses, clearSearchResults } from '../../redux/slice/icd10DdiangosisSlice';

const { Option } = Select;
const { TextArea } = Input;

const TheatreAdmissionForm = ({ onSubmit }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { departments } = useSelector((state) => state.departments);
  const { codes, loading } = useSelector((state) => state.dgrgCodes);
  const {
    searchResults: diagnoses = [],
    searchMeta = {},
    searchLoading = false,
    error,
  } = useSelector((state) => state.icd10);

  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [isEmergency, setIsEmergency] = useState(false);
  const [selectedProcedures, setSelectedProcedures] = useState([]);
  const [diagnosisSearch, setDiagnosisSearch] = useState('');
  const [selectedDiagnoses, setSelectedDiagnoses] = useState([]);

  const handleDiagnosisSelect = (diagnosisId) => {
    if (!diagnosisId) return;

    const diagnosis = diagnoses?.find(d => d.id === diagnosisId);
    if (diagnosis && !selectedDiagnoses.find(d => d.id === diagnosisId)) {
      setSelectedDiagnoses(prev => [...prev, diagnosis]);
    }

    // Clear the select input after selection
    form.setFieldsValue({ diagnosis_select: undefined });
    setDiagnosisSearch(''); // Clear search
  };

  const removeDiagnosis = (diagnosisId) => {
    setSelectedDiagnoses(prev => prev.filter(d => d.id !== diagnosisId));
  };

  // Get theatre departments
  const theatreDepartments = departments?.filter((dept) =>
    dept.departmentType === "Theatre" || dept.name.toLowerCase().includes("theatre")
  ) || [];

  // Fetch procedures on component mount
  useEffect(() => {
    dispatch(fetchAllGDRGCodes());
  }, [dispatch]);

  // Listen for submit event from parent
  useEffect(() => {
    const handleSubmit = () => {
      form.submit();
    };

    document.addEventListener('submitForm', handleSubmit);
    return () => {
      document.removeEventListener('submitForm', handleSubmit);
    };
  }, [form]);

  // Handle diagnosis search with debounce
  useEffect(() => {
    if (diagnosisSearch.trim().length > 2) {
      const timer = setTimeout(() => {
        dispatch(searchDiagnoses({ searchTerm: diagnosisSearch }));
      }, 500);
      return () => clearTimeout(timer);
    } else if (diagnosisSearch.trim().length === 0) {
      dispatch(clearSearchResults());
    }
  }, [diagnosisSearch, dispatch]);

  const handleFinish = (values) => {
    const formattedValues = {
      ...values,
      scheduled_date: values.scheduled_date?.format('YYYY-MM-DD'),
      scheduled_time: values.scheduled_time?.format('HH:mm'),
      is_emergency_surgery: isEmergency,
      procedure_ids: selectedProcedures.map(proc => proc.id), // Only send procedure IDs
      diagnosis_id:selectedDiagnoses.map(d => d.id) // Now an array
    };

    console.log('Data to be submitted:', formattedValues);
    onSubmit(formattedValues);
  };

  const handleTheatreChange = (theatreId) => {
    const theatre = theatreDepartments.find((dept) => dept.id === theatreId);
    setSelectedTheatre(theatre || null);
  };

  const handleEmergencyChange = (e) => {
    setIsEmergency(e.target.checked);
    if (e.target.checked) {
      // Auto-set to current date/time for emergencies
      form.setFieldsValue({
        scheduled_date: dayjs(),
        scheduled_time: dayjs()
      });
    }
  };

  const handleProcedureSelect = (procedureId) => {
    if (!procedureId) return;

    const procedure = codes?.find(proc => proc.id === procedureId);
    if (procedure && !selectedProcedures.find(p => p.id === procedureId)) {
      setSelectedProcedures(prev => [...prev, procedure]);
    }

    // Clear the select input after selection
    form.setFieldsValue({ procedure_select: undefined });
  };

  const removeProcedure = (procedureId) => {
    setSelectedProcedures(prev => prev.filter(proc => proc.id !== procedureId));
  };

  // Safe filter function that handles non-string values
  const filterOption = (input, option) => {
    if (!option || !option.children) return false;

    const children = String(option.children);
    return children.toLowerCase().includes(input.toLowerCase());
  };

  // Render gender icon for diagnosis
  const renderGenderIcon = (gender) => {
    switch (gender?.toLowerCase()) {
      case 'male':
        return <ManOutlined style={{ color: '#1890ff' }} />;
      case 'female':
        return <WomanOutlined style={{ color: '#eb2f96' }} />;
      default:
        return null;
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      {/* Theatre Selection */}
      <Card title="Theatre Information" size="small" style={{ marginBottom: 16 }}>
        <Form.Item
          label="Select Theatre"
          name="theatre_id"
          rules={[{ required: true, message: "Please select a theatre" }]}
        >
          <Select placeholder="Choose operating theatre" onChange={handleTheatreChange} size="large">
            {theatreDepartments.map((theatre) => (
              <Option key={theatre.id} value={theatre.id}>
                {theatre.name}
                {theatre.description && ` - ${theatre.description}`}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {selectedTheatre && (
          <div style={{ padding: '8px 12px', backgroundColor: '#f0f8ff', borderRadius: 6 }}>
            <small style={{ color: '#1890ff' }}>
              Selected: <strong>{selectedTheatre.name}</strong>
              {selectedTheatre.description && ` - ${selectedTheatre.description}`}
            </small>
          </div>
        )}
      </Card>

      {/* Diagnosis Selection */}
      <Card title="Diagnosis" size="small" style={{ marginBottom: 16 }}>
        <Form.Item
          label="Primary Diagnosis"
          name="diagnosis_select"
          rules={[{ required: selectedDiagnoses.length === 0, message: "Please select at least one diagnosis" }]}
        >
          <Select
            placeholder="Search for diagnosis (type at least 3 characters)..."
            size="large"
            showSearch
            filterOption={false}
            onSearch={setDiagnosisSearch}
            onSelect={handleDiagnosisSelect}
            loading={searchLoading}
            notFoundContent={
              searchLoading ? (
                <div style={{ textAlign: 'center', padding: '12px' }}>
                  <Spin size="small" />
                  <div style={{ color: '#666', fontSize: '12px', marginTop: 8 }}>
                    Searching diagnoses...
                  </div>
                </div>
              ) : diagnosisSearch.length > 2 ? (
                <div style={{ textAlign: 'center', padding: '12px', color: '#999' }}>
                  No diagnoses found
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '12px', color: '#999' }}>
                  Type at least 3 characters to search
                </div>
              )
            }
          >
            {diagnoses.map(diagnosis => (
              <Option 
                key={diagnosis.id}
                value={diagnosis.id}
                label={`${diagnosis.icd_10_code} - ${diagnosis.diagnosis_name}`}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Space>
                    <Tag color="blue" style={{ margin: 0 }}>{diagnosis.icd_10_code}</Tag>
                    <span>{diagnosis.diagnosis_name}</span>
                  </Space>
                  {renderGenderIcon(diagnosis.gender)}
                </div>
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Selected Diagnoses Display */}
        {selectedDiagnoses.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <div style={{ marginBottom: 8, fontWeight: 500 }}>
              Selected Diagnoses ({selectedDiagnoses.length}):
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {selectedDiagnoses.map((diagnosis) => (
                <Tag
                  key={diagnosis.id}
                  closable
                  onClose={() => removeDiagnosis(diagnosis.id)}
                  closeIcon={<CloseOutlined />}
                  style={{
                    padding: '4px 8px',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                  }}
                >
                  <Tag color="blue" style={{ margin: 0, fontSize: '10px' }}>
                    {diagnosis.icd_10_code}
                  </Tag>
                  {diagnosis.diagnosis_name}
                </Tag>
              ))}
            </div>
          </div>
        )}

        {diagnosisSearch.length > 0 && diagnoses.length > 0 && (
          <div style={{ padding: '8px 12px', backgroundColor: '#f6ffed', borderRadius: 6 }}>
            <small style={{ color: '#52c41a' }}>
              Found {diagnoses.length} diagnosis{diagnoses.length !== 1 ? 'es' : ''}
            </small>
          </div>
        )}
      </Card>

      {/* Procedures Selection */}
      <Card title="Procedures" size="small" style={{ marginBottom: 16 }}>
        <Form.Item label="Select Procedures" name="procedure_select">
          <Select
            placeholder="Search and select procedures"
            size="large"
            showSearch
            optionFilterProp="children"
            filterOption={filterOption}
            loading={loading}
            onSelect={handleProcedureSelect}
            value={undefined}
            allowClear
          >
            {codes?.map((procedure) => (
              <Option key={procedure.id} value={procedure.id}>
                {procedure.description}
                {procedure.code && ` (${procedure.code})`}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Selected Procedures Display */}
        {selectedProcedures.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <div style={{ marginBottom: 8, fontWeight: 500 }}>
              Selected Procedures ({selectedProcedures.length}):
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {selectedProcedures.map((procedure) => (
                <Tag
                  key={procedure.id}
                  closable
                  onClose={() => removeProcedure(procedure.id)}
                  closeIcon={<CloseOutlined />}
                  style={{
                    padding: '4px 8px',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                  }}
                >
                  {procedure.description}
                  {procedure.code && (
                    <span style={{ color: '#666', fontSize: '10px' }}>
                      ({procedure.code})
                    </span>
                  )}
                </Tag>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div style={{ textAlign: 'center', padding: '16px' }}>
            <Spin size="small" />
            <div style={{ color: '#666', fontSize: '12px', marginTop: 8 }}>
              Loading procedures...
            </div>
          </div>
        )}

        {!loading && codes?.length === 0 && (
          <div style={{ textAlign: 'center', padding: '16px', color: '#999' }}>
            No procedures available
          </div>
        )}
      </Card>

      {/* Surgery Details */}
      <Card title="Surgery Details" size="small" style={{ marginBottom: 16 }}>
        {/* Surgery Schedule */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Scheduled Date"
              name="scheduled_date"
              rules={[{ required: true, message: "Please select surgery date" }]}
            >
              <DatePicker
                style={{ width: '100%' }}
                size="large"
                disabled={isEmergency}
                disabledDate={(current) => current && current < dayjs().startOf('day')}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Scheduled Time"
              name="scheduled_time"
              rules={[{ required: true, message: "Please select surgery time" }]}
            >
              <TimePicker
                style={{ width: '100%' }}
                format="HH:mm"
                minuteStep={15}
                size="large"
                disabled={isEmergency}
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* Priority & Additional Information */}
      <Card title="Priority & Instructions" size="small">
        {/* Emergency Surgery */}
        <Form.Item name="is_emergency_surgery" valuePropName="checked">
          <Checkbox onChange={handleEmergencyChange}>
            <span style={{ color: '#ff4d4f', fontWeight: '600' }}>
              🚨 Emergency Surgery (Immediate attention required)
            </span>
          </Checkbox>
        </Form.Item>

        {isEmergency && (
          <div style={{
            padding: '12px',
            backgroundColor: '#fff2f0',
            border: '1px solid #ffccc7',
            borderRadius: 6,
            marginBottom: 16
          }}>
            <div style={{ color: '#ff4d4f', fontWeight: '500', marginBottom: 8 }}>
              ⚠️ Emergency Protocol Activated
            </div>
            <div style={{ color: '#d4380d', fontSize: '12px' }}>
              • Patient will be prioritized for immediate surgery<br />
              • Theatre team will be notified immediately<br />
              • Scheduled for current date/time automatically
            </div>
          </div>
        )}

        {/* Surgery Notes */}
        <Form.Item
          label="Surgery Notes & Instructions"
          name="surgery_notes"
          rules={[{ required: true, message: "Please provide surgery notes" }]}
        >
          <TextArea
            rows={4}
            placeholder="Enter detailed surgery notes, patient preparation instructions, anesthesia requirements, post-op care instructions, and any special considerations..."
            showCount
            maxLength={1000}
          />
        </Form.Item>
      </Card>

      {/* Hidden field to store procedure IDs for form submission */}
      <Form.Item name="procedure_ids" hidden>
        <Input />
      </Form.Item>
    </Form>
  );
};

export default TheatreAdmissionForm;