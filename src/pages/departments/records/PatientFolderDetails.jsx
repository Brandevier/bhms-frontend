import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Tabs, Typography } from 'antd';
import { 
  MedicineBoxOutlined, 
  ExperimentOutlined, 
  FileTextOutlined 
} from '@ant-design/icons';

import { getPatientDetails } from '../../../redux/slice/recordSlice';
import PatientHeader from './common/PatientHeader';
import PatientInfoTabs from './common/PatientInfoTabs';
import VisitInfo from './common/VisitInfo';
import VisitsTable from './common/VisitsTable';
import PrescriptionsTable from './common/PrescriptionsTable';
import LabTestsTable from './common/LabTestsTable';
import DiagnosisTable from './common/DiagnosisTable';
import ClaimsTable from './common/ClaimsTable';

const { TabPane } = Tabs;

const PatientFolderDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { patient, loading } = useSelector(state => state.records);

  useEffect(() => {
    if (id) {
      dispatch(getPatientDetails(id));
    }
  }, [id, dispatch]);

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (!patient) return <div className="text-center py-10">No patient data found</div>;

  const { visits = [] } = patient;
  const latestVisit = visits?.[0] || {};

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="container mx-auto">
        <PatientHeader patient={patient} />

        <Tabs defaultActiveKey="1" type="card">
          <TabPane tab="Overview" key="1">
            <div className="grid grid-cols-1 gap-6">
              <Card title="Patient Information" className="shadow-sm">
                <PatientInfoTabs patient={patient} />
              </Card>

              <Card title="Latest Visit Summary" className="shadow-sm">
                <VisitInfo latestVisit={latestVisit} />
              </Card>
            </div>
          </TabPane>

          <TabPane tab="Visits" key="2">
            <Card className="shadow-sm">
              <VisitsTable visits={visits} />
            </Card>
          </TabPane>

          <TabPane 
            tab={
              <span>
                <MedicineBoxOutlined />
                Prescriptions
              </span>
            } 
            key="3"
          >
            <Card className="shadow-sm">
              <PrescriptionsTable prescriptions={latestVisit.prescriptions || []} />
            </Card>
          </TabPane>

          <TabPane 
            tab={
              <span>
                <ExperimentOutlined />
                Lab Tests
              </span>
            } 
            key="4"
          >
            <Card className="shadow-sm">
              <LabTestsTable labTests={latestVisit.labTests || []} />
            </Card>
          </TabPane>

          <TabPane 
            tab={
              <span>
                <FileTextOutlined />
                Diagnosis
              </span>
            } 
            key="5"
          >
            <Card className="shadow-sm">
              <DiagnosisTable diagnosis={latestVisit.diagnosis || []} />
            </Card>
          </TabPane>

          <TabPane tab="Claims" key="6">
            <Card className="shadow-sm">
              <ClaimsTable claims={latestVisit.claims || []} />
            </Card>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default PatientFolderDetails;