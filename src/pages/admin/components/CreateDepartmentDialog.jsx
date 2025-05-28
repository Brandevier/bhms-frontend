import React, { useState } from "react";
import { Modal, Form, Input, Select, InputNumber, Spin } from "antd";
import BhmsButton from "../../../heroComponents/BhmsButton";
const { TextArea } = Input;
const { Option } = Select;

const departmentTypes = [
  "Ward",
  "Consultation",
  'Labour Ward',
  'Antenatal & Postnatal Ward',
  'Postpartum Ward',
  'Neonatal Unit', 
  "Pharmacy",
  "Lab",
  "Records",
  "OPD",
  "Accounts",
  "HR",
  "Store",
  "Surgery"
];

const CreateDepartmentDialog = ({ visible, onClose, onCreate, loading }) => {
  const [form] = Form.useForm();
  const [selectedType, setSelectedType] = useState(null);

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        onCreate(values);
        form.resetFields();
      })
      .catch((error) => {
        console.log("Validation Failed:", error);
      });
  };

  return (
    <Modal
      title="Create Department"
      open={visible}
      onCancel={onClose}
      footer={[
        <BhmsButton key="cancel" block={false} size="medium" outline={true} onClick={onClose}>
          Cancel
        </BhmsButton>,
        <BhmsButton key="submit" block={false} size="medium" type="primary" onClick={handleSubmit}>
          {loading ? <Spin /> : 'Create Department'}
        </BhmsButton>,
      ]}
    >
      <Form form={form} layout="vertical">
        {/* Department Name */}
        <Form.Item
          label="Department Name"
          name="name"
          rules={[{ required: true, message: "Department name is required" }]}
        >
          <Input placeholder="Enter department name" />
        </Form.Item>

        {/* Department Type */}
        <Form.Item
          label="Department Type"
          name="departmentType"
          rules={[{ required: true, message: "Please select a department type" }]}
        >
          <Select
            placeholder="Select department type"
            onChange={(value) => setSelectedType(value)}
          >
            {departmentTypes.map((type) => (
              <Option key={type} value={type}>
                {type}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Number of Beds (Only for Ward) */}
        {selectedType === "Ward" && (
          <Form.Item
            label="Number of Beds"
            name="numberOfBeds"
            rules={[{ required: true, message: "Please enter the number of beds" }]}
          >
            <InputNumber min={1} placeholder="Enter number of beds" style={{ width: "100%" }} />
          </Form.Item>
        )}

        {/* Department Description */}
        <Form.Item label="Description" name="description">
          <TextArea rows={4} placeholder="Enter department description" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateDepartmentDialog;
