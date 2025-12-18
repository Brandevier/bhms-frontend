import React, { useEffect, useState } from "react";
import { Skeleton, message, Empty, Menu, Layout, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchVisitDetails } from "../redux/slice/recordSlice";
import { useParams } from "react-router-dom";
import { useMediaQuery } from 'react-responsive';
import PatientProfileHeader from "../hooks/PatientProfileHeader";
import PatientDetailsInfo from "../hooks/PatientDetailsInfo";
import PatientNotes from "../hooks/PatientNotes";
import PatientVitals from "../hooks/vitals/PatientVitals";
import PatientVitalsChart from "../hooks/charts/PatientVitalsChart";
import { getAllStaff } from "../redux/slice/staff_admin_managment_slice";
import { fetchPatientNotes } from "../redux/slice/patientNotesSlice";
import HealthReports from "../hooks/labTest/HealthReports";
import PrescriptionList from "../hooks/prescriptions/PrescriptionList";
import PatientProcedure from "../hooks/PatientProcedure";
import PatientDiagnosis from "../hooks/patientDiagnosis/PatientDiagnosisComponent";
import { fetchServices, createPatientInvoice } from "../redux/slice/serviceSlice";
import PatientHistory from "../pages/departments/maternity/components/PatientHistory";
import { fetchTemplates } from "../redux/slice/labSlice";
import { fetchMedications, selectAllMedications } from "../redux/slice/nhia_medicationsSlice";
import MedicationActivityLog from "../hooks/MedicationActivityLog";
import PatientAppointments from "../hooks/appointements/PatientAppointments";
import LatestVitalsCard from "../hooks/LatestVitalsCard";
import {
  UserOutlined,
  FileTextOutlined,
  MedicineBoxOutlined,
  HeartOutlined,
  HistoryOutlined,
  ScheduleOutlined,
  ExperimentOutlined,
  FormOutlined,
  MoneyCollectOutlined,
  BulbOutlined,
  WarningOutlined,
  SafetyOutlined,
  SmileOutlined,
  SolutionOutlined,
  TeamOutlined,
  FileProtectOutlined,
  CalendarOutlined,
  PieChartTwoTone,
  FileImageOutlined
} from '@ant-design/icons';
import './PatientLayout.css';
import CarePlan from "../pages/careplan/Careplan";
import FluidMonitoring from "../pages/fluid_monitering/fluidMonitering";
import PatientInvoice from "../hooks/invoice/PatientInvoice";
import PatientVitalsTrendChart from "../hooks/charts/PatientVitalsTrendChart";
import PatientClaims from "../hooks/patient_claims/PatientClaims";
import Overview from "../hooks/overview/OverView";
import PatientANC from "../pages/departments/maternity/A&C/PatientANC";
import PregnancyTimeline from "../pages/departments/maternity/timeline/PregnancyTimeLine";
import PartographManager from "../pages/departments/maternity/partograph/Partograph";
import UltraSoundManager from "../pages/departments/maternity/ultrasound/UltraSoundManager";

const PatientLayout = () => {
  const dispatch = useDispatch();
  const { currentVisit, loading, error } = useSelector((state) => state.records);
  const { templates, loading: templatesLoading } = useSelector((state) => state.lab);
  const { notes, loading: notesLoading } = useSelector((state) => state.patientNote);
  const { id } = useParams();
  const { services, loading: servicesLoading } = useSelector((state) => state.service);
  const medications = useSelector(selectAllMedications);
  const [activeTab, setActiveTab] = useState('details');
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(fetchVisitDetails(id)).unwrap()
      .then(() => {
        dispatch(getAllStaff());
        dispatch(fetchTemplates());
        dispatch(fetchServices());
        dispatch(fetchMedications({ page: 1, pageSize: 100 }));
        // dispatch(fetchPatientNotes(id));
      })
      .catch(err => {
        message.error('Failed to load patient data');
        console.error('Error loading patient data:', err);
      });
  }, [dispatch, id]);

  const generalHandler = () => {
    dispatch(fetchVisitDetails(id)).catch(err => {
      message.error('Failed to refresh patient data');
      console.error('Error refreshing patient data:', err);
    });
  };

  const handlePatientBills = (data) => {
    if (!currentVisit?.patient?.id) {
      message.error('Patient ID is missing');
      return;
    }

    const submitData = {
      ...data,
      patient_id: currentVisit.patient.id
    };

    dispatch(createPatientInvoice(submitData)).unwrap()
      .then(() => {
        message.success('Patient bills updated successfully');
        generalHandler();
      })
      .catch(err => {
        message.error('Failed to update patient bills');
        console.error('Error updating patient bills:', err);
      });
  };

  const menuItems = [
    { key: 'overview', label: 'Patient Overview', icon: <SolutionOutlined /> },
    { key: 'details', label: 'Patient Details', icon: <UserOutlined /> },
    ...(currentVisit?.visit_type === 'Maternity' ? [
      { key: 'anc', label: 'ANC Record', icon: <SafetyOutlined /> },
      { key: 'timeline', label: 'Pregnancy Timeline', icon: <PieChartTwoTone /> },
      { key: 'partograph', label: 'Partograph', icon: <HistoryOutlined /> },
       { key: 'ultrasound', label: 'Ultrasound', icon: <FileImageOutlined /> },
    ] : []),
    { key: 'vitals', label: 'Vital Signs', icon: <HeartOutlined /> },
    { key: 'vitals-chart', label: 'Vitals Chart', icon: <ExperimentOutlined /> },
    { key: 'diagnosis', label: 'Diagnosis', icon: <FileTextOutlined /> },
    { key: 'prescriptions', label: 'Prescriptions', icon: <MedicineBoxOutlined /> },
    { key: 'reports', label: 'Lab Reports', icon: <ExperimentOutlined /> },
    { key: 'medications', label: 'Medications', icon: <MedicineBoxOutlined /> },
    { key: 'appointments', label: 'Appointments', icon: <ScheduleOutlined /> },
    { key: 'procedures', label: 'Procedures', icon: <FormOutlined /> },
    { key: 'notes', label: 'Clinical Notes', icon: <FileTextOutlined /> },
    { key: 'history', label: 'Medical History', icon: <HistoryOutlined /> },
    { key: 'invoice', label: 'Invoice', icon: <MoneyCollectOutlined /> },
    { key: 'care-plan', label: 'Care Plan', icon: <BulbOutlined /> },
    { key: 'fluid_monitering', label: 'Fluid Monitering', icon: <WarningOutlined /> },
    { key: 'claims', label: 'Insurance & Claims', icon: <FileProtectOutlined /> },
  ];



  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview visit_id={currentVisit?.id || {}} />;
      case 'anc':
        return <PatientANC visitId={currentVisit?.id || {}} />
      case 'timeline':
        return <PregnancyTimeline visitId={currentVisit?.id || {}} />;
      case 'partograph':
        return <PartographManager visitId={currentVisit?.id || {}} />;
      case 'ultrasound':
        return <UltraSoundManager visitId={currentVisit?.id || {}} />
      case 'details':
        return <PatientDetailsInfo patient_record={currentVisit || {}} />;
      case 'vitals':
        return <PatientVitals vitals={currentVisit?.vitalSignsRecords || []} />;
      case 'vitals-chart':
        return <PatientVitalsTrendChart vitalsData={currentVisit?.vitalSignsRecords || []} />;
      case 'diagnosis':
        return <PatientDiagnosis diagnosis={currentVisit?.diagnosis || []} onSubmit={generalHandler} />;
      case 'prescriptions':
        return <PrescriptionList prescriptionData={currentVisit?.prescriptions || []} onDelete={generalHandler} />;
      case 'reports':
        return <HealthReports status={currentVisit?.status} patient_data={currentVisit?.labTests || []} />;
      case 'medications':
        return <MedicationActivityLog />;
      case 'appointments':
        return <PatientAppointments appointments={currentVisit?.appointments || []} />;
      case 'procedures':
        return <PatientProcedure procedures={currentVisit?.procedure || []} onDelete={generalHandler} visit_id={currentVisit?.id} patient_id={currentVisit?.patient_id} claim_id={currentVisit?.claims?.[0]?.id} />;
      case 'notes':
        return <PatientNotes patient_notes={notes || []} visit_id={currentVisit?.id} general_handler={generalHandler} />;
      case 'history':
        return <PatientHistory patientData={currentVisit?.patient || {}} generalSubmit={generalHandler} />;
      case 'care-plan':
        return <CarePlan visit_id={currentVisit?.id} institution_id={currentVisit?.institution_id} />;
      case 'invoice':
        return <PatientInvoice visitId={currentVisit?.id} />;

      case 'fluid_monitering':
        return <FluidMonitoring visit_id={currentVisit?.id} institution_id={currentVisit?.institution?.id} />;

      case 'claims':
        return <PatientClaims claimsData={currentVisit?.claims || []} loading={false} />

      default:
        return <Overview visit_id={currentVisit?.id || {}} />;
    }
  };

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <Empty
          description={
            <span>
              Failed to load patient data. <a onClick={generalHandler}>Retry</a>
            </span>
          }
        />
      </div>
    );
  }

  return (
    <div className="patient-layout-container">
      {/* Header Section (always visible) */}
      <div className="patient-header-section">
        {loading ? (
          <Skeleton active avatar paragraph={{ rows: 1 }} />
        ) : (
          <>
            <LatestVitalsCard vitalSignsRecords={currentVisit?.vitalSignsRecords} />
            <PatientProfileHeader
              patient_record={currentVisit || {}}
              handleGeneralSubmit={generalHandler}
              patient_id={currentVisit?.id}
              lab={templates || []}
              patient_department={currentVisit?.patient?.department_id}
              medication={medications || []}
            />
          </>
        )}
      </div>

      {/* Main Content Area with Sidebar */}
      <div className="patient-main-content mt-4">
        {/* Desktop Navigation Sidebar */}
        {!isMobile && (
          <div className="patient-sidebar mt-0">
            <Menu
              mode="inline"
              selectedKeys={[activeTab]}
              onClick={({ key }) => setActiveTab(key)}
              style={{ borderRight: 0, }}
            >
              {menuItems
                .filter(item => item.key) // remove {} with no key
                .map(item => (
                  <Menu.Item key={item.key} className="sidebar-menu-item" icon={item.icon}>
                    {item.label}
                  </Menu.Item>
                ))}

            </Menu>
          </div>
        )}

        {/* Content Area */}
        <div className="patient-content">
          {loading ? (
            <Skeleton active paragraph={{ rows: 6 }} />
          ) : (
            renderContent()
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <div className="mobile-bottom-nav">
          <Menu
            mode="horizontal"
            selectedKeys={[activeTab]}
            onClick={({ key }) => setActiveTab(key)}
          >
            {menuItems.slice(0, 5).map(item => (
              <Menu.Item key={item.key} icon={item.icon} className="mobile-nav-item" />
            ))}
          </Menu>
        </div>
      )}
    </div>
  );
};

export default PatientLayout;