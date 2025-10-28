import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdmissions } from '../../../redux/slice/admissionSlice';
import AdmissionStats from './common/AdmissionStats';
import AdmissionFilters from './common/AdmissionFilters';
import AdmissionList from './common/AdmissionList';
import AdmissionModal from './common/AdmissionModal';
import { Spin, message } from 'antd';
import './admissions.css';

const InstitutionAdmissions = () => {
  const dispatch = useDispatch();
  const { loading, admissions } = useSelector((state) => state.admission);
  const  user  = useSelector((state) => state.auth.user || state.auth.admin) ;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState([]);

  useEffect(() => {
    dispatch(fetchAdmissions());
  }, [dispatch]);

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedRecord(null);
  };

  if (loading && !admissions?.length) {
    return (
      <div className="loading-container">
        <Spin size="large" />
        <p>Loading admissions data...</p>
      </div>
    );
  }

  return (
    <div className="admissions-container">
      <div className="header-section">
        <h1 className="page-title">Patient Admissions</h1>
        <div className="institution-info">
          <span>{user.institution?.name}</span>
        </div>
      </div>

      <AdmissionStats admissions={admissions} />
      
      <AdmissionFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />
      
      <AdmissionList
        admissions={admissions}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        dateRange={dateRange}
        onViewDetails={handleViewDetails}
        user={user}
      />
      
      <AdmissionModal
        visible={isModalVisible}
        record={selectedRecord}
        onClose={handleCloseModal}
        user={user}
      />
    </div>
  );
};

export default InstitutionAdmissions;