import React, { useState } from "react";
import { Modal, Form, Input, Select, InputNumber, Spin } from "antd";
import BhmsButton from "../../../heroComponents/BhmsButton";
const { TextArea } = Input;
const { Option } = Select;

const departmentTypes = [
  "Ward",
  "Consultation",
  'Labour Ward',
  'Antenatal Care (ANC)',
  'Postpartum Ward',
  'Neonatal Unit', 
  "Pharmacy",
  "Lab",
  "Records",
  "OPD",
  "Accounts",
  "HR",
  "Store",
  "Surgery",
  "Claims",
  "Information Manager",
  "Clerk"
];

const CreateDepartmentDialog = ({ visible, onClose, onCreate, loading }) => {
  const [form] = Form.useForm();
  const [selectedType, setSelectedType] = useState(null);
  const [searchText, setSearchText] = useState("");

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        onCreate(values);
        form.resetFields();
        setSelectedType(null);
        setSearchText("");
      })
      .catch((error) => {
        console.log("Validation Failed:", error);
      });
  };

  const handleCancel = () => {
    form.resetFields();
    setSelectedType(null);
    setSearchText("");
    onClose();
  };

  const filteredDepartmentTypes = departmentTypes.filter(type =>
    type.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Modal
      title="Create Department"
      open={visible}
      onCancel={handleCancel}
      footer={[
        <BhmsButton key="cancel" block={false} size="medium" outline={true} onClick={handleCancel}>
          Cancel
        </BhmsButton>,
        <BhmsButton 
          key="submit" 
          block={false} 
          size="medium" 
          type="primary" 
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <Spin size="small" /> : 'Create Department'}
        </BhmsButton>,
      ]}
    >
      <Form form={form} layout="vertical">
        {/* Department Name */}
        <Form.Item
          label="Department Name"
          name="name"
          rules={[
            { required: true, message: "Department name is required" },
            { min: 2, message: "Department name must be at least 2 characters" }
          ]}
        >
          <Input placeholder="Enter department name" />
        </Form.Item>

        {/* Department Type - Searchable Dropdown */}
        <Form.Item
          label="Department Type"
          name="departmentType"
          rules={[{ required: true, message: "Please select a department type" }]}
        >
          <Select
            showSearch
            placeholder="Search and select department type"
            optionFilterProp="children"
            onChange={(value) => setSelectedType(value)}
            onSearch={(value) => setSearchText(value)}
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
            allowClear
          >
            {filteredDepartmentTypes.map((type) => (
              <Option key={type} value={type}>
                {type}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Number of Beds (Only for Ward types) */}
        {(selectedType === "Ward" || selectedType === "Labour Ward" || 
          selectedType === "Postpartum Ward" || selectedType === "Neonatal Unit") && (
          <Form.Item
            label="Number of Beds"
            name="numberOfBeds"
            rules={[
              { required: true, message: "Please enter the number of beds" },
              { type: 'number', min: 1, message: "Number of beds must be at least 1" }
            ]}
          >
            <InputNumber 
              min={1} 
              placeholder="Enter number of beds" 
              style={{ width: "100%" }} 
            />
          </Form.Item>
        )}

        {/* Department Description */}
        <Form.Item 
          label="Description" 
          name="description"
          rules={[
            { required: true, message: "Description is required" },
            { min: 10, message: "Description must be at least 10 characters" },
            { max: 500, message: "Description cannot exceed 500 characters" }
          ]}
        >
          <TextArea 
            rows={4} 
            placeholder="Enter department description" 
            showCount 
            maxLength={500}
          />
        </Form.Item>

      
      </Form>
    </Modal>
  );
};

export default CreateDepartmentDialog;