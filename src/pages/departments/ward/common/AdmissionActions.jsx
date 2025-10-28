import React, { useState } from 'react';
import { Button, Space, Popconfirm, Modal, message } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, FolderOpenOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { updateAdmissionStatus } from '../../../../redux/slice/admissionSlice';
import { useNavigate } from 'react-router-dom';

const AdmissionActions = ({ admission, user }) => {
  const dispatch = useDispatch();
  const [actionLoading, setActionLoading] = useState(false);
  const navigate = useNavigate();

  const handleStatusUpdate = async (status) => {
    console.log(admission)
    setActionLoading(true);
    try {
      await dispatch(updateAdmissionStatus({
        visit_id: admission.id,
        admission_status: status
      })).unwrap();
      
      message.success(`Admission ${status} successfully`);
    } catch (error) {
      message.error(`Failed to ${status} admission: ${error.message || 'Unknown error'}`);
    } finally {
      setActionLoading(false);
    }
  };

  const showStatusConfirmation = (status) => {
    const actionText = status === 'accepted' ? 'accept' : 'reject';
    const actionColor = status === 'accepted' ? 'green' : 'red';
    
    Modal.confirm({
      title: `Confirm ${actionText.charAt(0).toUpperCase() + actionText.slice(1)} Admission`,
      content: `Are you sure you want to ${actionText} this admission request for ${admission.patient?.first_name} ${admission.patient?.last_name}?`,
      okText: `Yes, ${actionText.charAt(0).toUpperCase() + actionText.slice(1)}`,
      cancelText: 'Cancel',
      okType: status === 'accepted' ? 'primary' : 'danger',
      onOk: () => handleStatusUpdate(status),
      icon: status === 'accepted' ? <CheckCircleOutlined /> : <CloseCircleOutlined />,
      okButtonProps: {
        style: status === 'accepted' ? { backgroundColor: '#52c41a', borderColor: '#52c41a' } : {}
      }
    });
  };

  const handleNavigate = () => {
    navigate(`/shared/patient/details/${admission.id}`, { 
      state: { 
        admissionId: admission.id,
        patientId: admission.patient_id 
      }
    });
  };

  // Hide actions for consultation department
  if (user.department === 'consultation') {
    return null;
  }

  return (
    <Space>
      {admission.admission_status === 'pending' && (
        <>
          <Popconfirm
            title="Accept Admission"
            description="Are you sure you want to accept this admission?"
            onConfirm={() => handleStatusUpdate('accepted')}
            okText="Yes"
            cancelText="No"
            okType="primary"
          >
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              loading={actionLoading}
              style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
            >
              Accept
            </Button>
          </Popconfirm>
          
          <Popconfirm
            title="Reject Admission"
            description="Are you sure you want to reject this admission?"
            onConfirm={() => handleStatusUpdate('rejected')}
            okText="Yes"
            cancelText="No"
            okType="danger"
          >
            <Button
              danger
              icon={<CloseCircleOutlined />}
              loading={actionLoading}
            >
              Reject
            </Button>
          </Popconfirm>
        </>
      )}
      
      {admission.admission_status === 'accepted' && (
        <Button 
          type="primary" 
          icon={<FolderOpenOutlined />}
          loading={actionLoading} 
          onClick={handleNavigate}
        >
          View Folder
        </Button>
      )}

      {admission.admission_status === 'rejected' && (
        <Button 
          type="dashed" 
          disabled
        >
          Rejected
        </Button>
      )}
    </Space>
  );
};

export default AdmissionActions;