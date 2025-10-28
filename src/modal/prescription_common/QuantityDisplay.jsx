import React, { useEffect, useState } from 'react';
import { Form, InputNumber } from 'antd';

const QuantityDisplay = ({ form }) => {
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    const subscription = form.watch((values) => {
      if (values.doseValue && values.frequency && values.duration) {
        const qty = values.doseValue * values.frequency * values.duration;
        setQuantity(Math.ceil(qty));
        form.setFieldsValue({ quantity: Math.ceil(qty) });
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <Form.Item
      label={<span style={{ fontWeight: 500 }}>Quantity</span>}
      name="quantity"
    >
      <InputNumber
        min={1}
        style={{ width: '100%' }}
        size="large"
        value={quantity}
        onChange={setQuantity}
      />
    </Form.Item>
  );
};

export default QuantityDisplay;