import React, { useEffect,useState } from "react";
import { Table, Tag, Card, Button, message } from "antd";
import { getDepartment } from "../redux/slice/departmentSlice";
import { useSelector, useDispatch } from "react-redux";
import ShiftModal from "../modal/ShiftModal";


const shiftColors = {
  afternoon: "gold",
  morning: "blue",
  night: "purple",
  off: "red",
};

const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

// Define columns dynamically



const HMSStaffShiftSchedule = () => {
  const { loading, department } = useSelector((state) => state.departments);
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);


  useEffect(() => {
    dispatch(getDepartment());
  }, [dispatch]);

  // Function to transform API data into table format
  const transformData = () => {
    if (!department || !department.staff) return [];

    return department.staff.map((staff) => {
      const shifts = staff.rotation || [];

      // Convert shifts array to a map for quick lookup
      const shiftMap = shifts.reduce((acc, shift) => {
        acc[shift.day] = shift.shift;
        return acc;
      }, {});

      // Populate shift data for each day
      const rowData = {
        key: staff.id,
        staff_id: staff.id,
        name: `${staff.firstName} ${staff.lastName}`,
        hasShifts: shifts.length > 0, // Check if staff has shifts
      };

      daysOfWeek.forEach((day) => {
        rowData[day] = shiftMap[day] || null; // If no shift, show ❌
      });

      return rowData;
    });
  };

  const handleAddShift = (staff) => {
    setSelectedStaff(staff);
    setModalVisible(true);
  };

  // Close Modal
  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedStaff(null);
  };

  // Handle Shift Submission
  const handleShiftSubmit = (shifts) => {
    console.log("Shifts to be added:", shifts);
    message.success("Shifts assigned successfully!");
    handleCloseModal();
  };


  const columns = [
    {
      title: "Staff Name",
      dataIndex: "name",
      key: "name",
      fixed: "left",
    },
    ...daysOfWeek.map((day) => ({
      title: day.charAt(0).toUpperCase() + day.slice(1),
      dataIndex: day,
      key: day,
      render: (shift) =>
        shift ? <Tag color={shiftColors[shift]}>{shift}</Tag> : <span style={{ color: "red" }}>❌</span>,
    })),
    {
      title: "Actions",
      key: "actions",
      render: (_, record) =>
        record.hasShifts ? (
          <Button type="primary" onClick={() => handleUpdateShift(record)}>Update</Button>
        ) : (
          <Button type="dashed" onClick={() => handleAddShift(record)}>Add</Button>
        ),
    },
  ];

  return (
    <Card
      title="HMS Staff Shift Schedule"
      bordered
      style={{ borderRadius: 10, boxShadow: "0 2px 10px rgba(0,0,0,0.1)", overflow: "auto" }}
    >
      <Table
        columns={columns}
        dataSource={transformData()}
        loading={loading}
        pagination={false}
        bordered
        scroll={{ x: "max-content" }}
      />
            <ShiftModal visible={modalVisible} onClose={handleCloseModal} onSubmit={handleShiftSubmit} staff={selectedStaff} />
    </Card>
  );
};

export default HMSStaffShiftSchedule;
