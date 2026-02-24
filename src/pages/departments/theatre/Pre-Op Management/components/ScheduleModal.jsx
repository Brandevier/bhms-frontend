import React, { useState, useEffect } from 'react';
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
  Button,
  Spin
} from 'antd';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';

import { 
  createTheatreBooking, 
  updateTheatreBooking, 
  clearCurrentBooking,
  getAllOperatingRooms
} from '../../../../../redux/slice/theatreSlice';

const { Option } = Select;

const ScheduleModal = ({ visible, onCancel, currentSchedule }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { loading, operatingRooms, bookings } = useSelector((state) => state.theatre);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch operating rooms on mount
  useEffect(() => {
    if (visible) {
      dispatch(getAllOperatingRooms({ status: 'available' }));
    }
  }, [visible, dispatch]);

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);
      
      const bookingData = {
        visit_id: values.visit_id,
        procedure_names: values.procedure_names || [values.procedure_name],
        scheduled_date: values.scheduled_date ? values.scheduled_date.toISOString() : null,
        scheduled_time: values.scheduled_time,
        estimated_duration: values.estimated_duration,
        surgeon_id: values.surgeon_id,
        anaesthetist_id: values.anaesthetist_id,
        room_id: values.room_id,
        diagnosis_names: values.diagnosis_names || [],
        notes: values.notes,
        is_emergency: values.is_emergency || false,
        status: 'scheduled'
      };

      if (currentSchedule?.id) {
        await dispatch(updateTheatreBooking({ 
          id: currentSchedule.id, 
          updates: bookingData 
        })).unwrap();
        message.success('Schedule updated successfully');
      } else {
        await dispatch(createTheatreBooking(bookingData)).unwrap();
        message.success('Schedule created successfully');
      }

      onCancel();
      form.resetFields();
      setSelectedRoom(null);
    } catch (error) {
      message.error(error.message || error || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle room selection
  const handleRoomChange = (roomId) => {
    const room = operatingRooms.find(r => r.id === roomId);
    setSelectedRoom(room || null);
  };

  // Set form values when currentSchedule changes
  useEffect(() => {
    if (visible && currentSchedule) {
      form.setFieldsValue({
        ...currentSchedule,
        scheduled_date: currentSchedule.scheduled_date ? dayjs(currentSchedule.scheduled_date) : null,
        procedure_name: currentSchedule.procedure_names?.[0] || '',
      });
      if (currentSchedule.room_id) {
        handleRoomChange(currentSchedule.room_id);
      }
    } else if (visible) {
      form.resetFields();
      setSelectedRoom(null);
    }
  }, [visible, currentSchedule, form]);

  // Close handler
  const handleClose = () => {
    onCancel();
    form.resetFields();
    setSelectedRoom(null);
  };

  // Time slots for scheduling
  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00'
  ];

  // Duration options
  const durationOptions = [
    { value: 30, label: '30 minutes' },
    { value: 60, label: '1 hour' },
    { value: 90, label: '1.5 hours' },
    { value: 120, label: '2 hours' },
    { value: 180, label: '3 hours' },
    { value: 240, label: '4 hours' },
    { value: 300, label: '5 hours' },
    { value: 360, label: '6 hours' },
  ];

  return (
    <Modal
      title={currentSchedule ? 'Edit Surgery Schedule' : 'New Surgery Schedule'}
      open={visible}
      onCancel={handleClose}
      footer={null}
      width={900}
      destroyOnClose
      className="theatre-schedule-modal"
    >
      <Spin spinning={submitting}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            status: 'scheduled',
            is_emergency: false,
            estimated_duration: 60
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Patient Visit ID"
                name="visit_id"
                rules={[{ required: true, message: 'Please enter patient visit ID' }]}
              >
                <Input placeholder="Enter patient visit ID" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Procedure"
                name="procedure_name"
                rules={[{ required: true, message: 'Please enter the procedure' }]}
              >
                <Input placeholder="e.g. Laparoscopic Cholecystectomy" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Date"
                name="scheduled_date"
                rules={[{ required: true, message: 'Please select a date' }]}
              >
                <DatePicker 
                  style={{ width: '100%' }} 
                  disabledDate={(current) => current && current < dayjs().startOf('day')}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Time"
                name="scheduled_time"
                rules={[{ required: true, message: 'Please select a time' }]}
              >
                <Select placeholder="Select time">
                  {timeSlots.map(slot => (
                    <Option key={slot} value={slot}>
                      {slot}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Estimated Duration"
                name="estimated_duration"
              >
                <Select placeholder="Select duration">
                  {durationOptions.map(opt => (
                    <Option key={opt.value} value={opt.value}>
                      {opt.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Operating Room"
                name="room_id"
                rules={[{ required: true, message: 'Please select an operating room' }]}
              >
                <Select 
                  placeholder="Select operating room"
                  onChange={handleRoomChange}
                  showSearch
                  optionFilterProp="children"
                >
                  {operatingRooms.map(room => (
                    <Option key={room.id} value={room.id}>
                      {room.room_number} - {room.room_name || room.room_type}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Emergency Case"
                name="is_emergency"
                valuePropName="checked"
              >
                <Select>
                  <Option value={false}>No - Elective Surgery</Option>
                  <Option value={true}>Yes - Emergency Surgery</Option>
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
                <Select 
                  placeholder="Select surgeon"
                  showSearch
                  optionFilterProp="children"
                >
                  <Option value="surgeon-1">Dr. Smith (Cardiothoracic)</Option>
                  <Option value="surgeon-2">Dr. Johnson (Orthopedics)</Option>
                  <Option value="surgeon-3">Dr. Lee (Neurosurgery)</Option>
                  <Option value="surgeon-4">Dr. Williams (General Surgery)</Option>
                  <Option value="surgeon-5">Dr. Brown (Vascular)</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Anesthesiologist"
                name="anaesthetist_id"
                rules={[{ required: true, message: 'Please select an anesthesiologist' }]}
              >
                <Select 
                  placeholder="Select anesthesiologist"
                  showSearch
                  optionFilterProp="children"
                >
                  <Option value="anes-1">Dr. Wilson</Option>
                  <Option value="anes-2">Dr. Davis</Option>
                  <Option value="anes-3">Dr. Miller</Option>
                  <Option value="anes-4">Dr. Taylor</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Diagnosis"
            name="diagnosis_names"
          >
            <Select 
              mode="tags"
              placeholder="Enter diagnoses"
              style={{ width: '100%' }}
            />
          </Form.Item>

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
              <Button onClick={handleClose}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default ScheduleModal;

