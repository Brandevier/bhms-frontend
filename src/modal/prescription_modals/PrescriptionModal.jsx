import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Modal, Divider, Alert, Form, List, Button, Tag, Card } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { fetchMedicationByCode } from "../../redux/slice/nhia_medicationsSlice";
import DrugSearch from "./DrugSearch";
import EmergencyToggle from "./EmergencyToggle";
import PrescriptionForm from "./PrescriptionForm";

export default function PrescriptionModal({ visible, onClose, onSave, isBulk = false }) {
  const [form] = Form.useForm();
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [isEmergency, setIsEmergency] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [medicationOptions, setMedicationOptions] = useState([]);
  const [prescriptionItems, setPrescriptionItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [currentPrescriptionText, setCurrentPrescriptionText] = useState("");
  const dispatch = useDispatch();

  // Reset form when modal closes
  useEffect(() => {
    if (!visible) {
      form.resetFields();
      setSelectedDrug(null);
      setIsEmergency(false);
      setMedicationOptions([]);
      setPrescriptionItems([]);
      setEditingItem(null);
      setCurrentPrescriptionText("");
    }
  }, [visible, form]);

  // Handle drug search
  const handleSearch = async (value) => {
    if (!value) {
      setMedicationOptions([]);
      return;
    }

    try {
      setSearchLoading(true);
      const result = await dispatch(fetchMedicationByCode(value));
      const medications = result.payload || [];

      setMedicationOptions(medications);
    } finally {
      setSearchLoading(false);
    }
  };

  // When a drug is selected
  const handleDrugSelect = (value, option) => {
    const drug = option.data;
    setSelectedDrug(drug);

    // Auto-fill form fields
    form.setFieldsValue({
      dosage: "",
      frequency: null,
      duration: "",
      notes: ''
    });

    updatePrescriptionText();
  };

  // Update prescription text display when form values change
  const handleValuesChange = (changedValues, allValues) => {
    updatePrescriptionText();
  };

  // Generate prescription text like a doctor writes
  const updatePrescriptionText = () => {
    const values = form.getFieldsValue();
    const { dosage, frequency, duration, notes } = values;

    if (!selectedDrug) {
      setCurrentPrescriptionText("");
      return;
    }

    let prescriptionText = selectedDrug.generic_name || selectedDrug.name || "Unknown Medication";

    if (dosage) {
      prescriptionText += `\n${dosage}`;
    }
    // frequencyMap
    if (frequency) {
      const frequencyMap = {
        OD: "Once daily",
        BD: "Twice daily",
        TDS: "Three times daily",
        QID: "Four times daily",
        Q4H: "Every 4 hours",
        Q6H: "Every 6 hours",
        Q8H: "Every 8 hours",
        Q12H: "Every 12 hours",

        PRN: "As needed",
        STAT: "Immediately",
        HS: "At bedtime",
        AM: "Morning",
        PM: "Evening",
        AC: "Before meals",
        PC: "After meals",

        Q1H: "Every 1 hour",
        Q2H: "Every 2 hours",
        Q3H: "Every 3 hours",
        QW: "Once weekly",
        QM: "Once monthly"
      };

      prescriptionText += ` ${frequencyMap[frequency] || frequency}`;
    }

    if (duration) {
      prescriptionText += ` for ${duration}`;
    }

    if (notes) {
      prescriptionText += `\n${notes}`;
    }

    setCurrentPrescriptionText(prescriptionText);
  };

  // Add prescription item to the list
  const addPrescriptionItem = () => {
    form.validateFields().then((values) => {
      if (!selectedDrug) {
        Alert.error("Please select a medication first");
        return;
      }

      const prescriptionData = {
        id: editingItem ? editingItem.id : Date.now(),
        medication_id: selectedDrug.id,
        medication_data: selectedDrug,
        ...values,
        is_emergency: isEmergency,
        prescription_text: currentPrescriptionText
      };

      if (editingItem) {
        // Update existing item
        setPrescriptionItems(prev =>
          prev.map(item => item.id === editingItem.id ? prescriptionData : item)
        );
        setEditingItem(null);
      } else {
        // Add new item
        setPrescriptionItems(prev => [...prev, prescriptionData]);
      }

      // Reset form for next entry
      resetForm();
    }).catch(error => {
      console.error("Form validation failed:", error);
    });
  };

  // Reset form after adding/editing
  const resetForm = () => {
    setSelectedDrug(null);
    setCurrentPrescriptionText("");
    form.resetFields();
  };

  // Edit prescription item
  const editPrescriptionItem = (item) => {
    setSelectedDrug(item.medication_data);
    setEditingItem(item);

    // Populate form with item data
    form.setFieldsValue({
      dosage: item.dosage,
      frequency: item.frequency,
      duration: item.duration,
      notes: item.notes
    });
    console.log(item)

    setCurrentPrescriptionText(item.prescription_text);
  };

  // Remove prescription item
  const removePrescriptionItem = (id) => {
    setPrescriptionItems(prev => prev.filter(item => item.id !== id));
    if (editingItem && editingItem.id === id) {
      setEditingItem(null);
      resetForm();
    }
  };

  // Submit all prescriptions
  const handleSubmit = () => {
    if (prescriptionItems.length === 0) {
      Alert.error("Please add at least one prescription item");
      return;
    }

    onSave(prescriptionItems);
    console.log(prescriptionItems)
    onClose();
  };

  return (
    <Modal
      title={
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold">
            {isBulk ? 'Add Multiple Prescriptions' : 'Prescribe Medications'}
          </span>
          {isBulk && (
            <span className="text-sm text-gray-500">Step 1 of 3</span>
          )}
        </div>
      }
      open={visible}
      onCancel={onClose}
      width={800}
      footer={null}
    >
      <div className="space-y-4">
        {/* Emergency Toggle */}
        <EmergencyToggle isEmergency={isEmergency} onChange={setIsEmergency} />

        {/* Current Prescription Form */}
        <Card
          title={
            <div className="flex justify-between items-center">
              <span>{editingItem ? "Edit Prescription" : "Add New Prescription"}</span>
              {editingItem && (
                <Button
                  size="small"
                  onClick={() => {
                    setEditingItem(null);
                    resetForm();
                  }}
                >
                  Cancel Edit
                </Button>
              )}
            </div>
          }
          size="small"
        >
          <div className="space-y-4">
            {/* Drug Search */}
            <div>
              <label className="block text-sm font-medium mb-2">Search Medication</label>
              <DrugSearch
                medications={medicationOptions}
                loading={searchLoading}
                onSearch={handleSearch}
                onSelect={handleDrugSelect}
                value={selectedDrug?.generic_name}
              />
            </div>

            {/* Selected Drug Info Tags */}
            {selectedDrug && (
              <div className="flex flex-wrap gap-2">
                <Tag color="blue" className="text-sm">
                  {selectedDrug.generic_name || selectedDrug.name}
                </Tag>
                {selectedDrug.strength && (
                  <Tag color="green" className="text-sm">
                    Strength: {selectedDrug.strength}
                  </Tag>
                )}
                <Tag color={selectedDrug.is_nhia_covered ? "green" : "red"} className="text-sm">
                  NHIA: {selectedDrug.is_nhia_covered ? "Covered" : "Not Covered"}
                </Tag>
                {selectedDrug.is_nhia_covered && selectedDrug.nhia_price && (
                  <Tag color="orange" className="text-sm">
                    Price: GHC {selectedDrug.nhia_price}
                  </Tag>
                )}
                {selectedDrug.unit_of_pricing && (
                  <Tag color="purple" className="text-sm">
                    Unit: {selectedDrug.unit_of_pricing}
                  </Tag>
                )}
              </div>
            )}

            {/* Prescription Preview */}
            {currentPrescriptionText && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-sm font-semibold text-blue-800 mb-2">Prescription Preview:</div>
                <pre className="whitespace-pre-wrap font-sans text-sm text-blue-900">
                  {currentPrescriptionText}
                </pre>
              </div>
            )}

            {/* Prescription Form */}
            <PrescriptionForm
              form={form}
              selectedDrug={selectedDrug}
              onValuesChange={handleValuesChange}
            />

            {/* Add/Update Button */}
            <div className="flex justify-end">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={addPrescriptionItem}
                disabled={!selectedDrug || !currentPrescriptionText}
              >
                {editingItem ? "Update Prescription" : "Add to List"}
              </Button>
            </div>
          </div>
        </Card>

        {/* Prescription List */}
        {prescriptionItems.length > 0 && (
          <Card title={`Prescription List (${prescriptionItems.length} items)`} size="small">
            <List
              dataSource={prescriptionItems}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button
                      type="link"
                      icon={<EditOutlined />}
                      onClick={() => editPrescriptionItem(item)}
                    >
                      Edit
                    </Button>,
                    <Button
                      type="link"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => removePrescriptionItem(item.id)}
                    >
                      Remove
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-semibold">
                          {item.medication_data?.generic_name || item.medication_data?.name}
                        </span>
                        {item.is_emergency && (
                          <Tag color="red">Emergency</Tag>
                        )}
                        <Tag color={item.medication_data?.is_nhia_covered ? "green" : "red"} size="small">
                          NHIA: {item.medication_data?.is_nhia_covered ? "Covered" : "Not Covered"}
                        </Tag>
                      </div>
                    }
                    description={
                      <pre className="whitespace-pre-wrap font-sans text-sm">
                        {item.prescription_text}
                      </pre>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        )}

        <Divider />

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {prescriptionItems.length} medication(s) added
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-100"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-white rounded ${isEmergency ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
                }`}
              onClick={handleSubmit}
              disabled={prescriptionItems.length === 0}
            >
              {isEmergency ? `Save ${prescriptionItems.length} Emergency Prescriptions` : `Prescribe ${prescriptionItems.length} Medications`}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}