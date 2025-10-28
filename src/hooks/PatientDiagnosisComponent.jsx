import React, { useState } from "react";
import { Card, List, Typography, Button, Space, Tag, Popconfirm, message, Empty, Badge } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { deleteDiagnosis } from "../redux/slice/diagnosisSlice";

const { Title, Text } = Typography;

const PatientDiagnosis = ({ diagnosis, onSubmit }) => {
  const dispatch = useDispatch();
  const [visibleCount, setVisibleCount] = useState(1);
  const [loadingId, setLoadingId] = useState(null);
  const { loading } = useSelector((state) => state.diagnosis);

  // Sort diagnoses by date (newest first)
  const sortedDiagnoses = [...(diagnosis || [])].sort((a, b) => 
    new Date(b.diagnosis_date) - new Date(a.diagnosis_date)
  );

  // Check if diagnosis is new (within last 7 days)
  const isNewDiagnosis = (date) => {
    return moment().diff(moment(date), 'days') <= 7;
  };

  const handleViewMore = () => {
    setVisibleCount(sortedDiagnoses.length);
  };

  const handleEdit = (diagnosis) => {
    console.log("Edit Diagnosis:", diagnosis);
  };

  const handleDelete = async (id) => {
    setLoadingId(id);
    try {
      await dispatch(deleteDiagnosis(id)).unwrap();
      message.success("Diagnosis deleted successfully");
      onSubmit();
    } catch (error) {
      message.error("Failed to delete diagnosis");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <Card style={{ margin: 20, borderRadius: 10 }}>
      <Title level={4}>Patient Diagnosis</Title>

      {sortedDiagnoses?.length === 0 ? (
        <Empty description="No diagnosis records available" />
      ) : (
        <List
          dataSource={sortedDiagnoses?.slice(0, visibleCount)}
          renderItem={(item) => (
            <Badge.Ribbon 
              text="New" 
              color="green" 
              placement="start"
              style={{ display: isNewDiagnosis(item.diagnosis_date) ? 'block' : 'none' }}
            >
              <Card 
                style={{ marginBottom: 10 }} 
                key={item.id}
                title={
                  <Space>
                    <Text strong>
                      {moment(item.diagnosis_date).format("MMM DD, YYYY")}
                    </Text>
                    {item.system_diagnosis_id && (
                      <Tag color="blue">System Diagnosis</Tag>
                    )}
                  </Space>
                }
              >
                <Space direction="vertical" style={{ width: "100%" }}>
                  {item.patient_complaint && (
                    <Text>
                      <strong>Patient Complaints:</strong> {item.patient_complaint}
                    </Text>
                  )}
                  
                  {item.notes && (
                   
                     <Tag color="red-inverse"> {item?.systemDiagnosis?.diagnosis_name}</Tag>
                  )}

                  <Text>
                    <strong>Status:</strong>{" "}
                    <Tag color={item.status === 'Active' ? 'green' : 'red'}>
                      {item.status}
                    </Tag>
                  </Text>

                  <Space>
                    <Button 
                      type="link" 
                      icon={<EditOutlined />} 
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </Button>

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
            </Badge.Ribbon>
          )}
        />
      )}

      {sortedDiagnoses?.length > 1 && visibleCount < sortedDiagnoses?.length && (
        <Button type="link" icon={<EyeOutlined />} onClick={handleViewMore}>
          View More
        </Button>
      )}
    </Card>
  );
};

export default PatientDiagnosis;