import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Modal, Divider, Alert, Form, Card, Button, Tag } from "antd";
// import { fetchMedicationByCode } from "../../redux/slice/nhia_medicationsSlice";
import PrescriptionForm from "../../../modal/prescription_modals/PrescriptionForm";
import DrugSearch from "../../../modal/prescription_modals/DrugSearch";
import EmergencyToggle from "../../../modal/prescription_modals/EmergencyToggle";
import { fetchMedicationByCode } from "../../../redux/slice/nhia_medicationsSlice";



export default function EditPrescriptionModal({ 
  visible, 
  onClose, 
  onUpdate, 
  editingPrescription,
  loading = false 
}) {
  const [form] = Form.useForm();
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [isEmergency, setIsEmergency] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [medicationOptions, setMedicationOptions] = useState([]);
  const [currentPrescriptionText, setCurrentPrescriptionText] = useState("");
  const dispatch = useDispatch();

  // Initialize form with editing prescription data
  useEffect(() => {
    if (visible && editingPrescription) {
      const drug = editingPrescription.medicine || editingPrescription.medication_data;
      setSelectedDrug(drug);
      setIsEmergency(editingPrescription.is_emergency || false);
      
      // Populate form with existing data
      form.setFieldsValue({
        dosage: editingPrescription.dosage,
        frequency: editingPrescription.frequency,
        duration: editingPrescription.duration,
        notes: editingPrescription.notes || ''
      });

      // Generate initial prescription text
      updatePrescriptionText();
    }
  }, [visible, editingPrescription, form]);

  // Reset form when modal closes
  useEffect(() => {
    if (!visible) {
      form.resetFields();
      setSelectedDrug(null);
      setIsEmergency(false);
      setMedicationOptions([]);
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
    
    if (frequency) {
      const frequencyMap = {
        'once': 'Once daily',
        'twice': 'Twice daily', 
        'three_times': 'Three times daily',
        'four_times': 'Four times daily',
        'every_four_hours': 'Every 4 hours',
        'every_six_hours': 'Every 6 hours',
        'every_eight_hours': 'Every 8 hours',
        'every_twelve_hours': 'Every 12 hours',
        'as_needed': 'As needed',
        'bedtime': 'At bedtime'
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

  // Handle form submission
  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (!selectedDrug) {
        Alert.error("Please select a medication");
        return;
      }

      const updatedData = {
        ...editingPrescription,
        ...values,
        medication_id: selectedDrug.id,
        medication_data: selectedDrug,
        is_emergency: isEmergency,
        prescription_text: currentPrescriptionText
      };

      onUpdate(updatedData);
    }).catch(error => {
      console.error("Form validation failed:", error);
    });
  };

  // Format drug info display
  const formatDrugInfo = (drug) => {
    return (
      <div className="flex flex-wrap gap-2">
        <Tag color="blue" className="text-sm">
          {drug.generic_name || drug.name}
        </Tag>
        {drug.strength && (
          <Tag color="green" className="text-sm">
            Strength: {drug.strength}
          </Tag>
        )}
        <Tag color={drug.is_nhia_covered ? "green" : "red"} className="text-sm">
          NHIA: {drug.is_nhia_covered ? "Covered" : "Not Covered"}
        </Tag>
        {drug.is_nhia_covered && drug.nhia_price && (
          <Tag color="orange" className="text-sm">
            Price: GHC {drug.nhia_price}
          </Tag>
        )}
        {drug.unit_of_pricing && (
          <Tag color="purple" className="text-sm">
            Unit: {drug.unit_of_pricing}
          </Tag>
        )}
      </div>
    );
  };

  return (
    <Modal
      title={
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold">Edit Prescription</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      width={700}
      footer={null}
      confirmLoading={loading}
    >
      <div className="space-y-4">
        {/* Emergency Toggle */}
        <EmergencyToggle isEmergency={isEmergency} onChange={setIsEmergency} />

        {/* Current Prescription Form */}
        <Card title="Edit Prescription Details" size="small">
          <div className="space-y-4">
            {/* Drug Search - Allow changing medication if needed */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Medication {selectedDrug && <span className="text-gray-500">(Current selection)</span>}
              </label>
              <DrugSearch
                medications={medicationOptions}
                loading={searchLoading}
                onSearch={handleSearch}
                onSelect={handleDrugSelect}
                value={selectedDrug?.generic_name}
                placeholder="Search to change medication..."
              />
            </div>

            {/* Selected Drug Info Tags */}
            {selectedDrug && formatDrugInfo(selectedDrug)}

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
          </div>
        </Card>

        <Divider />

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-100"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-white rounded ${
              isEmergency ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
            }`}
            onClick={handleSubmit}
            disabled={!selectedDrug || !currentPrescriptionText || loading}
          >
            {loading ? "Updating..." : "Update Prescription"}
          </button>
        </div>
      </div>
    </Modal>
  );
}