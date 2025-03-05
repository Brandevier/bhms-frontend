import React, { useState } from "react";
import { Card, List, Typography, Button, Space, Tag, Popconfirm, message, Empty } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { deleteDiagnosis } from "../redux/slice/diagnosisSlice";

const { Title, Text } = Typography;

const PatientDiagnosis = ({ diagnosis,onSubmit }) => {
  const dispatch = useDispatch();
  const [visibleCount, setVisibleCount] = useState(1); // Show only the most recent by default
  const [loadingId, setLoadingId] = useState(null); // Track which diagnosis is being deleted
  const { loading } = useSelector((state) => state.diagnosis);

  // Show more diagnoses
  const handleViewMore = () => {
    setVisibleCount(diagnosis.length); // Show all
  };

  // Handle Edit Diagnosis
  const handleEdit = (diagnosis) => {
    console.log("Edit Diagnosis:", diagnosis);
    // Open Edit Form or Modal
  };

  // Handle Delete Diagnosis
  const handleDelete = async (id) => {
    setLoadingId(id);
    try {
      await dispatch(deleteDiagnosis(id)).unwrap(); // Ensure proper async handling
      message.success("Diagnosis deleted successfully");
      onSubmit()
    } catch (error) {
      message.error("Failed to delete diagnosis");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <Card style={{ margin: 20, borderRadius: 10 }}>
      <Title level={4}>Patient Diagnosis</Title>

      {diagnosis.length === 0 ? (
        <Empty description="No diagnosis records available" />
      ) : (
        <List
          dataSource={diagnosis.slice(0, visibleCount)} // Show limited diagnoses
          renderItem={(item) => (
            <Card style={{ marginBottom: 10 }} key={item.id}>
              <Space direction="vertical" style={{ width: "100%" }}>
                <Text>
                  <strong>Patient Complaints:</strong> {item.patient_complaints}
                </Text>
                <Text>
                  <strong>Diagnosis:</strong>{" "}
                  {item.diagnosis_name.map((d) => (
                    <Tag color="blue" key={d.code}>
                      {d.description}
                    </Tag>
                  ))}
                </Text>
                <Text>
                  <strong>Doctor:</strong> Dr. {item.staff?.lastName}
                </Text>
                <Text>
                  <strong>Observation:</strong> {item.doctors_observation}
                </Text>
                <Text>
                  <strong>Date:</strong> {moment(item.createdAt).format("MMM DD, YYYY")}
                </Text>
                <Space>
                  {/* Edit Button */}
                  <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(item)}>
                    Edit
                  </Button>

                  {/* Delete Button with Confirmation */}
                  <Popconfirm
                    title="Are you sure you want to delete this diagnosis?"
                    onConfirm={() => handleDelete(item.id)}
                    okText="Yes"
                    cancelText="No"
                    okButtonProps={{ danger: true }}
                  >
                    <Button
                      type="link"
                      danger
                      icon={<DeleteOutlined />}
                      loading={loadingId === item.id}
                    >
                      Delete
                    </Button>
                  </Popconfirm>
                </Space>
              </Space>
            </Card>
          )}
        />
      )}

      {/* Show "View More" Button if there are more diagnoses */}
      {diagnosis.length > 1 && visibleCount < diagnosis.length && (
        <Button type="link" icon={<EyeOutlined />} onClick={handleViewMore}>
          View More
        </Button>
      )}
    </Card>
  );
};

export default PatientDiagnosis;
