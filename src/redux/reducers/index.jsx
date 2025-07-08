import authReducer from '../slice/authSlice'
import waitListReducers from '../waitlistSlice'
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




export {
    authReducer,
    icd10Codes,
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
    billingStatsSlice
}
 