import React from "react";
import { Card, Tabs, Button } from "antd";
import PatientMedicalHistory from "./PatientMedicalHistory";
import PatientObstetricHistory from "./PatientObstetricHistory";
import PatientImmunization from "./PatientImmunization";

const { TabPane } = Tabs;

const PatientHistory = ({ patientData,generalSubmit }) => {
  return (
    <Card title="Patient History" className="mt-2"  bordered>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Medical History" key="1">
         <PatientMedicalHistory data={patientData?.medical_histories} patient_id={patientData?.id} generalSubmit={generalSubmit}/>
        </TabPane>
        
        <TabPane tab="Obstetric History" key="2">
         <PatientObstetricHistory data={patientData?.obstetric_histories} patient_id={patientData?.id} generalSubmit={generalSubmit}/>
        </TabPane>

        <TabPane tab="Immunization History" key="3">
          <PatientImmunization data={patientData?.immunization_histories} patient_id={patientData?.id} generalSubmit={generalSubmit}/>
        </TabPane>

        {/* <TabPane tab="Pregnancy History" key="4">
          <Button type="primary" style={{ marginBottom: 10 }}>
            Add Pregnancy History
          </Button>
          <p>Pregnancy history details will be displayed here...</p>
        </TabPane>

        <TabPane tab="Gynecological History" key="5">
          <Button type="primary" style={{ marginBottom: 10 }}>
            Add Gynecological History
          </Button>
          <p>Gynecological history details will be displayed here...</p>
        </TabPane> */}
      </Tabs>
    </Card>
  );
};

export default PatientHistory;
