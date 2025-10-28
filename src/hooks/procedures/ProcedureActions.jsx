import React, { useState } from "react";
import { Dropdown, Menu, Button, Select, Space, Modal } from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  LoadingOutlined,
  ExclamationCircleOutlined
} from "@ant-design/icons";

const { Option } = Select;

const statusOptions = [
  { value: 'pending', label: 'Pending', icon: <ClockCircleOutlined /> },
  { value: 'scheduled', label: 'Scheduled', icon: <ClockCircleOutlined /> },
  { value: 'ongoing', label: 'In Progress', icon: <ClockCircleOutlined /> },
  { value: 'completed', label: 'Completed', icon: <CheckOutlined /> },
  { value: 'canceled', label: 'Canceled', icon: <CloseOutlined /> },
];
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProcedureActions = ({ procedure, onStatusChange, onStaffChange }) => {
  const [selectedStatus, setSelectedStatus] = useState(procedure?.status || 'pending');
  const [showUpdateButton, setShowUpdateButton] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);
  
  const { loading } = useSelector((state) => state.procedure);
  const navigate = useNavigate();

  const handleStatusSelect = (value) => {
    setSelectedStatus(value);
    setShowUpdateButton(value !== procedure?.status);
  };

  const handleStatusUpdate = () => {
    if (!procedure?.id) return;
    
    setCurrentAction('status-update');
    onStatusChange(procedure.id, selectedStatus);
    setShowUpdateButton(false);
  };

  const handleCancelProcedure = () => {
    if (!procedure?.id) return;
    
    setCurrentAction('cancel');
    onStatusChange(procedure.id, 'canceled');
    setCancelModalVisible(false);
  };

  const handleMenuClick = (e) => {
    if (e.key === 'view') {
      navigate('/shared/procedure');
    } else if (e.key === 'cancel') {
      setCancelModalVisible(true);
    } else if (e.key === 'delete') {
      // Handle delete
      console.log('Delete procedure:', procedure?.id);
    }
  };

  const isUpdatingStatus = loading && currentAction === 'status-update';
  const isCanceling = loading && currentAction === 'cancel';

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="view" icon={<EyeOutlined />}>
        View Details
      </Menu.Item>
      <Menu.Item 
        key="cancel" 
        icon={isCanceling ? <LoadingOutlined /> : <CloseOutlined />}
        disabled={isCanceling || procedure?.status === 'canceled'}
      >
        {isCanceling ? 'Canceling...' : 'Cancel Procedure'}
      </Menu.Item>
      <Menu.Item 
        key="delete" 
        icon={<DeleteOutlined />} 
        danger
        disabled={procedure?.status === 'ongoing'}
      >
        Delete
      </Menu.Item>
    </Menu>
  );

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
      <Space>
        <Select
          value={selectedStatus}
          onChange={handleStatusSelect}
          style={{ width: 150 }}
          disabled={loading}
        >
          {statusOptions.map(option => (
            <Option key={option.value} value={option.value}>
              <Space>
                {option.icon}
                {option.label}
              </Space>
            </Option>
          ))}
        </Select>
        
        {showUpdateButton && (
          <Button 
            type="primary" 
            onClick={handleStatusUpdate}
            loading={isUpdatingStatus}
            icon={isUpdatingStatus ? <LoadingOutlined /> : null}
          >
            {isUpdatingStatus ? 'Updating...' : 'Update Status'}
          </Button>
        )}
      </Space>

      <Dropdown 
        overlay={menu} 
        trigger={['click']}
        disabled={loading}
      >
        <Button 
          type="text" 
          icon={loading ? <LoadingOutlined /> : <EllipsisOutlined />} 
          loading={loading}
        />
      </Dropdown>

      <Modal
        title="Confirm Cancellation"
        visible={cancelModalVisible}
        onOk={handleCancelProcedure}
        onCancel={() => setCancelModalVisible(false)}
        okText={isCanceling ? "Canceling..." : "Confirm Cancel"}
        okButtonProps={{ 
          danger: true,
          loading: isCanceling,
          icon: isCanceling ? <LoadingOutlined /> : null
        }}
        cancelButtonProps={{ disabled: isCanceling }}
      >
        <p>Are you sure you want to cancel this procedure?</p>
        {procedure?.status === 'completed' && (
          <p style={{ color: 'orange' }}>
            <ExclamationCircleOutlined /> Note: This procedure is already completed.
          </p>
        )}
      </Modal>
    </div>
  );
};

export default ProcedureActions;