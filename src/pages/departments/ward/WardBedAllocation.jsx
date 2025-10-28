import React, { useEffect, useState } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Tag, 
  Button, 
  Modal, 
  Form, 
  Select, 
  Spin, 
  Alert, 
  Statistic,
  Tooltip,
  Divider
} from 'antd';
import { 
  LineOutlined as BedOutlined, 
  WifiOutlined, 
  ToolOutlined, 
  CheckCircleOutlined,
  ExclamationCircleOutlined 
} from '@ant-design/icons';
import { fetchBedsByDepartment, updateBedStatus } from '../../../redux/slice/bedSlice';
import { useDispatch, useSelector } from 'react-redux';

const { Option } = Select;

const WardBedAllocation = () => {
  const { currentDepartmentBeds, loading, error } = useSelector((state) => state.beds);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.admin || state.auth.user);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBed, setSelectedBed] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const department_id = localStorage.getItem('department_id');
    if (department_id) {
      dispatch(fetchBedsByDepartment({ 
        departmentId: department_id, 
        institution_id: user.institution.id 
      }));
    } else {
      console.error("No department ID found in localStorage");
    }
  }, [dispatch, user.institution.id]);

  // Calculate bed statistics
  const bedStats = {
    total: currentDepartmentBeds?.length || 0,
    available: currentDepartmentBeds?.filter(bed => bed.status === 'available' && !bed.is_occupied)?.length || 0,
    occupied: currentDepartmentBeds?.filter(bed => bed.is_occupied)?.length || 0,
    maintenance: currentDepartmentBeds?.filter(bed => bed.status === 'maintenance')?.length || 0,
  };

  const handleStatusUpdate = (bed) => {
    setSelectedBed(bed);
    form.setFieldsValue({
      status: bed.status
    });
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      await dispatch(updateBedStatus({
        bed_id: selectedBed.id,
        status: values.status,
        institution_id: user.institution.id,
        department_id: selectedBed.department_id,
        bed_number: selectedBed.bed_number
      })).unwrap();
      
      setIsModalVisible(false);
      setSelectedBed(null);
      form.resetFields();
    } catch (error) {
      console.error('Failed to update bed status:', error);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedBed(null);
    form.resetFields();
  };

  const getBedColor = (bed) => {
    if (bed.status === 'maintenance') return '#ff4d4f'; // Red for maintenance
    if (bed.is_occupied) return '#1890ff'; // Blue for occupied
    return '#52c41a'; // Green for available
  };

  const getBedIcon = (bed) => {
    if (bed.status === 'maintenance') return <ToolOutlined />;
    if (bed.is_occupied) return <WifiOutlined />;
    return <CheckCircleOutlined />;
  };

  const getBedStatusText = (bed) => {
    if (bed.status === 'maintenance') return 'Under Maintenance';
    if (bed.is_occupied) return 'Occupied';
    return 'Available';
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header with Statistics */}
      <Card style={{ marginBottom: '24px', borderRadius: '12px' }}>
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ margin: 0, display: 'flex', alignItems: 'center' }}>
            <BedOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
            Ward Bed Allocation
          </h2>
          <p style={{ color: '#666', margin: 0 }}>
            Manage bed status and maintenance for your department
          </p>
        </div>

        <Row gutter={16}>
          <Col xs={12} sm={6}>
            <Statistic 
              title="Total Beds" 
              value={bedStats.total} 
              prefix={<BedOutlined />}
            />
          </Col>
          <Col xs={12} sm={6}>
            <Statistic 
              title="Available" 
              value={bedStats.available} 
              valueStyle={{ color: '#52c41a' }}
            />
          </Col>
          <Col xs={12} sm={6}>
            <Statistic 
              title="Occupied" 
              value={bedStats.occupied} 
              valueStyle={{ color: '#1890ff' }}
            />
          </Col>
          <Col xs={12} sm={6}>
            <Statistic 
              title="Maintenance" 
              value={bedStats.maintenance} 
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Col>
        </Row>
      </Card>

      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: '16px' }}
        />
      )}

      {/* Beds Grid */}
      <Card 
        title={`Beds in Department (${currentDepartmentBeds?.length || 0})`}
        style={{ borderRadius: '12px' }}
      >
        <Row gutter={[16, 16]}>
          {currentDepartmentBeds?.map((bed) => (
            <Col key={bed.id} xs={12} sm={8} md={6} lg={4}>
              <Card
                size="small"
                style={{
                  border: `2px solid ${getBedColor(bed)}`,
                  borderRadius: '8px',
                  textAlign: 'center',
                  cursor: bed.status === 'maintenance' || !bed.is_occupied ? 'pointer' : 'default',
                  opacity: bed.status === 'maintenance' ? 0.8 : 1
                }}
                hoverable={bed.status === 'maintenance' || !bed.is_occupied}
                onClick={() => (bed.status === 'maintenance' || !bed.is_occupied) && handleStatusUpdate(bed)}
              >
                <div style={{ fontSize: '24px', marginBottom: '8px', color: getBedColor(bed) }}>
                  {getBedIcon(bed)}
                </div>
                
                <h3 style={{ 
                  margin: '8px 0', 
                  color: getBedColor(bed),
                  fontSize: '18px'
                }}>
                  Bed {bed.bed_number}
                </h3>
                
                <Tag 
                  color={
                    bed.status === 'maintenance' ? 'red' : 
                    bed.is_occupied ? 'blue' : 'green'
                  }
                  style={{ marginBottom: '8px' }}
                >
                  {getBedStatusText(bed)}
                </Tag>

                {bed.status === 'maintenance' && (
                  <Tooltip title="Click to update status">
                    <Button 
                      type="link" 
                      size="small" 
                      icon={<ToolOutlined />}
                      style={{ color: '#ff4d4f' }}
                    >
                      Update
                    </Button>
                  </Tooltip>
                )}

                {!bed.is_occupied && bed.status !== 'maintenance' && (
                  <Tooltip title="Mark for maintenance">
                    <Button 
                      type="link" 
                      size="small" 
                      icon={<ExclamationCircleOutlined />}
                      style={{ color: '#faad14' }}
                    >
                      Maintenance
                    </Button>
                  </Tooltip>
                )}

                {bed.is_occupied && (
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                    Currently Occupied
                  </div>
                )}
              </Card>
            </Col>
          ))}
        </Row>

        {(!currentDepartmentBeds || currentDepartmentBeds.length === 0) && !loading && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            <BedOutlined style={{ fontSize: '48px', marginBottom: '16px', color: '#d9d9d9' }} />
            <p>No beds found for this department</p>
          </div>
        )}
      </Card>

      {/* Update Status Modal */}
      <Modal
        title={`Update Bed ${selectedBed?.bed_number} Status`}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Update Status"
        cancelText="Cancel"
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="status"
            label="Bed Status"
            rules={[{ required: true, message: 'Please select a status' }]}
          >
            <Select placeholder="Select bed status">
              <Option value="available">Available</Option>
              <Option value="faulty">faulty</Option>
            </Select>
          </Form.Item>
          
          {selectedBed && (
            <div style={{ 
              background: '#f0f8ff', 
              padding: '12px', 
              borderRadius: '6px',
              marginTop: '16px'
            }}>
              <p style={{ margin: 0, fontWeight: 'bold' }}>Current Information:</p>
              <p style={{ margin: '4px 0' }}>Bed Number: {selectedBed.bed_number}</p>
              <p style={{ margin: '4px 0' }}>Current Status: {getBedStatusText(selectedBed)}</p>
              <p style={{ margin: '4px 0' }}>
                Occupied: {selectedBed.is_occupied ? 'Yes' : 'No'}
              </p>
            </div>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default WardBedAllocation;