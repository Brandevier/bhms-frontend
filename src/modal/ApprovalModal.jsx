import React, { useState } from "react";
import { Modal, Input, Form, Button } from "antd";
import BhmsButton from "../heroComponents/BhmsButton";


const ApprovalModal = ({ visible, onClose, onApprove, itemName, batchNumber, maxQuantity }) => {
  const [form] = Form.useForm();

  const handleApprove = () => {
    form
      .validateFields()
      .then((values) => {
        onApprove(values.quantityIssued); // Pass the entered quantity
        form.resetFields();
      })
      .catch((info) => {
        console.error("Validation Failed:", info);
      });
  };

  return (
    <Modal 
      title="Approve Item Issuance"
      open={visible} 
      onCancel={onClose} 
      footer={null}
    >
      <Form form={form} layout="vertical">
        {/* Item Name (Disabled) */}
        <Form.Item label="Item Name">
          <Input value={itemName} disabled />
        </Form.Item>

        {/* Batch Number (Disabled) */}
        <Form.Item label="Batch Number">
          <Input value={batchNumber} disabled />
        </Form.Item>

        {/* Quantity Issued (Editable) */}
        <Form.Item 
          label="Quantity to Issue" 
          name="quantityIssued"
          rules={[
            { required: true, message: "Please enter quantity" },
          ]}
        >
          <Input type="number" placeholder={`Max: ${maxQuantity}`} />
        </Form.Item>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <BhmsButton block={false} size="medium" outline onClick={onClose}>Cancel</BhmsButton>
          <BhmsButton block={false} size="medium" type="primary" onClick={handleApprove}>Approve</BhmsButton>
        </div>
      </Form>
    </Modal>
  );
};

export default ApprovalModal;
