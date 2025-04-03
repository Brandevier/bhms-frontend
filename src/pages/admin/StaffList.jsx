import React, { useState, useEffect } from "react";
import { Table, Tag, Input, Select, Space, Avatar, Skeleton, Popconfirm, message } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import BhmsButton from "../../heroComponents/BhmsButton";
import AddStaffDialog from "./components/AddStaffDialog";
import { getAllStaff, deleteStaff } from "../../redux/slice/staff_admin_managment_slice";
import { useDispatch, useSelector } from "react-redux";
import { getAllRoles } from "../../redux/slice/staffPermissionSlice";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const StaffList = () => {
  const [visible, setVisible] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const dispatch = useDispatch();
  const { allStaffs, loading, error } = useSelector((state) => state.adminStaffManagement);
  const { roles, loading: roles_loading } = useSelector((state) => state.permissions);
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

  const handleEdit = (staff) => {
    setSelectedStaff(staff);
    setVisible(true);
  };

  const handleDelete = async (staffId) => {
    try {
      await dispatch(deleteStaff(staffId)).unwrap();
      message.success('Staff member deleted successfully');
      handleUpdate();
    } catch (error) {
      message.error('Failed to delete staff member');
    }
  };

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
      title: "Last Login",
      dataIndex: "last_login",
      key: "last_login",
      render: (last_login) =>
        last_login ? dayjs(last_login).format("DD MMM YYYY, hh:mm A") : "Never Logged In",
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <BhmsButton
            block={false}
            size="medium"
            
            icon={<EditOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(record);
            }}
          />
          <Popconfirm
            title="Are you sure to delete this staff member?"
            onConfirm={(e) => {
              e?.stopPropagation();
              handleDelete(record.id);
            }}
            onCancel={(e) => e?.stopPropagation()}
            okText="Yes"
            cancelText="No"
          >
            <BhmsButton
              block={false}
              size="medium"
              color="red"
              icon={<DeleteOutlined />}
              onClick={(e) => e.stopPropagation()}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={styles.container}>
      <Space style={styles.header}>
        <Space>
          {loading ? (
            <Skeleton.Input style={styles.skeletonInput} active />
          ) : (
            <Input placeholder="Search staff..." prefix={<SearchOutlined />} style={styles.input} />
          )}
          {loading ? (
            <Skeleton.Button style={styles.skeletonSelect} active />
          ) : (
            <Select placeholder="Department" style={styles.select}>
              <Option value="general">General Medicine</Option>
              <Option value="cardiology">Cardiology</Option>
            </Select>
          )}
          {loading ? (
            <Skeleton.Button style={styles.skeletonSelect} active />
          ) : (
            <Select placeholder="Role" style={styles.select}>
              <Option value="doctor">Doctor</Option>
              <Option value="nurse">Nurse</Option>
            </Select>
          )}
          {loading ? (
            <Skeleton.Button style={styles.skeletonSelect} active />
          ) : (
            <Select placeholder="Status" style={styles.select}>
              <Option value="available">Available</Option>
              <Option value="unavailable">Unavailable</Option>
            </Select>
          )}
        </Space>
        <BhmsButton type="primary" size="medium" icon={<PlusOutlined />} onClick={() => {
          setSelectedStaff(null);
          setVisible(true);
        }}>
          Add Staff
        </BhmsButton>
      </Space>

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
  container: { padding: 20, background: "#fff", borderRadius: 10, boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)" },
  header: { marginBottom: 16, width: "100%", justifyContent: "space-between" },
  input: { width: 200, borderRadius: 5 },
  select: { width: 150, borderRadius: 5 },
  table: { marginTop: 10 },
  skeletonInput: { width: 200, height: 32 },
  skeletonSelect: { width: 150, height: 32 },
};

export default StaffList;