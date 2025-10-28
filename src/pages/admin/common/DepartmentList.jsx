// components/staff/DepartmentList.js (Card Version)
import React from 'react';
import { Card, Tag, Button, Typography, Empty, Space, Tooltip, Row, Col } from 'antd';
import { DeleteOutlined, SafetyOutlined, StarOutlined, StarFilled, CrownOutlined } from '@ant-design/icons';
import { assignedPrimaryDepartment } from '../../../redux/slice/staff_admin_managment_slice';
import { useDispatch, useSelector } from 'react-redux';

const { Text, Title } = Typography;

const DepartmentList = ({ staffDepartments, loading, onRemoveDepartment, onOpenModal, staff_id, on_departmentUpdate }) => {
  const getAccessColor = (accessType) => {
    switch (accessType) {
      case 'full access': return 'green';
      case 'limited access': return 'orange';
      case 'view only': return 'blue';
      case 'no access': return 'red';
      default: return 'default';
    }
  };

  const dispatch = useDispatch();
  const { loading: assigningPrimary } = useSelector((state) => state.adminStaffManagement);

  const handleSetPrimary = (department_id) => {
    if (staff_id && department_id) {
      dispatch(assignedPrimaryDepartment({ staff_id, department_id }))
        .unwrap()
        .then(() => {
          if (on_departmentUpdate) {
            on_departmentUpdate();
          }
        });
    }
  };

  const formatAccessType = (accessType) => {
    return accessType.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Find the primary department
  const primaryDepartment = staffDepartments.find(item => item.primary_department === true);

  if (staffDepartments.length === 0) {
    return (
      <Empty
        description="No departments assigned yet"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      >
        <Button type="primary" onClick={onOpenModal}>
          Assign Departments
        </Button>
      </Empty>
    );
  }

  return (
    <div className="space-y-4">
      {/* Primary Department Card */}
      {primaryDepartment && (
        <Card 
          className="border-2 border-yellow-400 bg-yellow-50"
          title={
            <Space>
              <CrownOutlined className="text-yellow-500" />
              <Text strong>Primary Department</Text>
            </Space>
          }
          extra={<Tag color="gold">Primary</Tag>}
        >
          <div className="flex justify-between items-center">
            <div>
              <Title level={5} className="m-0">{primaryDepartment.department?.name}</Title>
              <Tag color={getAccessColor(primaryDepartment.access_type)} className="mt-2">
                {formatAccessType(primaryDepartment.access_type)}
              </Tag>
              {primaryDepartment.department?.description && (
                <Text type="secondary" className="block mt-1">
                  {primaryDepartment.department.description}
                </Text>
              )}
            </div>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => onRemoveDepartment(primaryDepartment.department_id)}
              loading={loading}
            >
              Remove
            </Button>
          </div>
        </Card>
      )}

      {/* Other Departments Grid */}
      <Row gutter={[16, 16]}>
        {staffDepartments
          .filter(item => !item.primary_department)
          .map((item) => (
            <Col xs={24} sm={12} lg={8} key={item.department_id}>
              <Card
                className="department-card"
                actions={[
                  <Tooltip title="Set as Primary Department">
                    <Button
                      type="text"
                      icon={<StarOutlined />}
                      onClick={() => handleSetPrimary(item.department_id)}
                      loading={assigningPrimary}
                      className="text-yellow-500"
                    >
                      Make Primary
                    </Button>
                  </Tooltip>,
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => onRemoveDepartment(item.department_id)}
                    loading={loading}
                  >
                    Remove
                  </Button>
                ]}
              >
                <div className="text-center">
                  <SafetyOutlined className="text-2xl text-gray-600 mb-2" />
                  <Title level={5} className="m-0 mb-2">
                    {item.department?.name || 'Unknown Department'}
                  </Title>
                  <Tag color={getAccessColor(item.access_type)} className="mb-2">
                    {formatAccessType(item.access_type)}
                  </Tag>
                  {item.department?.description && (
                    <Text type="secondary" className="block text-sm">
                      {item.department.description}
                    </Text>
                  )}
                </div>
              </Card>
            </Col>
          ))}
      </Row>

      {/* Add More Departments Button */}
      <div className="text-center mt-4">
        <Button type="dashed" onClick={onOpenModal} size="large" icon={<StarOutlined />}>
          Assign More Departments
        </Button>
      </div>
    </div>
  );
};

export default DepartmentList;