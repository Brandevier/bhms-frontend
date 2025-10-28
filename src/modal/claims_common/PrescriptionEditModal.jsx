import React, { useState, useEffect } from 'react';
import { Modal, Form, InputNumber, Select, Divider, Row, Col, Input, Switch, Alert } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { selectAllMedications,fetchMedications } from '../../redux/slice/nhia_medicationsSlice';


const { Option } = Select;
const { TextArea } = Input;

const PrescriptionEditModal = ({ 
  visible, 
  onCancel, 
  onSave, 
  currentPrescription 
}) => {
  const [form] = Form.useForm();
  const [quantity, setQuantity] = useState(0);
  const [isEmergency, setIsEmergency] = useState(false);
  const medications = useSelector(selectAllMedications);
  const dispatch = useDispatch()

  useEffect(() => {
    if (visible && currentPrescription) {
      form.setFieldsValue({
        medication: currentPrescription.gdrg_code,
        dosage: currentPrescription.dosage,
        doseUnitType: currentPrescription.unit_of_pricing,
        frequency: currentPrescription.frequency,
        duration: currentPrescription.duration,
        quantity: currentPrescription.quantity,
        route: currentPrescription.route,
        notes: currentPrescription.notes,
      });
      setQuantity(currentPrescription.quantity);
      setIsEmergency(currentPrescription.is_emergency || false);
       dispatch(fetchMedications({ page: 1, pageSize: 200 }));
    }
  }, [visible, currentPrescription]);

  const calculateQuantity = () => {
    const { dosage, frequency, duration } = form.getFieldsValue();
    if (!dosage || !frequency || !duration) return;

    let calculatedQty = dosage * frequency * duration;
    setQuantity(Math.ceil(calculatedQty));
    form.setFieldsValue({ quantity: Math.ceil(calculatedQty) });
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      onSave({
        ...values,
        is_emergency: isEmergency,
        quantity: quantity
      });
      onCancel();
    });
  };

  return (
    <Modal
      title="Edit Prescription"
      visible={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      width={800}
      okText="Update Prescription"
    >
      <Form form={form} layout="vertical" className="space-y-4">
        {/* Emergency Toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <span className="font-medium mr-2">Emergency Prescription:</span>
            <Switch
              checked={isEmergency}
              onChange={setIsEmergency}
              checkedChildren="Yes"
              unCheckedChildren="No"
            />
          </div>
          {isEmergency && (
            <Alert
              message="This prescription will be prioritized"
              type="error"
              showIcon
              className="flex-1 ml-4"
            />
          )}
        </div>

        {/* Medication Selection */}
        <Form.Item name="medication" label="Medication" rules={[{ required: true }]}>
          <Select
            showSearch
            placeholder="Search and select medication"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {medications.map(m => (
              <Option key={m.code} value={m.code}>
                {m.generic_name} ({m.strength})
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Dose, Frequency, Duration */}
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="dosage" label="Dose" rules={[{ required: true }]}>
              <InputNumber min={1} style={{ width: "100%" }} onChange={calculateQuantity} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="doseUnitType" label="Dose Unit" rules={[{ required: true }]}>
              <Select placeholder="Select unit" onChange={calculateQuantity}>
                <Option value="tablet(s)">Tablet(s)</Option>
                <Option value="ml">ml</Option>
                <Option value="mg">mg</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="frequency" label="Frequency (per day)" rules={[{ required: true }]}>
              <InputNumber min={1} max={24} style={{ width: "100%" }} onChange={calculateQuantity} />
            </Form.Item>
          </Col>
        </Row>

        {/* Duration, Quantity, Route */}
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="duration" label="Duration (days)" rules={[{ required: true }]}>
              <InputNumber min={1} max={90} style={{ width: "100%" }} onChange={calculateQuantity} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="quantity" label="Quantity to Dispense">
              <InputNumber value={quantity} disabled style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="route" label="Route">
              <Select placeholder="Select route">
                <Option value="oral">Oral</Option>
                <Option value="injection">Injection</Option>
                <Option value="topical">Topical</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* Special Instructions */}
        <Form.Item name="notes" label="Special Instructions">
          <TextArea rows={3} placeholder="Additional instructions (optional)" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PrescriptionEditModal;