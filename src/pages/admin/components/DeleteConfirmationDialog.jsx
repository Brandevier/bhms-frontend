import React from "react";
import { Modal } from "antd";

const DeleteConfirmationDialog = ({ visible, onConfirm, onCancel, text }) => {
  return (
    <Modal
      title="Confirm Deletion"
      open={visible}
      onOk={onConfirm}
      onCancel={onCancel}
      okText="Yes, Delete"
      cancelText="Cancel"
    >
      <p>{text || "Are you sure you want to delete this item?"}</p>
    </Modal>
  );
};

export default DeleteConfirmationDialog;
