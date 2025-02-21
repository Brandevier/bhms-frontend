import React, { useState } from "react";
import { Modal, Form, Select, Input, Button, Tag, DatePicker, Switch, Tooltip } from "antd";
import { PlusOutlined, CloseCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchProcedures } from "../redux/slice/procedureSlice";
import BhmsButton from "../heroComponents/BhmsButton";
import dayjs from "dayjs";

const { Option } = Select;
const { TextArea } = Input;

const CreateProcedureModal = ({ visible, onClose, onSubmit }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [selectedProcedures, setSelectedProcedures] = useState([]);
  const [alertStaffs, setAlertStaffs] = useState(false); // Toggle for alerting staff

  const { allStaffs } = useSelector((state) => state.adminStaffManagement);
  const { procedures, loading } = useSelector((state) => state.procedure);

  // Fetch procedures when user types
  const handleSearch = (value) => {
    if (value) {
      dispatch(fetchProcedures(value));
    }
  };

  // Add selected procedure
  const handleAddProcedure = (value) => {
    if (!selectedProcedures.includes(value)) {
      setSelectedProcedures([...selectedProcedures, value]);
    }
  };

  // Remove procedure
  const handleRemoveProcedure = (procedure) => {
    setSelectedProcedures(selectedProcedures.filter((item) => item !== procedure));
  };

  // Handle form submission
  const handleFinish = (values) => {
    const formattedData = {
      ...values,
      procedure_datetime: values.procedure_datetime?.toDate(), // Extracts only the Date object
      procedures: selectedProcedures,
      alertStaffs,
    };
    onSubmit(formattedData);
    form.resetFields();
    setSelectedProcedures([]);
   
  };

  return (
    <Modal
      title="Create Procedure"
      open={visible}
      onCancel={onClose}
      footer={[
        <BhmsButton block={false} size="medium" outline key="cancel" onClick={onClose}>
          Cancel
        </BhmsButton>,
        <BhmsButton key="submit" type="primary" block={false} size="medium" onClick={() => form.submit()}>
          Submit
        </BhmsButton>,
      ]}
      width={600} // Adjust width if needed
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        {/* Search and Select Procedures */}
        <Form.Item label="Select Procedure" name="procedure">
          <Select
            showSearch
            placeholder="Search for procedure"
            onSearch={handleSearch}
            loading={loading}
            onSelect={handleAddProcedure}
            filterOption={false}
          >
            {procedures.map((procedure) => (
              <Option key={procedure.code} value={procedure.name}>
                {procedure.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Display Selected Procedures */}
        {selectedProcedures.length > 0 && (
          <div style={{ marginBottom: 15 }}>
            {selectedProcedures.map((procedure) => (
              <Tag
                key={procedure}
                closable
                onClose={() => handleRemoveProcedure(procedure)}
                icon={<CloseCircleOutlined />}
              >
                {procedure}
              </Tag>
            ))}
          </div>
        )}

        {/* Select Doctor */}
        <Form.Item label="Select Doctor" name="doctor_id" rules={[{ required: true, message: "Please select a doctor" }]}>
          <Select placeholder="Select doctor">
            {allStaffs.map((doctor) => (
              <Option key={doctor.id} value={doctor.id}>
                Dr. {doctor.firstName} {doctor.lastName}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Select Assisting Staff */}
        <Form.Item label="Select Assisting Staff" name="staff_assistance">
          <Select mode="multiple" placeholder="Select nurses or assistants">
            {allStaffs.map((nurse) => (
              <Option key={nurse.id} value={nurse.id}>
                {nurse.firstName} {nurse.lastName}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Procedure Date & Time */}
        <Form.Item label="Procedure Date & Time" name="procedure_datetime" rules={[{ required: true, message: "Please select date and time" }]}>
          <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm"
            style={{ width: "100%" }}
            disabledDate={(current) => current && current < dayjs().startOf("day")} // Prevent past dates
          />
        </Form.Item>

        {/* Alert Staffs Toggle */}
        <Form.Item label="Notify Staffs via SMS">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Switch checked={alertStaffs} onChange={(checked) => setAlertStaffs(checked)} />
            <Tooltip title="Enabling this option will send an SMS notification to the assigned staff members. SMS may incur additional costs.">
              <InfoCircleOutlined style={{ fontSize: 16, color: "#1890ff" }} />
            </Tooltip>
          </div>
        </Form.Item>

        {/* Procedure Description */}
        <Form.Item label="Procedure Description" name="description">
          <TextArea rows={3} placeholder="Provide procedure details..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateProcedureModal;
