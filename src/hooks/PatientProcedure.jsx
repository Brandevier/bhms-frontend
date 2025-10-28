import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProcedureList from "./procedures/ProcedureList";
import ProcedureStaffModal from "./procedures/ProcedureStaffModal";
import { updateProcedureStatus } from "../redux/slice/procedureSlice";


const PatientProcedure = ({ procedures, onDelete,visit_id,patient_id,claim_id }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.procedure);
  
  const [staffModalVisible, setStaffModalVisible] = useState(false);
  const [currentProcedure, setCurrentProcedure] = useState(null);

  const handleStatusChange = async (procedureId, newStatus) => {
    try {
      const data  = {
        procedure_id:procedureId, 
        status: newStatus,
        visit_id,
        patient_id,
        claim_id

      }
      await dispatch(updateProcedureStatus(data)).unwrap();
      
      // Optional: Show success message
      console.log('Status updated successfully',data);
      
    } catch (error) {
      console.error('Failed to update status:', error);
      // Optional: Show error message
    }
  };

  const handleStaffChange = async (procedureId, staffIds) => {
    try {
      
      console.log('Staff assigned successfully');
      
    } catch (error) {
      console.error('Failed to assign staff:', error);
    }
  };

  return (
    <div>
      <ProcedureList
        procedures={procedures}
        onStatusChange={handleStatusChange}
        onStaffChange={(procedureId) => {
          const procedure = procedures.find(p => p.id === procedureId);
          setCurrentProcedure(procedure);
          setStaffModalVisible(true);
        }}
        loading={loading}
      />

      {currentProcedure && (
        <ProcedureStaffModal
          visible={staffModalVisible}
          onCancel={() => setStaffModalVisible(false)}
          onOk={(staffIds) => {
            handleStaffChange(currentProcedure.id, staffIds);
            setStaffModalVisible(false);
          }}
          procedure={currentProcedure} // Pass the specific procedure, not the whole array
          availableStaff={[]} // Pass your staff list here
          loading={loading}
        />
      )}
    </div>
  );
};

export default PatientProcedure;