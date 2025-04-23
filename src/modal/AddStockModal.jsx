import React from "react";
import { Modal, Form, Input, DatePicker, Row, Col, Select, Spin, Space } from "antd";
import BhmsButton from "../heroComponents/BhmsButton";
import { useMediaQuery } from "react-responsive";

const { Option } = Select;

const AddStockModal = ({ visible, onClose, onSubmit, loading }) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const handleFormSubmit = (values) => {
    const formattedValues = {
      ...values,
      purchase_date: values.purchase_date?.format("YYYY-MM-DD"),
      expiry_date: values.expiry_date?.format("YYYY-MM-DD"),
      unit_cost: values.unit_cost || 0,
    };
    onSubmit(formattedValues);
  };

  return (
    <Modal
      title="Add Stock Item"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={isMobile ? "90%" : 700}
    >
      <Form layout="vertical" onFinish={handleFormSubmit}>
        <Row gutter={isMobile ? 0 : 16}>
          <Col span={isMobile ? 24 : 12}>
            <Form.Item 
              name="name" 
              label="Name" 
              rules={[{ required: true, message: "Please enter the stock name" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={isMobile ? 24 : 12}>
            <Form.Item 
              name="supplier_name" 
              label="Supplier" 
              rules={[{ required: true, message: "Please enter the supplier name" }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={isMobile ? 0 : 16}>
          <Col span={isMobile ? 24 : 12}>
            <Form.Item 
              name="quantity" 
              label="Quantity" 
              rules={[{ required: true, message: "Please enter quantity" }]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col span={isMobile ? 24 : 12}>
            <Form.Item 
              name="purchase_date" 
              label="Purchase Date" 
              rules={[{ required: true, message: "Please select purchase date" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={isMobile ? 0 : 16}>
          <Col span={isMobile ? 24 : 12}>
            <Form.Item 
              name="expiry_date" 
              label="Expire Date" 
              rules={[{ required: true, message: "Please select expire date" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={isMobile ? 24 : 12}>
            <Form.Item 
              name="unit_cost" 
              label="Unit Cost" 
              initialValue={0} 
              rules={[{ required: true, message: "Please enter unit cost" }]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={isMobile ? 0 : 16}>
          <Col span={isMobile ? 24 : 12}>
            <Form.Item 
              name="category" 
              label="Category" 
              rules={[{ required: true, message: "Please select a category" }]}
            >
              <Select placeholder="Select category">
                <Option value="medical_equipment">Medical Equipment</Option>
                <Option value="consumables">Consumables</Option>
                <Option value="pharmaceuticals">Pharmaceuticals</Option>
                <Option value="laboratory_supplies">Laboratory Supplies</Option>
                <Option value="office_supplies">Office Supplies</Option>
                <Option value="cleaning_supplies">Cleaning Supplies</Option>
                <Option value="patient_care">Patient Care</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={isMobile ? 24 : 12}>
            <Form.Item name="description" label="Remarks">
              <Input.TextArea />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <BhmsButton 
              size="medium" 
              outline 
              onClick={onClose}
            >
              Cancel
            </BhmsButton>
            <BhmsButton 
              size="medium" 
              htmlType="submit" 
              disabled={loading}
            >
              {loading ? <Spin size="small" /> : 'Submit'}
            </BhmsButton>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddStockModal;