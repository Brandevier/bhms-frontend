import React from 'react';
import { Row, Col, Form, Input, Button } from 'antd';

const { TextArea } = Input;

const ContactUs = () => {
  const onFinish = (values) => {
    console.log('Received values of form: ', values);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa', padding: '24px' }}>
      <Row gutter={24} style={{ width: '100%', maxWidth: '1200px', height: '100%' }}>
        <Col span={12} style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '8px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h2 style={{ marginBottom: '16px' }}>Contact Us</h2>
          <p style={{ marginBottom: '24px' }}>Email, call, or complete the form to learn how BrandeviaHMS+ can transform your healthcare delivery.</p>
          <p style={{ marginBottom: '16px' }}><strong>Email:</strong> info@brandeviahms.com</p>
          <p style={{ marginBottom: '16px' }}><strong>Phone:</strong> 321-221-231</p>
          <h3 style={{ marginBottom: '16px' }}>Customer Support</h3>
          <p style={{ marginBottom: '24px' }}>Our support team is available around the clock to address any concerns or queries you may have.</p>
          <h3 style={{ marginBottom: '16px' }}>Feedback and Suggestions</h3>
          <p style={{ marginBottom: '24px' }}>We value your feedback and are continuously working to improve BrandeviaHMS+. Your input is crucial in shaping the future of our platform.</p>
          <h3 style={{ marginBottom: '16px' }}>Media Inquiries</h3>
          <p>For media-related questions or press inquiries, please contact us at media@brandeviahms.com.</p>
        </Col>
        <Col span={12} style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '8px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h2 style={{ marginBottom: '24px' }}>Send Us a Message</h2>
          <Form onFinish={onFinish}>
            <Form.Item
              name="name"
              rules={[{ required: true, message: 'Please input your name!' }]}
            >
              <Input placeholder="Your Name" />
            </Form.Item>
            <Form.Item
              name="email"
              rules={[{ required: true, message: 'Please input your email!' }]}
            >
              <Input placeholder="Your Email" />
            </Form.Item>
            <Form.Item
              name="phone"
              rules={[{ required: true, message: 'Please input your phone number!' }]}
            >
              <Input placeholder="Your Phone Number" />
            </Form.Item>
            <Form.Item
              name="message"
              rules={[{ required: true, message: 'Please input your message!' }]}
            >
              <TextArea rows={4} placeholder="Your Message" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default ContactUs;