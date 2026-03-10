import authReducer from '../slice/authSlice'
import dashboardReducer from '../slice/dashboardSlice'
import backupReducer from '../slice/backupSlice'
import dataManagementReducer from '../slice/dataManagementSlice'
import waitListReducers from '../slice/waitlistSlice'
import departmentReducers from '../slice/departmentSlice'
import staffAdminManagementSlice from  '../slice/staff_admin_managment_slice'
import staff_permission_slice from  '../slice/staffPermissionSlice'
import recordsReducers from '../slice/recordSlice'
import diagnosisReducers from '../slice/diagnosisSlice'
import vitalSignsReducers from '../slice/vitalSignsSlice'
import patientNoteSlice from '../slice/patientNotesSlice'
import labReducers from '../slice/labSlice'
import prescriptionSlice from '../slice/prescriptionSlice'
import serviceReducers from '../slice/serviceSlice'
import procedureReducers from  '../slice/procedureSlice'
import inventoryReducers from '../slice/inventorySlice'
import shiftReducers from  '../slice/shiftSlice'
import notificationSlice from  '../slice/notificationSlice'
import patientNoteCommentSlice from '../slice/commentSlice'
import admissionSlice from '../slice/admissionSlice'
import transferSlice from '../slice/transferSlice'
import InstitutionPaymentSlice from '../slice/institutionPayments'
import obstetricHistorySlice from '../slice/obstetricHistorySlice'
import medicalHistorySlice from '../slice/medicalHistorySlice'
import ImmunizationSlice from '../slice/ImmunizationHistorySlice'
import consultationSlice from '../slice/consultationSlice'
import chatSlice from '../slice/chatSlice'
import billSlice from  '../slice/PatientBillSlices'
import attendanceSlice from '../slice/qrAttendanceSlice'
import dischargeSlice from  '../slice/dischargeSlice'
import billingStatsSlice from '../slice/billingStatsSlice'
import bedSlice from '../slice/bedSlice'
import ORscheduling from '../slice/ORSlice'
import icd10ToGdrg from '../slice/gdrg_mapping'
import nhiaMedicationsReducer from '../slice/nhia_medicationsSlice';
import icd10Codes from '../slice/icd10DdiangosisSlice';
import interventionSlice from '../slice/clinicalInterventionSlice'
import claims_dgrg from '../slice/claims_dgrg'
import labInvestigationSlice from '../slice/labInvestigationSlice'
import appoitmentSlice from '../slice/createBookingSlice'
import carePlanSice from  '../slice/carePlanSlice'
import fluidMonitoring from '../slice/fluidMonitoringSlice'
import accountSlice from '../slice/accountsSlice'
import faceRecognitionSlice from '../slice/faceRecognitionSlice'
import nhiaVettingReducer from '../slice/nhiaVettingSlice';
import invoiceReducer from '../slice/invoiceSlice';
import billingReducer from '../slice/billingSlice';
import leaveReducer from '../slice/leaveSlice';
import claimItemReducer from '../slice/claimItemSlice';
import ancReducer from '../slice/ancSlice';
import partographReducer from '../slice/partographSlice';
import ultrasoundReducer from '../slice/ultrasoundSlice';
import staffDepartmentReducer from '../slice/staffDepartmentSlice';
import departmentSwitchReducer from "../slice/departmentSwitchSlice";
import diagnosisAnalysisReducers from '../slice/diagnosisAnalysisSlice'
import patientAnalysisReducers from '../slice/patientAnalysisSlice'
import bedStatisticsReducers from '../slice/bedStatisticsSlice'
import patientSummaryReducer from '../slice/patientSummarySlice';
import staffDepartmentSwitchReducer from '../slice/staffDepartmentSwitchSlice';
import sessionManagerReducer from '../slice/sessionSlice'
import nurseHandoverReducers from '../slice/nurseHandoverSlice'
import claimsReducers from  '../slice/claimSlice'
import theatreReducer from '../slice/theatreSlice';
import meetingReducers from '../slice/meetingSlice';
import preOpChecklistReducers from '../slice/theatre/preOpChecklistSlice';
import educationMaterialReducers from '../slice/theatre/educationMaterialsSlice'
import doctorsNoteReducers from '../slice/doctorsNoteSlice' 
import patientOccupationReducers from  '../slice/occupationHistorySlice'
import drugHistoryReducers from '../slice/drugHistorySlice' 
import pastMedicalHistoryReducers from '../slice/pastMedicalHistorySlice'

// New Advanced Patient Feature Slices
import allergyReducer from '../slice/allergySlice'
import chronicConditionReducer from '../slice/chronicConditionSlice'
import riskAssessmentReducer from '../slice/riskAssessmentSlice'
import patientAdvancedReducer from '../slice/patientAdvancedSlice'
import systemConfigReducer from '../slice/systemConfigSlice'

// Patient Billing Slice
import patientBillingReducer from '../slice/patientBillingSlice'

export {
    dashboardReducer,
    backupReducer,
    dataManagementReducer,
    systemConfigReducer,
    allergyReducer,
    chronicConditionReducer,
    riskAssessmentReducer,
    patientAdvancedReducer,
    authReducer,
    claimsReducers,
    drugHistoryReducers,
    pastMedicalHistoryReducers,
    patientOccupationReducers,
    doctorsNoteReducers,
    educationMaterialReducers,
    meetingReducers,
    sessionManagerReducer,
    nurseHandoverReducers,
    staffDepartmentSwitchReducer,
    patientSummaryReducer,
    bedStatisticsReducers,
    diagnosisAnalysisReducers,
    preOpChecklistReducers,
    patientAnalysisReducers,
    ancReducer,
    partographReducer,
    departmentSwitchReducer,
    billingReducer,
    patientBillingReducer,
    staffDepartmentReducer,
    invoiceReducer,
    claimItemReducer,
    ultrasoundReducer,
    accountSlice,
    faceRecognitionSlice,
    fluidMonitoring,
    appoitmentSlice,
    carePlanSice,
    leaveReducer,
    icd10Codes,
    nhiaVettingReducer,
    interventionSlice,
    nhiaMedicationsReducer,
    icd10ToGdrg,
    ORscheduling,
    bedSlice,
    waitListReducers,
    departmentReducers,
    staffAdminManagementSlice,
    staff_permission_slice,
    recordsReducers,
    diagnosisReducers,
    vitalSignsReducers,
    patientNoteSlice,
    labReducers,
    prescriptionSlice,
    serviceReducers,
    procedureReducers,
    inventoryReducers,
    shiftReducers,
    notificationSlice,
    patientNoteCommentSlice,
    admissionSlice,
    transferSlice,
    InstitutionPaymentSlice,
    obstetricHistorySlice,
    medicalHistorySlice,
    ImmunizationSlice,
    consultationSlice,
    chatSlice,
    billSlice,
    attendanceSlice,
    dischargeSlice,
    billingStatsSlice,
    claims_dgrg,
    labInvestigationSlice,
    theatreReducer
}

