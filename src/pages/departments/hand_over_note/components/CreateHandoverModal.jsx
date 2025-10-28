import React from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Row,
  Col,
  Typography,
  message
} from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  FileTextOutlined
} from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

const CreateHandoverModal = ({
  visible,
  onCancel,
  onSave,
  loading,
  staffList = [], // Default to empty array
  patientsList = [] // Default to empty array
}) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSave(values);
      form.resetFields();
    } catch (error) {
      message.error('Please fill all required fields');
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  // Safe array access with fallbacks
  const safePatientsList = Array.isArray(patientsList) ? patientsList : [];
  const safeStaffList = Array.isArray(staffList) ? staffList : [];

  return (
    <Modal
      title={
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
            <TeamOutlined className="text-white text-xl" />
          </div>
          <div>
            <Title level={4} className="m-0 text-gray-800">
              Create Handover Note
            </Title>
            <Text type="secondary" className="text-sm">
              Transfer patient care responsibilities
            </Text>
          </div>
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      width={800}
      footer={[
        <Button key="cancel" onClick={handleCancel} size="large">
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
          loading={loading}
          size="large"
          className="bg-gradient-to-r from-blue-500 to-purple-500 border-0 hover:from-blue-600 hover:to-purple-600"
        >
          Create Handover
        </Button>,
      ]}
      className="handover-modal"
    >
      <Form
        form={form}
        layout="vertical"
        className="mt-6"
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Patient"
              name="visit_id"
              rules={[{ required: true, message: 'Please select a patient' }]}
            >
              <Select
                placeholder="Select patient"
                size="large"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option?.children?.toLowerCase?.().includes(input.toLowerCase())
                }
                notFoundContent={safePatientsList.length === 0 ? "No patients available" : undefined}
              >
                {safePatientsList.map((item) => {
                  const patient = item.patient || {}; // nested patient info
                  const fullName = `${patient.first_name || ''} ${patient.middle_name || ''} ${patient.last_name || ''}`.trim();
                  return (
                    <Option key={item.id} value={item.id}>
                      {fullName || 'Unnamed Patient'} ({item.visit_type || 'N/A'})
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>

          </Col>
          <Col span={12}>
            <Form.Item
              label="Shift"
              name="shift"
              rules={[{ required: true, message: 'Please select shift' }]}
            >
              <Select placeholder="Select shift" size="large">
                <Option value="morning">🌅 Morning Shift</Option>
                <Option value="afternoon">☀️ Afternoon Shift</Option>
                <Option value="night">🌙 Night Shift</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Handover To"
              name="to_nurse_id"
            >
              <Select
                placeholder="Select receiving nurse"
                size="large"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                notFoundContent={safeStaffList.length === 0 ? "No staff available" : undefined}
              >
                {safeStaffList.map(nurse => (
                  <Option key={nurse.id} value={nurse.id}>
                    {nurse.firstName || 'Unknown'} {nurse.lastName || 'Nurse'}
                    {nurse.position ? ` (${nurse.position})` : ''}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Status"
              name="status"
              initialValue="submitted"
            >
              <Select placeholder="Select status" size="large">
                <Option value="draft">📝 Draft</Option>
                <Option value="submitted">📤 Submitted</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label={
            <span className="flex items-center">
              <FileTextOutlined className="mr-2 text-blue-500" />
              Ongoing Treatments & Medications
            </span>
          }
          name="ongoing_treatments"
        >
          <TextArea
            rows={4}
            placeholder="Describe current treatments, medications, IV fluids, vital signs monitoring, etc."
            size="large"
            className="resize-none"
          />
        </Form.Item>

        <Form.Item
          label="Additional Notes"
          name="notes"
        >
          <TextArea
            rows={3}
            placeholder="Any additional information, special instructions, or observations..."
            size="large"
            className="resize-none"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateHandoverModal;