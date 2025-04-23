import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRequestedItems, approveDepartmentItemRequest, rejectDepartmentItemRequest } from "../../../redux/slice/inventorySlice";
import { Table, Button, Tag, message, Popconfirm, Spin } from "antd";
import moment from "moment";
import BhmsButton from "../../../heroComponents/BhmsButton";
import ApprovalModal from "../../../modal/ApprovalModal";
import { useMediaQuery } from "react-responsive";

const PendingRequests = () => {
  const { items, loading, rejectDepartmentItemLoading } = useSelector((state) => state.warehouse);
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectingRequestId, setRejectingRequestId] = useState(null);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    dispatch(fetchRequestedItems());
  }, [dispatch]);

  const statusColors = {
    pending: "orange",
    approved: "green",
    rejected: "red",
  };

  const openApprovalModal = (record) => {
    setSelectedRequest(record);
    setModalVisible(true);
  };

  const handleApprove = (quantity) => {
    const data = {
      request_id: selectedRequest.id,
      quantity_issued: quantity,
      department_id: selectedRequest.department_id,
    };

    dispatch(approveDepartmentItemRequest(data))
      .unwrap()
      .then(() => {
        message.success("Item issued successfully");
        setModalVisible(false);
      });
  };

  const handleReject = (record) => {
    setRejectingRequestId(record.id);
    const data = {
      request_id: record.id,
      reason: "Reason for rejection",
      department_id: record.department_id
    };

    dispatch(rejectDepartmentItemRequest(data))
      .unwrap()
      .then(() => {
        message.success("Item request rejected successfully");
      })
      .catch(() => {
        message.error("Error rejecting item request");
      })
      .finally(() => {
        setRejectingRequestId(null);
      });
  };

  // Mobile responsive columns
  const mobileColumns = [
    {
      title: "Item",
      dataIndex: ["batch", "batch_number"],
      key: "batch_number",
      render: (text, record) => (
        <div>
          <strong>{text || "Unknown Item"}</strong>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Dept: {record.department?.name}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Status: <Tag color={statusColors[record.status] || "default"}>{record.status.toUpperCase()}</Tag>
          </div>
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button 
            size="small" 
            type="primary" 
            onClick={() => openApprovalModal(record)}
          >
            Approve
          </Button>
          <Popconfirm
            title="Reject this request?"
            onConfirm={() => handleReject(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              size="small" 
              danger 
              disabled={rejectingRequestId === record.id}
            >
              {rejectingRequestId === record.id ? <Spin size="small" /> : "Reject"}
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  // Desktop columns
  const desktopColumns = [
    {
      title: "Item Name",
      dataIndex: ["batch", "batch_number"],
      key: "batch_number",
      render: (text) => <strong>{text || "Unknown Item"}</strong>,
    },
    {
      title: "Department",
      dataIndex: ["department", "name"],
      key: "department",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={statusColors[status] || "default"}>{status.toUpperCase()}</Tag>,
    },
    {
      title: "Requested By",
      dataIndex: ["requester", "lastName"],
      key: "requester",
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => moment(date).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <BhmsButton block={false} size="medium" type="primary" onClick={() => openApprovalModal(record)}>
            Approve
          </BhmsButton>
          <Popconfirm
            title="Are you sure you want to reject this request?"
            onConfirm={() => handleReject(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger disabled={rejectingRequestId === record.id}>
              {rejectingRequestId === record.id ? <Spin /> : "Reject"}
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: isMobile ? '8px' : '16px' }}>
      <h2>Pending Requests</h2>
      <Table
        columns={isMobile ? mobileColumns : desktopColumns}
        dataSource={items}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 5 }}
        scroll={isMobile ? { x: true } : undefined}
        size={isMobile ? "small" : "middle"}
      />

      {selectedRequest && (
        <ApprovalModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onApprove={handleApprove}
          itemName={selectedRequest.batch?.item?.name || "Unknown Item"}
          batchNumber={selectedRequest.batch?.batch_number || "N/A"}
          maxQuantity={selectedRequest.quantity_requested}
        />
      )}
    </div>
  );
};

export default PendingRequests;