import React, { useState } from "react";
import { Modal, Form, Input, DatePicker, Row, Col } from "antd";
import BhmsButton from "../heroComponents/BhmsButton";

const AddStockModal = ({ visible, onClose, onSubmit }) => {
  const handleFormSubmit = (values) => {
    const formattedValues = {
      ...values,
      purchase_date: values.purchase_date?.format("YYYY-MM-DD"),
      expire_date: values.expire_date?.format("YYYY-MM-DD"),
      issued_date: values.issued_date?.format("YYYY-MM-DD"),
      unitCost: values.unitCost || 0, // Ensure default value of 0
    };

    onSubmit(formattedValues);
    onClose();
  };

  return (
    <Modal
      title="Add Stock Item"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700} // Increased modal width
    >
      <Form layout="vertical" onFinish={handleFormSubmit}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="name" label="Name" rules={[{ required: true, message: "Please enter the stock name" }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="supplier_name" label="Supplier" rules={[{ required: true, message: "Please enter the supplier name" }]}>
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="quantity" label="Quantity" rules={[{ required: true, message: "Please enter quantity" }]}>
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="purchase_date" label="Purchase Date" rules={[{ required: true, message: "Please select purchase date" }]}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          
          <Col span={12}>
            <Form.Item name="expiry_date" label="Expire Date" rules={[{ required: true, message: "Please select expire date" }]}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="unit_cost" label="Unit Cost" initialValue={0} rules={[{ required: true, message: "Please enter unit cost" }]}>
              <Input type="number" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          
          <Col span={12}>
            <Form.Item name="description" label="Remarks">
              <Input.TextArea />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item style={{ display: "flex", justifyContent: "flex-end" }}>
          <BhmsButton block={false} size="medium" outline onClick={onClose} className="mx-2">
            Cancel
          </BhmsButton>
          <BhmsButton block={false} size="medium" htmlType="submit">
            Submit
          </BhmsButton>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddStockModal;
