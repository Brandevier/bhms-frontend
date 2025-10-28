import moment from 'moment';

export const groupPrescriptionsByPatient = (prescriptions) => {
  return prescriptions.reduce((acc, prescription) => {
    const patientId = prescription.visit?.patient?.id;
    if (!patientId) return acc;

    if (!acc[patientId]) {
      acc[patientId] = {
        patient: {
          ...prescription.visit.patient,
          name: `${prescription.visit.patient.first_name} ${prescription.visit.patient.last_name}`
        },
        prescriptions: []
      };
    }
    
    acc[patientId].prescriptions.push(prescription);
    return acc;
  }, {});
};

export const filterPrescriptions = (prescriptions, filters) => {
  return prescriptions.filter(prescription => {
    const matchesSearch = !filters.searchText || 
      prescription.visit?.patient?.first_name?.toLowerCase().includes(filters.searchText.toLowerCase()) ||
      prescription.visit?.patient?.last_name?.toLowerCase().includes(filters.searchText.toLowerCase()) ||
      prescription.medicine?.generic_name?.toLowerCase().includes(filters.searchText.toLowerCase()) ||
      prescription.department?.name?.toLowerCase().includes(filters.searchText.toLowerCase());

    const matchesDate = !filters.dateRange.length || (
      moment(prescription.updatedAt).isAfter(moment(filters.dateRange[0])) &&
      moment(prescription.updatedAt).isBefore(moment(filters.dateRange[1]))
    );

    const matchesStatus = filters.status === 'all' || 
      (filters.status === 'dispensed' && prescription.is_dispensed) ||
      (filters.status === 'pending' && !prescription.is_dispensed) ||
      (filters.status === 'cancelled' && prescription.status === 'cancelled');

    const matchesDepartment = filters.department === 'all' || 
      prescription.department?.name?.toLowerCase().includes(filters.department.toLowerCase());

    return matchesSearch && matchesDate && matchesStatus && matchesDepartment;
  });
};

export const sortPrescriptionsByDate = (prescriptions, ascending = false) => {
  return [...prescriptions].sort((a, b) => {
    const dateA = new Date(a.updatedAt);
    const dateB = new Date(b.updatedAt);
    return ascending ? dateA - dateB : dateB - dateA;
  });
};