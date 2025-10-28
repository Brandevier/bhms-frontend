import React, { useState } from 'react';
import { Form, InputNumber, Select, Row, Col, Alert, Button } from 'antd';

const { Option } = Select;

const DoseInput = ({ form, selectedDrug, onDoseChange }) => {
  const [doseUnitType, setDoseUnitType] = useState('tablets');
  const [showMassWarning, setShowMassWarning] = useState(false);
  const [calculatedUnits, setCalculatedUnits] = useState(null);

  const handleMassDoseCalculation = (massValue) => {
    if (!selectedDrug || !massValue) return;
    
    const strength = parseInt(selectedDrug.strength.match(/\d+/)[0]);
    const unitsPerDose = massValue / strength;
    
    if (unitsPerDose % 1 !== 0) {
      setShowMassWarning(true);
    } else {
      setShowMassWarning(false);
    }
    
    setCalculatedUnits(unitsPerDose);
    onDoseChange(unitsPerDose * form.getFieldValue('frequency') * form.getFieldValue('duration'));
  };

  return (
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item
          label={<span style={{ fontWeight: 500 }}>Dose Value</span>}
          name="doseValue"
          rules={[{ required: true, message: 'Please enter dose' }]}
        >
          <InputNumber
            min={0.1}
            max={1000}
            style={{ width: '100%' }}
            size="large"
            onChange={(value) => {
              if (doseUnitType === 'mg' || doseUnitType === 'ml') {
                handleMassDoseCalculation(value);
              }
            }}
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label={<span style={{ fontWeight: 500 }}>Dose Unit</span>}
          name="doseUnit"
          initialValue="tablets"
        >
          <Select
            style={{ width: '100%' }}
            size="large"
            onChange={(value) => setDoseUnitType(value)}
          >
            <Option value="tablets">Tablet(s)</Option>
            <Option value="capsules">Capsule(s)</Option>
            <Option value="ml">ml</Option>
            <Option value="mg">mg</Option>
          </Select>
        </Form.Item>
      </Col>
      {showMassWarning && (
        <Col span={24}>
          <Alert
            message={`Desired dose corresponds to ${calculatedUnits.toFixed(1)} tablets. Please adjust dose or confirm.`}
            type="warning"
            showIcon
            action={
              <Button size="small" type="primary" onClick={() => {
                form.setFieldsValue({ doseValue: calculatedUnits.toFixed(1) });
                setDoseUnitType('tablets');
                setShowMassWarning(false);
              }}>
                Use {calculatedUnits.toFixed(1)} tablets
              </Button>
            }
          />
        </Col>
      )}
    </Row>
  );
};

export default DoseInput;