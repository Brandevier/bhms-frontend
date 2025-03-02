import React, { useState } from "react";
import { Modal, Form, Select, InputNumber, Button, message, Spin } from "antd";
import { useSelector } from "react-redux";
import BhmsButton from "../heroComponents/BhmsButton";

const { Option } = Select;

const DistributeStocks = ({ visible, onClose, onSubmit, loading }) => {
  const { departments } = useSelector((state) => state.departments);
  const { stockItems } = useSelector((state) => state.warehouse);

  const [selectedItem, setSelectedItem] = useState(null);
  const [remainingQuantity, setRemainingQuantity] = useState(0);
  const [form] = Form.useForm();

  // Handle item selection
  const handleItemSelect = (value) => {
    const item = stockItems.stockItems.find((item) => item.id === value);
    if (item) {
      setSelectedItem(item);
      setRemainingQuantity(item.quantity);
    }
  };

  // Handle form submission
  const handleFinish = (values) => {
    if (values.quantity > remainingQuantity) {
      message.error("Entered quantity exceeds available stock!");
      return;
    }
    onSubmit(values);
    form.resetFields();
    setSelectedItem(null);
    setRemainingQuantity(0);
  };

  return (
    <Modal
      title="Distribute Stock"
      visible={visible}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form layout="vertical" form={form} onFinish={handleFinish}>
        {/* Select Department (Only Store Departments) */}
        <Form.Item
          name="department_id"
          label="Select Department"
          rules={[{ required: true, message: "Please select a department" }]}
        >
          <Select placeholder="Select Department">
            {departments
              .filter((dept) => dept.departmentType === "store") // ✅ Only store departments
              .map((dept) => (
                <Option key={dept.id} value={dept.id}>
                  {dept.name}
                </Option>
              ))}
          </Select>
        </Form.Item>

        {/* Select Item */}
        <Form.Item
          name="batch_id"
          label="Select Item"
          rules={[{ required: true, message: "Please select an item" }]}
        >
          <Select
            showSearch
            placeholder="Search and select item"
            onChange={handleItemSelect}
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {stockItems?.stockItems?.map((item) => (
              <Option key={item.id} value={item.id}>
                {item.item.name} (Batch: {item.batch_number})
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Show Remaining Quantity */}
        {selectedItem && (
          <div style={{ marginBottom: "10px" }}>
            <strong>Remaining Quantity:</strong> {remainingQuantity}
          </div>
        )}

        {/* Enter Quantity */}
        <Form.Item
          name="quantity"
          label="Enter Quantity"
          rules={[{ required: true, message: "Please enter quantity" }]}
        >
          <InputNumber
            min={1}
            max={remainingQuantity}
            style={{ width: "100%" }}
            placeholder="Enter quantity"
          />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <BhmsButton type="primary" htmlType="submit" block disabled={loading}>
            {loading ? <Spin /> : "Distribute"}
          </BhmsButton>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DistributeStocks;
