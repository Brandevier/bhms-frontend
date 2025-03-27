import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table, Space, Tag } from 'antd';
import { getConsultationResults, approveConsultation, rejectConsultation } from '../../../redux/slice/consultationSlice';
import BhmsButton from '../../../heroComponents/BhmsButton';
import {useNavigate} from 'react-router-dom'



const ConsultationDepartment = () => {
  const dispatch = useDispatch();
  const { consultations, loading } = useSelector((state) => state.consultation);
  const [loadingState, setLoadingState] = useState({}); // Track button loading state
  const navigate = useNavigate()


  useEffect(() => {
    dispatch(getConsultationResults());
  }, [dispatch]);

  // Handle approval
  const handleApprove = async (id) => {
    setLoadingState((prev) => ({ ...prev, [id]: true }));
    try {
      await dispatch(approveConsultation(id)).unwrap(); // Wait for action to complete
      dispatch(getConsultationResults()); // Refresh the list
    } finally {
      setLoadingState((prev) => ({ ...prev, [id]: false }));
    }
  };

  // Handle rejection
  const handleReject = async (id) => {
    setLoadingState((prev) => ({ ...prev, [id]: true }));
    try {
      await dispatch(rejectConsultation(id)).unwrap(); // Wait for action to complete
      dispatch(getConsultationResults()); // Refresh the list
    } finally {
      setLoadingState((prev) => ({ ...prev, [id]: false }));
    }
  };

  // Define table columns
  const columns = [
    {
      title: 'Patient Name',
      dataIndex: 'record',
      key: 'patient',
      render: (record) => `${record?.patient?.first_name} ${record?.patient?.last_name}`,
    },
    {
      title: 'Gender',
      dataIndex: 'record',
      key: 'patient_id',
      render: (record) => record?.patient?.gender,
    },
    {
      title: 'Folder Number',
      dataIndex: 'record',
      key: 'folder_number',
      render: (record) => record?.folder_number || 'N/A',
    },
    {
      title: 'Insurance',
      dataIndex: 'record',
      key: 'insurance',
      render: (record) => (record?.is_insured ? 'Yes' : 'No'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'approved' ? 'green' : status === 'pending' ? 'orange' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          {record.status === 'pending' ? (
            <>
              <BhmsButton
                block={false}
                type="primary"
                loading={loadingState[record.id]}
                onClick={() => handleApprove(record.id)}
                size='medium'
              >
                Approve
              </BhmsButton>
              <BhmsButton
                type="danger"
                size='medium'
                outline
                block={false}
                loading={loadingState[record.id]}
                onClick={() => handleReject(record.id)}
              >
                Reject
              </BhmsButton>
            </>
          ) : record.status === 'approved' ? (
            <BhmsButton
              type="default"
              size='medium'
              block={false}
              onClick={() => navigate(`/shared/patient/details/${record?.record?.id}`)}
            >
              View
            </BhmsButton>
          ) : null}
        </Space>
      ),
    },
  ];

  return (
    <div> 
      <h2>Consultation Requests</h2>
      <Table
        columns={columns}
        dataSource={consultations}
        rowKey="id"
        loading={loading}
      />
    </div>
  );
};

export default ConsultationDepartment;
