import React from "react";
import { Modal, Form, Input, message } from "antd";
import logo from "/assets/logo_2.png"; // Replace with the actual path to your logo
import BhmsButton from "../heroComponents/BhmsButton";

const WaitListDialog = ({ className, text }) => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        setLoading(true);
        console.log("Form values:", values); // Log form values for debugging
        
        // Simulate API call
        setTimeout(() => {
          setLoading(false);
          message.success("Demo request received! We'll contact you shortly.");
          setIsModalOpen(false);
          form.resetFields();
        }, 1500);
      })
      .catch((info) => {
        message.error("Please enter a valid phone number");
        console.log("Validation failed:", info);
      });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  return (
    <div>
      {/* Trigger Button */}
      <BhmsButton
        type="primary"
        onClick={showModal}
        variant="solid"
        size="medium"
        className={className}
      >
        {text || "Request Demo"}
      </BhmsButton>

      {/* Modal */}
      <Modal
        title={
          <div style={{ textAlign: "center" }}>
            <img
              src={logo}
              alt="Logo"
              style={{ width: "70px", marginBottom: "16px" }}
            />
            <h3 style={{ margin: 0, fontSize: "24px", fontWeight: "bold" }}>
              Request a Demo
            </h3>
          </div>
        }
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <BhmsButton variant="outline" key="back" onClick={handleCancel} disabled={loading}>
            Cancel
          </BhmsButton>,
          <BhmsButton
            key="submit"
            type="primary"
            onClick={handleOk}
            loading={loading}
            style={{ backgroundColor: "#19417D", borderColor: "#19417D" }}
          >
            Request Demo
          </BhmsButton>,
        ]}
      >
        {/* Form */}
        <Form form={form} layout="vertical">
          {/* Phone Number Field (only field now) */}
          <Form.Item
            name="phoneNumber"
            label="Phone Number"
            rules={[
              {
                required: true,
                message: "Please enter your phone number with country code!",
              },
              {
                pattern: /^(\+\d{1,3}[- ]?)?\d{10,15}$/,
                message: "Please enter a valid phone number!",
              },
            ]}
          >
            <Input placeholder="Please enter your phone number with country code!" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default WaitListDialog;