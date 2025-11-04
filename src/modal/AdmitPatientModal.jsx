import React, { useState, useEffect } from "react";
import { Modal, Tabs, Spin, message } from "antd";
import BhmsButton from "../heroComponents/BhmsButton";
import { useDispatch, useSelector } from "react-redux";
import { createTheatreBooking } from "../redux/slice/theatreSlice";
import { admitPatient } from "../redux/slice/admissionSlice";

// Import Tab Components
import RegularAdmissionForm from "./components/RegularAdmissionForm";
import TheatreAdmissionForm from "./components/TheatreAdmissionForm";
import TransferDepartmentForm from "./components/TransferDepartmentForm";

const AdmitPatientModal = ({ visible, onClose, onSubmit,visit_id }) => {
  const dispatch = useDispatch();
  const { loading: admissionLoading } = useSelector((state) => state.admission);
  const { loading: theatreLoading, error: theatreError, success: theatreSuccess } = useSelector((state) => state.theatre);
  
  const [activeTab, setActiveTab] = useState("1");
  const [submitting, setSubmitting] = useState(false);

  // Handle success and error messages
  useEffect(() => {
    if (theatreSuccess) {
      message.success('Theatre booking created successfully!');
      setSubmitting(false);
      onClose(); // Close modal on success
    }
    
    if (theatreError) {
      message.error(`Failed to create theatre booking: ${theatreError}`);
      setSubmitting(false);
    }
  }, [theatreSuccess, theatreError, onClose]);

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handleFormSubmit = async (values) => {
    setSubmitting(true);
    
    try {
      if (activeTab === "1") {
        // Regular Admission
        await dispatch(admitPatient(values)).unwrap();
        message.success('Patient admitted successfully!');
        onSubmit(values);
        onClose();
      } else if (activeTab === "2") {
        // Theatre Admission - Use the theatre slice
        const theatreData = {
          visit_id: visit_id, // You'll need to pass this from parent
          procedure_ids: values.procedure_ids,
          scheduled_date: values.scheduled_date,
          scheduled_time: values.scheduled_time,
          diagnosis_id: values.diagnosis_id,
          notes: values.surgery_notes,
          is_emergency: values.is_emergency_surgery,
          // Add other required fields for theatre booking
        };
        console.log('Submitting theatre booking data:', theatreData);
        
        await dispatch(createTheatreBooking(theatreData)).unwrap();
        // Success message is handled in the useEffect above
      } else if (activeTab === "3") {
        // Transfer Department - Just show info since we're not implementing submit
        message.info('Transfer department functionality is not yet implemented');
        setSubmitting(false);
        return;
      }
    } catch (error) {
      console.error('Submission error:', error);
      message.error(`Operation failed: ${error.message || 'Unknown error'}`);
      setSubmitting(false);
    }
  };

  // Determine which loading state to show
  const getLoadingState = () => {
    if (activeTab === "1") return admissionLoading;
    if (activeTab === "2") return theatreLoading;
    return false;
  };

  const getSubmitButtonText = () => {
    if (submitting || getLoadingState()) {
      return <Spin size="small" />;
    }
    
    switch (activeTab) {
      case "1": return 'Admit Patient';
      case "2": return 'Book Theatre';
      case "3": return 'Transfer Patient';
      default: return 'Submit';
    }
  };

  const tabItems = [
    {
      key: "1",
      label: "Regular Admission",
      children: <RegularAdmissionForm onSubmit={handleFormSubmit} />
    },
    {
      key: "2",
      label: "Theatre Admission",
      children: <TheatreAdmissionForm onSubmit={handleFormSubmit} />
    },
    {
      key: "3",
      label: "Transfer Department",
      children: <TransferDepartmentForm onSubmit={handleFormSubmit} />
    }
  ];

  const handleSubmit = () => {
    // Trigger form submission based on active tab
    const event = new Event('submitForm', { bubbles: true });
    document.dispatchEvent(event);
  };

  const handleModalClose = () => {
    setSubmitting(false);
    onClose();
  };

  return (
    <Modal
      title="Patient Admission"
      open={visible}
      onCancel={handleModalClose}
      footer={[
        <BhmsButton 
          block={false} 
          size="medium" 
          outline 
          key="cancel" 
          onClick={handleModalClose}
          disabled={submitting || getLoadingState()}
        >
          Cancel
        </BhmsButton>,
        <BhmsButton 
          key="submit" 
          type="primary" 
          block={false} 
          size="medium" 
          onClick={handleSubmit}
          loading={submitting || getLoadingState()}
          disabled={submitting || getLoadingState()}
        >
          {getSubmitButtonText()}
        </BhmsButton>,
      ]}
      width={600}
      closable={!submitting && !getLoadingState()}
      maskClosable={!submitting && !getLoadingState()}
    >
      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        items={tabItems}
        disabled={submitting || getLoadingState()}
      />
      
      {/* Loading overlay */}
      {(submitting || getLoadingState()) && (
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <Spin size="large" tip="Processing..." />
        </div>
      )}
    </Modal>
  );
};

export default AdmitPatientModal;