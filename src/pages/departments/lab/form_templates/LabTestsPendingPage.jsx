import React, { useState,useEffect } from 'react';
import { Table, Button, Card, Tag, DatePicker, Select, Input, Space } from 'antd';
import { SearchOutlined, ExperimentOutlined } from '@ant-design/icons';
import { fetchTestResults } from '../../../../redux/slice/labSlice';
import { useDispatch,useSelector } from 'react-redux';

const { RangePicker } = DatePicker;
const { Option } = Select;

const LabTestsPendingPage = () => {
  // Dummy data - would normally come from API
  const [pendingTests, setPendingTests] = useState([
    {
      id: '1',
      patientName: 'John Doe',
      folderNumber: 'MED-2023-001',
      testName: 'Complete Blood Count',
      requestedDate: '2023-05-15T10:30:00',
      status: 'pending',
    },
    {
      id: '2',
      patientName: 'Jane Smith',
      folderNumber: 'MED-2023-002',
      testName: 'Lipid Profile',
      requestedDate: '2023-05-16T09:15:00',
      status: 'pending',
    },
    {
      id: '3',
      patientName: 'Robert Johnson',
      folderNumber: 'MED-2023-003',
      testName: 'Liver Function Test',
      requestedDate: '2023-05-17T14:45:00',
      status: 'pending',
    },
  ]);
  const { results,loading } = useSelector((state)=>state.lab)

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentTest, setCurrentTest] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [searchParams, setSearchParams] = useState({
    patientName: '',
    folderNumber: '',
    testName: '',
    dateRange: [],
  });
  const dispatch = useDispatch()

  const handleEnterResults = (record) => {
    setCurrentTest(record);
    setIsModalVisible(true);
    // Initialize form values based on test template
    setFormValues({
      // Initialize with default values for each field
    });
  };

  const handleSearch = () => {
    // Filter data based on search parameters
    // In a real app, this would be an API call
    console.log('Searching with:', searchParams);
  };

  const handleReset = () => {
    setSearchParams({
      patientName: '',
      folderNumber: '',
      testName: '',
      dateRange: [],
    });
  };

  useEffect(()=>{
    dispatch(fetchTestResults())
  },[])

  const columns = [
    {
      title: 'Patient Name',
      dataIndex: 'patientName',
      key: 'patientName',
    },
    {
      title: 'Folder Number',
      dataIndex: 'folderNumber',
      key: 'folderNumber',
    },
    {
      title: 'Test Name',
      dataIndex: 'testName',
      key: 'testName',
    },
    {
      title: 'Requested Date',
      dataIndex: 'requestedDate',
      key: 'requestedDate',
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'pending' ? 'orange' : 'green'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          type="primary"
          icon={<ExperimentOutlined />}
          onClick={() => handleEnterResults(record)}
        >
          Enter Results
        </Button>
      ),
    },
  ];

  return (
    <div className="lab-tests-pending">
      <Card title="Pending Lab Tests" bordered={false}>
        <div className="search-filters" style={{ marginBottom: 20 }}>
          <Space size="middle" wrap>
            <Input
              placeholder="Patient Name"
              value={searchParams.patientName}
              onChange={(e) => setSearchParams({ ...searchParams, patientName: e.target.value })}
              style={{ width: 200 }}
            />
            <Input
              placeholder="Folder Number"
              value={searchParams.folderNumber}
              onChange={(e) => setSearchParams({ ...searchParams, folderNumber: e.target.value })}
              style={{ width: 200 }}
            />
            <Input
              placeholder="Test Name"
              value={searchParams.testName}
              onChange={(e) => setSearchParams({ ...searchParams, testName: e.target.value })}
              style={{ width: 200 }}
            />
            <RangePicker
              value={searchParams.dateRange}
              onChange={(dates) => setSearchParams({ ...searchParams, dateRange: dates })}
              style={{ width: 250 }}
            />
            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
              Search
            </Button>
            <Button onClick={handleReset}>Reset</Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={pendingTests}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Modal for entering test results */}
      {currentTest && (
        <Modal
          title={`Enter Results - ${currentTest.testName}`}
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setIsModalVisible(false)}>
              Cancel
            </Button>,
            <Button key="submit" type="primary">
              Save Results
            </Button>,
          ]}
          width={800}
        >
          <div className="patient-info" style={{ marginBottom: 20 }}>
            <p>
              <strong>Patient:</strong> {currentTest.patientName}
            </p>
            <p>
              <strong>Folder #:</strong> {currentTest.folderNumber}
            </p>
            <p>
              <strong>Test:</strong> {currentTest.testName}
            </p>
          </div>

          {/* Dynamic form based on test template */}
          <Form layout="vertical">
            {/* Example fields - these would come from your template */}
            <Form.Item label="Hemoglobin (g/dL)">
              <Input type="number" />
            </Form.Item>
            <Form.Item label="White Blood Cells (10³/µL)">
              <Input type="number" />
            </Form.Item>
            <Form.Item label="Platelets (10³/µL)">
              <Input type="number" />
            </Form.Item>
            <Form.Item label="Notes">
              <Input.TextArea rows={4} />
            </Form.Item>
          </Form>
        </Modal>
      )}
    </div>
  );
};

export default LabTestsPendingPage;