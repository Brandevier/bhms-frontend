import React, { useState } from 'react';
import { Form, Select, Typography } from 'antd';
import { debounce } from 'lodash';

const { Option } = Select;
const { Text } = Typography;

const MedicationSelector = ({ medications, onSelect, form }) => {
  const [filteredMeds, setFilteredMeds] = useState(medications || []);

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

  return (
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
          onSelect(option.med);
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
          <Option key={med.id} value={med.id} med={med}>
            <div style={{ padding: '8px 0' }}>
              <Text strong style={{ fontSize: '1rem' }}>{med.generic_name}</Text>
              <div>
                <Text type="secondary" style={{ fontSize: '0.85rem' }}>
                  {med.strength} • {med.price_ghc} GHC per {med.unit_of_pricing}
                </Text>
              </div>
            </div>
          </Option>
        ))}
      </Select>
    </Form.Item>
  );
};

export default MedicationSelector;