import React, { useState, useEffect, useRef } from "react";
import {
  Card, List, Avatar, Button, Tooltip, Empty, Input, message, Collapse, Spin,Slider
} from "antd";
import {
  PlusOutlined, UserOutlined, CommentOutlined, SoundOutlined, PauseOutlined
} from "@ant-design/icons";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { createPatientNote, fetchPatientNotes } from "../redux/slice/patientNotesSlice";
import { addComment } from "../redux/slice/commentSlice";
import PatientNoteModal from "../modal/PatientNoteModal";
import BhmsButton from "../heroComponents/BhmsButton";

const { Panel } = Collapse;

const PatientNotes = ({ patient_notes, general_handler, visit_id }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commentTexts, setCommentTexts] = useState({});
  const [availableVoices, setAvailableVoices] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpeakingNote, setCurrentSpeakingNote] = useState(null);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const speechSynthesisRef = useRef(null);

  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.patientNote);
  const { loading: commentLoading } = useSelector((state) => state.noteComment);

  useEffect(() => {
    // Initialize speech synthesis
    speechSynthesisRef.current = window.speechSynthesis;

    // Load available voices on mount
    const loadVoices = () => {
      const voices = speechSynthesisRef.current.getVoices();
      setAvailableVoices(voices);
      
      // Set default voice if not already set
      if (!selectedVoice && voices.length > 0) {
        const defaultVoice = getBestVoice(voices);
        setSelectedVoice(defaultVoice);
      }
    };

    // Chrome loads voices asynchronously
    if (speechSynthesisRef.current.onvoiceschanged !== undefined) {
      speechSynthesisRef.current.onvoiceschanged = loadVoices;
    }

    loadVoices();

    // Cleanup on unmount
    return () => {
      speechSynthesisRef.current.cancel();
    };
  }, []);

  // Get the best available human-like voice
  const getBestVoice = (voices = availableVoices) => {
    // Preferred voices (try these first)
    const preferredVoices = [
      "Google UK English Female",
      "Microsoft Hazel Desktop - English (Great Britain)",
      "Microsoft Zira Desktop - English (United States)",
      "Google US English",
      "Karen", // macOS voice
      "Samantha" // macOS voice
    ];

    // Try to find preferred voices first
    for (const voiceName of preferredVoices) {
      const voice = voices.find(v => v.name.includes(voiceName));
      if (voice) return voice;
    }

    // Fallback to any English female voice
    const femaleVoice = voices.find(v => 
      v.lang.startsWith("en") && 
      v.name.toLowerCase().includes("female")
    );
    if (femaleVoice) return femaleVoice;

    // Final fallback to any English voice
    const englishVoice = voices.find(v => v.lang.startsWith("en"));
    return englishVoice || null;
  };

  const speakNote = (noteId, text) => {
    if (!text) return;

    // If already speaking this note, stop it
    if (isSpeaking && currentSpeakingNote === noteId) {
      stopSpeaking();
      return;
    }

    // If speaking another note, stop it first
    if (isSpeaking) {
      stopSpeaking();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = selectedVoice || getBestVoice();
    
    if (voice) {
      utterance.voice = voice;
      utterance.rate = speechRate;
      utterance.pitch = 1.0; // Normal pitch
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setCurrentSpeakingNote(noteId);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentSpeakingNote(null);
    };

    utterance.onerror = (event) => {
      console.error("SpeechSynthesis error:", event);
      setIsSpeaking(false);
      setCurrentSpeakingNote(null);
      message.error("Failed to read note aloud");
    };

    speechSynthesisRef.current.cancel(); // Stop any ongoing speech
    speechSynthesisRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    speechSynthesisRef.current.cancel();
    setIsSpeaking(false);
    setCurrentSpeakingNote(null);
  };

  const handleSaveNote = (note) => {
    const data = {
      ...note,
      visit_id: visit_id
    };
    dispatch(createPatientNote(data))
      .unwrap()
      .then(() => {
        message.success("Note created successfully");
        dispatch(fetchPatientNotes({ visit_id }));
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
        setCommentTexts((prev) => ({ ...prev, [noteId]: "" }));
        dispatch(fetchPatientNotes({ patient_id: visit_id }));
      })
      .catch(() => message.error("Failed to add comment"));
  };

  return (
    <Card
      title={
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>Patient Notes</span>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Tooltip title="Stop all speech">
              <Button
                shape="circle"
                icon={<PauseOutlined />}
                onClick={stopSpeaking}
                disabled={!isSpeaking}
                style={{ marginRight: 8 }}
              />
            </Tooltip>
            <Tooltip title="Add Nurse's Note">
              <Avatar
                size={28}
                icon={<PlusOutlined />}
                style={{ backgroundColor: "#1890ff", cursor: "pointer" }}
                onClick={() => setIsModalOpen(true)}
              />
            </Tooltip>
          </div>
        </div>
      }
      bordered
      style={{ marginTop: 20 }}
      extra={
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ marginRight: 8 }}>Speed:</span>
          <Slider
            min={0.5}
            max={2}
            step={0.1}
            value={speechRate}
            onChange={setSpeechRate}
            tipFormatter={value => `${value}x`}
            style={{ width: 100 }}
          />
        </div>
      }
    >
      {!patient_notes || patient_notes.length === 0 ? (
        <Empty description="No Patient Notes Available" style={{ margin: "20px 0" }} />
      ) : (
        <List
          dataSource={patient_notes}
          renderItem={(note) => (
            <Card key={note.id} style={{ marginBottom: 10, padding: 10 }} bordered>
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} src={note.staff?.profile_pic} />}
                  title={
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <strong>{note.staff?.firstName} {note.staff?.lastName}</strong>
                      <Tooltip title={isSpeaking && currentSpeakingNote === note.id ? "Stop reading" : "Read note aloud"}>
                        <Button
                          shape="circle"
                          icon={<SoundOutlined />}
                          onClick={() => speakNote(note.id, note.note)}
                          type={isSpeaking && currentSpeakingNote === note.id ? "primary" : "default"}
                          loading={isSpeaking && currentSpeakingNote === note.id}
                        />
                      </Tooltip>
                    </div>
                  }
                  description={
                    <>
                      <p>{note.note}</p>
                      <small style={{ color: "gray" }}>{moment(note.createdAt).fromNow()}</small>
                    </>
                  }
                />
              </List.Item>

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

              <Collapse style={{ marginTop: 10 }}>
                <Panel
                  header={<><CommentOutlined /> Comments ({note.comments?.length || 0})</>}
                  key={note.id}
                >
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

      <PatientNoteModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveNote}
        patient_id={visit_id}
        status={status}
      />
    </Card>
  );
};

export default PatientNotes;