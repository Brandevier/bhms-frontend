import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdmissions } from '../../../redux/slice/admissionSlice';
import { Table, Tag, Space, Skeleton, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const InstitutionAdmissions = () => {
  const dispatch = useDispatch();
  const { loading, admissions } = useSelector((state) => state.admission);
  const { user, admin } = useSelector((state) => state.auth);
  const currentUser = user || admin;

  useEffect(() => {
    dispatch(fetchAdmissions({})); // Fetch all admissions for institution
  }, [dispatch]);

  const columns = [
    {
      title: 'Patient',
      dataIndex: 'patient',
      key: 'patient',
      render: (_, record) => (
        <Space>
          <Avatar 
            src={record.patient?.profile_pic} 
            icon={<UserOutlined />} 
          />
          <span>
            {record.patient?.first_name} {record.patient?.last_name}
          </span>
        </Space>
      ),
    },
    {
      title: 'ID',
      dataIndex: 'patient_id',
      key: 'patient_id',
      render: (id) => `#${id}`,
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      render: (department) => (
        <Tag color="blue">{department?.name || 'N/A'}</Tag>
      ),
    },
    {
      title: 'Bed',
      dataIndex: 'bed',
      key: 'bed',
      render: (bed) => bed?.bed_number || 'N/A',
    },
    {
      title: 'Admission Date',
      dataIndex: 'admission_date',
      key: 'admission_date',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleViewDetails(record)}>View</a>
          <a onClick={() => handleDischarge(record)}>Discharge</a>
        </Space>
      ),
    },
  ];

  const handleViewDetails = (record) => {
    // Implement view details logic
    console.log('View details:', record);
  };

  const handleDischarge = (record) => {
    // Implement discharge logic
    console.log('Discharge patient:', record);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Current Admissions</h2>
        <span className="text-gray-500">
          {currentUser.institution?.name}
        </span>
      </div>

      {loading ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : (
        <Table
          columns={columns}
          dataSource={admissions}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          bordered
          className="custom-table"
        />
      )}
    </div>
  );
};

export default InstitutionAdmissions;