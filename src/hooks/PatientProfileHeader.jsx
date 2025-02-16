import React, { useState } from "react";
import { Card, Row, Col, Avatar, Typography, Button, Tooltip, message } from "antd";
import { EditOutlined, ExperimentOutlined, HeartOutlined, PlusCircleOutlined, FileTextOutlined } from "@ant-design/icons";
import BhmsButton from "../heroComponents/BhmsButton";
const { Title, Text } = Typography;
import VitalSignsModal from "../modal/VitalSignsModal";
import PatientDiagnosisModal from "../modal/PatientDiagnosisModal";
import { useDispatch, useSelector } from "react-redux";
import { createVitalSignsRecord } from "../redux/slice/vitalSignsSlice";
import { useParams } from 'react-router-dom';
import RequestLabDialog from "../modal/RequestLabDialog";
import { requestLab } from "../redux/slice/labSlice";


const PatientProfileHeader = ({ patient_record, handleGeneralSubmit,patient_id,lab,patient_department }) => {
  const [vitalModalVisible, setVitalModalVisible] = useState(false);
  const [diagnosisModalVisible, setDiagnosisModalVisible] = useState(false);
  const [labModalVisible,setLabModalVisible] = useState(false);

  const dispatch = useDispatch()
  const { status} = useSelector((state)=>state.vitals);
  const { loading,error } = useSelector((state)=>state.lab)
  const { id } = useParams()

  const handleVitalsSubmit = (data) => {
    const vitalSignsData = {
      ...data,
      patient_id: patient_id,
     
    }
    dispatch(createVitalSignsRecord(vitalSignsData)).unwrap()
      .then((res) => {
        message.success('vitals created successfully')
        handleGeneralSubmit()
        setVitalModalVisible(false);
      }).error(()=>message.error('lab requested failed'))
  };

  const handleLabSubmit = (data) => {
    const labData = {
      ...data,
      patient_id: patient_id,
      department_id:patient_department
    };
  
    dispatch(requestLab(labData))
      .unwrap()
      .then((res) => {
        message.success("Lab request completed");
        handleGeneralSubmit()
        setLabModalVisible(false);
      })
      .catch(() => {
        message.error("Lab request failed");
      });
  };
  

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
                  {`${patient_record?.patient?.first_name} ${patient_record?.patient?.last_name}`}
                </Title>
                <Text type={patient_record?.status === "active" ? "success" : "danger"} style={{ marginBottom: 5 }}>
                  {patient_record?.status?.charAt(0).toUpperCase() + patient_record?.status?.slice(1)}
                </Text>
                {/* Dummy Diagnosis */}
                <Text type="secondary" style={{ display: "block" }}>
                  Diagnosis: Hypertension & Fever
                </Text>
              </div>
            </div>
          </Col>

          {/* Edit Button */}
          <Col>
            <BhmsButton block={false} size="medium" >Transfer Patient</BhmsButton>
          </Col>
        </Row>

        {/* Action Buttons */}
        <Row justify="center" style={{ marginTop: 20 }} gutter={[16, 16]}>
          <Col>
            <Tooltip title="Request Lab">
              <Button shape="circle" icon={<ExperimentOutlined />} onClick={() => setLabModalVisible(true)}/>
            </Tooltip>
          </Col>
          <Col>
            <Tooltip title="Add Diagnosis">
              <Button shape="circle" icon={<FileTextOutlined />} onClick={() => setDiagnosisModalVisible(true)} />
            </Tooltip>
          </Col>
          <Col>
            <Tooltip title="Take Vitals">
              <Button shape="circle" icon={<HeartOutlined />} onClick={() => setVitalModalVisible(true)} />
            </Tooltip>
          </Col>
          <Col>
            <Tooltip title="Request Procedure">
              <Button shape="circle" icon={<PlusCircleOutlined />} />
            </Tooltip>
          </Col>
        </Row>
      </Card>
      <VitalSignsModal visible={vitalModalVisible} onClose={() => setVitalModalVisible(false)} status={status} onSubmit={handleVitalsSubmit}/>
      <PatientDiagnosisModal visible={diagnosisModalVisible} onClose={() => setDiagnosisModalVisible(false)}  />
      <RequestLabDialog  visible={labModalVisible} onClose={()=>setLabModalVisible(false)} loading={loading} onSubmit={handleLabSubmit} tests={lab}/>
    </>
  );
};

export default PatientProfileHeader;
