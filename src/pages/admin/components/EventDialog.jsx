import React, { useState } from "react";
import { Modal, DatePicker, TimePicker, Mentions, Form,Input } from "antd";
import BhmsButton from "../../../heroComponents/BhmsButton";
import BhmsInput from "../../../heroComponents/BhmsInput";

const { TextArea } = Input;
const { Option } = Mentions;

const EventDialog = ({ visible, onClose, onSave,staffs }) => {
    const [form] = Form.useForm();
    const [meetingLink, setMeetingLink] = useState("");

    // Function to generate a random meeting link (example)
    const generateMeetingLink = () => {
        const randomCode = Math.random().toString(36).substring(7);
        const newLink = `https://meet.example.com/${randomCode}`;
        setMeetingLink(newLink);
        form.setFieldsValue({ videoLink: newLink });
    };

    const handleSave = () => {
        form.validateFields()
            .then(values => {
                onSave(values);
                form.resetFields();
                setMeetingLink(""); // Reset link after saving
            })
            .catch(info => {
                console.log("Validation Failed:", info);
            });
    };

    return (
        <Modal
            title="Add Event"
            open={visible}
            onCancel={onClose}
            footer={[
                <BhmsButton key="cancel" block={false} size="medium" outline={true} onClick={onClose}>
                    Cancel
                </BhmsButton>,
                <BhmsButton key="save" block={false} size="medium" onClick={handleSave}>
                    Save Event
                </BhmsButton>,
            ]}
        >
            <Form form={form} layout="vertical">
                {/* Event Title */}
                <BhmsInput
                    label="Title"
                    name="title"
                    placeholder="Event title"
                    required
                    
                />
                {/* Date & Time Pickers */}
                <Form.Item label="Date & Time">
                    <div style={{ display: "flex", gap: "10px" }}>
                        <Form.Item
                            name="date"
                            rules={[{ required: true, message: "Please select a date" }]}
                            style={{ flex: 1 }}
                        >
                            <DatePicker style={{ width: "100%", padding:"5px 0px" }} />
                        </Form.Item>
                        <Form.Item
                            name="time"
                            rules={[{ required: true, message: "Please select a time" }]}
                            style={{ flex: 1 }}
                        >
                            <TimePicker format="HH:mm" style={{ width: "100%" }} />
                        </Form.Item>
                    </div>
                </Form.Item>

                {/* Staff Mentions */}
                <Form.Item name="staff" label="Tag Staff">
                    <Mentions
                        style={{ width: "100%", padding:"10px 0px" }}
                        placeholder="Tag staff with @"
                        
                    >
                        <Option value="john_doe">John Doe</Option>
                        <Option value="emily_smith">Emily Smith</Option>
                        <Option value="michael_brown">Michael Brown</Option>
                    </Mentions>
                </Form.Item>

                {/* Meeting Video Link */}
                <Form.Item name="videoLink" label="Meeting Video Link">
                    <div style={{ display: "flex", gap: "10px" }}>
                        <BhmsInput value={meetingLink} readOnly placeholder="Generated meeting link" />
                        <BhmsButton size="medium" block={false} type="primary" onClick={generateMeetingLink}>Generate</BhmsButton>
                    </div>
                </Form.Item>

                {/* Description */}
                <Form.Item name="description" label="Description">
                    <TextArea rows={3} placeholder="Enter event details..." />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EventDialog;
