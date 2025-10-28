import React from "react";
import { Row, Col, Card, Input, Select, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";

const { Search } = Input;
const { Option } = Select;

const SearchFilters = ({
  searchText,
  onSearchChange,
  departmentFilter,
  onDepartmentFilterChange,
  statusFilter,
  onStatusFilterChange,
  onClearFilters
}) => {
  const { allStaffs } = useSelector((state) => state.adminStaffManagement);

  // Get unique departments from staff data - FIXED VERSION
  const getUniqueDepartments = () => {
    const deptMap = new Map();
    
    allStaffs?.forEach(staff => {
      // Check primary department
      if (staff.department && staff.department.id) {
        deptMap.set(staff.department.id, staff.department);
      }
      
      // Check staff_departments array
      if (staff.staff_departments && Array.isArray(staff.staff_departments)) {
        staff.staff_departments.forEach(deptItem => {
          // Check if department exists in the item
          if (deptItem.department && deptItem.department.id) {
            deptMap.set(deptItem.department.id, deptItem.department);
          }
          // Also check if there's a direct department_id with name (fallback)
          else if (deptItem.department_id && deptItem.name) {
            deptMap.set(deptItem.department_id, {
              id: deptItem.department_id,
              name: deptItem.name
            });
          }
        });
      }
    });
    
    return Array.from(deptMap.values());
  };

  const uniqueDepartments = getUniqueDepartments();

  return (
    <Card style={{ marginBottom: 24 }}>
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={8}>
          <Search
            placeholder="Search by name, ID, or role..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </Col>
        <Col xs={24} sm={6}>
          <Select
            placeholder="Filter by department"
            style={{ width: '100%' }}
            size="large"
            value={departmentFilter}
            onChange={onDepartmentFilterChange}
            allowClear
          >
            <Option value="all">All Departments</Option>
            {uniqueDepartments.map(dept => (
              <Option key={dept.id} value={dept.id}>
                {dept.name}
              </Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} sm={6}>
          <Select
            placeholder="Filter by status"
            style={{ width: '100%' }}
            size="large"
            value={statusFilter}
            onChange={onStatusFilterChange}
            allowClear
          >
            <Option value="all">All Status</Option>
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
          </Select>
        </Col>
        <Col xs={24} sm={4}>
          <Button 
            onClick={onClearFilters}
            size="large"
            style={{ width: '100%' }}
          >
            Clear Filters
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

export default SearchFilters;