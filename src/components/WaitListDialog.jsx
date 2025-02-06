import React from "react";
import { Modal, Form, Input, Button, message } from "antd";
import logo from "/assets/logo.svg"; // Replace with the actual path to your logo
import { addToWaitlist } from "../redux/waitlistSlice";
import { useDispatch, useSelector } from "react-redux";

const WaitListDialog = ({ className, text }) => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.waitlist);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        console.log("Form values:", values); // Log form values for debugging
        // Dispatch the action to add the user to the waitlist
        dispatch(addToWaitlist({ email: values.email, hospitalName: values.hospitalName, phone_number: values.phoneNumber })).unwrap().then(() => {
          message.success("You have been added to the waitlist!");
          setIsModalOpen(false);
        });
      })
      .catch((info) => {
        message.error(info);
        console.log("Validation failed:", info);
      });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields(); // Reset the form fields when the modal is closed
  };

  React.useEffect(() => {
    if (success) {
      // Show success message when the user is added to the waitlist
      message.success("You have been successfully added to the waitlist!");
      setIsModalOpen(false); // Close the modal after successful submission
      form.resetFields(); // Reset the form fields
    }
  }, [success, form]);

  React.useEffect(() => {
    if (error) {
      console.log('error', error);
      // Show error message if there's an error during submission
      message.error(error.message);
    }
  }, [error]);

  return (
    <div>
      {/* Trigger Button */}
      <Button
        type="primary"
        onClick={showModal}
        style={{
          backgroundColor: "#19417D",
          borderColor: "#19417D",
          fontWeight: "medium",
        }}
        className={className}
      >
        {text || "Join Waitlist"}
      </Button>

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
              Join the Waitlist
            </h3>
          </div>
        }
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel} disabled={loading}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleOk}
            loading={loading} // Disable the button while loading
            style={{ backgroundColor: "#19417D", borderColor: "#19417D" }}
          >
            Join Waitlist
          </Button>,
        ]}
      >
        {/* Form */}
        <Form form={form} layout="vertical">
          {/* Email Field */}
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                message: "Please enter your email!",
              },
              {
                type: "email",
                message: "Please enter a valid email!",
              },
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          {/* Hospital/Institution Name Field */}
          <Form.Item
            name="hospitalName"
            label="Hospital/Institution Name"
            rules={[
              {
                required: true,
                message: "Please enter your hospital/institution name!",
              },
            ]}
          >
            <Input placeholder="Enter your hospital/institution name" />
          </Form.Item>

          {/* Phone Number Field */}
          <Form.Item
            name="phoneNumber"
            label="Phone Number"
            rules={[
              {
                required: true,
                message: "Please enter your phone number!",
              },
              {
                pattern: /^(\+\d{1,3}[- ]?)?\d{10,15}$/,
                message: "Please enter a valid phone number!",
              },
            ]}
          >
            <Input placeholder="Enter your phone number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default WaitListDialog;