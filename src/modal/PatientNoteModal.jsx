import React, { useState } from "react";
import { Modal, Typography, Mentions, Spin } from "antd";
import BhmsButton from "../heroComponents/BhmsButton";
import { useSelector } from "react-redux";

const { Text } = Typography;
const { Option } = Mentions;

const PatientNoteModal = ({ visible, onClose,patient_id, onSave,status }) => {
    const [note, setNote] = useState("");
    const { allStaffs, loading } = useSelector((state) => state.adminStaffManagement);

    // Transform staff data into mentionable format
    const staffOptions = allStaffs?.map(staff => ({
        id: staff.id,
        name: `${staff.firstName} ${staff.lastName}`
    })) || [];

    const handleSave = () => {
        // Extract mentioned users from note
        const mentionedStaff = staffOptions.filter(staff => note.includes(`@${staff.name}`));
        const mentionedStaffIds = mentionedStaff.map(staff => staff.id);

        const newNote = {
            note,
            tagged_staff_ids:mentionedStaffIds,
            patient_id
        }

        // Pass note and mentioned staff IDs to onSave
        onSave(newNote);
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
                   {status === 'loading' ? <Spin/> : 'Save'}
                </BhmsButton>
            ]}
        >
            {/* Instructions */}
            <Text type="secondary" style={{ display: "block", marginBottom: 8 }}>
                ✍️ Write your note here. Tag staff using <strong>@staffname</strong>.
            </Text>

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
