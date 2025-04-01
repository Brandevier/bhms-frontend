import React, { useState, useEffect, useCallback } from "react";
import { Modal, Form, Input, InputNumber, List, Typography, Divider,Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { searchPrescription } from "../redux/slice/prescriptionSlice";
import { debounce } from "lodash";
import BhmsButton from "../heroComponents/BhmsButton";

const { TextArea } = Input;
const { Text } = Typography; 

const PrescriptionModal = ({ visible, onClose, onSave }) => {
  const dispatch = useDispatch();
  const { searchResults = [], status } = useSelector((state) => state.prescription);
  
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [form] = Form.useForm();

  // Debounced search
  const handleSearch = useCallback(
    debounce((value) => {
      if (value.trim().length > 0) {
        dispatch(searchPrescription(value));
      } else {
        // dispatch(clearSearchResults());
      }
    }, 300),
    [dispatch]
  );

  // Clear on close
  useEffect(() => {
    if (!visible) {
      setSearchValue("");
      setSelectedDrug(null);
      // dispatch(clearSearchResults());
      form.resetFields();
    }
  }, [visible, dispatch, form]);

  // Handle drug selection
  const handleDrugSelect = (drug) => {
    setSelectedDrug(drug);
    form.setFieldsValue({
      drug: drug["Drug Name"],
      form: drug.Form,
      dosage: drug.Dosage || "",
      notes: drug["Administration Cautions"] || ""
    });
  };

  const handleSubmit = () => {
    form.validateFields()
      .then((values) => {
        onSave(values);
        onClose();
      })
      .catch(console.error);
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
        <BhmsButton 
          key="submit" 
          block={false} 
          size="medium" 
          onClick={handleSubmit}
          disabled={!selectedDrug}
        >
          Save Prescription
        </BhmsButton>,
      ]}
      width={800}
    >
      <Form form={form} layout="vertical">
        {/* Search Section */}
        <div style={{ marginBottom: 24 }}>
          <Input
            placeholder="Type drug name (e.g., morphine)"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              handleSearch(e.target.value);
            }}
            allowClear
          />

          {/* Search Results */}
          {status === "succeeded" && (
            <div style={{ marginTop: 16, maxHeight: 300, overflowY: 'auto' }}>
              {searchResults.length > 0 ? (
                <List
                  dataSource={searchResults}
                  renderItem={(drug) => (
                    <List.Item 
                      onClick={() => handleDrugSelect(drug)}
                      style={{ 
                        cursor: 'pointer',
                        padding: 12,
                        backgroundColor: selectedDrug?.["Drug Name"] === drug["Drug Name"] ? '#e6f7ff' : 'transparent',
                        borderBottom: '1px solid #f0f0f0'
                      }}
                    >
                      <List.Item.Meta
                        title={<Text strong>{drug["Drug Name"]}</Text>}
                        description={
                          <>
                            <Text type="secondary">Form: {drug.Form}</Text>
                            {drug.Dosage && <Text type="secondary" style={{ display: 'block' }}>Dosage: {drug.Dosage}</Text>}
                            {drug["Administration Cautions"] && (
                              <Text type="secondary" style={{ display: 'block' }}>Cautions: {drug["Administration Cautions"]}</Text>
                            )}
                          </>
                        }
                      />
                    </List.Item>
                  )}
                />
              ) : searchValue && (
                <Text type="secondary" style={{ display: 'block', padding: 16, textAlign: 'center' }}>
                  No medications found for "{searchValue}"
                </Text>
              )}
            </div>
          )}
        </div>

        {/* Prescription Form */}
        {selectedDrug && (
          <>
            <Divider />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <Form.Item label="Drug Name" name="drug">
                  <Input disabled />
                </Form.Item>
                <Form.Item label="Form" name="form">
                  <Input disabled />
                </Form.Item>
                <Form.Item label="Dosage" name="dosage">
                  <Input placeholder="Enter dosage" />
                </Form.Item>
              </div>
              <div>
                <Form.Item label="Frequency" name="frequency" rules={[{ required: true }]}>
                  <Select placeholder="Select frequency">
                    <Option value="Once Daily">Once Daily</Option>
                    <Option value="Twice Daily">Twice Daily</Option>
                    <Option value="Three Times Daily">Three Times Daily</Option>
                  </Select>
                </Form.Item>
                <Form.Item label="Duration (Days)" name="duration" rules={[{ required: true }]}>
                  <InputNumber min={1} max={30} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label="Refills" name="refills">
                  <InputNumber min={0} max={5} style={{ width: '100%' }} />
                </Form.Item>
              </div>
            </div>
            <Form.Item label="Notes" name="notes">
              <TextArea rows={3} placeholder="Additional instructions..." />
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default PrescriptionModal;