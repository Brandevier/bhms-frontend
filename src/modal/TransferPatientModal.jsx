import React, { useState } from "react";
import { Modal, Form, Select, Input, Checkbox, Button } from "antd";
import { useSelector } from "react-redux";
import BhmsButton from "../heroComponents/BhmsButton";


const { TextArea } = Input;

const TransferPatientModal = ({ visible, onClose, onSubmit}) => {
  const [form] = Form.useForm();
  const [checked, setChecked] = useState(false);
  const { institutions } = useSelector((state)=>state.transfer)
//020-8119668


  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (!checked) {
        return;
      }
      onSubmit(values);
      form.resetFields();
      setChecked(false);
    });
  };

  return (
    <Modal
      title="Transfer Patient"
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="targetInstitution"
          label="Target Institution"
          rules={[{ required: true, message: "Please select an institution" }]}
        >
          <Select placeholder="Select an institution">
            {institutions.map((inst) => (
              <Select.Option key={inst.id} value={inst.id}>
                {inst.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="note" label="Note">
          <TextArea rows={3} placeholder="Enter additional details (optional)" />
        </Form.Item>

        <Form.Item>
          <Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)}>
            I understand that the target institution will have access to all patient information.
          </Checkbox>
        </Form.Item>

        <Form.Item>
          <BhmsButton block={false} size="medium" type="primary" onClick={handleSubmit} disabled={!checked}>
            Transfer Patient
          </BhmsButton>
          <BhmsButton block={false} outline size="medium" onClick={onClose} style={{ marginLeft: 8 }}>
            Cancel
          </BhmsButton>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TransferPatientModal;
