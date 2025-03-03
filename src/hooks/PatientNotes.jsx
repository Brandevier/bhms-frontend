import React, { useState } from "react";
import { Card, List, Avatar, Button, Tooltip, Empty, Input, message, Collapse, Row, Spin } from "antd";
import { PlusOutlined, UserOutlined, CommentOutlined } from "@ant-design/icons";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { createPatientNote, fetchPatientNotes } from "../redux/slice/patientNotesSlice";
import { addComment } from "../redux/slice/commentSlice";
import PatientNoteModal from "../modal/PatientNoteModal";
const { Panel } = Collapse;
import BhmsButton from "../heroComponents/BhmsButton";

const PatientNotes = ({ patient_notes, general_handler, patient_id }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [commentTexts, setCommentTexts] = useState({}); // Store comments for each note
    const [activeNote, setActiveNote] = useState(null);
    const dispatch = useDispatch();
    const { status } = useSelector((state) => state.patientNote);
    const { loading: commentLoading } = useSelector((state) => state.noteComment);

    const handleSaveNote = (note) => {
        dispatch(createPatientNote(note))
            .unwrap()
            .then(() => {
                message.success("Note created successfully");
                dispatch(fetchPatientNotes({ patient_id }));
                general_handler();
                setIsModalOpen(false);
            })
            .catch(() => message.error("Failed to create note"));
    };

    const handleAddComment = (noteId) => {
        if (!commentTexts[noteId]?.trim()) return;
        const commentData = {
            patient_note_id: noteId,
            comment: commentTexts[noteId],
        };

        dispatch(addComment(commentData))
            .unwrap()
            .then(() => {
                message.success("Comment added successfully!");
                setCommentTexts((prev) => ({ ...prev, [noteId]: "" })); // Clear input after posting
                dispatch(fetchPatientNotes({ patient_id })); // Refresh notes to include the new comment
            })
            .catch(() => message.error("Failed to add comment"));
    };

    return (
        <Card
            title={
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>Patient Notes</span>
                    <Tooltip title="Add Nurse's Note">
                        <Avatar
                            size={28}
                            icon={<PlusOutlined />}
                            style={{ backgroundColor: "#1890ff", cursor: "pointer" }}
                            onClick={() => setIsModalOpen(true)}
                        />
                    </Tooltip>
                </div>
            }
            bordered
            style={{ marginTop: 20 }}
        >
            {!patient_notes || patient_notes.length === 0 ? (
                <Empty description="No Patient Notes Available" style={{ margin: "20px 0" }} />
            ) : (
                <List
                    dataSource={patient_notes}
                    renderItem={(note) => (
                        <Card style={{ marginBottom: 10, padding: 10 }} bordered>
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar icon={<UserOutlined />} src={note.staff?.profile_pic} />}
                                    title={<strong>{note.staff?.firstName} {note.staff?.lastName}</strong>}
                                    description={
                                        <>
                                            <p>{note.note}</p>
                                            <small style={{ color: "gray" }}>{moment(note.createdAt).fromNow()}</small>
                                        </>
                                    }
                                />
                            </List.Item>

                            {/* Tagged Staff Avatars */}
                            {note.taggedStaffs?.length > 0 && (
                                <div style={{ marginTop: 10 }}>
                                    <strong>Tagged: </strong>
                                    {note.taggedStaffs.slice(0, 3).map((staff, index) => (
                                        <Tooltip key={index} title={staff.firstName + ' ' + staff.lastName}>
                                            <Avatar style={{ marginLeft: 5 }}>{staff.firstName[0]}</Avatar>
                                        </Tooltip>
                                    ))}
                                    {note.taggedStaffs.length > 3 && (
                                        <Avatar style={{ marginLeft: 5, backgroundColor: "#ccc" }}>
                                            +{note.taggedStaffs.length - 3}
                                        </Avatar>
                                    )}
                                </div>
                            )}

                            {/* Comments Section */}
                            <Collapse style={{ marginTop: 10 }}>
                                <Panel header={<><CommentOutlined /> Comments ({note.comments?.length || 0})</>} key={note.id}>
                                    {/* Display Existing Comments */}
                                    {note.comments && note.comments.length > 0 ? (
                                        <List
                                            dataSource={note.comments}
                                            renderItem={(comment) => (
                                                <List.Item key={comment.id}>
                                                    <List.Item.Meta
                                                        avatar={<Avatar icon={<UserOutlined />} src={comment.user?.profile_pic} />}
                                                        title={<strong>{comment.user?.firstName} {comment.user?.lastName}</strong>}
                                                        description={
                                                            <>
                                                                <p>{comment.comment}</p>
                                                                <small style={{ color: "gray" }}>{moment(comment.createdAt).fromNow()}</small>
                                                            </>
                                                        }
                                                    />
                                                </List.Item>
                                            )}
                                        />
                                    ) : (
                                        <Empty description="No comments yet" />
                                    )}

                                    {/* Add New Comment */}
                                    <div className="flex" style={{ marginTop: 10 }}>
                                        <Input.TextArea
                                            value={commentTexts[note.id] || ""}
                                            onChange={(e) =>
                                                setCommentTexts((prev) => ({ ...prev, [note.id]: e.target.value }))
                                            }
                                            placeholder="Write a comment..."
                                            autoSize={{ minRows: 2, maxRows: 3 }}
                                            style={{ marginRight: "5px" }}
                                        />
                                        <BhmsButton
                                            onClick={() => handleAddComment(note.id)}
                                            block={false}
                                            size="medium"
                                            disabled={commentLoading}
                                        >
                                            {commentLoading ? <Spin /> : "Post"}
                                        </BhmsButton>
                                    </div>
                                </Panel>
                            </Collapse>
                        </Card>
                    )}
                />
            )}

            {/* Add Note Modal */}
            <PatientNoteModal
                visible={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveNote}
                patient_id={patient_id}
                status={status}
            />
        </Card>
    );
};

export default PatientNotes;
