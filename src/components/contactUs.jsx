import React, { useState } from "react";
import { Form, Input, Button, Card, Row, Col, message, Divider } from "antd";
import { motion } from "framer-motion";
import { 
  MailOutlined, 
  PhoneOutlined, 
  EnvironmentOutlined, 
  SendOutlined, 
  CheckOutlined 
} from "@ant-design/icons";

const { TextArea } = Input;

const ContactUs = () => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onFinish = async (values) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      message.success('Message sent successfully!');
      setIsSubmitted(true);
      form.resetFields();
    } catch (error) {
      message.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: <MailOutlined className="text-blue-500" />,
      title: "Email Us",
      content: ["support@tonitel.com",],
      color: "bg-blue-50"
    },
    
    {
      icon: <PhoneOutlined className="text-green-500" />,
      title: "Call Us or WhatsApp",
      content: ["+233 54 700 0364","+233 50 927 9792", "Mon-Fri, 8AM - 5PM GMT"],
      color: "bg-green-50"
    },
    {
      icon: <EnvironmentOutlined className="text-purple-500" />,
      title: "Visit Us",
      content: ["123 Healthcare Ave", "Accra, Ghana"],
      color: "bg-purple-50"
    }
  ];

  const faqs = [
    {
      question: "How quickly will I get a response?",
      answer: "Our team typically responds within 24 hours on business days."
    },
    {
      question: "Do you offer support for hospitals?",
      answer: "Yes! We provide dedicated support for healthcare institutions."
    },
    {
      question: "Can I schedule a demo?",
      answer: "Absolutely! Contact us to arrange a personalized demo."
    },
    {
      question: "Is Tonitel available internationally?",
      answer: "Currently serving Ghana, with expansion plans in progress."
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="py-16 bg-gradient-to-r from-blue-600 to-teal-500 text-white text-center"
      >
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Contact Tonitel</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Have questions about our healthcare solutions? We're here to help!
          </p>
        </div>
      </motion.section>

      {/* Contact Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <Row gutter={[24, 24]}>
          {/* Contact Methods */}
          <Col xs={24} md={12}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="space-y-6"
            >
              {contactMethods.map((method, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                >
                  <Card
                    className={`${method.color} border-0 shadow-sm`}
                  >
                    <div className="flex items-start">
                      <div className="p-3 rounded-full bg-white mr-4 shadow-sm">
                        {method.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-1">{method.title}</h3>
                        {method.content.map((text, i) => (
                          <p key={i} className="text-gray-700">{text}</p>
                        ))}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </Col>

          {/* Contact Form */}
          <Col xs={24} md={12}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <Card className="shadow-sm">
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                      <CheckOutlined className="text-green-600 text-2xl" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
                    <p className="text-gray-600">
                      Your message has been sent. Our team will respond within 24 hours.
                    </p>
                    <Button 
                      type="primary" 
                      className="mt-6"
                      onClick={() => setIsSubmitted(false)}
                    >
                      Send Another Message
                    </Button>
                  </motion.div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Send us a message</h2>
                    <Form
                      form={form}
                      layout="vertical"
                      onFinish={onFinish}
                    >
                      <Form.Item
                        name="name"
                        label="Full Name"
                        rules={[{ required: true, message: 'Please input your name' }]}
                      >
                        <Input size="large" />
                      </Form.Item>

                      <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                          { 
                            required: true, 
                            message: 'Please input your email' 
                          },
                          {
                            type: 'email',
                            message: 'Please enter a valid email',
                          },
                        ]}
                      >
                        <Input size="large" />
                      </Form.Item>

                      <Form.Item
                        name="message"
                        label="Message"
                        rules={[{ required: true, message: 'Please input your message' }]}
                      >
                        <TextArea rows={4} size="large" />
                      </Form.Item>

                      <Form.Item>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            icon={<SendOutlined />}
                            loading={isSubmitting}
                            block
                          >
                            Send Message
                          </Button>
                        </motion.div>
                      </Form.Item>
                    </Form>
                  </>
                )}
              </Card>
            </motion.div>
          </Col>
        </Row>

        {/* FAQ Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16"
        >
          <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">
            Frequently Asked Questions
          </h2>
          <Row gutter={[16, 16]}>
            {faqs.map((faq, index) => (
              <Col key={index} xs={24} sm={12}>
                <motion.div
                  whileHover={{ y: -3 }}
                >
                  <Card className="h-full">
                    <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.section>
      </div>
    </div>
  );
};

export default ContactUs;