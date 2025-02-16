import React from "react";
import { Card, Row, Col } from "antd";
import dayjs from "dayjs";

const PatientDetailsInfo = ({ patient_record }) => {
  // Helper function to display default text if data is missing
  const getValue = (value) => (value ? value : "Not Provided");

  // Function to calculate age from DOB
  const calculateAge = (dob) => {
    if (!dob) return "Not Provided"; // If DOB is missing
    const birthDate = dayjs(dob);
    const today = dayjs();
    return today.diff(birthDate, "year"); // Get difference in years
  };

  return (
    <Row gutter={16}>
      {/* Contact Info */}
      <Col span={12}>
        <Card title="Contact Info">
          <p><strong>Phone:</strong> {getValue(patient_record?.patient?.phone_number)}</p>
          <p><strong>Email:</strong> {getValue(patient_record?.patient?.email)}</p>
          <p><strong>Address:</strong> {getValue(patient_record?.patient?.address)}</p>
        </Card>
      </Col>

      {/* General Info */}
      <Col span={12}>
        <Card title="General Info">
          <p><strong>Gender:</strong> {getValue(patient_record?.patient?.gender)}</p>
          <p><strong>Age:</strong> {calculateAge(patient_record?.patient?.date_of_birth)} years</p>
          <p><strong>Date of Birth:</strong> {getValue(patient_record?.patient?.date_of_birth)}</p>
        </Card>
      </Col>
    </Row>
  );
};

export default PatientDetailsInfo;
