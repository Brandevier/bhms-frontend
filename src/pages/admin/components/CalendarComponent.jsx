import React, { useEffect, useState } from "react";
import { Calendar, Badge, Button, Row, Col, Typography } from "antd";
import { LeftOutlined, RightOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "./CalendarComponent.css"; // Import custom styles
import BhmsButton from "../../../heroComponents/BhmsButton";
import EventDialog from "./EventDialog";
import { useDispatch, useSelector } from "react-redux";
import { getAllStaff } from "../../../redux/slice/staff_admin_managment_slice";


const { Title } = Typography;

// Sample Appointments Data
const appointments = [
  { date: "2028-07-02", doctor: "Dr. John Davis", time: "11:00 AM" },
  { date: "2028-07-02", doctor: "Dr. Linda Green", time: "03:00 PM" },
  { date: "2028-07-05", doctor: "Dr. Petra Winsbury", time: "10:00 AM" },
  { date: "2028-07-07", doctor: "Dr. Emily Smith", time: "10:00 AM" },
  { date: "2028-07-10", doctor: "Dr. Emily Smith", time: "02:00 PM" },
  { date: "2028-07-12", doctor: "Dr. John Davis", time: "03:00 PM" },
  { date: "2028-07-19", doctor: "Dr. Linda Green", time: "01:00 PM" },
  { date: "2028-07-25", doctor: "Dr. Emily Smith", time: "04:00 PM" },
  { date: "2028-07-27", doctor: "Dr. John Davis", time: "09:00 AM" },
  { date: "2028-07-30", doctor: "Dr. Petra Winsbury", time: "03:00 PM" },
];

const CalendarComponent = () => {
  const [currentDate, setCurrentDate] = useState(dayjs("2028-07-01"));
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { allStaffs} = useSelector((state) => state.adminStaffManagement);
  const dispatch = useDispatch()
  // Handle month navigation
  const handlePrevMonth = () => setCurrentDate(currentDate.subtract(1, "month"));
  const handleNextMonth = () => setCurrentDate(currentDate.add(1, "month"));

  // Render appointments in each date cell
  const dateCellRender = (value) => {
    const dateString = value.format("YYYY-MM-DD");
    const events = appointments.filter((event) => event.date === dateString);


    useEffect(()=>{
      dispatch(getAllStaff())
    },[])




    return (
      <div>
        {events.map((event, index) => (
          <div key={index} className="event-card">
            <Badge status="success" />
            <span>{event.doctor}</span>
            <br />
            <span className="event-time">{event.time}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="calendar-container">
      {/* Header Controls */}
      <Row justify="space-between" align="middle" className="calendar-header">
        <Col>
          <BhmsButton block={false} outline={true} size="large" width="40px" icon={<LeftOutlined />} onClick={handlePrevMonth} />
          <Title level={3} style={{ display: "inline-block", margin: "0 15px" }}>
            {currentDate.format("MMMM YYYY")}
          </Title>
          <BhmsButton block={false} outline={true} size="large" width="40px" icon={<RightOutlined />} onClick={handleNextMonth}></BhmsButton>
        </Col>
        <Col>
          <BhmsButton type="primary" block={false} size="medium" icon={<PlusOutlined />} onClick={() => setIsDialogOpen(true)}>Add Schedule</BhmsButton>
        </Col>
      </Row>

      {/* Calendar View */}
      <Calendar
        value={currentDate}
        dateCellRender={dateCellRender}
        fullscreen={true}
        onSelect={(data) => console.log(data)}
      />
      <EventDialog
        visible={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={(eventData) => {
          console.log("Event Saved:", eventData);
          setIsDialogOpen(false);
        }}
        staffs={allStaffs}
      />

    </div>
  );
};

export default CalendarComponent;
