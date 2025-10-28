// components/staff/DepartmentModal.js
import React, { useState, useEffect } from 'react';
import { Modal, Checkbox, Divider, Typography, Select, Row, Col, Tag,Empty } from 'antd';

const { Text } = Typography;
const { Option } = Select;

const DepartmentModal = ({
  visible,
  onCancel,
  onUpdate,
  staffName,
  departments,
  staffDepartments,
  loading
}) => {
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [departmentAccessTypes, setDepartmentAccessTypes] = useState({});

  useEffect(() => {
    // Set selected departments and access types when modal opens or staff departments change
    if (visible) {
      const initialSelected = [];
      const initialAccessTypes = {};
      
      staffDepartments.forEach(dept => {
        initialSelected.push(dept.department_id);
        initialAccessTypes[dept.department_id] = dept.access_type || 'full access';
      });
      
      setSelectedDepartments(initialSelected);
      setDepartmentAccessTypes(initialAccessTypes);
    }
  }, [visible, staffDepartments]);

  const handleDepartmentSelection = (checkedValues) => {
    setSelectedDepartments(checkedValues);
    
    // Add default access type for newly selected departments
    const newAccessTypes = { ...departmentAccessTypes };
    checkedValues.forEach(deptId => {
      if (!newAccessTypes[deptId]) {
        newAccessTypes[deptId] = 'full access';
      }
    });
    setDepartmentAccessTypes(newAccessTypes);
  };

  const handleAccessTypeChange = (departmentId, accessType) => {
    setDepartmentAccessTypes(prev => ({
      ...prev,
      [departmentId]: accessType
    }));
  };

  const handleOk = () => {
    onUpdate(selectedDepartments, departmentAccessTypes);
  };

  return (
    <Modal
      title={`Manage Departments for ${staffName}`}
      visible={visible}
      onCancel={onCancel}
      onOk={handleOk}
      okText="Update Departments"
      cancelText="Cancel"
      confirmLoading={loading}
      width={700}
    >
      <Divider />
      <Text type="secondary" className="block mb-4">
        Select departments and set access levels for {staffName}:
      </Text>
      
      {departments.length === 0 ? (
        <Empty description="No departments available" />
      ) : (
        <div className="max-h-96 overflow-y-auto">
          <Checkbox.Group
            value={selectedDepartments}
            onChange={handleDepartmentSelection}
            className="w-full"
          >
            {departments.map(dept => (
              <div key={dept.id} className="border-b border-gray-100 last:border-b-0">
                <Row align="middle" className="py-3 px-2 hover:bg-gray-50 rounded">
                  <Col span={16}>
                    <Checkbox value={dept.id} className="w-full">
                      <div className="ml-2">
                        <Text strong>{dept.name}</Text>
                        {dept.description && (
                          <Text type="secondary" className="block text-xs">
                            {dept.description}
                          </Text>
                        )}
                      </div>
                    </Checkbox>
                  </Col>
                  <Col span={8}>
                    {selectedDepartments.includes(dept.id) && (
                      <Select
                        value={departmentAccessTypes[dept.id] || 'full access'}
                        onChange={(value) => handleAccessTypeChange(dept.id, value)}
                        size="small"
                        className="w-full"
                      >
                        <Option value="full access">
                          <Tag color="green">Full Access</Tag>
                        </Option>
                        <Option value="limited access">
                          <Tag color="orange">Limited Access</Tag>
                        </Option>
                        <Option value="view only">
                          <Tag color="blue">View Only</Tag>
                        </Option>
                        <Option value="no access">
                          <Tag color="red">No Access</Tag>
                        </Option>
                      </Select>
                    )}
                  </Col>
                </Row>
              </div>
            ))}
          </Checkbox.Group>
        </div>
      )}
    </Modal>
  );
};

export default DepartmentModal;