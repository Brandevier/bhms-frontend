import React, { useState, useEffect } from "react";
import { Row, Col, Card, Empty, Button,Skeleton } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// Components
import StaffHeader from "./components/StaffHeader";
import StatisticsCards from "./components/StatisticsCards";
import SearchFilters from "./components/SearchFilters";
import StaffCard from "./components/StaffCard";
import AddStaffDialog from "../components/AddStaffDialog";

// Redux actions
import { getAllStaff } from "../../../redux/slice/staff_admin_managment_slice";
import { getAllRoles } from "../../../redux/slice/staffPermissionSlice";

const StaffList = () => {
  const [visible, setVisible] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { allStaffs, loading } = useSelector((state) => state.adminStaffManagement);

  useEffect(() => {
    dispatch(getAllStaff());
    dispatch(getAllRoles());
  }, [dispatch]);

  const handleUpdate = () => {
    dispatch(getAllStaff());
  };

  const handleClearFilters = () => {
    setSearchText("");
    setDepartmentFilter("all");
    setStatusFilter("all");
  };

  // Filter staff based on search and filters
  const filteredStaff = allStaffs?.filter(staff => {
    const matchesSearch = 
      searchText === "" ||
      staff.firstName?.toLowerCase().includes(searchText.toLowerCase()) ||
      staff.lastName?.toLowerCase().includes(searchText.toLowerCase()) ||
      staff.staffID?.toLowerCase().includes(searchText.toLowerCase()) ||
      staff.role?.name?.toLowerCase().includes(searchText.toLowerCase());

    const matchesDepartment = 
      departmentFilter === "all" ||
      staff.staff_departments?.some(dept => dept.department_id === departmentFilter) ||
      staff.department_id === departmentFilter;

    const matchesStatus = 
      statusFilter === "all" ||
      (statusFilter === "active" && staff.last_login) ||
      (statusFilter === "inactive" && !staff.last_login);

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <StaffHeader 
        onAddStaff={() => {
          setSelectedStaff(null);
          setVisible(true);
        }}
      />

      {/* Statistics Cards */}
      <StatisticsCards staffData={allStaffs} />

      {/* Search and Filters Section */}
      <SearchFilters 
        searchText={searchText}
        onSearchChange={setSearchText}
        departmentFilter={departmentFilter}
        onDepartmentFilterChange={setDepartmentFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onClearFilters={handleClearFilters}
      />

      {/* Staff Cards Grid */}
      {loading ? (
        <StaffLoadingSkeleton />
      ) : filteredStaff?.length > 0 ? (
        <Row gutter={[16, 16]}>
          {filteredStaff.map(staff => (
            <Col xs={24} sm={12} lg={8} key={staff.id}>
              <StaffCard 
                staff={staff} 
                onEdit={(staff) => {
                  setSelectedStaff(staff);
                  setVisible(true);
                }}
                onView={(staffId) => navigate(`/admin/details/${staffId}`)}
              />
            </Col>
          ))}
        </Row>
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            searchText || departmentFilter !== "all" || statusFilter !== "all" 
              ? "No staff members match your search criteria"
              : "No staff members found"
          }
          style={{ padding: '40px 0' }}
        >
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setVisible(true)}
          >
            Add First Staff Member
          </Button>
        </Empty>
      )}

      {/* Add/Edit Staff Dialog */}
      <AddStaffDialog 
        visible={visible} 
        onClose={() => {
          setVisible(false);
          setSelectedStaff(null);
        }} 
        updateComponent={handleUpdate} 
        staffData={selectedStaff}
      />
    </div>
  );
};

// Loading Skeleton Component
const StaffLoadingSkeleton = () => {
  
  return (
    <Row gutter={[16, 16]}>
      {[1, 2, 3, 4, 5, 6].map(item => (
        <Col xs={24} sm={12} lg={8} key={item}>
          <Card>
            <Skeleton active avatar paragraph={{ rows: 3 }} />
          </Card>
        </Col>
      ))}
    </Row>
  );
};

const styles = {
  container: { 
    padding: 24, 
    background: "#f5f5f5", 
    minHeight: '100vh'
  }
};

export default StaffList;