import React, { useEffect } from 'react';
import { Modal, Form, Input, DatePicker, TimePicker, Select, Button, message, Switch } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, FileTextOutlined, NotificationOutlined } from '@ant-design/icons';
import { createAppointment } from '../redux/slice/createBookingSlice';
import { useSelector, useDispatch } from 'react-redux';
import dayjs from 'dayjs'; // Make sure to import dayjs

const { TextArea } = Input;
const { Option } = Select;

const AppointmentModal = ({ visible, onCancel, onFinish, initialValues, visit_id }) => {
  const [form] = Form.useForm();
  const { loading } = useSelector((state) => state.appointment); 
  const dispatch = useDispatch();

  useEffect(() => {
    if (visible) {
      form.resetFields();
      if (initialValues) {
        // Convert string values back to dayjs objects for the form
        const formattedValues = {
          ...initialValues,
          appointment_date: initialValues.appointment_date ? dayjs(initialValues.appointment_date) : null,
          appointment_time: initialValues.appointment_time ? dayjs(initialValues.appointment_time, 'HH:mm') : null
        };
        form.setFieldsValue(formattedValues);
      }
    }
  }, [visible, form, initialValues]);

  const handleFormSubmit = (values) => {
    // Format the date and time values before sending to API
    const formattedValues = {
      ...values,
      appointment_date: values.appointment_date ? values.appointment_date.format('YYYY-MM-DD') : null,
      appointment_time: values.appointment_time ? values.appointment_time.format('HH:mm') : null,
      visit_id
    };

    dispatch(createAppointment(formattedValues))
      .then(() => {
        message.success('Appointment created successfully');
        onFinish();
        form.resetFields();
      })
      .catch((error) => {
        message.error('Failed to create appointment');
        console.error('Failed to create appointment:', error);
      });
  };

  return (
    <Modal
      title={<><CalendarOutlined /> {initialValues ? 'Edit Appointment' : 'New Appointment'}</>}
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          loading={loading} 
          onClick={() => form.submit()}
        >
          Submit
        </Button>,
      ]}
      width={600}
      centered
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ ...initialValues, send_reminder: true }}
        onFinish={handleFormSubmit}
      >
        <Form.Item
          name="appointment_date"
          label="Appointment Date"
          rules={[{ required: true, message: 'Please select appointment date' }]}
        >
          <DatePicker
            style={{ width: '100%' }}
            format="YYYY-MM-DD"
            suffixIcon={<CalendarOutlined />}
          />
        </Form.Item>

        <Form.Item
          name="appointment_time"
          label="Appointment Time"
          rules={[{ required: true, message: 'Please select appointment time' }]}
        >
          <TimePicker
            style={{ width: '100%' }}
            format="HH:mm"
            minuteStep={15}
            suffixIcon={<ClockCircleOutlined />}
          />
        </Form.Item>

        <Form.Item
          name="appointment_type"
          label="Appointment Type"
          rules={[{ required: true, message: 'Please select appointment type' }]}
        >
          <Select placeholder="Select appointment type">
            <Option value="consultation">Consultation</Option>
            <Option value="checkup">Checkup</Option>
            <Option value="emergency">Emergency</Option>
            <Option value="follow-up">Follow-up</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="reason"
          label="Reason"
          rules={[{ required: true, message: 'Please provide a reason' }]}
        >
          <TextArea
            rows={4}
            placeholder="Describe the reason for the appointment..."
          />
        </Form.Item>

        <Form.Item
          name="send_reminder"
          label="Send SMS Reminder"
          valuePropName="checked"
          extra="Toggle this switch to send an SMS reminder to the patient about their appointment."
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <NotificationOutlined style={{ marginRight: 8, color: '#1890ff' }} />
            <Switch 
              checkedChildren="On" 
              unCheckedChildren="Off" 
              defaultChecked 
            />
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AppointmentModal;