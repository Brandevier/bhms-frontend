import moment from 'moment';

// Status color mapping
export const STATUS_COLORS = {
  'active': '#52c41a',
  'resolved': '#1890ff',
  'pending': '#fa8c16',
  'critical': '#f5222d',
  'default': '#d9d9d9'
};

// Diagnosis type labels and colors
export const DIAGNOSIS_TYPES = {
  'confirmed_diagnosis': {
    label: 'Confirmed Diagnosis',
    color: '#52c41a',
    icon: 'CheckCircleOutlined',
    badgeColor: 'green'
  },
  'provisional_diagnosis': {
    label: 'Provisional Diagnosis',
    color: '#fa8c16',
    icon: 'ClockCircleOutlined',
    badgeColor: 'orange'
  }
};

// Helper functions
export const getStatusColor = (status) => {
  if (!status) return STATUS_COLORS.default;
  return STATUS_COLORS[status.toLowerCase()] || STATUS_COLORS.default;
};

export const getDiagnosisTypeInfo = (type) => {
  return DIAGNOSIS_TYPES[type] || DIAGNOSIS_TYPES.confirmed_diagnosis;
};

export const isNewDiagnosis = (date) => {
  return moment().diff(moment(date), 'days') <= 7;
};

export const filterDiagnosesByType = (diagnoses, type) => {
  if (!diagnoses) return [];
  if (type === 'all') return diagnoses;
  return diagnoses.filter(d => d.diagnosis_type === type);
};

export const sortDiagnosesByDate = (diagnoses, ascending = false) => {
  return [...diagnoses].sort((a, b) => {
    const dateA = new Date(a.diagnosis_date);
    const dateB = new Date(b.diagnosis_date);
    return ascending ? dateA - dateB : dateB - dateA;
  });
};