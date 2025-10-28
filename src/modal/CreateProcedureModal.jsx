import React, { useState, useEffect } from "react";
import { Modal, Form, Select, Input, Tag, DatePicker, Switch, Tooltip } from "antd";
import { CloseCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import BhmsButton from "../heroComponents/BhmsButton";
import dayjs from "dayjs";
import { fetchAllGDRGCodes } from "../redux/slice/claims_dgrg";
import { fetchDepartments } from "../redux/slice/chatSlice";

const { Option } = Select;
const { TextArea } = Input;

const CreateProcedureModal = ({ visible, onClose, onSubmit }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [selectedProcedures, setSelectedProcedures] = useState([]);
  const [alertStaffs, setAlertStaffs] = useState(false);

  const { allStaffs } = useSelector((state) => state.adminStaffManagement);
  const { codes, loading } = useSelector((state) => state.dgrgCodes);
  const { departments } = useSelector((state) => state.departments);

  useEffect(() => {
    if (visible) {
      dispatch(fetchAllGDRGCodes());
      dispatch(fetchDepartments());
    }
  }, [dispatch, visible]);

  // Add selected procedure with its description
  const handleAddProcedure = (value) => {
    const proc = codes.find((p) => p.id === value);
    if (proc && !selectedProcedures.some((p) => p.id === proc.id)) {
      setSelectedProcedures([...selectedProcedures, proc]);
    }
  };

  // Remove procedure
  const handleRemoveProcedure = (id) => {
    setSelectedProcedures(selectedProcedures.filter((item) => item.id !== id));
  };

  // Handle form submission
  const handleFinish = (values) => {
    const formattedData = {
      ...values,
      procedure_datetime: values.procedure_datetime?.toDate(),
      procedures: selectedProcedures.map((p) => p.id), // send only IDs to backend
      alertStaffs,
    };
    onSubmit(formattedData);
    form.resetFields();
    setSelectedProcedures([]);
    console.log(formattedData)
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
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        
        {/* Select Procedure */}
        <Form.Item label="Select Procedure" name="procedure">
          <Select
            showSearch
            placeholder="Search for procedure"
            loading={loading}
            onSelect={handleAddProcedure}
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {codes.map((procedure) => (
              <Option key={procedure.id} value={procedure.id}>
                {procedure.description}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Display Selected Procedures */}
        {selectedProcedures.length > 0 && (
          <div style={{ marginBottom: 15 }}>
            {selectedProcedures.map((procedure) => (
              <Tag
                key={procedure.id}
                closable
                onClose={() => handleRemoveProcedure(procedure.id)}
                icon={<CloseCircleOutlined />}
              >
                {procedure.description}
              </Tag>
            ))}
          </div>
        )}

        {/* Select Department */}
        <Form.Item
          label="Select Department"
          name="department_id"
          rules={[{ required: true, message: "Please select a department" }]}
        >
          <Select placeholder="Select department">
            {departments.map((dept) => (
              <Option key={dept.id} value={dept.id}>
                {dept.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Select Doctor */}
        <Form.Item
          label="Select Doctor"
          name="doctor_id"
          rules={[{ required: true, message: "Please select a doctor" }]}
        >
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
        <Form.Item
          label="Procedure Date & Time"
          name="procedure_datetime"
          rules={[{ required: true, message: "Please select date and time" }]}
        >
          <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm"
            style={{ width: "100%" }}
            disabledDate={(current) => current && current < dayjs().startOf("day")}
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
