import React, { useState } from "react";
import { Modal, Form, Input, InputNumber, Slider, Row, Col, Spin } from "antd";
import { HeartOutlined, SmileOutlined, FireOutlined, DashboardOutlined } from "@ant-design/icons";
import BhmsButton from "../heroComponents/BhmsButton";

const VitalSignsModal = ({ visible, onClose, onSubmit, status }) => {
  const [form] = Form.useForm();
  const [painLevel, setPainLevel] = useState(1);
  const painEmojis = ["😀", "🙂", "😐", "😕", "😣", "😖", "😩", "😫", "😭", "🤕"];

  const handleSubmit = () => {
    form.validateFields()
      .then(values => {
        const vitalSigns = { ...values, pain: painLevel }; // Add pain level
        onSubmit(vitalSigns); // Pass validated values
        form.resetFields();
      })
      .catch(errorInfo => {
        console.error("Validation Failed:", errorInfo);
      });
  };

  return (
    <Modal
      title="Enter Vital Signs"
      open={visible}
      onCancel={onClose}
      width={720}
      footer={[
        <BhmsButton key="cancel" block={false} outline={true} size="medium" onClick={onClose}>
          Cancel
        </BhmsButton>,
        <BhmsButton key="submit" block={false} size="medium" onClick={handleSubmit} disabled={status === "loading"}>
          {status === "loading" ? <Spin /> : "Save"}
        </BhmsButton>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="oxygen"
              label="Oxygen Level"
              rules={[
                {
                  type: "number",
                  message: "Please enter a valid number",
                },
              ]}
            >
              <InputNumber
                addonAfter="%"
                style={{ width: "100%" }}
                placeholder="Enter oxygen level (numbers only)"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="SpO2"
              label="SpO2"
              rules={[
                {
                  type: "number",
                  message: "Please enter a valid number",
                },
              ]}
            >
              <InputNumber
                addonAfter="%"
                style={{ width: "100%" }}
                placeholder="Enter SpO2 (numbers only)"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="temperature"
              label="Temperature"
              rules={[
                {
                  type: "number",
                  message: "Please enter a valid number",
                },
              ]}
            >
              <InputNumber
                addonAfter={<FireOutlined />}
                style={{ width: "100%" }}
                placeholder="Enter temperature (numbers only)"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Blood Pressure">
              <Row gutter={8}>
                <Col span={12}>
                  <Form.Item
                    name="systole"
                    noStyle
                    rules={[
                      {
                        type: "number",
                        message: "Please enter a valid number",
                      },
                    ]}
                  >
                    <InputNumber
                      addonAfter="mmHg"
                      style={{ width: "100%" }}
                      placeholder="Systolic (numbers only)"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="diastole"
                    noStyle
                    rules={[
                      {
                        type: "number",
                        message: "Please enter a valid number",
                      },
                    ]}
                  >
                    <InputNumber
                      addonAfter="mmHg"
                      style={{ width: "100%" }}
                      placeholder="Diastolic (numbers only)"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="heart_rate"
              label="Heart Rate"
              rules={[
                {
                  type: "number",
                  message: "Please enter a valid number",
                },
              ]}
            >
              <InputNumber
                addonAfter={<HeartOutlined />}
                style={{ width: "100%" }}
                placeholder="Enter heart rate (numbers only)"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="pulse"
              label="Pulse"
              rules={[
                {
                  type: "number",
                  message: "Please enter a valid number",
                },
              ]}
            >
              <InputNumber
                addonAfter={<DashboardOutlined />}
                style={{ width: "100%" }}
                placeholder="Enter pulse (numbers only)"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="weight"
              label="Weight"
              rules={[
                {
                  type: "number",
                  message: "Please enter a valid number",
                },
              ]}
            >
              <InputNumber
                addonAfter="kg"
                style={{ width: "100%" }}
                placeholder="Enter weight (numbers only)"
                parser={(value) => value.replace(/[^\d.]/g, '')}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="height"
              label="Height"
              rules={[
                {
                  type: "number",
                  message: "Please enter a valid number",
                },
              ]}
            >
              <InputNumber
                addonAfter="cm"
                style={{ width: "100%" }}
                placeholder="Enter height (numbers only)"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="rbs"
              label="Random Blood Sugar (RBS)"
              rules={[
                {
                  type: "number",
                  message: "Please enter a valid number",
                },
              ]}
            >
              <InputNumber
                addonAfter="mg/dL"
                style={{ width: "100%" }}
                placeholder="Enter RBS (numbers only)"
                parser={(value) => value.replace(/[^\d.]/g, '')}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={`Pain Level ${painEmojis[painLevel - 1]}`}>
              <Slider min={1} max={10} value={painLevel} onChange={setPainLevel} tooltip={{ open: true }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default VitalSignsModal;