import React, { useState } from "react";
import { Modal, Form, Select, Input, InputNumber, Button, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { searchPrescription } from "../redux/slice/prescriptionSlice";
import BhmsButton from "../heroComponents/BhmsButton";


const { Option } = Select;
const { TextArea } = Input;

const PrescriptionModal = ({ visible, onClose, onSave,loading }) => {
  const dispatch = useDispatch();
  const { results, status } = useSelector((state) => state.prescription);
  
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false); // Controls dropdown visibility
  const [form] = Form.useForm();

  // Handle Drug Search
  const handleSearch = (value) => {
    if (value.length > 2) {
      dispatch(searchPrescription(value));
      setDropdownOpen(true); // Open dropdown on search
    }
  };

  // Handle Drug Selection & Auto-fill Dosage
  const handleDrugSelect = (value) => {
    const index = results[1].indexOf(value);
    const drug = results[3]?.[index];
  
    // Ensure drug is an array and get the second item (dosage details)
    const availableDosages = Array.isArray(drug) && drug.length > 1 ? drug[1].split(", ") : [];
  
    setSelectedDrug(availableDosages);
    form.setFieldsValue({ dosage: availableDosages[0] || null }); // Set first dosage if available
  };
  

  // Handle Form Submission
  const handleSubmit = () => {
    form.validateFields()
      .then((values) => {
        onSave(values);
        form.resetFields();
        // onClose();
      })
      .catch((error) => console.log("Validation Failed:", error));
  };

  return (
    <Modal
      title="Prescribe Medication"
      open={visible}
      onCancel={onClose}
      footer={[
        <BhmsButton key="cancel" block={false} size="medium" outline onClick={onClose}>
          Cancel
        </BhmsButton>,
        <BhmsButton key="submit" block={false} size="medium" onClick={handleSubmit}>
         {status==="loading" ? <Spin/> : "Save Prescription"} 
        </BhmsButton>,
      ]}
      width={720} // Increase modal size
    >
      <Form form={form} layout="vertical">
        {/* Search & Select Drug */}
        <Form.Item label="Drug Name" name="drug" rules={[{ required: true, message: "Please select a drug" }]}>
          <Select
            showSearch
            placeholder="Search for a drug"
            onSearch={handleSearch}
            onSelect={handleDrugSelect}
            open={dropdownOpen}
            onDropdownVisibleChange={setDropdownOpen} // Control dropdown visibility
            notFoundContent={status === "loading" ? "Loading..." : "No results"}
            filterOption={false}
          >
            {results[1]?.map((drug, index) => (
              <Option key={drug} value={drug}>{drug}</Option>
            ))}
          </Select>
        </Form.Item>

        {/* Dosage Auto-fill */}
        <Form.Item label="Dosage" name="dosage" rules={[{ required: true, message: "Please select dosage" }]}>
          <Select placeholder="Select dosage" disabled={!selectedDrug}>
            {selectedDrug?.map((dose, index) => (
              <Option key={index} value={dose}>{dose}</Option>
            ))}
          </Select>
        </Form.Item>

        {/* Frequency & Duration */}
        <Form.Item label="Frequency" name="frequency" rules={[{ required: true, message: "Select frequency" }]}>
          <Select placeholder="Select frequency">
            <Option value="Once Daily">Once Daily</Option>
            <Option value="Twice Daily">Twice Daily</Option>
            <Option value="Three Times Daily">Three Times Daily</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Duration (Days)" name="duration" rules={[{ required: true, message: "Enter duration" }]}>
          <InputNumber min={1} max={30} style={{ width: "100%" }} />
        </Form.Item>

        {/* Refills */}
        <Form.Item label="Refills" name="refills">
          <InputNumber min={0} max={10} style={{ width: "100%" }} />
        </Form.Item>

        {/* Additional Notes */}
        <Form.Item label="Additional Notes" name="notes">
          <TextArea rows={3} placeholder="Add any extra instructions..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PrescriptionModal;
