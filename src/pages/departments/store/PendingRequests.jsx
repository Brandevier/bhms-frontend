import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRequestedItems, approveDepartmentItemRequest, rejectDepartmentItemRequest } from "../../../redux/slice/inventorySlice";
import { Table, Button, Tag, message, Popconfirm, Spin } from "antd";
import moment from "moment";
import BhmsButton from "../../../heroComponents/BhmsButton";
import ApprovalModal from "../../../modal/ApprovalModal";

const PendingRequests = () => {
  const { items, loading, rejectDepartmentItemLoading } = useSelector((state) => state.warehouse);
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectingRequestId, setRejectingRequestId] = useState(null); // Track request being rejected

  useEffect(() => {
    dispatch(fetchRequestedItems());
  }, [dispatch]);

  // Status Badge Colors
  const statusColors = {
    pending: "orange",
    approved: "green",
    rejected: "red",
  };

  // Open Modal for Approval
  const openApprovalModal = (record) => {
    setSelectedRequest(record);
    setModalVisible(true);
  };

  // Handle Approval Logic
  const handleApprove = (quantity) => {
    console.log("Approved request:", selectedRequest.id, "Quantity Issued:", quantity);
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

  // Handle Rejection Logic
  const handleReject = (record) => {
    console.log("Rejecting request:", record.id);
    setRejectingRequestId(record.id); // Set loading state for this request

    const data = {
      request_id: record.id,
      reason: "Reason for rejection",
      department_id:record.department_id
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
        setRejectingRequestId(null); // Reset loading state after request
      });
  };

  // Define Table Columns
  const columns = [
    {
      title: "Item Name",
      dataIndex: ["batch", "batch_number"], // Assuming `batch.batch_number` gives the item name
      key: "batch_number",
      render: (text) => <strong>{text || "Unknown Item"}</strong>,
    },
    {
      title: "Department",
      dataIndex: ["department", "name"],
      key: "department",
      render: (text) => <span>{text}</span>,
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
      render: (text) => <span>{text} </span>,
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
    <div>
      <h2>Pending Requests</h2>
      <Table columns={columns} dataSource={items} rowKey="id" loading={loading} pagination={{ pageSize: 5 }} />

      {/* Approval Modal */}
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
