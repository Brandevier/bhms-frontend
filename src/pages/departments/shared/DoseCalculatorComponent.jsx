import React, { useState, useEffect } from "react";
import { InputNumber, Select, Typography, Divider, Form, Alert } from "antd";
import { 
  MedicineBoxOutlined, 
  ClockCircleOutlined, 
  CalendarOutlined,
  CalculatorOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { Title, Text } = Typography;

// Supported units and conversions
const UNIT_CONVERSIONS = {
  // Solid units
  tablet: { base: 1, type: 'solid' },
  capsule: { base: 1, type: 'solid' },
  pill: { base: 1, type: 'solid' },
  
  // Liquid units
  ml: { base: 1, type: 'liquid' },
  l: { base: 1000, type: 'liquid' },
  tsp: { base: 5, type: 'liquid' }, // teaspoon = 5ml
  tbsp: { base: 15, type: 'liquid' }, // tablespoon = 15ml
  
  // Weight units
  mg: { base: 1, type: 'weight' },
  g: { base: 1000, type: 'weight' },
  mcg: { base: 0.001, type: 'weight' },
  kg: { base: 1000000, type: 'weight' },
  
  // International units
  IU: { base: 1, type: 'iu' }
};

// Frequency options with standard medical abbreviations
const FREQUENCY_OPTIONS = [
  { value: 1, label: "Once daily (OD)" },
  { value: 2, label: "Twice daily (BD)" },
  { value: 3, label: "Three times daily (TID)" },
  { value: 4, label: "Four times daily (QID)" },
  { value: 6, label: "Every 4 hours (Q4H)" },
  { value: 8, label: "Every 3 hours (Q3H)" },
  { value: 12, label: "Every 2 hours (Q2H)" },
  { value: 24, label: "Hourly (Q1H)" },
  { value: 0.5, label: "Every other day (QOD)" },
  { value: 1/7, label: "Weekly" },
  { value: 1/30, label: "Monthly" }
];

const calculateDrugQuantity = ({
  dosage,
  dosageUnit,
  frequency,
  duration,
  strength,
  strengthUnit,
  drugForm
}) => {
  // Validate inputs
  if (!dosage || !frequency || !duration) return 0;
  
  // For solid forms (tablets/capsules) - simple calculation
  if (drugForm === 'solid') {
    return Math.ceil(dosage * frequency * duration);
  }
  
  // For medications dosed by weight/volume
  if (strength && strengthUnit && dosageUnit) {
    // Convert everything to base units for calculation
    const dosageInBase = dosage * (UNIT_CONVERSIONS[dosageUnit]?.base || 1);
    const strengthInBase = strength * (UNIT_CONVERSIONS[strengthUnit]?.base || 1);
    
    // Calculate required quantity
    const baseQuantity = (dosageInBase / strengthInBase) * frequency * duration;
    
    // Convert back to the original unit for display
    return Math.ceil(baseQuantity / (UNIT_CONVERSIONS[dosageUnit]?.base || 1));
  }
  
  // Default calculation for other cases
  return Math.ceil(dosage * frequency * duration);
};

export default function DoseCalculatorComponent({ medications }) {
  const [form] = Form.useForm();
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [calculationMethod, setCalculationMethod] = useState('simple');
  const [warning, setWarning] = useState(null);

  const updateCalculation = () => {
    try {
      const values = form.getFieldsValue();
      if (!values.dosage || !values.frequency || !values.duration) {
        setQuantity(0);
        return;
      }

      const qty = calculateDrugQuantity({
        dosage: values.dosage,
        dosageUnit: values.dosageUnit,
        frequency: values.frequency,
        duration: values.duration,
        strength: selectedDrug?.strength_value,
        strengthUnit: selectedDrug?.strength_unit,
        drugForm: selectedDrug?.unit_of_pricing_type
      });

      setQuantity(qty);
      
      // Set warnings for unusual doses
      if (values.frequency > 6) {
        setWarning('High frequency - confirm patient can adhere to this regimen');
      } else if (values.duration > 90) {
        setWarning('Long duration - consider splitting prescription');
      } else {
        setWarning(null);
      }
    } catch (error) {
      console.error('Calculation error:', error);
      setQuantity(0);
    }
  };

  useEffect(() => {
    updateCalculation();
  }, [selectedDrug]);

  const onDrugSelect = (code) => {
    const drug = medications.find((m) => m.code === code);
    setSelectedDrug(drug);
    
    form.setFieldsValue({
      dosageUnit: drug?.unit_of_pricing,
      strengthUnit: drug?.strength_unit,
      dosage: drug?.standard_dose,
      frequency: drug?.standard_frequency || 1
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-2xl">
      <div className="flex items-center mb-4">
        <MedicineBoxOutlined className="text-2xl mr-2 text-blue-600" />
        <Title level={4} className="mb-0">Drug Dose Calculator</Title>
      </div>
      
      <Form form={form} layout="vertical" onValuesChange={updateCalculation}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Form.Item 
              name="drug" 
              label="Select Medication"
              rules={[{ required: true, message: 'Please select a medication' }]}
            >
              <Select
                showSearch
                placeholder="Search medications..."
                optionFilterProp="children"
                onChange={onDrugSelect}
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {medications.map((m) => (
                  <Option key={m.code} value={m.code}>
                    <div className="flex justify-between">
                      <span>{m.generic_name}</span>
                      {m.strength_value && (
                        <span className="text-gray-500 ml-2">
                          {m.strength_value} {m.strength_unit}
                        </span>
                      )}
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {selectedDrug && (
              <div className="mb-4 p-3 bg-blue-50 rounded">
                <Text strong className="text-blue-800">
                  {selectedDrug.generic_name}
                </Text>
                {selectedDrug.strength_value && (
                  <Text className="block">
                    Strength: {selectedDrug.strength_value} {selectedDrug.strength_unit}
                  </Text>
                )}
                <Text className="block">
                  Form: {selectedDrug.unit_of_pricing}
                </Text>
                {selectedDrug.standard_dose && (
                  <Text className="block">
                    Standard dose: {selectedDrug.standard_dose} {selectedDrug.unit_of_pricing}
                  </Text>
                )}
              </div>
            )}
          </div>

          <div>
            <Form.Item 
              name="calculationMethod" 
              label="Calculation Method"
              initialValue="simple"
            >
              <Select onChange={setCalculationMethod}>
                <Option value="simple">Simple (Dose × Frequency × Duration)</Option>
                <Option value="advanced">Advanced (Weight-based/Concentration)</Option>
              </Select>
            </Form.Item>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <Form.Item 
                name="dosage" 
                label="Dose"
                rules={[{ required: true, message: 'Enter dose' }]}
              >
                <InputNumber 
                  min={0.1} 
                  step={0.1} 
                  precision={2}
                  style={{ width: '100%' }} 
                  addonAfter={
                    <Form.Item name="dosageUnit" noStyle initialValue="tablet">
                      <Select style={{ width: 80 }}>
                        {Object.keys(UNIT_CONVERSIONS).map(unit => (
                          <Option key={unit} value={unit}>{unit}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  }
                />
              </Form.Item>

              <Form.Item 
                name="frequency" 
                label="Frequency"
                rules={[{ required: true, message: 'Select frequency' }]}
              >
                <Select 
                  showSearch
                  placeholder="Frequency"
                  optionFilterProp="children"
                >
                  {FREQUENCY_OPTIONS.map(freq => (
                    <Option key={freq.value} value={freq.value}>
                      {freq.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item 
                name="duration" 
                label="Duration (days)"
                rules={[{ required: true, message: 'Enter duration' }]}
              >
                <InputNumber 
                  min={1} 
                  max={365} 
                  style={{ width: '100%' }} 
                />
              </Form.Item>
            </div>

            {calculationMethod === 'advanced' && selectedDrug?.strength_value && (
              <div className="grid grid-cols-2 gap-3 mb-4">
                <Form.Item 
                  name="strength" 
                  label="Drug Strength"
                  initialValue={selectedDrug.strength_value}
                >
                  <InputNumber 
                    disabled 
                    style={{ width: '100%' }} 
                  />
                </Form.Item>
                <Form.Item 
                  name="strengthUnit" 
                  label="Strength Unit"
                  initialValue={selectedDrug.strength_unit}
                >
                  <Select disabled>
                    {Object.keys(UNIT_CONVERSIONS).map(unit => (
                      <Option key={unit} value={unit}>{unit}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            )}
          </div>
        </div>

        <Divider />

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
          <div>
            <Text strong className="block text-gray-600">
              Calculated Quantity
            </Text>
            <div className="flex items-center mt-1">
              <CalculatorOutlined className="text-xl mr-2 text-blue-600" />
              <span className="text-2xl font-bold text-blue-800">
                {quantity} {selectedDrug?.unit_of_pricing || 'units'}
              </span>
            </div>
          </div>
          
          <div className="text-right">
            <Text type="secondary" className="block">
              <ClockCircleOutlined className="mr-1" />
              {form.getFieldValue('frequency') || 0}x per day
            </Text>
            <Text type="secondary" className="block">
              <CalendarOutlined className="mr-1" />
              {form.getFieldValue('duration') || 0} days
            </Text>
          </div>
        </div>

        {warning && (
          <Alert message={warning} type="warning" showIcon className="mt-4" />
        )}
      </Form>
    </div>
  );
}