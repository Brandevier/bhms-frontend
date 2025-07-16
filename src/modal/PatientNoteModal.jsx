import React, { useState, useEffect } from "react";
import { Modal, Typography, Mentions, Spin, Button, message } from "antd";
import { ThunderboltOutlined, AudioOutlined, PauseOutlined, StopOutlined } from "@ant-design/icons";
import BhmsButton from "../heroComponents/BhmsButton";
import { useSelector } from "react-redux";

const { Text } = Typography;
const { Option } = Mentions;

const PatientNoteModal = ({ visible, onClose, patient_id, onSave, status }) => {
    const [note, setNote] = useState("");
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [recognition, setRecognition] = useState(null);
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

    // Initialize speech recognition
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognizer = new SpeechRecognition();
                recognizer.continuous = true;
                recognizer.interimResults = true;
                recognizer.lang = 'en-US';

                recognizer.onresult = (event) => {
                    const transcript = Array.from(event.results)
                        .map(result => result[0])
                        .map(result => result.transcript)
                        .join('');

                    setNote(transcript);
                };

                recognizer.onerror = (event) => {
                    console.error('Speech recognition error', event.error);
                    message.error(`Speech recognition error: ${event.error}`);
                    stopRecording();
                };

                setRecognition(recognizer);
            }
        }

        return () => {
            if (recognition) {
                recognition.stop();
            }
        };
    }, []);

    // Timer effect
    useEffect(() => {
        let timer;
        if (isRecording) {
            timer = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isRecording]);

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
        stopRecording();
    };

    const handleAiRewrite = () => {
        if (!isOnline) {
            message.error("You are not connected to the internet");
            return;
        }
        
        // TODO: Implement actual AI rewrite functionality when online
        message.info("AI rewrite feature will be available when connected");
    };

    const startRecording = () => {
        if (!isOnline) {
            message.warning("Speech-to-text requires an internet connection");
            return;
        }

        if (!recognition) {
            message.error("Speech recognition not supported in this browser");
            return;
        }

        try {
            recognition.start();
            setIsRecording(true);
            setRecordingTime(0);
            message.info("Recording started. Speak now...");
        } catch (err) {
            console.error("Recording error:", err);
            message.error("Failed to start recording");
        }
    };

    const pauseRecording = () => {
        if (recognition) {
            recognition.stop();
            setIsRecording(false);
            message.info("Recording paused");
        }
    };

    const stopRecording = () => {
        if (recognition) {
            recognition.stop();
            setIsRecording(false);
            message.info("Recording stopped");
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <Modal
            title="New Patient Note"
            open={visible}
            onCancel={() => {
                onClose();
                stopRecording();
            }}
            footer={[
                <BhmsButton block={false} size="medium" outline key="cancel" onClick={() => {
                    onClose();
                    stopRecording();
                }}>
                    Cancel
                </BhmsButton>,
                <BhmsButton 
                    key="save" 
                    block={false} 
                    size="medium" 
                    onClick={handleSave}
                    disabled={isRecording}
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

            {/* Mention Input with Speech-to-Text */}
            <div style={{ position: 'relative' }}>
                <Mentions
                    autoSize={{ minRows: 4 }}
                    placeholder="Start writing your note or use microphone..."
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
                    disabled={isRecording}
                >
                    {staffOptions.map(staff => (
                        <Option key={staff.id} value={staff.name}>
                            {staff.name}
                        </Option>
                    ))}
                </Mentions>
                
                <div style={{ 
                    position: 'absolute', 
                    right: 8, 
                    bottom: 8, 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: 8
                }}>
                    {isRecording && (
                        <span style={{ 
                            color: '#ff4d4f', 
                            fontWeight: 'bold',
                            marginRight: 8
                        }}>
                            {formatTime(recordingTime)}
                        </span>
                    )}
                    
                    {!isRecording ? (
                        <Button
                            type="text"
                            icon={<AudioOutlined />}
                            onClick={startRecording}
                            title="Start speech-to-text"
                            style={{ color: isOnline ? '#1890ff' : '#ccc' }}
                        />
                    ) : (
                        <>
                            <Button
                                type="text"
                                icon={<PauseOutlined />}
                                onClick={pauseRecording}
                                title="Pause recording"
                                style={{ color: '#ff4d4f' }}
                            />
                            <Button
                                type="text"
                                icon={<StopOutlined />}
                                onClick={stopRecording}
                                title="Stop recording"
                                style={{ color: '#ff4d4f' }}
                            />
                        </>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default PatientNoteModal;