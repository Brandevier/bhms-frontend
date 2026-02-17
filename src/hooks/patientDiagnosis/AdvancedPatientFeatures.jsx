import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Card, Tabs, Table, Tag, Button, Space, Modal, Form, Input, 
  Select, DatePicker, message, Progress, Badge, Empty, Descriptions, Switch
} from 'antd';
import { 
  WarningOutlined, MedicineBoxOutlined, HeartOutlined, 
  TeamOutlined, HomeOutlined, StarOutlined,
  PlusOutlined, DeleteOutlined
} from '@ant-design/icons';

import {
  fetchPatientAllergies,
  createAllergy,
  deleteAllergy
} from '../../redux/slice/allergySlice';
import {
  fetchPatientConditions,
  createChronicCondition,
  updateConditionStatus
} from '../../redux/slice/chronicConditionSlice';
import {
  fetchPatientAssessments,
  createRiskAssessment
} from '../../redux/slice/riskAssessmentSlice';
import {
  fetchPatientFamilyHistory,
  fetchPatientSDOH,
  fetchPatientWellness,
  fetchOrganDonor,
  fetchPatientAdherence,
  fetchPatientScreenings,
  createFamilyHistory,
  createSDOH,
  createWellnessScore,
  createOrganDonor,
  createMedicationAdherence,
  createScreeningReminder
} from '../../redux/slice/patientAdvancedSlice';

const { Option } = Select;
const { TextArea } = Input;

// Common allergy types
const ALLERGY_TYPES = ['Drug', 'Food', 'Environmental', 'Latex', 'Insect', 'Other'];
const ALLERGY_SEVERITY = ['Mild', 'Moderate', 'Severe', 'Anaphylaxis'];

// Common chronic conditions (Ghana-specific)
const CHRONIC_CONDITIONS = [
  'Hypertension', 'Diabetes Type 1', 'Diabetes Type 2', 
  'Sickle Cell Disease', 'Asthma', 'COPD', 'HIV/AIDS',
  'Heart Disease', 'Kidney Disease', 'Epilepsy', 
  'Thyroid Disorder', 'Arthritis', 'Cancer', 'Mental Health'
];

// Risk assessment types
const RISK_TYPES = ['Cardiovascular', 'Diabetes', 'Fall', 'Cancer', 'Other'];

// Family relationship types
const RELATIONSHIPS = ['Mother', 'Father', 'Sister', 'Brother', 'Grandmother', 'Grandfather', 'Aunt', 'Uncle', 'Other'];

// Common conditions for family history
const FAMILY_CONDITIONS = [
  'Hypertension', 'Diabetes', 'Heart Disease', 'Stroke', 'Cancer',
  'Sickle Cell Disease', 'Mental Health', 'Asthma', 'Kidney Disease'
];

// Wellness categories
const WELLNESS_CATEGORIES = ['Physical', 'Mental', 'Social', 'Nutrition', 'Sleep', 'Stress'];

