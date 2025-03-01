import React, { useState } from "react";
import { Card, Row, Col, Avatar, Typography, Button, Tooltip, message } from "antd";
import {
  EditOutlined,
  ExperimentOutlined,
  HeartOutlined,
  PlusCircleOutlined,
  FileTextOutlined,
  MedicineBoxOutlined, // Prescription Icon
  LoginOutlined
} from "@ant-design/icons";
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


const PatientProfileHeader = ({ patient_record, handleGeneralSubmit, patient_id, lab, patient_department }) => {
  const [vitalModalVisible, setVitalModalVisible] = useState(false);
  const [diagnosisModalVisible, setDiagnosisModalVisible] = useState(false);
  const [labModalVisible, setLabModalVisible] = useState(false);
  const [prescriptionModalVisible, setPrescriptionModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [admitModalVisible, setAdmitModalVisible] = useState(false);


  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.vitals);
  const { createLabLoading, error } = useSelector((state) => state.lab);
  const { id } = useParams();

  const handleVitalsSubmit = (data) => {
    const vitalSignsData = {
      ...data,
      patient_id: patient_id,
    };
    dispatch(createVitalSignsRecord(vitalSignsData)).unwrap()
      .then((res) => {
        message.success('Vitals recorded successfully');
        handleGeneralSubmit();
        setVitalModalVisible(false);
      })
      .catch(() => message.error('Failed to record vitals'));
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
    console.log(patientData)
    closeModal();
  };


  const hasAccess = useDepartmentCheck(["Doctor", "Surgeon"]);


  const handleDiagnosisSubmit = (data) => {
    const submitData = {
      ...data,
      patient_id: patient_id,
      department_id: patient_department
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




  return ( 
    <>
      <Card>
        {/* Patient Details Row */}
        <Row align="middle" justify="space-between">
          <Col span={18}>
            <div style={{ display: "flex", alignItems: "center" }}>
              {/* Avatar */}
              <Avatar
                size={64}
                src={patient_record?.patient?.gender === "Male" ? "/assets/male_patient.jpg" : "/assets/female_patient.jpg"}
                shape="square"
                style={{ marginRight: 15 }}
              />

              {/* Patient Info */}
              <div>
                <Title level={3} style={{ margin: 0 }}>
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
          <Col>
            <BhmsButton block={false} size="medium" disabled={!hasAccess}>Transfer Patient</BhmsButton>
          </Col>
        </Row>

        {/* Action Buttons */}
        <Row justify="center" style={{ marginTop: 20 }} gutter={[16, 16]}>
          <Col>
            <Tooltip title="Request Lab">
              <Button shape="circle" icon={<ExperimentOutlined />} onClick={() => setLabModalVisible(true)} disabled={!hasAccess} />
            </Tooltip>
          </Col>
          <Col>
            <Tooltip title="Add Diagnosis">
              <Button shape="circle" icon={<FileTextOutlined />} onClick={() => setDiagnosisModalVisible(true)} disabled={!hasAccess} />
            </Tooltip>
          </Col>
          <Col>
            <Tooltip title="Take Vitals">
              <Button shape="circle" icon={<HeartOutlined />} onClick={() => setVitalModalVisible(true)} />
            </Tooltip>
          </Col>
          <Col>
            <Tooltip title="Request Procedure">
              <Button shape="circle" icon={<PlusCircleOutlined />} onClick={() => setModalVisible(true)} disabled={!hasAccess} />
            </Tooltip>
          </Col>
          <Col>
            <Tooltip title="Prescribe Medication">
              <Button shape="circle" icon={<MedicineBoxOutlined />} onClick={() => setPrescriptionModalVisible(true)} disabled={!hasAccess} />
            </Tooltip>
          </Col>
          <Col>
            <Tooltip title="Admit Patient">
              <Button shape="circle" icon={<LoginOutlined />} onClick={() => setAdmitModalVisible(true)} disabled={!hasAccess} />
            </Tooltip>
          </Col>
        </Row>
      </Card>

      {/* Modals */}
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
    </>
  );
};

export default PatientProfileHeader;
