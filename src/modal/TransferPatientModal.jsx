import React, { useState } from "react";
import { Modal, Form, Select, Input, Button, DatePicker, Checkbox, Divider, Alert, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { createDischarge } from "../redux/slice/dischargeSlice";
import { 
  CheckOutlined,
  WarningOutlined,
  SwapOutlined,
  CloseCircleOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";

const { TextArea } = Input;
const { Option } = Select;

const DischargePatientModal = ({ visible, onClose, patientId }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [dischargeType, setDischargeType] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const { loading } = useSelector((state) => state.discharge);

  const handleSubmit = () => {
    form.validateFields().then(values => {
      const dischargeData = {
        patient_id: patientId,
        type: values.dischargeType,
        discharge_date: values.dischargeDate?.format('YYYY-MM-DD HH:mm') || dayjs().format('YYYY-MM-DD HH:mm'),
        notes: values.notes,
        // Type-specific fields
        ...(values.dischargeType === 'routine' && {
          follow_up_date: values.followUpDate?.format('YYYY-MM-DD HH:mm'),
          instructions: values.instructions
        }),
        ...(values.dischargeType === 'ama' && {
          ama_reason: values.amaReason,
          risks_acknowledged: values.risksAcknowledged
        }),
        ...(values.dischargeType === 'transfer' && {
          facility_name: values.facilityName,
          transfer_reason: values.transferReason,
          transfer_notes: values.transferNotes
        }),
        ...(values.dischargeType === 'expired' && {
          time_of_death: values.timeOfDeath?.format('YYYY-MM-DD HH:mm'),
          cause_of_death: values.causeOfDeath,
          death_notes: values.deathNotes
        })
      };

      dispatch(createDischarge(dischargeData))
        .unwrap()
        .then(() => {
          message.success('Discharge recorded successfully');
          handleClose();
        })
        .catch((error) => {
          message.error(error.message || 'Failed to record discharge');
        });
    });
  };

  const handleClose = () => {
    form.resetFields();
    setDischargeType(null);
    setConfirmed(false);
    onClose();
  };

  const dischargeTypes = [
    {
      value: 'routine',
      label: 'Routine Discharge',
      icon: <CheckOutlined />,
      description: 'Patient has completed treatment and is medically stable'
    },
    {
      value: 'ama',
      label: 'Discharge Against Medical Advice (AMA)',
      icon: <WarningOutlined />,
      description: 'Patient is leaving against medical recommendations'
    },
    {
      value: 'transfer',
      label: 'Transfer to Another Facility',
      icon: <SwapOutlined />,
      description: 'Patient is being transferred to another healthcare facility'
    },
    {
      value: 'expired',
      label: 'Expired (Deceased)',
      icon: <CloseCircleOutlined />,
      description: 'Patient has passed away'
    }
  ];

  const renderFormFields = () => {
    switch (dischargeType) {
      case 'routine':
        return (
          <>
            <Form.Item
              name="followUpDate"
              label="Follow-up Date"
              rules={[{ required: true, message: 'Please select follow-up date' }]}
            >
              <DatePicker 
                showTime 
                style={{ width: '100%' }} 
                disabledDate={current => current && current < dayjs().startOf('day')}
              />
            </Form.Item>
            <Form.Item name="instructions" label="Discharge Instructions">
              <TextArea rows={4} placeholder="Enter medication, care instructions, etc." />
            </Form.Item>
          </>
        );
      
      case 'ama':
        return (
          <>
            <Alert 
              message="Warning" 
              description="This patient is leaving against medical advice. This may lead to complications."
              type="warning" 
              showIcon 
              style={{ marginBottom: 16 }}
            />
            <Form.Item
              name="amaReason"
              label="Reason for Leaving"
              rules={[{ required: true, message: 'Please document the reason' }]}
            >
              <TextArea rows={3} placeholder="Why is the patient leaving AMA?" />
            </Form.Item>
            <Form.Item
              name="risksAcknowledged"
              label="Risks Explained"
              rules={[{ required: true, message: 'This is required' }]}
            >
              <Checkbox.Group options={[
                'Patient understands risks',
                'Patient received written documentation',
                'Alternative options discussed'
              ]} />
            </Form.Item>
          </>
        );
      
      case 'transfer':
        return (
          <>
            <Form.Item
              name="facilityName"
              label="Facility Name"
              rules={[{ required: true, message: 'Please enter facility name' }]}
            >
              <Input placeholder="Name of receiving facility" />
            </Form.Item>
            <Form.Item
              name="transferReason"
              label="Transfer Reason"
              rules={[{ required: true, message: 'Please specify reason' }]}
            >
              <Input placeholder="E.g., Higher level of care needed" />
            </Form.Item>
            <Form.Item name="transferNotes" label="Additional Notes">
              <TextArea rows={3} placeholder="Any special instructions?" />
            </Form.Item>
          </>
        );
      
      case 'expired':
        return (
          <>
            <Form.Item
              name="timeOfDeath"
              label="Time of Death"
              rules={[{ required: true, message: 'Please record time of death' }]}
            >
              <DatePicker 
                showTime 
                style={{ width: '100%' }} 
                disabledDate={current => current && current > dayjs()}
              />
            </Form.Item>
            <Form.Item
              name="causeOfDeath"
              label="Cause of Death"
              rules={[{ required: true, message: 'Please document cause' }]}
            >
              <Input placeholder="Primary cause of death" />
            </Form.Item>
            <Form.Item name="deathNotes" label="Additional Notes">
              <TextArea rows={3} placeholder="Circumstances, family notified, etc." />
            </Form.Item>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <Modal
      title="Patient Discharge"
      open={visible}
      onCancel={handleClose}
      footer={null}
      width={700}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="dischargeType"
          label="Discharge Type"
          rules={[{ required: true, message: 'Please select discharge type' }]}
        >
          <Select
            placeholder="Select discharge type"
            onChange={value => {
              setDischargeType(value);
              setConfirmed(false);
            }}
            optionLabelProp="label"
          >
            {dischargeTypes.map(type => (
              <Option key={type.value} value={type.value} label={type.label}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: 8 }}>{type.icon}</span>
                  <div>
                    <div>{type.label}</div>
                    <div style={{ fontSize: 12, color: '#888' }}>{type.description}</div>
                  </div>
                </div>
              </Option>
            ))}
          </Select>
        </Form.Item>

        {dischargeType && (
          <>
            <Divider />
            {renderFormFields()}
            
            <Form.Item
              name="dischargeDate"
              label="Discharge Date/Time"
              initialValue={dayjs()}
            >
              <DatePicker showTime style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item name="notes" label="General Notes">
              <TextArea rows={2} placeholder="Additional comments" />
            </Form.Item>

            {dischargeType !== 'ama' && (
              <Form.Item>
                <Checkbox
                  checked={confirmed}
                  onChange={e => setConfirmed(e.target.checked)}
                >
                  I confirm all information is accurate
                </Checkbox>
              </Form.Item>
            )}

            <Form.Item style={{ marginTop: 24 }}>
              <Button
                type="primary"
                onClick={handleSubmit}
                disabled={dischargeType === 'ama' ? false : !confirmed}
                loading={loading}
                style={{ marginRight: 8 }}
              >
                {dischargeType === 'expired' ? 'Record Death' : 
                 dischargeType === 'ama' ? 'Confirm AMA Discharge' : 
                 'Complete Discharge'}
              </Button>
              <Button onClick={handleClose}>
                Cancel
              </Button>
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default DischargePatientModal;