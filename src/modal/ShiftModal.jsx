import React, { useState } from 'react';
import { 
  Modal, 
  Form, 
  Select, 
  TimePicker, 
  Input, 
  Button, 
  Space,
  message,
  Avatar,
  Row,
  Col
} from 'antd';
import { 
  UserOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  CloseOutlined,
  SaveOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { addShift } from '../redux/slice/shiftSlice';

const { Option } = Select;
const { TextArea } = Input;

const AddShiftModal = ({ visible, onCancel, staffList }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [selectedStaff, setSelectedStaff] = useState(null);
  const { loading } = useSelector((state) => state.shifts);

  const daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ];

  const shiftTypes = [
    'Morning',
    'Afternoon',
    'Night',
    'Off'
  ];

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      const shiftData = {
        staff_id: values.staff,
        day: values.day,
        shift: values.shiftType,
        start_time: values.timeRange?.[0]?.format('HH:mm:ss'),
        end_time: values.timeRange?.[1]?.format('HH:mm:ss'),
        notes: values.notes,
        institution_id: 1, // Replace with actual value
        department_id: 1  // Replace with actual value
      };

      await dispatch(addShift(shiftData)).unwrap();
      message.success('Shift added successfully!');
      form.resetFields();
      onCancel();
    } catch (error) {
      message.error(error.message || 'Failed to add shift');
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center">
          <CalendarOutlined className="text-blue-500 mr-2" />
          <span>Assign New Shift</span>
        </div>
      }
      visible={visible}
      onCancel={onCancel}
      width={600}
      footer={[
        <Button key="cancel" onClick={onCancel} icon={<CloseOutlined />}>
          Cancel
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          loading={loading}
          onClick={handleSubmit}
          icon={<SaveOutlined />}
        >
          Save Shift
        </Button>,
      ]}
      centered
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="staff"
              label="Select Staff Member"
              rules={[{ required: true, message: 'Please select a staff member' }]}
            >
              <Select
                showSearch
                placeholder="Search staff..."
                optionFilterProp="children"
                onChange={(value) => setSelectedStaff(staffList.find(staff => staff.id === value))}
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {staffList?.map(staff => (
                  <Option key={staff.id} value={staff.id}>
                    <div className="flex items-center">
                      <Avatar 
                        src={staff.photo} 
                        icon={<UserOutlined />}
                        size="small"
                        className="mr-2"
                      />
                      <span>
                        {staff.firstName} {staff.lastName} 
                        <span className="text-gray-500 ml-2">({staff.position})</span>
                      </span>
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {selectedStaff && (
          <div className="mb-4 p-3 bg-blue-50 rounded">
            <div className="flex items-center">
              <Avatar 
                src={selectedStaff.photo} 
                icon={<UserOutlined />}
                size="large"
                className="mr-3"
              />
              <div>
                <h4 className="font-medium mb-0">{selectedStaff.firstName} {selectedStaff.lastName}</h4>
                <p className="text-gray-600 mb-0">{selectedStaff.position}</p>
              </div>
            </div>
          </div>
        )}

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="day"
              label="Day of Week"
              rules={[{ required: true, message: 'Please select a day' }]}
            >
              <Select
                placeholder="Select day"
                suffixIcon={<CalendarOutlined />}
              >
                {daysOfWeek.map(day => (
                  <Option key={day} value={day}>{day}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="shiftType"
              label="Shift Type"
              rules={[{ required: true, message: 'Please select shift type' }]}
            >
              <Select placeholder="Select shift type">
                {shiftTypes.map(type => (
                  <Option key={type} value={type}>{type}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="timeRange"
              label="Time Range"
              rules={[{ required: true, message: 'Please select time range' }]}
            >
              <TimePicker.RangePicker
                format="HH:mm"
                style={{ width: '100%' }}
                suffixIcon={<ClockCircleOutlined />}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="notes"
          label="Additional Notes"
        >
          <TextArea rows={3} placeholder="Enter any additional notes..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddShiftModal;