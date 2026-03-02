import React, { useEffect, useState } from "react";
import { message, Modal, Spin } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { fetchActiveVisits } from "../../../../redux/slice/recordSlice";

// Components
import PatientStats from "./components/PatientStats";
import PatientFilters from "./components/PatientFilters";
import PatientTable from "./components/PatientTable";
import EmptyState from "./components/EmptyState";

const { confirm } = Modal;

const Records = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Access the correct state structure based on your Redux response
  const recordsState = useSelector((state) => state.records);
  const patients = recordsState?.activeVisits?.data || []; // Access nested data array
  const loading = recordsState?.loading ?? false;

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    dispatch(fetchActiveVisits())
      .unwrap()
      .then((response) => {
        console.log('Fetched active visits:', response);
        // The data is already in Redux state, no need to set local state
      })
      .catch((error) => {
        console.error('Failed to load patient records:', error);
        message.error('Failed to load patient records');
      });
  }, [dispatch]);

  const showVisitConfirmation = (patient) => {
    confirm({
      title: 'Confirm New Visit',
      icon: <ExclamationCircleFilled />,
      content: (
        <>
          <p>Initiate new visit for:</p>
          <p className="font-semibold">{patient?.patient?.first_name} {patient?.patient?.last_name}</p>
          <p className="text-sm text-gray-500">Folder #: {patient?.patient?.folder_number}</p>
        </>
      ),
      okText: 'Confirm',
      cancelText: 'Cancel',
      onOk() {
        message.success("Visit initiated");
        navigate(`/shared/records/folder/${patient.patient_id}`);
      }
    });
  };

  const handleInitiateVisit = (patient) => {
    showVisitConfirmation(patient);
  };

  // Safe array filtering with proper data structure
  const filteredPatients = Array.isArray(patients) ? patients.filter(visit => {
    if (!visit || !visit.patient) return false;
    
    const patient = visit.patient;
    const matchesTab = activeTab === 'all' || visit.status === activeTab;
    const matchesSearch = !searchTerm || (
      `${patient.first_name || ''} ${patient.last_name || ''}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (patient.folder_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (patient.phone_number || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return matchesTab && matchesSearch;
  }) : [];

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className=" mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Active Patient Visits</h1>
          <p className="text-gray-600 text-lg">Manage and view all active patient visits</p>
        </div>

        {/* Statistics */}
        <PatientStats patients={patients} />

        {/* Filters */}
        <PatientFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Debug info - remove in production */}
        {import.meta.env.DEV && (
          <div className="mb-4 p-2 bg-yellow-100 rounded text-xs">
            Debug: {patients.length} patients loaded, {filteredPatients.length} filtered
          </div>
        )}

        {/* Content */}
        <Spin spinning={loading} size="large">
          {filteredPatients.length > 0 ? (
            <PatientTable
              patients={filteredPatients}
              loading={loading}
              onInitiateVisit={handleInitiateVisit}
              searchTerm={searchTerm}
            />
          ) : (
            <EmptyState 
              searchTerm={searchTerm} 
              onClearSearch={handleClearSearch}
              hasPatients={patients.length > 0}
            />
          )}
        </Spin>
      </div>
    </div>
  );
};

export default Records;