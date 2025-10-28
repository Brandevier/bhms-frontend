import React, { useState } from 'react';
import { 
  Typography, 
  Descriptions, 
  Collapse, 
  Tag,
  Button,
  Modal,
  Tabs,
  message,
  Spin,
  Card,
  Row,
  Col,
  Space,
  List,
  Divider,
  Badge
} from 'antd';
import { 
  DownOutlined, 
  EditOutlined, 
  CheckCircleOutlined, 
  UserOutlined,
  InsuranceOutlined,
  FileTextOutlined,
  MedicineBoxOutlined,
  CalendarOutlined,
  DollarOutlined,
 
} from '@ant-design/icons';
import { updateClaimStatus } from '../../../../redux/slice/claimSlice';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import ClaimItemsGroupedView from '../../claims/common/ClaimItemsGroupedView';


const { Title, Text } = Typography;
const { Panel } = Collapse;
const { TabPane } = Tabs;

const PatientDetails = ({ record, handleGeneralSubmit }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('patient');
  const [approvingClaimId, setApprovingClaimId] = useState(null);
  
  const { loading } = useSelector(state => state.claims);
  const dispatch = useDispatch();
  
  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  const handleApproveClaim = (claim) => {
    Modal.confirm({
      title: 'Approve Claim',
      icon: <CheckCircleOutlined />,
      content: (
        <div>
          <p>Are you sure you want to approve this claim?</p>
          <Card size="small" style={{ marginTop: 8 }}>
            <Space direction="vertical" size="small">
              <Text strong>Claim #: {record.claim_reference_number}</Text>
              <Text>Amount: GHC {record.total_amount?.toFixed(2)}</Text>
              <Text>Items: {record.items?.length || 0}</Text>
            </Space>
          </Card>
        </div>
      ),
      okText: 'Yes, Approve',
      okType: 'primary',
      cancelText: 'Cancel',
      onOk() {
        approveClaim(record.id);
      },
    });
  };

  const approveClaim = async (claimId) => {
    setApprovingClaimId(claimId);
    try {
      const result = await dispatch(updateClaimStatus({
        claim_id: claimId,
        claim_status: 'Approved'
      })).unwrap();
      
      message.success('Claim approved successfully!');
      // Refresh the data
      if (handleGeneralSubmit) {
        handleGeneralSubmit();
      }
    } catch (error) {
      message.error(`Failed to approve claim: ${error.message || 'Unknown error'}`);
    } finally {
      setApprovingClaimId(null);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'orange',
      'Submitted': 'blue',
      'Approved': 'green',
      'Rejected': 'red'
    };
    return colors[status] || 'default';
  };

  // Safe data access functions
  const getPatient = () => record.patient || record.visit?.patient || {};
  const getInsurance = () => getPatient().insurance || {};
  const getVisit = () => record.visit || {};

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <Title level={4} className="mb-0">
          <UserOutlined className="mr-2" />
          Patient & Claim Information
        </Title>
        <Button 
          type="primary" 
          icon={<CheckCircleOutlined />} 
          onClick={() => handleApproveClaim(record)}
          loading={approvingClaimId === record.id}
          disabled={record.claim_status === 'Approved'}
          size="large"
        >
          {record.claim_status === 'Approved' ? 'Approved' : 'Approve Claim'}
        </Button>
      </div>

      {/* Claim Information */}
      <Card className="mb-4">
        <Descriptions 
          bordered 
          column={{ xxl: 4, xl: 3, lg: 2, md: 2, sm: 1, xs: 1 }}
          size="middle"
          title="Claim Information"
        >
          <Descriptions.Item label="Claim Reference">
            <Text strong>{record.claim_reference_number}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={getStatusColor(record.claim_status)}>
              {record.claim_status}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Total Amount">
            <Text strong style={{ color: '#1890ff' }}>
              GHC {record.total_amount?.toFixed(2)}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="Submission Date">
            <CalendarOutlined className="mr-1" />
            {moment(record.submission_date || record.createdAt).format('LLL')}
          </Descriptions.Item>
          <Descriptions.Item label="Items Count">
            <Badge count={record.items?.length || 0} showZero />
          </Descriptions.Item>
          <Descriptions.Item label="Department">
            <Tag color="blue">{getVisit().department?.name || 'N/A'}</Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Patient Information */}
      <Card className="mb-4">
        <Descriptions 
          bordered 
          column={{ xxl: 3, xl: 3, lg: 2, md: 2, sm: 1, xs: 1 }}
          size="middle"
          title="Patient Information"
        >
          <Descriptions.Item label="Full Name" span={1}>
            <Text strong>
              {record.patientName || `${getPatient().first_name || ''} ${getPatient().last_name || ''}`.trim() || 'Unknown'}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="Gender" span={1}>
            <Tag icon={<UserOutlined />} color={getPatient().gender === 'M' ? 'blue' : 'pink'}>
              {getPatient().gender === 'M' ? 'Male' : 'Female'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Date of Birth" span={1}>
            <Text>
              {getPatient().date_of_birth ? moment(getPatient().date_of_birth).format("LL") : 'N/A'}
            </Text>
          </Descriptions.Item>
          
          <Descriptions.Item label="Folder Number" span={1}>
            <Tag color="orange">
              {record.patientFolderNumber || getPatient().folder_number || 'N/A'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Attendance Number" span={1}>
            <Tag color="cyan">
              {record.attendanceNumber || getVisit().attendance_number || 'N/A'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Visit Type" span={1}>
            <Tag color={getVisit().visit_type === 'Outpatient' ? 'blue' : 'green'}>
              {getVisit().visit_type || 'General OPD'}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Insurance Information */}
      <Card className="mb-4">
        <Descriptions 
          bordered 
          column={{ xxl: 3, xl: 3, lg: 2, md: 2, sm: 1, xs: 1 }}
          size="middle"
          title="Insurance Information"
        >
          <Descriptions.Item label="Insurance Provider" span={1}>
            <Tag color="blue" icon={<InsuranceOutlined />}>
              {record.insuranceProvider || getInsurance().insurance_provider || 'N/A'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="NHIS Number" span={1}>
            <Tag color="green">
              {getInsurance().insurance_number || 'N/A'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Insurance Status" span={1}>
            <Tag color={getInsurance().insured ? 'green' : 'red'}>
              {getInsurance().insured ? 'Active' : 'Inactive'}
            </Tag>
          </Descriptions.Item>
          
          <Descriptions.Item label="Insurance Expiry" span={3}>
            {getInsurance().insurance_expiry_date ? 
              moment(getInsurance().insurance_expiry_date).format("LL") : 'N/A'
            }
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Claim Items Section */}
<Card>
  <Title level={4}>
    <MedicineBoxOutlined className="mr-2" />
    Claim Items
  </Title>
  
  <ClaimItemsGroupedView 
    items={record.items}
    onItemUpdate={(updatedItem) => {
      // Handle item update logic here
      console.log('Item updated:', updatedItem);
      message.success('Item updated successfully');
    }}
    readOnly={record.claim_status === 'Approved'} // Read-only if claim is approved
  />
</Card>
    </div>
  );
};

export default PatientDetails;