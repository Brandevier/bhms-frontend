import React, { useEffect, useState } from 'react';
import { fetchLabResultsByStatus,uploadLabResult } from '../../../redux/slice/labSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Input, Tooltip, Badge, Empty,message } from 'antd';
import { SearchOutlined, MessageOutlined } from '@ant-design/icons';
import BhmsButton from '../../../heroComponents/BhmsButton';
import UploadLabResultsModal from '../../../modal/UploadLabResultsModal';

const InProgressComponent = () => {
  const dispatch = useDispatch();
  const { labResults, loading,uploadLoading, } = useSelector((state) => state.lab);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  

  useEffect(() => {
    dispatch(fetchLabResultsByStatus({ status: 'in-progress' }));
  }, [dispatch]);

  const handleUploadClick = (record) => {
    setSelectedRecord(record);
    setIsModalVisible(true);
  };

  const handleUpload = (file, comment) => {
    dispatch(uploadLabResult({ labResultId: selectedRecord.id, testImage: file, results_comment: comment }))
      .unwrap()
      .then(() => {
        message.success("Lab result uploaded successfully!");
        setIsModalVisible(true);
        dispatch(fetchLabResultsByStatus({ status: 'in-progress' }));
      })
      .catch(() => {
        message.error("Failed to upload lab result.");
      });
  };


  const filteredData = labResults.filter((item) =>
    item.patient?.first_name.toLowerCase().includes(searchText.toLowerCase()) ||
    item.patient?.middle_name?.toLowerCase().includes(searchText.toLowerCase()) ||
    item.patient?.last_name.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (_, record) => `${record.patient?.first_name} ${record.patient?.middle_name || ''} ${record.patient?.last_name}`,
    },
    {
      title: 'Test Name',
      dataIndex: 'test_name',
      key: 'test_name',
      render: (_, record) => record.test_name?.test_name || 'N/A',
    },
    {
      title: 'Staff ID',
      dataIndex: 'staff_id',
      key: 'staff_id',
      render: (_, record) => `${record.staff?.firstName} ${record.staff?.lastName}` || 'N/A',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <span style={{ color: 'yellow', fontWeight: 'bold' }}>{status}</span>,
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      key: 'comment',
      render: (_, record) => (
        <Tooltip title={record.comment ? record.comment : 'No comments'}>
          <Badge dot={!!record.comment}>
            <MessageOutlined style={{ fontSize: 16, cursor: 'pointer' }} />
          </Badge>
        </Tooltip>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <div>
          <BhmsButton block={false} size="medium" className='mx-2' onClick={() => handleUploadClick(record)}>
            Upload Results
          </BhmsButton>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Input
        placeholder="Search by Patient Name"
        prefix={<SearchOutlined />}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: 20, width: 300 }}
      />

      {labResults.length > 0 ? (
        <Table
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          pagination={{ pageSize: 10 }}
          rowKey={(record) => record.id}
        />
      ) : (
        <Empty description="No Lab Results Available" />
      )}

      {/* Upload Lab Results Modal */}
      {selectedRecord && (
        <UploadLabResultsModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onUpload={handleUpload}
          loading={uploadLoading}
        />
      )}
    </div>
  );
};

export default InProgressComponent;
