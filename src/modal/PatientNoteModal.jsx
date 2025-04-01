import React, { useState, useEffect } from "react";
import { Modal, Typography, Mentions, Spin, Button, message } from "antd";
import { ThunderboltOutlined } from "@ant-design/icons";
import BhmsButton from "../heroComponents/BhmsButton";
import { useSelector } from "react-redux";

const { Text } = Typography;
const { Option } = Mentions;

const PatientNoteModal = ({ visible, onClose, patient_id, onSave, status }) => {
    const [note, setNote] = useState("");
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const { allStaffs, loading } = useSelector((state) => state.adminStaffManagement);

    // Check internet connection status
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Transform staff data into mentionable format
    const staffOptions = allStaffs?.map(staff => ({
        id: staff.id,
        name: `${staff.firstName} ${staff.lastName}`
    })) || [];

    const handleSave = () => {
        const mentionedStaff = staffOptions.filter(staff => note.includes(`@${staff.name}`));
        const mentionedStaffIds = mentionedStaff.map(staff => staff.id);

        const newNote = {
            note,
            tagged_staff_ids: mentionedStaffIds,
            patient_id
        };

        onSave(newNote);
    };

    const handleAiRewrite = () => {
        if (!isOnline) {
            message.error("You are not connected to the internet");
            return;
        }
        
        // TODO: Implement actual AI rewrite functionality when online
        message.info("AI rewrite feature will be available when connected");
    };

    return (
        <Modal
            title="New Patient Note"
            open={visible}
            onCancel={onClose}
            footer={[
                <BhmsButton block={false} size="medium" outline key="cancel" onClick={onClose}>
                    Cancel
                </BhmsButton>,
                <BhmsButton key="save" block={false} size="medium" onClick={handleSave}>
                   {status === 'loading' ? <Spin /> : 'Save'}
                </BhmsButton>
            ]}
        >
            {/* Instructions and AI Button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <Text type="secondary">
                    ✍️ Write your note here. Tag staff using <strong>@staffname</strong>.
                </Text>
                <Button 
                    icon={<ThunderboltOutlined />} 
                    onClick={handleAiRewrite}
                    type="text"
                    style={{ color: '#1890ff' }}
                    title="Rewrite with AI"
                >
                    AI
                </Button>
            </div>

            {/* Mention Input */}
            <Mentions
                autoSize={{ minRows: 4 }}
                placeholder="Start writing your note..."
                value={note}
                onChange={setNote}
                style={{
                    padding: "8px",
                    fontSize: "16px",
                    width: "100%",
                    border: "none",
                    outline: "none",
                    boxShadow: "none",
                }}
            >
                {staffOptions.map(staff => (
                    <Option key={staff.id} value={staff.name}>
                        {staff.name}
                    </Option>
                ))}
            </Mentions>
        </Modal>
    );
};

export default PatientNoteModal;