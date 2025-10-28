// LeaveRequestModal.js - Updated version
import React, { useState } from 'react';
import { 
  Modal,
  Form,
  Input, 
  DatePicker, 
  Select,
  Upload, 
  Button,
  Row, 
  Col,
  Spin
} from 'antd';


import { 
  FileTextOutlined, 
  PaperClipOutlined 
} from '@ant-design/icons';



const { TextArea } = Input;
const { RangePicker } = DatePicker;

const LeaveRequestModal = ({ visible, onCancel, onCreate, loading }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [leaveType, setLeaveType] = useState('Annual');

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      const leaveData = {
        leaveType: values.leaveType,
        startDate: values.dateRange[0].format('YYYY-MM-DD'),
        endDate: values.dateRange[1].format('YYYY-MM-DD'),
        reason: values.reason,
        ...(values.emergencyContact && { emergencyContact: values.emergencyContact }),
        // You'll need to handle file upload separately - this is just for the form data
        ...(fileList.length > 0 && { hasDocument: true })
      };
      
      onCreate(leaveData);
    } catch (error) {
      console.error('Validation Failed:', error);
    }
  };

  const uploadProps = {
    onRemove: file => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: file => {
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    onCancel();
  };

  return (
    <Modal
      title={<><FileTextOutlined /> New Leave Request</>}
      visible={visible}
      onCancel={handleCancel}
      onOk={handleSubmit}
      width={700}
      centered
      footer={[
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          onClick={handleSubmit}
          loading={loading}
        >
          Submit Request
        </Button>,
      ]}
    >
      {loading ? (
        <div className="flex justify-center py-8">
          <Spin />
        </div>
      ) : (
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="leaveType"
                label="Leave Type"
                rules={[{ required: true, message: 'Please select leave type' }]}
                initialValue="Annual"
              >
                <Select onChange={setLeaveType}>
                  <Select.Option value="Annual">Annual Leave</Select.Option>
                  <Select.Option value="Sick">Sick Leave</Select.Option>
                  <Select.Option value="Maternity">Maternity Leave</Select.Option>
                  <Select.Option value="Paternity">Paternity Leave</Select.Option>
                  <Select.Option value="Study">Study Leave</Select.Option>
                  <Select.Option value="Unpaid">Unpaid Leave</Select.Option>
                  <Select.Option value="Compensatory">Compensatory Leave</Select.Option>
                  <Select.Option value="Other">Other</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="dateRange"
                label="Date Range"
                rules={[{ required: true, message: 'Please select date range' }]}
              >
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="reason"
            label="Reason"
            rules={[{ required: true, message: 'Please provide a reason' }]}
          >
            <TextArea rows={4} placeholder="Explain the reason for your leave..." />
          </Form.Item>

          {['Sick', 'Maternity', 'Paternity', 'Study'].includes(leaveType) && (
            <Form.Item
              name="emergencyContact"
              label="Emergency Contact"
              rules={[{ required: true, message: 'Please provide emergency contact' }]}
            >
              <Input placeholder="Phone number of emergency contact" />
            </Form.Item>
          )}

          <Form.Item label="Supporting Document">
            <Upload {...uploadProps}>
              <Button icon={<PaperClipOutlined />}>Attach File</Button>
            </Upload>
            <div className="text-xs text-gray-500 mt-1">
              Max file size: 5MB (PDF, JPG, PNG)
            </div>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default LeaveRequestModal;