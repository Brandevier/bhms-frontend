import React, { useState,useEffect } from "react";
import { Card, Row, Col, Avatar, Typography, Button, Tooltip, message } from "antd";
import {
  EditOutlined,
  ExperimentOutlined,
  HeartOutlined,
  PlusCircleOutlined,
  FileTextOutlined,
  MedicineBoxOutlined,
  LoginOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined
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
import { requestLab } from "../redux/slice/labSlice";
import PrescriptionModal from "../modal/PrescriptionModal";
import CreateProcedureModal from "../modal/CreateProcedureModal";
import { createPrescription } from "../redux/slice/prescriptionSlice";
import { addProcedure } from "../redux/slice/procedureSlice";
import AdmitPatientModal from "../modal/AdmitPatientModal";
import useDepartmentCheck from "../customHooks/useDepartmentCheck";
import { addDiagnosis } from "../redux/slice/diagnosisSlice";
import { admitPatient } from "../redux/slice/admissionSlice";
import DischargePatientModal from "../modal/TransferPatientModal";
import { fetchAllDiagnoses } from "../redux/slice/icd10DdiangosisSlice";



const PatientProfileHeader = ({ patient_record, handleGeneralSubmit, patient_id, lab, patient_department }) => {
  const [vitalModalVisible, setVitalModalVisible] = useState(false);
  const [diagnosisModalVisible, setDiagnosisModalVisible] = useState(false);
  const [labModalVisible, setLabModalVisible] = useState(false);
  const [prescriptionModalVisible, setPrescriptionModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [admitModalVisible, setAdmitModalVisible] = useState(false);
  const [transferModal, setTransferModal] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const { createLabLoading, error } = useSelector((state) => state.lab);
  const dispatch = useDispatch()
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isTablet = useMediaQuery({ minWidth: 769, maxWidth: 1024 });
  const { completeList,loading } = useSelector((state) => state.icd10);


  // ... keep all your existing handler functions ...

  useEffect(() => {
    dispatch(fetchAllDiagnoses());
  }, [dispatch]);


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

  const handleLabSubmit = (data) => {
    const labData = {
      ...data,
      patient_id: patient_id,
      department_id: patient_department
    };

    dispatch(requestLab(labData)).unwrap()
      .then((res) => {
        message.success("Lab request submitted");
        handleGeneralSubmit();
        setLabModalVisible(false);
      })
      .catch(() => {
        message.error("Lab request failed");
      });
  };

  const handlePrescriptionSubmit = (data) => {

    const prescriptionData = {
      ...data,
      patient_id: patient_id,
      department_id: patient_department
    };
    dispatch(createPrescription(prescriptionData)).unwrap().then((res) => {
      message.success('prescription created successfully')
      handleGeneralSubmit();
      setPrescriptionModalVisible(false);

    }).catch((err) => {
      message.error('Failed to create prescription')
    });
  };

  const handleAddProcedure = (newProcedure) => {
    const procedureData = {
      ...newProcedure,
      patient_id: patient_id,
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
      record_id:patient_record.id
    }
   dispatch(admitPatient(data)).unwrap().then((res)=>{
    message.success('Patient admitted successfully')
    setAdmitModalVisible(false)
   })
  console.log(data)
  };


  const hasAccess = useDepartmentCheck(["Doctor", "Surgeon"]);


  const handleDiagnosisSubmit = (data) => {
    const submitData = {
      ...data,
      patient_id: patient_id,
      department_id: patient_department,
     
    }

    dispatch(addDiagnosis(submitData)).unwrap().then((res) => {
      
      message.success('diagnosis created successfully');
      handleGeneralSubmit();
      setDiagnosisModalVisible(false)
    })

  }

  const latestDiagnosis = patient_record?.patient?.diagnosis?.length
  ? [...patient_record.patient.diagnosis].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
  : null;


  const actionButtons = [
    { icon: <ExperimentOutlined />, tooltip: "Request Lab", action: () => setLabModalVisible(true), disabled: !hasAccess },
    { icon: <FileTextOutlined />, tooltip: "Add Diagnosis", action: () => setDiagnosisModalVisible(true), disabled: !hasAccess },
    { icon: <HeartOutlined />, tooltip: "Take Vitals", action: () => setVitalModalVisible(true), disabled: false },
    { icon: <PlusCircleOutlined />, tooltip: "Request Procedure", action: () => setModalVisible(true), disabled: !hasAccess },
    { icon: <MedicineBoxOutlined />, tooltip: "Prescribe Medication", action: () => setPrescriptionModalVisible(true), disabled: !hasAccess },
    { icon: <LoginOutlined />, tooltip: "Admit Patient", action: () => setAdmitModalVisible(true), disabled: !hasAccess }
  ];




  return ( 
    <>
      <Card>
        {/* Patient Details Row */}
        <Row align="middle" justify="space-between" gutter={[16, 16]}>
          <Col xs={24} sm={18}>
            <div style={{ display: "flex", alignItems: "center", flexWrap: 'wrap' }}>
              {/* Avatar */}
              <Avatar
                size={isMobile ? 48 : 64}
                src={patient_record?.patient?.gender === "Male" ? "/assets/male_patient.jpg" : "/assets/female_patient.jpg"}
                shape="square"
                style={{ marginRight: 15, marginBottom: isMobile ? 10 : 0 }}
              />

              {/* Patient Info */}
              <div style={{ flex: 1, minWidth: isMobile ? '100%' : 0 }}>
                <Title level={isMobile ? 4 : 3} style={{ margin: 0 }}>
                  {`${patient_record?.patient?.first_name} ${patient_record?.patient?.middle_name || ''} ${patient_record?.patient?.last_name}`}
                </Title>
                <Text type={patient_record?.status === "active" ? "success" : "danger"} style={{ marginBottom: 5 }}>
                  {patient_record?.status?.charAt(0).toUpperCase() + patient_record?.status?.slice(1)}
                </Text>
                <Text type="secondary" style={{ display: "block" }}>
                  Diagnosis: {latestDiagnosis?.diagnosis_name.map(d => d.description).join(", ") || "No diagnosis available"}
                </Text>
              </div>
            </div>
          </Col>

          {/* Edit Button */}
          <Col xs={24} sm={6} style={{ textAlign: isMobile ? 'left' : 'right' }}>
            <BhmsButton 
              block={isMobile} 
              size={isMobile ? 'small' : 'medium'} 
              disabled={!hasAccess} 
              onClick={()=>setTransferModal(true)}
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

      {/* Modals - keep all your existing modals */}
      <VitalSignsModal
        visible={vitalModalVisible}
        onClose={() => setVitalModalVisible(false)}
        status={status}
        onSubmit={handleVitalsSubmit}
      />
      <PatientDiagnosisModal
        visible={diagnosisModalVisible}
        onClose={() => setDiagnosisModalVisible(false)}
        onSubmit={handleDiagnosisSubmit}
        data={completeList}
      />
      <RequestLabDialog
        visible={labModalVisible}
        onClose={() => setLabModalVisible(false)}
        loading={createLabLoading}
        onSubmit={handleLabSubmit}
        tests={lab}
      />
      <PrescriptionModal
        visible={prescriptionModalVisible}
        onClose={() => setPrescriptionModalVisible(false)}
        onSave={handlePrescriptionSubmit}
      />
      <CreateProcedureModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleAddProcedure}
      />
      <AdmitPatientModal visible={admitModalVisible} onClose={() => setAdmitModalVisible(false)} onSubmit={handleAdmit} />

      <DischargePatientModal visible={transferModal} onClose={()=>setTransferModal(false)} onSubmit={()=>console.log('it works')} patientId={patient_id}/>
    </>
  );
};

export default PatientProfileHeader;