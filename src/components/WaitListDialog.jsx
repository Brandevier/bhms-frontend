import React from "react";
import { Modal, Form, Input, message } from "antd";
import logo from "/assets/logo_2.png";
import BhmsButton from "../heroComponents/BhmsButton";
import { useDispatch, useSelector } from "react-redux";
import { addToWaitlist, resetWaitlistState } from "../redux/slice/waitlistSlice";

const WaitListDialog = ({ className, text }) => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const dispatch = useDispatch();
  const { loading, error, success, exists } = useSelector((state) => state.waitlist);

  const showModal = () => {
    setIsModalOpen(true);
    dispatch(resetWaitlistState()); // Reset state when modal opens
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const phoneNumber = values.phoneNumber;
        
        // Ensure phone number has country code
        if (!phoneNumber.startsWith('+')) {
          message.error("Please include country code (e.g. +233...)");
          return;
        }

        dispatch(addToWaitlist(phoneNumber));
      })
      .catch((info) => {
        console.log("Validation failed:", info);
      });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    dispatch(resetWaitlistState());
  };

  // Handle success/error notifications
  React.useEffect(() => {
    if (error) {
      message.error(error.message || "Failed to process your request");
    }
    
    if (success) {
      message.success("Demo request received! We'll contact you shortly.");
      setIsModalOpen(false);
      form.resetFields();
    }

    if (exists) {
      message.info("This number is already on our waitlist!");
    }
  }, [error, success, exists, form]);

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
          <BhmsButton 
            variant="outline" 
            key="back" 
            onClick={handleCancel} 
            disabled={loading}
          >
            Cancel
          </BhmsButton>,
          <BhmsButton
            key="submit"
            type="primary"
            onClick={handleOk}
            loading={loading}
            style={{ backgroundColor: "#19417D", borderColor: "#19417D" }}
          >
            {loading ? "Processing..." : "Request Demo"}
          </BhmsButton>,
        ]}
        destroyOnClose
      >
        {/* Form */}
        <Form form={form} layout="vertical">
          <Form.Item
            name="phoneNumber"
            label="Phone Number (with country code)"
            rules={[
              {
                required: true,
                message: "Please enter your phone number with country code!",
              },
              {
                pattern: /^\+\d{1,3}\d{9,15}$/,
                message: "Format: +[country code][number] (e.g. +233123456789)",
              },
            ]}
          >
            <Input 
              placeholder="+233123456789" 
              prefix="+"
              type="tel"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default WaitListDialog;