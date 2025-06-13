import React from 'react';
import { 
  Modal, 
  Form, 
  Input, 
  DatePicker, 
  Select, 
  Space, 
  Row, 
  Col,
  message,
  Button
} from 'antd';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';


import { createOrSchedule,updateOrSchedule,clearCurrentSchedule,fetchAvailableTimeSlots,clearAvailableSlots } from '../../../../../redux/slice/ORSlice';



const ScheduleModal = ({ visible, onCancel, currentSchedule }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { loading, availableSlots } = useSelector((state) => state.orScheduling);

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      const formattedValues = {
        ...values,
        scheduled_date: values.scheduled_date.format('YYYY-MM-DD'),
        scheduled_time: values.scheduled_time,
        institution_id: 'your-institution-id',
      };

      if (currentSchedule) {
        await dispatch(updateOrSchedule({ id: currentSchedule.id, updates: formattedValues })).unwrap();
        message.success('Schedule updated successfully');
      } else {
        await dispatch(createOrSchedule(formattedValues)).unwrap();
        message.success('Schedule created successfully');
      }

      onCancel();
      dispatch(clearCurrentSchedule());
      form.resetFields();
    } catch (error) {
      message.error(error.message || 'Operation failed');
    }
  };

  // Handle date change for available slots
  const handleDateChange = (date) => {
    if (date) {
      dispatch(fetchAvailableTimeSlots({ 
        date: date.format('YYYY-MM-DD'), 
        institution_id: 'your-institution-id' 
      }));
    } else {
      dispatch(clearAvailableSlots());
    }
  };

  // Set form values when currentSchedule changes
  React.useEffect(() => {
    if (currentSchedule) {
      form.setFieldsValue({
        ...currentSchedule,
        scheduled_date: dayjs(currentSchedule.scheduled_date),
        scheduled_time: currentSchedule.scheduled_time,
      });
    } else {
      form.resetFields();
    }
  }, [currentSchedule, form]);

  return (
    <Modal
      title={currentSchedule ? 'Edit Surgery Schedule' : 'New Surgery Schedule'}
      visible={visible}
      onCancel={() => {
        onCancel();
        dispatch(clearCurrentSchedule());
        form.resetFields();
      }}
      footer={null}
      width={800}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          status: 'Scheduled'
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Patient"
              name="patient_id"
              rules={[{ required: true, message: 'Please select a patient' }]}
            >
              <Select
                showSearch
                placeholder="Search patients"
                optionFilterProp="children"
              >
                <Option value="patient-1">John Doe (MRN: 12345)</Option>
                <Option value="patient-2">Jane Smith (MRN: 67890)</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Procedure"
              name="procedure"
              rules={[{ required: true, message: 'Please enter the procedure' }]}
            >
              <Input placeholder="e.g. Laparoscopic Cholecystectomy" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Date"
              name="scheduled_date"
              rules={[{ required: true, message: 'Please select a date' }]}
            >
              <DatePicker 
                style={{ width: '100%' }} 
                onChange={handleDateChange}
                disabledDate={(current) => current && current < dayjs().startOf('day')}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Time"
              name="scheduled_time"
              rules={[{ required: true, message: 'Please select a time' }]}
            >
              <Select
                placeholder="Select available time"
                notFoundContent={availableSlots.length === 0 ? 'No available slots' : null}
              >
                {availableSlots.map((slot, index) => (
                  <Option key={index} value={slot}>
                    {slot}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Surgeon"
              name="surgeon_id"
              rules={[{ required: true, message: 'Please select a surgeon' }]}
            >
              <Select placeholder="Select surgeon">
                <Option value="surgeon-1">Dr. Smith (Cardiothoracic)</Option>
                <Option value="surgeon-2">Dr. Johnson (Orthopedics)</Option>
                <Option value="surgeon-3">Dr. Lee (Neurosurgery)</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Anesthesiologist"
              name="anesthesiologist_id"
              rules={[{ required: true, message: 'Please select an anesthesiologist' }]}
            >
              <Select placeholder="Select anesthesiologist">
                <Option value="anes-1">Dr. Brown</Option>
                <Option value="anes-2">Dr. Wilson</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Notes"
          name="notes"
        >
          <Input.TextArea rows={3} placeholder="Any additional notes..." />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              {currentSchedule ? 'Update Schedule' : 'Create Schedule'}
            </Button>
            <Button 
              onClick={() => {
                onCancel();
                dispatch(clearCurrentSchedule());
                form.resetFields();
              }}
            >
              Cancel
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ScheduleModal;