import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Avatar,
  Typography,
  Button,
  Tooltip,
  message,
  Badge,
  Tag,
  Popover,
  Divider,
  Modal,
} from "antd";
import {
  EditOutlined,
  ExperimentOutlined,
  HeartOutlined,
  PlusCircleOutlined,
  FileTextOutlined,
  MedicineBoxOutlined,
  LoginOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  InsuranceOutlined,
  CalendarOutlined,
  UserOutlined,
  IdcardOutlined,
  ApartmentOutlined,
  BankOutlined
} from "@ant-design/icons";
import { useMediaQuery } from 'react-responsive';
import BhmsButton from "../heroComponents/BhmsButton";
const { Title, Text } = Typography;
import VitalSignsModal from "../modal/VitalSignsModal";
import PatientDiagnosisModal from "../modal/PatientDiagnosisModal";
import { useDispatch, useSelector } from "react-redux";
import { createVitalSignsRecord } from "../redux/slice/vitalSignsSlice";
import { useParams } from 'react-router-dom';
import RequestLabDialog from "../modal/RequestLabDialog";
import PrescriptionModal from "../modal/prescription_modals/PrescriptionModal";
import CreateProcedureModal from "../modal/CreateProcedureModal";
import { createPrescription } from "../redux/slice/prescriptionSlice";
import { addProcedure } from "../redux/slice/procedureSlice";
import AdmitPatientModal from "../modal/AdmitPatientModal";
import useDepartmentCheck from "../customHooks/useDepartmentCheck";
import { addDiagnosis } from "../redux/slice/diagnosisSlice";
import { admitPatient } from "../redux/slice/admissionSlice";
import DischargePatientModal from "../modal/TransferPatientModal";
import { fetchAllDiagnoses } from "../redux/slice/icd10DdiangosisSlice";
import { createTestResult,updateTestResult } from "../redux/slice/labSlice";
import DiagnosisDrawer from "../drawers/DiagnosisDrawer";
import PatientStatusModal from "../modal/PatientStatusModal";
import AppointmentModal from "../modal/AppointmentModal";



