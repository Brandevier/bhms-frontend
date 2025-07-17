import React, { useEffect } from "react";
import { Row, Col, Skeleton, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchVisitDetails } from "../redux/slice/recordSlice";
import { useParams } from "react-router-dom";
import { useMediaQuery } from 'react-responsive'; // Import the hook
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
import { fetchLabTest, fetchPatientLabResults } from "../redux/slice/labSlice";
import PatientProcedure from "../hooks/PatientProcedure";
import PatientDiagnosis from "../hooks/PatientDiagnosisComponent";
import { fetchServices, createPatientInvoice } from "../redux/slice/serviceSlice";
import PatientHistory from "../pages/departments/maternity/components/PatientHistory";
import Partograph from "../pages/departments/maternity/components/Partograph";

const PatientLayout = () => {
  const dispatch = useDispatch();
  const { currentVisit, loading } = useSelector((state) => state.records);
  const { tests, labResults } = useSelector((state) => state.lab)
  const { notes } = useSelector((state) => state.patientNote);
  const { id } = useParams();
  const { services } = useSelector((state) => state.service);
  
  // Define media queries
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  useEffect(() => {
    dispatch(fetchVisitDetails(id )).unwrap().then((res) => {
      dispatch(getAllStaff());
      dispatch(fetchLabTest());
      dispatch(fetchServices());
    });
  }, [dispatch, id]);

  const generalHandler = () => {
    dispatch(fetchVisitDetails(id));
    dispatch(fetchPatientLabResults({ patient_id: currentVisit?.patient?.id }));
  };

  const handlePatientBills = (data) => {
    const submitData = {
      ...data,
      patient_id: currentVisit?.patient?.id
    }

    dispatch(createPatientInvoice(submitData)).unwrap().then((res) => {
      message.success('Patient bills updated successfully')
      generalHandler()
    })
  }

  // Determine column spans based on screen size
  const getColumnSpans = () => {
    if (isMobile) return { left: 24, right: 24 };
    if (isTablet) return { left: 16, right: 8 };
    return { left: 16, right: 8 }; // Desktop
  };

  const { left, right } = getColumnSpans();

  return (
    <div style={{ padding: isMobile ? '10px' : '20px' }}>
      {/* Profile Header */}
      {loading ? (
        <Skeleton active avatar paragraph={{ rows: 1 }} />
      ) : (
        <PatientProfileHeader
          patient_record={currentVisit}
          handleGeneralSubmit={generalHandler}
          patient_id={currentVisit?.id}
          lab={tests}
          patient_department={currentVisit?.patient?.department_id}
        />
      )}

      {/* Full-Width Components */}
      <div style={{ marginTop: 20 }}>
        {loading ? (
          <Skeleton active paragraph={{ rows: 3 }} />
        ) : (
          <PrescriptionList 
            prescriptionData={currentVisit?.patient?.prescriptions} 
            onDelete={generalHandler}
            isMobile={isMobile}
          />
        )}
      </div>

      <div style={{ marginTop: 20 }}>
        {loading ? (
          <Skeleton active paragraph={{ rows: 3 }} />
        ) : (
          <PatientDiagnosis 
            diagnosis={currentVisit?.patient?.diagnosis} 
            onSubmit={generalHandler}
            isMobile={isMobile}
          />
        )}
      </div>

      {/* Main Layout */}
      <Row gutter={isMobile ? 0 : 16} style={{ marginTop: 20 }}>
        {/* Left Column */}
        <Col xs={24} sm={24} md={left} lg={left} xl={left}>
          {loading ? (
            <Skeleton active paragraph={{ rows: 3 }} />
          ) : (
            <PatientDetailsInfo 
              patient_record={currentVisit} 
              isMobile={isMobile}
            />
          )}

          {/* Medical Info */}
          <div style={{ marginTop: 20 }}>
            {loading ? (
              <Skeleton active paragraph={{ rows: 3 }} />
            ) : (
              <PatientVitals 
                vitals={currentVisit?.vitalSignsRecords} 
                isMobile={isMobile}
              />
            )}
          </div>

          <div style={{ marginTop: 20 }}>
            {loading ? (
              <Skeleton active paragraph={{ rows: 3 }} />
            ) : (
              <PatientVitalsChart 
                vitalsData={currentVisit?.patient?.vitalSignsRecords} 
                isMobile={isMobile}
              />
            )}
          </div>
        </Col>

        {/* Right Column */}
        <Col xs={24} sm={24} md={right} lg={right} xl={right} style={{ marginTop: isMobile ? 20 : 0 }}>
          <HealthReports 
            status={status} 
            patient_data={currentVisit?.patient?.labResults}
            isMobile={isMobile}
          />
          
          {loading ? (
            <Skeleton active paragraph={{ rows: 3 }} />
          ) : (
            <PatientBills 
              bills={currentVisit?.patient?.serviceBills} 
              services={services} 
              onSubmit={handlePatientBills}
              isMobile={isMobile}
            />
          )}
        </Col>
      </Row>

      {/* Bottom Sections */}
      <div style={{ marginTop: 20 }}>
        {loading ? (
          <Skeleton active paragraph={{ rows: 2 }} />
        ) : (
          <PatientProcedure 
            procedures={currentVisit?.patient?.procedures} 
            onDelete={() => console.log('delete')}
            isMobile={isMobile}
          />
        )}
      </div>

      <div style={{ marginTop: 20 }}>
        {loading ? (
          <Skeleton active paragraph={{ rows: 2 }} />
        ) : (
          <PatientNotes
            patient_notes={currentVisit?.patientNote}
            visit_id={currentVisit?.id}
            general_handler={generalHandler}
            isMobile={isMobile}
          />
        )}
      </div>

      <div style={{ marginTop: 20 }}>
        {loading ? (
          <Skeleton active paragraph={{ rows: 2 }} />
        ) : (
          <PatientHistory
            patientData={currentVisit?.patient}
            generalSubmit={generalHandler}
            isMobile={isMobile}
          />
        )}
      </div>

      {/* <div style={{ marginTop: 20 }}>
        {loading ? (
          <Skeleton active paragraph={{ rows: 2 }} />
        ) : (
          <Partograph isMobile={isMobile} />
        )}
      </div> */}
    </div>
  );
};

export default PatientLayout;