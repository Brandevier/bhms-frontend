import React, { useState } from "react";
import { Typography, Space, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from 'react-responsive';
import { deletePrescription } from "../../redux/slice/prescriptionSlice";
import PrescriptionTable from "./common/PrescriptionTable";
import PrescriptionCard from "./common/PrescriptionCard";
import InterventionModal from "./common/InterventionModal";
import EditPrescriptionModal from "./common/EditPrescriptionModal";
import { updatePrescription } from "../../redux/slice/prescriptionSlice";


const { Title } = Typography;

const PrescriptionList = ({ prescriptionData, onRefresh }) => {
  const dispatch = useDispatch();
  const { status,updateLoading } = useSelector((state) => state.prescription); 
  const [loadingId, setLoadingId] = useState(null);
  const [interventionLoading, setInterventionLoading] = useState(null);
  const [selectedIntervention, setSelectedIntervention] = useState(null);
  const [editingPrescription, setEditingPrescription] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const handleDelete = async (id) => {
    setLoadingId(id);
    try {
      await dispatch(deletePrescription(id)).unwrap();
      message.success("Prescription deleted successfully");
      onRefresh();
    } catch (error) {
      message.error("Failed to delete prescription");
    } finally {
      setLoadingId(null);
    }
  };

  const handleEdit = (prescription) => {
    setEditingPrescription(prescription);
    setEditModalVisible(true);
  };

  // Update handler
  const handleUpdatePrescription = (updatedData) => {
    dispatch(updatePrescription(updatedData)).unwrap()
      .then(() => {
        message.success('Prescription updated successfully');
        setEditModalVisible(false);
      })
      .catch(() => message.error('Failed to update prescription'));
  };

  // const handleEdit = (prescription) => {
  //   console.log("Edit Prescription:", prescription);
  // };

  const handleViewIntervention = (intervention) => {
    setSelectedIntervention(intervention);
  };

  const handleInterventionResponse = async (interventionId, response) => {
    setInterventionLoading(interventionId);
    try {
      // Add your intervention response logic here
      message.success(`Intervention ${response} successfully`);
      setSelectedIntervention(null);
      onRefresh();
    } catch (error) {
      message.error(`Failed to ${response} intervention`);
    } finally {
      setInterventionLoading(null);
    }
  };

  return (
    <div style={{ padding: isMobile ? 10 : 20 }}>
      <Title level={4} style={{ marginBottom: 16 }}>Prescriptions</Title>

      {isMobile ? (
        <Space direction="vertical" style={{ width: '100%' }}>
          {prescriptionData?.map(record => (
            <PrescriptionCard
              key={record.id}
              record={record}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewIntervention={handleViewIntervention}
              loading={loadingId === record?.id}
            />
          ))}
        </Space>
      ) : (
        <PrescriptionTable
          data={prescriptionData}
          loading={status === "loading"}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewIntervention={handleViewIntervention}
          loadingId={loadingId}
        />
      )}

      <InterventionModal
        intervention={selectedIntervention}
        visible={!!selectedIntervention}
        onCancel={() => setSelectedIntervention(null)}
        onResponse={handleInterventionResponse}
        loading={interventionLoading === selectedIntervention?.id}
      />
      <EditPrescriptionModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        onUpdate={handleUpdatePrescription}
        editingPrescription={editingPrescription}
        loading={updateLoading}
      />
    </div>
  );
};

export default PrescriptionList;