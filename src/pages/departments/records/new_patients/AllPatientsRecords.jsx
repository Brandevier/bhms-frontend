import React, { useEffect, useState } from 'react';
import { Card, Space, message, Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import VisitModal from '../common/VisitModal';
import { fetchPatients, startNewVisit, createPatient } from '../../../../redux/slice/recordSlice';
import { getDepartmentsByInstitution } from '../../../../redux/slice/departmentSlice';

// Components
import PatientTable from './components/PatientTable';
import SearchHeader from './components/SearchHeader';
import EmptyState from './components/EmptyState';
import PatientRegistrationModal from "../../../../modal/register_model/PatientRegistrationModal";
// Hooks
import { useVoiceSearch } from './components/VoiceSearchHandler';

const AllPatientsRecords = () => {
  const dispatch = useDispatch();

  // Redux state
  const patients = useSelector((state) => state.records?.patients ?? []);
  const loading = useSelector((state) => state.records?.loading ?? false);
  const error = useSelector(state => state.records.error);
  const { departments } = useSelector((state) => state.departments);

  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [visitModalOpen, setVisitModalOpen] = useState(false);
  const [registrationModalOpen, setRegistrationModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Voice search hook
  const { startListening, stopListening, isListening } = useVoiceSearch(setSearchTerm);

  // Filtered patients
  const filteredPatients = patients?.filter(p =>
    `${p.first_name} ${p.last_name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    p.folder_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.phone_number?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Effects
  useEffect(() => {
    dispatch(getDepartmentsByInstitution());
    dispatch(fetchPatients())
      .unwrap()
      .catch(() => message.error('Failed to load patient records'));
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  // Event handlers
  const handleInitiateVisit = (patient) => {
    setSelectedPatient(patient);
    setVisitModalOpen(true);
  };

  const handleSubmitVisit = (values) => {
    const data = {
      patient_id: selectedPatient.id,
      ...values,
    };

    dispatch(startNewVisit(data))
      .unwrap()
      .then(() => {
        dispatch(fetchPatients());
        message.success('Visit initiated successfully');
        setVisitModalOpen(false);
        setSelectedPatient(null);
      })
      .catch((error) => {
        message.error(error || 'Failed to initiate visit');
      });
  };

  const handleRegisterPatient = () => {
    setRegistrationModalOpen(true);
  };

  const handleSubmitRegistration = (values) => {
    dispatch(createPatient(values)).unwrap()
      .then(() => {
        message.success('Patient registered successfully');
        setRegistrationModalOpen(false);
        dispatch(fetchPatients());
      })
      .catch((error) => {
        message.error(error || 'Failed to register patient');
      });
  };

  const browserSupport = ('webkitSpeechRecognition' in window) || ('SpeechRecognition' in window);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className=" mx-auto">
        <Card
          className="border-0 rounded-2xl shadow-sm bg-white mb-6"
          bodyStyle={{ padding: '24px' }}
        >
          {/* Header with Search */}
          <SearchHeader
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            isListening={isListening}
            onStartVoiceSearch={startListening}
            onStopVoiceSearch={stopListening}
            browserSupport={browserSupport}
            onRegisterPatient={handleRegisterPatient}
            patientCount={patients.length}
          />
        </Card>

        {/* Patients Table */}
        <Card
          className="border-0 rounded-2xl shadow-sm bg-white"
          bodyStyle={{ padding: 0 }}
        >
          {filteredPatients.length > 0 ? (
            <PatientTable
              patients={filteredPatients}
              loading={loading}
              onInitiateVisit={handleInitiateVisit}
              searchTerm={searchTerm}
            />
          ) : (
            <EmptyState onRegisterPatient={handleRegisterPatient} />
          )}
        </Card>

        {/* Modals */}
        <VisitModal
          visible={visitModalOpen}
          onCancel={() => {
            setVisitModalOpen(false);
            setSelectedPatient(null);
          }}
          onSubmit={handleSubmitVisit}
          departments={departments}
        />

        <PatientRegistrationModal
          visible={registrationModalOpen}
          onClose={() => setRegistrationModalOpen(false)}
          onSubmit={handleSubmitRegistration}
          status="create"
          loading={loading}
        />
      </div>
    </div>
  );
};

export default AllPatientsRecords;