// ==================== ALLERGY TAB ====================
const AllergyTab = ({ patientId, institutionId }) => {
  const dispatch = useDispatch();
  const { allergies, loading } = useSelector(state => state.allergy);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (patientId) {
      dispatch(fetchPatientAllergies(patientId));
    }
  }, [dispatch, patientId]);

  const handleAdd = (values) => {
    dispatch(createAllergy({
      ...values,
      patient_id: patientId,
      institution_id: institutionId
    })).then(() => {
      message.success('Allergy added successfully');
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const handleDelete = (id) => {
    dispatch(deleteAllergy(id)).then(() => {
      message.success('Allergy deleted');
    });
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Anaphylaxis': return 'red';
      case 'Severe': return 'orange';
      case 'Moderate': return 'gold';
      default: return 'green';
    }
  };

  const columns = [
    { title: 'Allergen', dataIndex: 'allergen', key: 'allergen' },
    { title: 'Type', dataIndex: 'allergy_type', key: 'type' },
    { title: 'Severity', dataIndex: 'severity', key: 'severity', 
      render: (severity) => (
        <Tag color={getSeverityColor(severity)} title={severity} /> 
      )
    },
    { title: 'Reaction', dataIndex: 'reaction', key: 'reaction' },
    { title: 'Status', dataIndex: 'verification_status', key: 'status',
      render: (status) => (
        <Badge status={status === 'Verified' ? 'success' : status === 'Rejected' ? 'error' : 'warning'} text={status} />
      )
    },
    { title: 'Action', key: 'action',
      render: (_, record) => (
        <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
      )
    }
  ];

  return (
    <Card 
      title={<><WarningOutlined className="mr-2 text-red-500" /> Allergies & Adverse Reactions</>}
      extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>Add Allergy</Button>}
    >
      {allergies && allergies.length > 0 ? (
        <Table dataSource={allergies} columns={columns} rowKey="id" pagination={false} size="small" />
      ) : (
        <Empty description="No allergies recorded" />
      )}

      <Modal
        title="Add Allergy"
        open={isModalVisible}
        destroyOnClose
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleAdd} layout="vertical">
          <Form.Item name="allergen" label="Allergen" rules={[{ required: true }]}>
            <Input placeholder="e.g., Penicillin, Peanuts, Pollen" />
          </Form.Item>
          <Form.Item name="allergy_type" label="Allergy Type" rules={[{ required: true }]}>
            <Select>
              {ALLERGY_TYPES.map(type => <Option key={type} value={type}>{type}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="severity" label="Severity" rules={[{ required: true }]}>
            <Select>
              {ALLERGY_SEVERITY.map(s => <Option key={s} value={s}>{s}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="reaction" label="Reaction">
            <TextArea placeholder="Describe the allergic reaction" />
          </Form.Item>
          <Form.Item name="notes" label="Notes">
            <TextArea placeholder="Additional notes" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

// ==================== CHRONIC CONDITIONS TAB ====================
const ChronicConditionsTab = ({ patientId, institutionId }) => {
  const dispatch = useDispatch();
  const { conditions, loading } = useSelector(state => state.chronicCondition);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (patientId) {
      dispatch(fetchPatientConditions(patientId));
    }
  }, [dispatch, patientId]);

  const handleAdd = (values) => {
    dispatch(createChronicCondition({
      ...values,
      patient_id: patientId,
      institution_id: institutionId
    })).then(() => {
      message.success('Condition added');
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'red';
      case 'Controlled': return 'green';
      case 'Resolved': return 'blue';
      default: return 'default';
    }
  };

  const columns = [
    { title: 'Condition', dataIndex: 'condition_name', key: 'name' },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Stage', dataIndex: 'stage', key: 'stage' },
    { title: 'Status', dataIndex: 'status', key: 'status',
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>
    },
    { title: 'Diagnosis Date', dataIndex: 'diagnosis_date', key: 'date' }
  ];

  return (
    <Card 
      title={<><MedicineBoxOutlined className="mr-2 text-blue-500" /> Chronic Disease Management</>}
      extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>Add Condition</Button>}
    >
      {conditions.length > 0 ? (
        <Table dataSource={conditions} columns={columns} rowKey="id" pagination={false} size="small" />
      ) : (
        <Empty description="No chronic conditions recorded" />
      )}

      <Modal
        title="Add Chronic Condition"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        width={600}
      >
        <Form form={form} onFinish={handleAdd} layout="vertical">
          <Form.Item name="condition_name" label="Condition" rules={[{ required: true }]}>
            <Select showSearch>
              {CHRONIC_CONDITIONS.map(c => <Option key={c} value={c}>{c}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="category" label="Category">
            <Select>
              <Option value="Cardiovascular">Cardiovascular</Option>
              <Option value="Metabolic">Metabolic</Option>
              <Option value="Respiratory">Respiratory</Option>
              <Option value="Infectious">Infectious</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>
          <Form.Item name="stage" label="Stage">
            <Select>
              <Option value="Stage 1">Stage 1</Option>
              <Option value="Stage 2">Stage 2</Option>
              <Option value="Stage 3">Stage 3</Option>
              <Option value="Stage 4">Stage 4</Option>
            </Select>
          </Form.Item>
          <Form.Item name="diagnosis_date" label="Diagnosis Date">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="notes" label="Notes">
            <TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

// ==================== RISK ASSESSMENT TAB ====================
const RiskAssessmentTab = ({ patientId, institutionId }) => {
  const dispatch = useDispatch();
  const { assessments, loading } = useSelector(state => state.riskAssessment);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (patientId) {
      dispatch(fetchPatientAssessments({ patient_id: patientId }));
    }
  }, [dispatch, patientId]);

  const handleAdd = (values) => {
    dispatch(createRiskAssessment({
      ...values,
      patient_id: patientId,
      institution_id: institutionId
    })).then(() => {
      message.success('Assessment completed');
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'High': return 'red';
      case 'Moderate': return 'orange';
      case 'Low': return 'green';
      default: return 'default';
    }
  };

  const columns = [
    { title: 'Type', dataIndex: 'assessment_type', key: 'type' },
    { title: 'Score', dataIndex: 'risk_score', key: 'score' },
    { title: 'Category', dataIndex: 'risk_category', key: 'category',
      render: (cat) => <Tag color={getRiskColor(cat)}>{cat}</Tag>
    },
    { title: 'Date', dataIndex: 'assessment_date', key: 'date' },
    { title: 'Recommendations', dataIndex: 'recommendations', key: 'rec', ellipsis: true }
  ];

  return (
    <Card 
      title={<><HeartOutlined className="mr-2 text-pink-500" /> Risk Assessment</>}
      extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>New Assessment</Button>}
    >
      {assessments.length > 0 ? (
        <Table dataSource={assessments} columns={columns} rowKey="id" pagination={false} size="small" />
      ) : (
        <Empty description="No risk assessments recorded" />
      )}

      <Modal
        title="New Risk Assessment"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleAdd} layout="vertical">
          <Form.Item name="assessment_type" label="Type" rules={[{ required: true }]}>
            <Select>
              {RISK_TYPES.map(r => <Option key={r} value={r}>{r}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="risk_score" label="Score (0-100)" rules={[{ required: true }]}>
            <Input type="number" min={0} max={100} />
          </Form.Item>
          <Form.Item name="risk_category" label="Category" rules={[{ required: true }]}>
            <Select>
              <Option value="Low">Low</Option>
              <Option value="Moderate">Moderate</Option>
              <Option value="High">High</Option>
            </Select>
          </Form.Item>
          <Form.Item name="recommendations" label="Recommendations">
            <TextArea placeholder="Recommended actions" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

// ==================== FAMILY HISTORY TAB ====================
const FamilyHistoryTab = ({ patientId, institutionId }) => {
  const dispatch = useDispatch();
  const { familyHistory } = useSelector(state => state.patientAdvanced);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (patientId) {
      dispatch(fetchPatientFamilyHistory(patientId));
    }
  }, [dispatch, patientId]);

  const handleAdd = (values) => {
    dispatch(createFamilyHistory({
      ...values,
      patient_id: patientId,
      institution_id: institutionId
    })).then(() => {
      message.success('Family history added');
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const columns = [
    { title: 'Condition', dataIndex: 'condition', key: 'condition' },
    { title: 'Relationship', dataIndex: 'relationship', key: 'rel' },
    { title: 'Age at Onset', dataIndex: 'age_at_onset', key: 'age' },
    { title: 'Notes', dataIndex: 'notes', key: 'notes', ellipsis: true }
  ];

  return (
    <Card 
      title={<><TeamOutlined className="mr-2 text-purple-500" /> Family Health History</>}
      extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>Add Entry</Button>}
    >
      {familyHistory.length > 0 ? (
        <Table dataSource={familyHistory} columns={columns} rowKey="id" pagination={false} size="small" />
      ) : (
        <Empty description="No family history recorded" />
      )}

      <Modal
        title="Add Family History"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleAdd} layout="vertical">
          <Form.Item name="condition" label="Condition" rules={[{ required: true }]}>
            <Select showSearch>
              {FAMILY_CONDITIONS.map(c => <Option key={c} value={c}>{c}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="relationship" label="Relationship" rules={[{ required: true }]}>
            <Select>
              {RELATIONSHIPS.map(r => <Option key={r} value={r}>{r}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="age_at_onset" label="Age at Onset">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="notes" label="Notes">
            <TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

// ==================== SDOH TAB ====================
const SDOHTab = ({ patientId, institutionId }) => {
  const dispatch = useDispatch();
  const { sdoh } = useSelector(state => state.patientAdvanced);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (patientId) {
      dispatch(fetchPatientSDOH(patientId));
    }
  }, [dispatch, patientId]);

  const handleAdd = (values) => {
    dispatch(createSDOH({
      ...values,
      patient_id: patientId,
      institution_id: institutionId
    })).then(() => {
      message.success('SDOH recorded');
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  return (
    <Card 
      title={<><HomeOutlined className="mr-2 text-green-500" /> Social Determinants of Health</>}
      extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
        {sdoh ? 'Update' : 'Add'} SDOH
      </Button>}
    >
      {sdoh ? (
        <Descriptions bordered column={2} size="small">
          <Descriptions.Item label="Employment">{sdoh.employment_status}</Descriptions.Item>
          <Descriptions.Item label="Income">{sdoh.income_level}</Descriptions.Item>
          <Descriptions.Item label="Education">{sdoh.education_level}</Descriptions.Item>
          <Descriptions.Item label="Housing">{sdoh.housing_status}</Descriptions.Item>
          <Descriptions.Item label="Transport">{sdoh.access_to_transport}</Descriptions.Item>
          <Descriptions.Item label="Food Security">{sdoh.food_security}</Descriptions.Item>
        </Descriptions>
      ) : (
        <Empty description="No SDOH data recorded" />
      )}

      <Modal
        title="Social Determinants of Health"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        width={600}
      >
        <Form form={form} onFinish={handleAdd} layout="vertical" initialValues={sdoh || {}}>
          <Form.Item name="employment_status" label="Employment">
            <Select>
              <Option value="Employed">Employed</Option>
              <Option value="Self-employed">Self-employed</Option>
              <Option value="Unemployed">Unemployed</Option>
              <Option value="Student">Student</Option>
            </Select>
          </Form.Item>
          <Form.Item name="income_level" label="Income">
            <Select>
              <Option value="Low">Low</Option>
              <Option value="Middle">Middle</Option>
              <Option value="High">High</Option>
            </Select>
          </Form.Item>
          <Form.Item name="education_level" label="Education">
            <Select>
              <Option value="None">None</Option>
              <Option value="Primary">Primary</Option>
              <Option value="Secondary">Secondary</Option>
              <Option value="Tertiary">Tertiary</Option>
            </Select>
          </Form.Item>
          <Form.Item name="housing_status" label="Housing">
            <Select>
              <Option value="Own">Own</Option>
              <Option value="Rent">Rent</Option>
              <Option value="Informal">Informal</Option>
            </Select>
          </Form.Item>
          <Form.Item name="food_security" label="Food Security">
            <Select>
              <Option value="Secure">Secure</Option>
              <Option value="Insecure">Insecure</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

// ==================== WELLNESS TAB ====================
const WellnessTab = ({ patientId, institutionId }) => {
  const dispatch = useDispatch();
  const { wellness } = useSelector(state => state.patientAdvanced);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (patientId) {
      dispatch(fetchPatientWellness(patientId));
    }
  }, [dispatch, patientId]);

  const handleAdd = (values) => {
    const scores = [
      values.physical_score, values.mental_score, values.social_score,
      values.nutrition_score, values.sleep_score, values.stress_score
    ].filter(s => s);
    const overall = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

    dispatch(createWellnessScore({
      ...values,
      overall_score: overall,
      patient_id: patientId,
      institution_id: institutionId
    })).then(() => {
      message.success('Wellness score recorded');
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#52c41a';
    if (score >= 60) return '#faad14';
    return '#f5222d';
  };

  return (
    <Card 
      title={<><StarOutlined className="mr-2 text-yellow-500" /> Wellness Dashboard</>}
      extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>Record Wellness</Button>}
    >
      {wellness ? (
        <div className="text-center">
          <Progress 
            type="circle" 
            percent={wellness.overall_score} 
            strokeColor={getScoreColor(wellness.overall_score)}
            size={100}
          />
          <p className="mt-2 text-gray-600">Overall Wellness</p>
          <Descriptions bordered column={3} size="small" className="mt-4">
            <Descriptions.Item label="Physical"><Progress percent={wellness.physical_score} size="small" /></Descriptions.Item>
            <Descriptions.Item label="Mental"><Progress percent={wellness.mental_score} size="small" /></Descriptions.Item>
            <Descriptions.Item label="Social"><Progress percent={wellness.social_score} size="small" /></Descriptions.Item>
          </Descriptions>
        </div>
      ) : (
        <Empty description="No wellness data recorded" />
      )}

      <Modal
        title="Record Wellness Score"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        width={500}
      >
        <Form form={form} onFinish={handleAdd} layout="vertical">
          <p className="text-gray-500">Rate each category from 0-100:</p>
          {WELLNESS_CATEGORIES.map(cat => (
            <Form.Item key={cat} name={`${cat.toLowerCase()}_score`} label={cat}>
              <Input type="number" min={0} max={100} placeholder="0-100" />
            </Form.Item>
          ))}
        </Form>
      </Modal>
    </Card>
  );
};

// ==================== MEDICATION ADHERENCE TAB ====================
const MedicationAdherenceTab = ({ patientId, institutionId }) => {
  const dispatch = useDispatch();
  const { medicationAdherence } = useSelector(state => state.patientAdvanced);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (patientId) {
      dispatch(fetchPatientAdherence(patientId));
    }
  }, [dispatch, patientId]);

  const handleAdd = (values) => {
    dispatch(createMedicationAdherence({
      ...values,
      patient_id: patientId,
      institution_id: institutionId
    })).then(() => {
      message.success('Medication adherence recorded');
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const getAdherenceColor = (rate) => {
    if (rate >= 90) return '#52c41a';
    if (rate >= 70) return '#faad14';
    return '#f5222d';
  };

  return (
    <Card 
      title={<><MedicineBoxOutlined className="mr-2 text-blue-500" /> Medication Adherence</>}
      extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>Record Adherence</Button>}
    >
      {medicationAdherence && medicationAdherence.length > 0 ? (
        <div>
          {medicationAdherence.map((item, idx) => (
            <div key={idx} className="mb-4 p-4 border rounded">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{item.medication_name}</span>
                <Progress 
                  percent={item.adherence_rate} 
                  strokeColor={getAdherenceColor(item.adherence_rate)}
                  size="small"
                  style={{ width: 150 }}
                />
              </div>
              <p className="text-sm text-gray-500">Period: {item.start_date} - {item.end_date || 'Ongoing'}</p>
              <p className="text-sm">Notes: {item.notes || 'N/A'}</p>
            </div>
          ))}
        </div>
      ) : (
        <Empty description="No medication adherence data recorded" />
      )}

      <Modal
        title="Record Medication Adherence"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleAdd} layout="vertical">
          <Form.Item name="medication_name" label="Medication" rules={[{ required: true }]}>
            <Input placeholder="e.g., Metformin 500mg" />
          </Form.Item>
          <Form.Item name="adherence_rate" label="Adherence Rate (%)" rules={[{ required: true }]}>
            <Input type="number" min={0} max={100} placeholder="0-100" />
          </Form.Item>
          <Form.Item name="start_date" label="Start Date" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="end_date" label="End Date">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="notes" label="Notes">
            <TextArea rows={2} placeholder="Any observations or concerns" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

// ==================== SCREENING REMINDERS TAB ====================
const ScreeningRemindersTab = ({ patientId, institutionId }) => {
  const dispatch = useDispatch();
  const { screeningReminders } = useSelector(state => state.patientAdvanced);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (patientId) {
      dispatch(fetchPatientScreenings(patientId));
    }
  }, [dispatch, patientId]);

  const handleAdd = (values) => {
    dispatch(createScreeningReminder({
      ...values,
      patient_id: patientId,
      institution_id: institutionId
    })).then(() => {
      message.success('Screening reminder created');
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'green';
      case 'Scheduled': return 'blue';
      case 'Overdue': return 'red';
      default: return 'default';
    }
  };

  const SCREENING_TYPES = [
    'TB Screening', 'Cervical Cancer Screening', 'Breast Cancer Screening',
    'Prostate Cancer Screening', 'Diabetes Screening', 'Hypertension Screening',
    'HIV Screening', 'Hepatitis B Screening', 'Eye Examination', 'Dental Screening'
  ];

  const columns = [
    { title: 'Screening Type', dataIndex: 'screening_type', key: 'type' },
    { title: 'Due Date', dataIndex: 'due_date', key: 'due' },
    { title: 'Status', dataIndex: 'status', key: 'status',
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>
    },
    { title: 'Result', dataIndex: 'result', key: 'result' },
    { title: 'Notes', dataIndex: 'notes', key: 'notes', ellipsis: true }
  ];

  return (
    <Card 
      title={<><WarningOutlined className="mr-2 text-orange-500" /> Preventive Screening Reminders</>}
      extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>Add Reminder</Button>}
    >
      {screeningReminders && screeningReminders.length > 0 ? (
        <Table dataSource={screeningReminders} columns={columns} rowKey="id" pagination={false} size="small" />
      ) : (
        <Empty description="No screening reminders set" />
      )}

      <Modal
        title="Add Screening Reminder"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleAdd} layout="vertical">
          <Form.Item name="screening_type" label="Screening Type" rules={[{ required: true }]}>
            <Select showSearch>
              {SCREENING_TYPES.map(s => <Option key={s} value={s}>{s}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="due_date" label="Due Date" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="status" label="Status">
            <Select>
              <Option value="Scheduled">Scheduled</Option>
              <Option value="Completed">Completed</Option>
              <Option value="Overdue">Overdue</Option>
              <Option value="Declined">Declined</Option>
            </Select>
          </Form.Item>
          <Form.Item name="result" label="Result">
            <Input placeholder="Screening result if available" />
          </Form.Item>
          <Form.Item name="notes" label="Notes">
            <TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

// ==================== ORGAN DONOR TAB ====================
const OrganDonorTab = ({ patientId, institutionId }) => {
  const dispatch = useDispatch();
  const { organDonor } = useSelector(state => state.patientAdvanced);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (patientId) {
      dispatch(fetchOrganDonor(patientId));
    }
  }, [dispatch, patientId]);

  const handleAdd = (values) => {
    dispatch(createOrganDonor({
      ...values,
      patient_id: patientId,
      institution_id: institutionId
    })).then(() => {
      message.success('Organ donor status updated');
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  return (
    <Card 
      title={<><HeartOutlined className="mr-2 text-red-500" /> Organ Donor</>}
      extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
        {organDonor ? 'Update' : 'Register'}
      </Button>}
    >
      {organDonor ? (
        <Descriptions bordered column={2} size="small">
          <Descriptions.Item label="Registered">{organDonor.is_donor ? 'Yes' : 'No'}</Descriptions.Item>
          <Descriptions.Item label="Type">{organDonor.donation_type}</Descriptions.Item>
          <Descriptions.Item label="Contact" span={2}>
            {organDonor.emergency_contact_name} - {organDonor.emergency_contact_phone}
          </Descriptions.Item>
        </Descriptions>
      ) : (
        <Empty description="Not registered as organ donor" />
      )}

      <Modal
        title="Organ Donor Registration"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleAdd} layout="vertical" initialValues={organDonor || {}}>
          <Form.Item name="is_donor" label="I want to be an organ donor" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="donation_type" label="Donation Type">
            <Select>
              <Option value="All organs">All organs</Option>
              <Option value="Tissues only">Tissues only</Option>
            </Select>
          </Form.Item>
          <Form.Item name="emergency_contact_name" label="Contact Name">
            <Input />
          </Form.Item>
          <Form.Item name="emergency_contact_phone" label="Contact Phone">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

// ==================== MAIN COMPONENT ====================
const AdvancedPatientFeatures = ({ patientId, institutionId }) => {
  const [activeTab, setActiveTab] = useState('1');

  const tabItems = [
    { key: '1', label: 'Allergies', children: <AllergyTab patientId={patientId} institutionId={institutionId} /> },
    { key: '2', label: 'Chronic', children: <ChronicConditionsTab patientId={patientId} institutionId={institutionId} /> },
    { key: '3', label: 'Risk', children: <RiskAssessmentTab patientId={patientId} institutionId={institutionId} /> },
    { key: '4', label: 'Family', children: <FamilyHistoryTab patientId={patientId} institutionId={institutionId} /> },
    { key: '5', label: 'Social', children: <SDOHTab patientId={patientId} institutionId={institutionId} /> },
    { key: '6', label: 'Wellness', children: <WellnessTab patientId={patientId} institutionId={institutionId} /> },
    { key: '7', label: 'Adherence', children: <MedicationAdherenceTab patientId={patientId} institutionId={institutionId} /> },
    { key: '8', label: 'Screenings', children: <ScreeningRemindersTab patientId={patientId} institutionId={institutionId} /> },
    { key: '9', label: 'Donor', children: <OrganDonorTab patientId={patientId} institutionId={institutionId} /> },
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab} 
        items={tabItems}
        size="small"
      />
    </div>
  );
};

export default AdvancedPatientFeatures;
