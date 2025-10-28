import React, { useState } from "react";
import { Modal, Select, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Option } = Select;

const ProcedureStaffModal = ({ 
  visible, 
  onCancel, 
  onOk, 
  procedure,
  availableStaff = []
}) => {
  const [selectedStaff, setSelectedStaff] = useState(
    procedure.assisting_staff?.map(s => s.id) || []
  );

  return (
    <Modal
      title="Update Assisting Staff"
      visible={visible}
      onOk={() => onOk(selectedStaff)}
      onCancel={onCancel}
      okText="Update Staff"
    >
      <Select
        mode="multiple"
        style={{ width: '100%' }}
        placeholder="Select staff members"
        value={selectedStaff}
        onChange={setSelectedStaff}
        optionLabelProp="label"
      >
        {availableStaff.map(staff => (
          <Option
            key={staff.id}
            value={staff.id}
            label={`${staff.firstName} ${staff.lastName}`}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                size="small"
                src={staff.profile_pic}
                style={{ marginRight: 8 }}
                icon={<UserOutlined />}
              >
                {staff.firstName.charAt(0)}
              </Avatar>
              <span>{staff.firstName} {staff.lastName} ({staff.staffID})</span>
            </div>
          </Option>
        ))}
      </Select>
    </Modal>
  );
};

export default ProcedureStaffModal;