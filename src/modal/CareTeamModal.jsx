import React, { useState } from 'react';
import { Modal, Form, Input, Select, Button, Divider, Tag } from 'antd';
import { UserOutlined, CloseOutlined } from '@ant-design/icons';

const { Option } = Select;

const CareTeamModal = ({ visible, onCancel, onSave, existingMembers }) => {
  const [form] = Form.useForm();
  const [teamMembers, setTeamMembers] = useState(existingMembers || []);
  const [selectedRole, setSelectedRole] = useState('surgeon');

  const roles = [
    { value: 'surgeon', label: 'Surgeon' },
    { value: 'assistant', label: 'Assistant' },
    { value: 'anesthesiologist', label: 'Anesthesiologist' },
    { value: 'nurse', label: 'Nurse' },
    { value: 'technician', label: 'Technician' }
  ];

  const handleAddMember = () => {
    form.validateFields().then(values => {
      const newMember = {
        id: Date.now().toString(),
        name: values.name,
        role: values.role,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setTeamMembers([...teamMembers, newMember]);
      form.resetFields(['name']);
    });
  };

  const handleRemoveMember = (id) => {
    setTeamMembers(teamMembers.filter(member => member.id !== id));
  };

  return (
    <Modal
      title="Manage Care Team"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button 
          key="save" 
          type="primary" 
          onClick={() => {
            onSave(teamMembers);
            onCancel();
          }}
        >
          Save Team
        </Button>
      ]}
      width={700}
    >
      <div className="mb-6">
        <div className="font-medium mb-2">Current Team Members</div>
        {teamMembers.length === 0 ? (
          <div className="text-gray-500">No team members added yet</div>
        ) : (
          <div className="space-y-2">
            {teamMembers.map(member => (
              <div key={member.id} className="flex justify-between items-center p-2 border rounded">
                <div>
                  <Tag color="blue" className="mr-2">
                    {member.role}
                  </Tag>
                  <span className="font-medium">{member.name}</span>
                  <span className="text-gray-500 ml-2">({member.time})</span>
                </div>
                <Button 
                  type="text" 
                  icon={<CloseOutlined />} 
                  onClick={() => handleRemoveMember(member.id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <Divider orientation="left">Add New Member</Divider>
      
      <Form form={form} layout="inline">
        <Form.Item
          name="role"
          initialValue="surgeon"
          className="w-40"
        >
          <Select onChange={value => setSelectedRole(value)}>
            {roles.map(role => (
              <Option key={role.value} value={role.value}>
                {role.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="name"
          rules={[{ required: true, message: 'Please enter name' }]}
          className="flex-grow"
        >
          <Input placeholder="Enter team member name" />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            icon={<UserOutlined />}
            onClick={handleAddMember}
          >
            Add
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CareTeamModal;