import React, { useState, useEffect } from "react";
import { Modal, Form, Input, InputNumber, Select, Typography, Divider, Row, Col, Switch } from "antd";
import BhmsButton from "../heroComponents/BhmsButton";
import { debounce } from "lodash";

const { TextArea } = Input;
const { Text } = Typography;
const { Option } = Select;

const PrescriptionModal = ({ visible, onClose, onSave, medications }) => {
  const [form] = Form.useForm();
  const [filteredMeds, setFilteredMeds] = useState(medications || []);
  const [selectedDrug, setSelectedDrug] = useState(null);

  // Filter medications based on search input
  const handleSearch = debounce((value) => {
    if (!value) {
      setFilteredMeds(medications);
      return;
    }
    setFilteredMeds(
      medications.filter(med =>
        med.generic_name.toLowerCase().includes(value.toLowerCase())
      ));
  }, 300);

  // Clear form on close
  useEffect(() => {
    if (!visible) {
      form.resetFields();
      setSelectedDrug(null);
      setFilteredMeds(medications);
    }
  }, [visible, form, medications]);

  const handleSubmit = () => {
    form.validateFields()
      .then((values) => {
        onSave({
          ...values,
          selectedDrug
        });
        onClose();
      })
      .catch(console.error);
  };

  return (
    <Modal
      title={<span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Prescribe Medication</span>}
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
      bodyStyle={{ padding: '24px' }}
    >
      <Form form={form} layout="vertical">
        {/* Medication Search Section */}
        <div style={{ marginBottom: 24 }}>
          <Form.Item
            label={<span style={{ fontWeight: 500 }}>Select Medication</span>}
            name="medication_id"
            rules={[{ required: true, message: 'Please select a medication' }]}
          >
            <Select
              showSearch
              placeholder="Type to search medications..."
              defaultActiveFirstOption={false}
              showArrow={true}
              filterOption={false}
              onSearch={handleSearch}
              onChange={(value, option) => {
                console.log(value); // This will now log the ID
                setSelectedDrug(value); // No need for option.med.id
                form.setFieldsValue({
                  dosage: "",
                  notes: ""
                });
              }}
              notFoundContent={<div style={{ padding: 8, textAlign: 'center' }}>No medications found</div>}
              style={{ width: '100%' }}
              size="large"
            >
              {filteredMeds.map(med => (
                <Option key={med.id} value={med.id} med={med}> {/* Change value to med.id */}
                  <div style={{ padding: '8px 0' }}>
                    <Text strong style={{ fontSize: '1rem' }}>{med.generic_name}</Text>
                    <div>
                      <Text type="secondary" style={{ fontSize: '0.85rem' }}>
                        {med.price_ghc} GHC per {med.unit_of_pricing}
                      </Text>
                    </div>
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        {/* Prescription Details Section */}
        {selectedDrug && (
          <>
            <Divider style={{ margin: '16px 0' }} />

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label={<span style={{ fontWeight: 500 }}>Dosage</span>}
                  name="dosage"
                  rules={[
                    { required: true, message: 'Please enter dosage' },
                    {
                      validator: (_, value) =>
                        !isNaN(Number(value)) ? Promise.resolve() : Promise.reject('Must be a number')
                    }
                  ]}
                >
                  <InputNumber
                    min={1}
                    max={1000}
                    placeholder="500mg"
                    style={{ width: '100%' }}
                    size="large"
                    parser={(value) => value ? parseInt(value.replace(/\D/g, '')) : ''}
                    formatter={(value) => value ? `${value}`.replace(/\D/g, '') : ''}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label={<span style={{ fontWeight: 500 }}>Frequency (per day)</span>}
                  name="frequency"
                  rules={[
                    { required: true, message: 'Please enter frequency' },
                    {
                      type: 'number',
                      min: 1,
                      max: 4,
                      message: 'Must be between 1 and 4 times daily'
                    }
                  ]}
                >
                  <InputNumber
                    min={1}
                    max={4}
                    placeholder="Enter times per day"
                    style={{ width: '100%' }}
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label={<span style={{ fontWeight: 500 }}>Duration (Days)</span>}
                  name="duration"
                  rules={[
                    { required: true, message: 'Please enter duration' },
                    {
                      pattern: /^[1-9]\d*$/,
                      message: 'Please enter a positive whole number'
                    }
                  ]}
                >
                  <InputNumber
                    min={1}
                    max={90}
                    style={{ width: '100%' }}
                    size="large"
                    parser={(value) => value ? parseInt(value.replace(/\D/g, '')) : ''}
                    formatter={(value) => value ? `${value}`.replace(/\D/g, '') : ''}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label={<span style={{ fontWeight: 500 }}>Refills</span>}
                  name="refills"
                >
                  <InputNumber
                    min={0}
                    max={5}
                    style={{ width: '100%' }}
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label={<span style={{ fontWeight: 500 }}>Emergency Prescription</span>}
                  name="is_emergency"
                  valuePropName="checked"
                >
                  <Switch
                    checkedChildren="Yes"
                    unCheckedChildren="No"
                    style={{ marginLeft: 8 }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label={<span style={{ fontWeight: 500 }}>Notes</span>}
              name="notes"
            >
              <TextArea
                rows={4}
                placeholder="Additional instructions (e.g., take with food, avoid alcohol)"
                style={{ resize: 'vertical' }}
              />
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default PrescriptionModal;