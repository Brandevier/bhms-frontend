import React, { useState } from "react";
import { Modal, Form, Select, Input, Button, Tag, Spin } from "antd";
import BhmsButton from "../heroComponents/BhmsButton";
import { useSelector } from "react-redux";

const { Option } = Select;
const { TextArea } = Input;

const AdmitPatientModal = ({ visible, onClose, onSubmit }) => {
  const { departments } = useSelector((state) => state.departments);
  const [form] = Form.useForm();
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const { loading } = useSelector((state)=>state.admission)

  // Get only departments that are "Ward"
  const wardDepartments = departments?.filter((dept) => dept.departmentType === "Ward");

  // Find beds for selected department
  const selectedBeds = selectedDepartment ? selectedDepartment.bed : [];

  // Handle Department Change
  const handleDepartmentChange = (deptId) => {
    const department = wardDepartments.find((dept) => dept.id === deptId);
    setSelectedDepartment(department || null);
    form.setFieldsValue({ bed_number: undefined }); // Reset bed selection
  };

  // Handle form submission
  const handleFinish = (values) => {
    onSubmit(values); // Pass admitted patient data to the parent component
    form.resetFields();
    
  };

  return (
    <Modal
      title="Admit Patient"
      open={visible}
      onCancel={onClose}
      footer={[
        <BhmsButton block={false} size="medium" outline key="cancel" onClick={onClose}>
          Cancel
        </BhmsButton>,
        <BhmsButton key="submit" type="primary" block={false} size="medium" onClick={() => form.submit()}>
         {loading ? <Spin/> :'Admit'}
        </BhmsButton>,
      ]}
      width={500} // Adjust width if needed
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        {/* Select Department */}
        <Form.Item label="Select Ward" name="department_id" rules={[{ required: true, message: "Please select a ward" }]}>
          <Select placeholder="Choose ward" onChange={handleDepartmentChange}>
            {wardDepartments.map((dept) => (
              <Option key={dept.id} value={dept.id}>
                {dept.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Select Bed Number */}
        {selectedDepartment && (
          <Form.Item label="Bed Number" name="bed_id" rules={[{ required: true, message: "Please select a bed" }]}>
            <Select placeholder="Choose bed number">
              {selectedBeds.map((bed) => (
                <Option key={bed.id} value={bed.id} disabled={bed.is_occupied}>
                  {bed.bed_number} -{" "}
                  {bed.is_occupied ? <Tag color="red">Occupied</Tag> : <Tag color="green">Available</Tag>}
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}

        {/* Description */}
        <Form.Item label="Description" name="note">
          <TextArea rows={3} placeholder="Enter additional notes..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AdmitPatientModal;
