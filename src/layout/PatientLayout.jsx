import React, { useEffect } from "react";
import { Row, Col, Skeleton } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecordByPatient } from "../redux/slice/recordSlice";
import { useParams } from "react-router-dom";
import PatientProfileHeader from "../hooks/PatientProfileHeader";
import PatientDetailsInfo from "../hooks/PatientDetailsInfo";
import PatientNotes from "../hooks/PatientNotes";
import PatientBills from "../hooks/PatientBills";
import PatientVitals from "../hooks/PatientVitals";
import PatientVitalsChart from "../hooks/PatientVitalsChart";
import { getAllStaff } from "../redux/slice/staff_admin_managment_slice";
import { fetchPatientNotes } from "../redux/slice/patientNotesSlice";
import HealthReports from "../hooks/HealthReports";
import PrescriptionList from "../hooks/PrescriptionList";
import { fetchLabTest ,fetchPatientLabResults} from "../redux/slice/labSlice";
import PatientProcedure from "../hooks/PatientProcedure";


const PatientLayout = () => {
  const dispatch = useDispatch();
  const { currentRecord, status } = useSelector((state) => state.records);
  const { tests,labResults } = useSelector((state)=>state.lab)
  const { notes } = useSelector((state) => state.patientNote);
  const { id } = useParams();

  useEffect(() => {
    dispatch(fetchRecordByPatient({ record_id: id })).unwrap().then((res)=>{
      dispatch(getAllStaff());
      dispatch(fetchLabTest());
      // dispatch(fetchPatientLabResults({patient_id: currentRecord?.patient?.id}));
  
      // dispatch(fetchPatientNotes({ patient_id: currentRecord?.patient?.id }));
    });
   
  }, [dispatch, id]);

  const generalHandler = () => {
    dispatch(fetchRecordByPatient({ record_id: id }));
    dispatch(fetchPatientLabResults({patient_id: currentRecord?.patient?.id}));
  };

  return (
    <div style={{ padding: 20 }}>
      {/* Profile Header */}
      {status === "loading" ? (
        <Skeleton active avatar paragraph={{ rows: 1 }} />
      ) : (
        <PatientProfileHeader
          patient_record={currentRecord}
          handleGeneralSubmit={generalHandler}
          patient_id={currentRecord?.patient?.id}
          lab={tests}
          patient_department={currentRecord?.patient?.department_id}
        />
      )}

      {/* Full-Width PrescriptionList */}
      <div style={{ marginTop: 20 }}>
        {status === "loading" ? (
          <Skeleton active paragraph={{ rows: 3 }} />
        ) : (
          <PrescriptionList  prescriptionData={currentRecord?.patient?.prescriptions}/>
        )}
      </div>

      {/* Main Layout */}
      <Row gutter={16} style={{ marginTop: 20 }}>
        {/* Left Column - Contact & General Info */}
        <Col span={16}>
          {status === "loading" ? (
            <Skeleton active paragraph={{ rows: 3 }} />
          ) : (
            <PatientDetailsInfo patient_record={currentRecord} />
          )}


          {/* Medical Info */}
          <Row gutter={16} style={{ marginTop: 20 }}>
            {status === "loading" ? (
              <Skeleton active paragraph={{ rows: 3 }} />
            ) : (
              <PatientVitals vitals={currentRecord?.patient?.vitalSignsRecords} />
            )}
          </Row>

          <Row gutter={16} style={{ marginTop: 20 }}>
            {status === "loading" ? (
              <Skeleton active paragraph={{ rows: 3 }} />
            ) : (
              <PatientVitalsChart vitalsData={currentRecord?.patient?.vitalSignsRecords} />
            )}
          </Row>
          
        </Col>

        {/* Right Column - Reports & Appointments */}
        <Col span={8}>
          <HealthReports status={status} patient_data={currentRecord?.patient?.labResults} />
          {status === "loading" ? (
            <Skeleton active paragraph={{ rows: 3 }} />
          ) : (
            <PatientBills bills={currentRecord?.patient?.service_bills} />
          )}
        </Col>
      </Row>
      {/* Patient Notes */}
      {status === "loading" ? (
            <Skeleton active paragraph={{ rows: 2 }} />
          ) : (
            <PatientProcedure procedures={currentRecord?.patient?.procedures} onDelete={()=>console.log('delete')} />

          )} 
          
      {status === "loading" ? (
            <Skeleton active paragraph={{ rows: 2 }} />
          ) : (
            <PatientNotes
              patient_notes={currentRecord?.patient?.patient_notes}
              patient_id={currentRecord?.patient?.id}
              general_handler={generalHandler}
            />
          )}
    </div>
  );
};

export default PatientLayout;
