// Updated PatientNoteModal.js
import React, { useState, useEffect } from "react";
import { Modal, Typography, Spin, Button, message } from "antd";
import { ThunderboltOutlined } from "@ant-design/icons";
import BhmsButton from "../heroComponents/BhmsButton";
import { useSelector } from "react-redux";
import SpeechTextArea from "../components/common/SpeechTextArea";
const { Text } = Typography;

const PatientNoteModal = ({ visible, onClose, visit_id, onSave, status }) => {
    const [note, setNote] = useState("");
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const { allStaffs, loading } = useSelector((state) => state.adminStaffManagement);

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
            visit_id
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
                <BhmsButton 
                    key="save" 
                    block={false} 
                    size="medium" 
                    onClick={handleSave}
                >
                   {status === 'loading' ? <Spin /> : 'Save'}
                </BhmsButton>
            ]}
        >
            {/* Instructions and AI Button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <Text type="secondary">
                    ✍️ Write your note here. Tag staff using <strong>@staffname</strong>.
                </Text>
                <div>
                    <Button 
                        icon={<ThunderboltOutlined />} 
                        onClick={handleAiRewrite}
                        type="text"
                        style={{ color: '#1890ff', marginRight: 8 }}
                        title="Rewrite with AI"
                    >
                        AI
                    </Button>
                </div>
            </div>

            {/* Reusable SpeechTextArea component */}
            <SpeechTextArea
                value={note}
                onChange={setNote}
                mentionOptions={staffOptions}
                placeholder="Start writing your note or use microphone..."
                showMentions={true}
                recordingControlsPosition="inside"
            />
        </Modal>
    );
};

export default PatientNoteModal;