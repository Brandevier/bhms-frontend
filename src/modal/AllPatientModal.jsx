import React, { useState } from "react";
import { Modal, Card, Button, Avatar, List, Typography, Input } from "antd";
import { UserOutlined, MessageOutlined, SearchOutlined } from "@ant-design/icons";
import BhmsButton from "../heroComponents/BhmsButton";


const { Text } = Typography;
const { Search } = Input;

const dummyPatients = [
  { id: 1, firstName: "John", lastName: "Doe", diagnosis: "Flu", department: "OPD" },
  { id: 2, firstName: "Jane", lastName: "Smith", diagnosis: "Fractured Arm", department: "Emergency" },
  { id: 3, firstName: "Michael", lastName: "Brown", diagnosis: "Diabetes", department: "Female Ward" },
  { id: 4, firstName: "Emily", lastName: "Davis", diagnosis: "Hypertension", department: "Cardiology" },
  { id: 5, firstName: "Chris", lastName: "Evans", diagnosis: "Asthma", department: "Respiratory" },
  { id: 6, firstName: "Sophia", lastName: "Wilson", diagnosis: "Migraine", department: "Neurology" },
  { id: 7, firstName: "Daniel", lastName: "Martinez", diagnosis: "Covid-19", department: "Isolation" },
];

const AllPatientModal = ({ visible, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPatients = dummyPatients.filter(
    (patient) =>
      `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Modal
      title="Select a Patient for Chat"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={550}
    >
      {/* Search Input */}
      <Search
        placeholder="Search patient by name, diagnosis, or department"
        enterButton={<SearchOutlined />}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: 15 }}
      />

      {/* Scrollable List */}
      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
        <List
          dataSource={filteredPatients}
          renderItem={(patient) => (
            <Card
              key={patient.id}
              size="small"
              style={{ marginBottom: 10, borderRadius: 8, background: "#fafafa" }}
            >
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar size={40} icon={<UserOutlined />} />}
                  title={<Text strong>{patient.firstName} {patient.lastName}</Text>}
                  description={
                    <>
                      <Text type="secondary">Diagnosis: {patient.diagnosis}</Text>
                      <br />
                      <Text type="secondary">Department: {patient.department}</Text>
                    </>
                  }
                />
                <BhmsButton block={false} outline size="medium" type="primary" icon={<MessageOutlined />}>Refer</BhmsButton>
              </List.Item>
            </Card>
          )}
        />

        {filteredPatients.length === 0 && <Text type="secondary">No patients found.</Text>}
      </div>
    </Modal>
  );
};

export default AllPatientModal;
