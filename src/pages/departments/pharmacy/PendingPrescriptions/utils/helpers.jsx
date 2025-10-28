import moment from 'moment';

export const groupPrescriptionsByPatient = (prescriptions) => {
    return prescriptions.reduce((acc, prescription) => {
        const patient = prescription.visit?.patient;
        if (!patient) return acc;

        const patientId = patient.id;
        if (!acc[patientId]) {
            acc[patientId] = {
                patient: {
                    ...patient,
                    name: `${patient.first_name} ${patient.last_name}`,
                    age: patient.date_of_birth ? 
                        moment().diff(moment(patient.date_of_birth), 'years') : null
                },
                prescriptions: []
            };
        }
        
        acc[patientId].prescriptions.push(prescription);
        
        // Update last prescribed date
        const currentLast = acc[patientId].lastPrescribed;
        const prescriptionDate = new Date(prescription.createdAt);
        if (!currentLast || prescriptionDate > new Date(currentLast)) {
            acc[patientId].lastPrescribed = prescription.createdAt;
        }

        return acc;
    }, {});
};

export const calculateStats = (prescriptions) => {
    const today = new Date().toISOString().split('T')[0];
    
    const todayCount = prescriptions.filter(p => {
        if (!p.createdAt) return false;
        const createdDate = new Date(p.createdAt);
        return !isNaN(createdDate) && createdDate.toISOString().split('T')[0] === today;
    }).length;

    const patientsData = groupPrescriptionsByPatient(prescriptions);
    
    return {
        totalPatients: Object.keys(patientsData).length,
        totalPrescriptions: prescriptions.length,
        emergencyCount: prescriptions.filter(p => p.is_emergency).length,
        todayCount: todayCount
    };
};

export const sortPatientsByPriority = (patientsData) => {
    return Object.values(patientsData).sort((a, b) => {
        // Sort by emergency cases first, then by number of prescriptions, then by date
        const aEmergency = a.prescriptions.some(p => p.is_emergency);
        const bEmergency = b.prescriptions.some(p => p.is_emergency);
        
        if (aEmergency && !bEmergency) return -1;
        if (!aEmergency && bEmergency) return 1;
        
        // More prescriptions first
        if (a.prescriptions.length !== b.prescriptions.length) {
            return b.prescriptions.length - a.prescriptions.length;
        }
        
        // Most recent first
        return new Date(b.lastPrescribed) - new Date(a.lastPrescribed);
    });
};