const PatientProfileHeader = ({ patient_record, handleGeneralSubmit, patient_id, patient_department, lab, medication }) => {
  const [vitalModalVisible, setVitalModalVisible] = useState(false);
  const [labModalVisible, setLabModalVisible] = useState(false);
  const [prescriptionModalVisible, setPrescriptionModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [admitModalVisible, setAdmitModalVisible] = useState(false);
  const [appointmentModalVisible, setAppointmentModalVisible] = useState(false);
  const [transferModal, setTransferModal] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const dispatch = useDispatch();
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isTablet = useMediaQuery({ minWidth: 769, maxWidth: 1024 });
  const [diagnosisDrawerVisible, setDiagnosisDrawerVisible] = useState(false);
  const { user } = useSelector((state) => state.auth)
  const { loading } = useSelector((state)=>state.lab)



  const handleVitalsSubmit = (data) => {
    const vitalSignsData = {
      ...data,
      visit_id: patient_id,
    };
    dispatch(createVitalSignsRecord(vitalSignsData)).unwrap()
      .then((res) => {
        message.success('Vitals recorded successfully');
        handleGeneralSubmit();
        setVitalModalVisible(false);
      })
      .catch(() => message.error('Failed to record vitals'));
  };
  const handleAppointmentSubmit = (values) => {
    console.log('Appointment data:', values);
    handleGeneralSubmit();
  };



  const handleLabSubmit = (data) => {
    const department_id = localStorage.getItem('department_id');
    const labData = {
      ...data,
      visit_id: patient_id,
      department_id: department_id,
    };

    console.log(labData);

    dispatch(createTestResult(labData)).unwrap().then((res) => {
      message.success('Lab request created successfully');
      handleGeneralSubmit();
      setLabModalVisible(false);
    })

  };


const handlePrescriptionSubmit = (data) => {
  let prescriptionsArray;

  if (Array.isArray(data)) {
    prescriptionsArray = data;
  } else if (typeof data === 'object' && Object.keys(data).every(k => !isNaN(k))) {
    prescriptionsArray = Object.values(data); // Fix for "0", "1" keys
  } else {
    prescriptionsArray = [data];
  }

  const submitData = prescriptionsArray.map(prescription => ({
    ...prescription,
    visit_id: patient_id,
    institution_id: user.institution.id,
    department_id: localStorage.getItem('department_id'),
    doctor_id: user.id,
  }));

  console.log("📤 Final data being sent to backend:", submitData);

  dispatch(createPrescription(submitData))
    .unwrap()
    .then(() => {
      message.success('Prescription created successfully');
      handleGeneralSubmit();
      setPrescriptionModalVisible(false);
    })
    .catch(() => message.error('Failed to create prescription'));
};



  const handleAddProcedure = (newProcedure) => {
    const procedureData = {
      ...newProcedure,
      visit_id: patient_id,
      claim_id: patient_record?.claims?.[0]?.id
    };

    dispatch(addProcedure(procedureData)).unwrap().then((res) => {
      message.success('procedure created successfully')
      handleGeneralSubmit();
      setProcedureModalVisible(false);
    })
  };


  const handleAdmit = (patientData) => {
    const data = {
      ...patientData,
      visit_id: patient_record.id
    }
    dispatch(admitPatient(data)).unwrap().then((res) => {
      message.success('Patient admitted successfully')
      setAdmitModalVisible(false)
    })
    console.log(data)
  };


  const hasAccess = useDepartmentCheck(["Doctor", "Surgeon", "Physician Assistant", "Admin"]);


  const handleDiagnosisSubmit = (data) => {
    const submitData = {
      ...data,
      patient_id: patient_id,
      department_id: patient_department,

    }

    dispatch(addDiagnosis(submitData)).unwrap().then((res) => {

      message.success('diagnosis created successfully');
      handleGeneralSubmit();
    })

  }

  // Get all diagnoses sorted by date
  const diagnoses = patient_record?.diagnosis?.length
    ? [...patient_record.diagnosis].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    : [];



  // Status configuration
  const statusConfig = {
    Active: { color: 'green', text: 'Active' },
    pending: { color: 'orange', text: 'Pending' },
    Discharged: { color: 'blue', text: 'Discharged' },
    Admitted: { color: 'purple', text: 'Admitted' },
    default: { color: 'gray', text: 'Unknown' }
  };

  const currentStatus = patient_record?.status || 'pending';
  const statusInfo = statusConfig[currentStatus] || statusConfig.default;

  // Insurance information
  const has_insurance = patient_record?.patient?.has_insurance;

  const handleScroll = (direction) => {
    const container = document.getElementById('action-buttons-container');
    const scrollAmount = 200;
    if (container) {
      if (direction === 'left') {
        container.scrollLeft -= scrollAmount;
      } else {
        container.scrollLeft += scrollAmount;
      }
      setScrollPosition(container.scrollLeft);
    }
  };

  // Method to handle admit click

  const handleAdmitClick = () => {
    if (patient_record?.on_admission) {
      Modal.warning({
        title: "Patient Already on Admission",
        content: "⚠️ This patient is currently admitted and cannot be re-admitted.",
        okText: "Close",
      });
      return; // stop here
    }
    setAdmitModalVisible(true);
  };




  const actionButtons = [
    { icon: <ExperimentOutlined />, tooltip: "Request Lab", action: () => setLabModalVisible(true), disabled: !hasAccess },
    { icon: <FileTextOutlined />, tooltip: "Add Diagnosis", action: () => setDiagnosisDrawerVisible(true), disabled: !hasAccess },
    { icon: <HeartOutlined />, tooltip: "Take Vitals", action: () => setVitalModalVisible(true), disabled: false },
    { icon: <PlusCircleOutlined />, tooltip: "Request Procedure", action: () => setModalVisible(true), disabled: !hasAccess },
    { icon: <MedicineBoxOutlined />, tooltip: "Prescribe Medication", action: () => setPrescriptionModalVisible(true), disabled: !hasAccess },
    // check if patient . admission_status is true if so dont allow admission of patient

    { icon: <LoginOutlined />, tooltip: "Admit Patient", action: handleAdmitClick, disabled: !hasAccess },

    { icon: <CalendarOutlined />, tooltip: "Book Appointment", action: () => setAppointmentModalVisible(true), disabled: false }
  ];

  {/* Helper functions (put these outside your component) */ }
  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    const birthDate = new Date(dob);
    const diff = Date.now() - birthDate.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <>
      <Card>
        {/* Patient Details Row */}
        <Row align="middle" justify="space-between" gutter={[16, 16]}>
          <Col xs={24} sm={18}>
            <div style={{ display: "flex", alignItems: "flex-start", flexWrap: 'wrap' }}>
              {/* Avatar */}
              <Avatar
                size={isMobile ? 48 : 64}
                src={patient_record?.patient?.gender === "Male" ? "/assets/male_patient.jpg" : "/assets/female_patient.jpg"}
                shape="square"
                style={{ marginRight: 15, marginBottom: isMobile ? 10 : 0 }}
              />


              {/* Patient Info */}
              <div style={{ flex: 1, minWidth: isMobile ? '100%' : 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                  <Title level={isMobile ? 4 : 3} style={{ margin: 0 }}>
                    {`${patient_record?.patient?.first_name} ${patient_record?.patient?.middle_name || ''} ${patient_record?.patient?.last_name}`}
                  </Title>

                  {/* Gender Badge */}
                  <Badge
                    status={patient_record?.patient?.gender === 'M' ? 'blue' : 'pink'}
                    text={patient_record?.patient?.gender === 'M' ? 'Male' : 'Female'}
                  />

                  {/* Age Badge */}
                  <Badge
                    status="default"
                    text={`${calculateAge(patient_record?.patient?.date_of_birth)} years`}
                  />

                  {/* Status Badge */}
                  <Badge
                    status={statusInfo.color}
                    text={
                      <Button
                        type="text"
                        size="small"
                        onClick={() => hasAccess && setStatusModalVisible(true)}
                        style={{ color: statusInfo.color, padding: '0 4px' }}
                      >
                        {statusInfo.text}
                      </Button>
                    }
                  />
                </div>

                {/* Details Row */}
                <div style={{ margin: '12px 0', display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                  {/* DOB */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <CalendarOutlined />
                    <Text type="secondary">DOB:</Text>
                    <Text>{formatDate(patient_record?.patient?.date_of_birth)}</Text>
                  </div>

                  {/* Folder Number */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <IdcardOutlined />
                    <Text type="secondary">Folder #:</Text>
                    <Text strong>{patient_record?.patient?.folder_number}</Text>
                  </div>

                  {/* Insurance */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <InsuranceOutlined />
                    <Text type="secondary">Insurance:</Text>
                    <Tag color="gold">{has_insurance ? "True" : "False"}</Tag>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <BankOutlined />
                <Text type="secondary">Admission Status:</Text>
                <Tag
                  color={
                    patient_record?.admission_status === "pending"
                      ? "orange"
                      : patient_record?.admission_status === "admitted"
                        ? "green"
                        : "red"
                  }
                >
                  {patient_record?.admission_status || "N/A"}
                </Tag>
              </div>

              {/* Department */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <ApartmentOutlined />
                <Text type="secondary">Department:</Text>
                <Text strong>{patient_record?.department?.name || "N/A"}</Text>
              </div>

            </div>
          </Col>

          {/* Edit Button */}
          <Col xs={24} sm={6} style={{ textAlign: isMobile ? 'left' : 'right' }}>
            <BhmsButton
              block={isMobile}
              size={isMobile ? 'small' : 'medium'}
              disabled={!hasAccess}
              onClick={() => setTransferModal(true)}
            >
              Discharge Patient
            </BhmsButton>
          </Col>
        </Row>

        {/* Action Buttons - Horizontal Scroll on Mobile */}
        <div style={{ marginTop: 20, position: 'relative' }}>
          {isMobile && scrollPosition > 0 && (
            <Button
              shape="circle"
              icon={<ArrowLeftOutlined />}
              onClick={() => handleScroll('left')}
              style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 1 }}
            />
          )}

          <div
            id="action-buttons-container"
            style={{
              display: 'flex',
              overflowX: isMobile ? 'auto' : 'visible',
              scrollBehavior: 'smooth',
              padding: isMobile ? '10px 0' : 0,
              justifyContent: isMobile ? 'flex-start' : 'center',
              gap: isMobile ? '16px' : '8px',
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' }
            }}
          >
            {actionButtons.map((btn, index) => (
              <Tooltip key={index} title={btn.tooltip}>
                <Button
                  shape="circle"
                  icon={btn.icon}
                  onClick={btn.action}
                  disabled={btn.disabled}
                  size={isMobile ? 'large' : 'default'}
                  style={{ flexShrink: 0 }}
                />
              </Tooltip>
            ))}
          </div>

          {isMobile && (
            <Button
              shape="circle"
              icon={<ArrowRightOutlined />}
              onClick={() => handleScroll('right')}
              style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 1 }}
            />
          )}
        </div>
      </Card>

      {/* Modals */}
      <VitalSignsModal
        visible={vitalModalVisible}
        onClose={() => setVitalModalVisible(false)}
        onSubmit={handleVitalsSubmit}
      />

      <DiagnosisDrawer
        visible={diagnosisDrawerVisible}
        onClose={() => setDiagnosisDrawerVisible(false)}
        visit_id={patient_id}
        claim_id={patient_record?.claims?.[0]?.id}
        onFinished={handleGeneralSubmit}
      />

      <PatientStatusModal
        visible={statusModalVisible}
        onClose={() => setStatusModalVisible(false)}
        currentStatus={currentStatus}
        patientId={patient_record?.patient?.id}
        visitId={patient_id}
        onStatusChange={handleGeneralSubmit}
      />

      {/* Other modals remain the same */}
      <RequestLabDialog
        visible={labModalVisible}
        onClose={() => setLabModalVisible(false)}
        onSubmit={handleLabSubmit}
        templates={lab}
        loading={loading}
      />

      <PrescriptionModal
        visible={prescriptionModalVisible}
        onClose={() => setPrescriptionModalVisible(false)}
        onSave={handlePrescriptionSubmit}
        medications={medication}
      />

      <CreateProcedureModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleAddProcedure}
      />

      <AdmitPatientModal
        visible={admitModalVisible}
        onClose={() => setAdmitModalVisible(false)}
        onSubmit={handleAdmit}
      />

      <DischargePatientModal
        visible={transferModal}
        onClose={() => setTransferModal(false)}
        onSubmit={() => console.log('it works')}
        patientId={patient_record?.patient?.id}
        visit_id={patient_id}
      />

      <AppointmentModal
        visible={appointmentModalVisible}
        onCancel={() => setAppointmentModalVisible(false)}
        onFinish={handleAppointmentSubmit}
        visit_id={patient_id}
      />
    </>
  );
};

export default PatientProfileHeader;