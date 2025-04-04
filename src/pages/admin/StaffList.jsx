import React, { useState, useEffect } from "react";
import { Table, Tag, Input, Select, Space, Avatar, Skeleton, Popconfirm, message,Row,Col,Card,Statistic} from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import BhmsButton from "../../heroComponents/BhmsButton";
import AddStaffDialog from "./components/AddStaffDialog";
import { getAllStaff, deleteStaff } from "../../redux/slice/staff_admin_managment_slice";
import { useDispatch, useSelector } from "react-redux";
import { getAllRoles } from "../../redux/slice/staffPermissionSlice";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";


const StaffList = () => {
  const [visible, setVisible] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const dispatch = useDispatch();
  const { allStaffs, loading } = useSelector((state) => state.adminStaffManagement);
  const { roles } = useSelector((state) => state.permissions);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllStaff());
    dispatch(getAllRoles());
  }, [dispatch]);

  const handleUpdate = () => {
    dispatch(getAllStaff());
  };

  const handleRowClick = (user) => {
    navigate(`/admin/details/${user.id}`);
  };

  // Calculate statistics
  const totalStaff = allStaffs?.length || 0;
  const activeTodayStaff = allStaffs?.filter(staff => 
    staff.last_login && dayjs(staff.last_login).isSame(dayjs(), 'day')
  ).length || 0;
  const neverLoggedIn = allStaffs?.filter(staff => !staff.last_login).length || 0;

  const columns = [
    {
      title: "Profile",
      dataIndex: "profile_pic",
      key: "profile_pic",
      render: (profile_pic) => (
        <Avatar src={profile_pic || "/assets/user.png"} size={40} />
      ),
      width: 80,
    },
    {
      title: "Staff ID",
      dataIndex: "staffID",
      key: "staffID",
      sorter: (a, b) => a.staffID.localeCompare(b.staffID),
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      render: (_, record) => `${record.firstName} ${record.middleName || ""} ${record.lastName}`,
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      render: (department) => department?.name || "N/A",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => role?.name || "N/A",
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => (
        <Tag color={record.last_login ? 'green' : 'orange'}>
          {record.last_login ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: "Last Login",
      dataIndex: "last_login",
      key: "last_login",
      render: (last_login) =>
        last_login ? dayjs(last_login).format("DD MMM YYYY, hh:mm A") : "Never Logged In",
    },
  ];

  return (
    <div style={styles.container}>
      {/* Statistics Cards */}
      <BhmsButton type="primary" block={false} size="medium" icon={<PlusOutlined />} onClick={() => {
         
          setVisible(true);
        }}>
          Add Staff
        </BhmsButton>
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Staff"
              value={totalStaff}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Active Today"
              value={activeTodayStaff}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Never Logged In"
              value={neverLoggedIn}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {loading ? (
        <Skeleton active paragraph={{ rows: 8 }} />
      ) : (
        <Table
          columns={columns}
          dataSource={allStaffs || []}
          rowKey="id"
          pagination={{ pageSize: 12 }}
          bordered
          style={styles.table}
          rowClassName="clickable-row"
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
          })}
        />
      )}

      <AddStaffDialog 
        visible={visible} 
        onClose={() => setVisible(false)} 
        updateComponent={handleUpdate} 
        staffData={selectedStaff}
      />
    </div>
  );
};

const styles = {
  container: { 
    padding: 20, 
    background: "#fff", 
    borderRadius: 10, 
    boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)" 
  },
  table: { 
    marginTop: 10,
    cursor: 'pointer'
  },
  statCard: {
    borderRadius: 8,
    boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
  }
};

export default StaffList;