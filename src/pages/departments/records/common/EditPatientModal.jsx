import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  message,
  Row,
  Col,
  Tabs,
} from 'antd';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

const EditPatientModal = ({ visible, patient, onClose, onUpdate }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('1');

  useEffect(() => {
    if (visible && patient) {
      const { metadata, ...basicInfo } = patient;
      
      form.setFieldsValue({
        // Basic Info
        first_name: basicInfo.first_name,
        middle_name: basicInfo.middle_name,
        last_name: basicInfo.last_name,
        gender: basicInfo.gender,
        date_of_birth: basicInfo.date_of_birth ? moment(basicInfo.date_of_birth) : null,
        folder_number: basicInfo.folder_number,
        status: basicInfo.status,
        
        // Contact Info
        next_of_kin_name: metadata?.relatives?.next_of_kin?.name,
        next_of_kin_relationship: metadata?.relatives?.next_of_kin?.relationship,
        next_of_kin_phone: metadata?.relatives?.next_of_kin?.phone,
        emergency_contact_name: metadata?.relatives?.emergency_contact?.name,
        emergency_contact_relationship: metadata?.relatives?.emergency_contact?.relationship,
        emergency_contact_phone: metadata?.relatives?.emergency_contact?.phone,
        
        // Additional Info
        address: metadata?.address,
        insurance_provider: metadata?.insurance?.provider,
        insurance_policy_number: metadata?.insurance?.policy_number,
        insurance_group_number: metadata?.insurance?.group_number,
        allergies: metadata?.allergies?.join(', '),
        notes: metadata?.notes,
      });
    }
  }, [visible, patient, form]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedPatient = {
        ...patient,
        first_name: values.first_name,
        middle_name: values.middle_name,
        last_name: values.last_name,
        gender: values.gender,
        date_of_birth: values.date_of_birth?.format('YYYY-MM-DD'),
        folder_number: values.folder_number,
        status: values.status,
        metadata: {
          ...patient.metadata,
          address: values.address,
          relatives: {
            next_of_kin: values.next_of_kin_name ? {
              name: values.next_of_kin_name,
              relationship: values.next_of_kin_relationship,
              phone: values.next_of_kin_phone,
            } : null,
            emergency_contact: values.emergency_contact_name ? {
              name: values.emergency_contact_name,
              relationship: values.emergency_contact_relationship,
              phone: values.emergency_contact_phone,
            } : null,
          },
          insurance: values.insurance_provider ? {
            provider: values.insurance_provider,
            policy_number: values.insurance_policy_number,
            group_number: values.insurance_group_number,
          } : null,
          allergies: values.allergies ? values.allergies.split(',').map(a => a.trim()) : [],
          notes: values.notes,
        }
      };

      onUpdate(updatedPatient);
      message.success('Patient information updated successfully!');
    } catch (error) {
      console.error('Validation failed:', error);
      message.error('Please fill in all required fields correctly.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Edit Patient Information"
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 border-blue-600"
        >
          Update Patient
        </Button>,
      ]}
      width={700}
      centered
      maskClosable={false}
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Basic Info" key="1">
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="first_name" label="First Name" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="middle_name" label="Middle Name">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="last_name" label="Last Name" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
                  <Select>
                    <Option value="M">Male</Option>
                    <Option value="F">Female</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="date_of_birth" label="Date of Birth" rules={[{ required: true }]}>
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="folder_number" label="Folder Number" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            
            <Form.Item name="status" label="Status" rules={[{ required: true }]}>
              <Select>
                <Option value="active">Active</Option>
                <Option value="inactive">Inactive</Option>
              </Select>
            </Form.Item>
          </TabPane>

          <TabPane tab="Contact Info" key="2">
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="next_of_kin_name" label="Next of Kin Name">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="next_of_kin_relationship" label="Relationship">
                  <Select>
                    <Option value="spouse">Spouse</Option>
                    <Option value="parent">Parent</Option>
                    <Option value="child">Child</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="next_of_kin_phone" label="Phone">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="emergency_contact_name" label="Emergency Contact">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="emergency_contact_relationship" label="Relationship">
                  <Select>
                    <Option value="spouse">Spouse</Option>
                    <Option value="parent">Parent</Option>
                    <Option value="friend">Friend</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="emergency_contact_phone" label="Phone">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="Additional Info" key="3">
            <Form.Item name="address" label="Address">
              <TextArea rows={3} />
            </Form.Item>
            
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="insurance_provider" label="Insurance Provider">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="insurance_policy_number" label="Policy Number">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="insurance_group_number" label="Group Number">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            
            <Form.Item name="allergies" label="Allergies">
              <TextArea placeholder="Separate with commas" rows={2} />
            </Form.Item>
            
            <Form.Item name="notes" label="Notes">
              <TextArea rows={3} />
            </Form.Item>
          </TabPane>
        </Tabs>
      </Form>
    </Modal>
  );
};

export default EditPatientModal;