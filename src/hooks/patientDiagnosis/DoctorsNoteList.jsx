// Updated DoctorsNoteList.js
import React, { useState } from "react";
import {
    Card,
    Row,
    Col,
    Typography,
    Button,
    Space,
    Tag,
    Avatar,
    Tooltip,
    Modal,
    message,
    Badge,
    Divider,
    Popconfirm
} from "antd";
import {
    EyeOutlined,
    EditOutlined,
    DeleteOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    LockOutlined,
    UserOutlined,
    CalendarOutlined,
    FileTextOutlined,
    SignatureOutlined,
    CopyOutlined,
    CheckOutlined,
    SafetyCertificateOutlined
} from "@ant-design/icons";
import { useDispatch,useSelector } from "react-redux";
import { format } from "date-fns";
import { signDoctorsNote } from "../../redux/slice/doctorsNoteSlice";
const { Title, Text } = Typography;

const DoctorsNoteList = ({
    notes,
    loading,
    onView,
    onEdit,
    onDelete,
    onSign,  // New prop for signing notes
    canEdit = true,
    canSign = true  // New prop to control who can sign
}) => {
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [signModalVisible, setSignModalVisible] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);
    const { loading:signing } = useSelector((state) => state.doctorsNote)
    const dispatch = useDispatch();

    const handleDeleteClick = (note) => {
        setSelectedNote(note);
        setDeleteModalVisible(true);
    };

    const handleSignClick = (note) => {
        // setSelectedNote(note);
        // setSignModalVisible(true);
        dispatch(signDoctorsNote(note.id)).unwrap().then((res) => {
            message.success('')
            setSelectedNote(note);
            setSignModalVisible(true);
        })
    };

    const confirmDelete = () => {
        if (selectedNote) {
            onDelete(selectedNote.id);
            setDeleteModalVisible(false);
            setSelectedNote(null);
        }
    };

    const confirmSign = async () => {
        if (!selectedNote) return;

        try {
            await onSign(selectedNote.id);
            message.success("Note signed successfully!");
            setSignModalVisible(false);
            setSelectedNote(null);
        } catch (error) {
            message.error("Failed to sign note");
        } finally {
        }
    };

    const cancelDelete = () => {
        setDeleteModalVisible(false);
        setSelectedNote(null);
    };

    const cancelSign = () => {
        setSignModalVisible(false);
        setSelectedNote(null);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Not signed";
        try {
            return format(new Date(dateString), "MMM dd, yyyy HH:mm");
        } catch (error) {
            return dateString;
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'critical':
                return 'red';
            case 'high':
                return 'orange';
            case 'medium':
                return 'blue';
            case 'low':
                return 'green';
            default:
                return 'default';
        }
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'consultation':
                return '👨‍⚕️';
            case 'followup':
                return '📅';
            case 'procedure':
                return '🔬';
            case 'assessment':
                return '📋';
            default:
                return '📝';
        }
    };

    // Extract text from HTML for preview
    const extractTextFromHTML = (html) => {
        if (!html) return '';
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        return tempDiv.textContent || tempDiv.innerText || '';
    };

    return (
        <>
            <div className="doctors-note-list">
                {notes.length === 0 ? (
                    <Card>
                        <div style={{ textAlign: 'center', padding: '40px 0' }}>
                            <FileTextOutlined style={{ fontSize: 48, color: '#ccc', marginBottom: 16 }} />
                            <Title level={5} type="secondary">
                                No Doctor's Notes Found
                            </Title>
                            <Text type="secondary">
                                No doctor's notes have been created for this patient yet.
                            </Text>
                        </div>
                    </Card>
                ) : (
                    notes.map((note) => {
                        const noteText = extractTextFromHTML(note.note);
                        const isSigned = note.is_signed;

                        return (
                            <Card
                                key={note.id}
                                style={{
                                    marginBottom: 16,
                                    borderLeft: isSigned ? '4px solid #52c41a' : '4px solid #d9d9d9'
                                }}
                                title={
                                    <Row justify="space-between" align="middle">
                                        <Col>
                                            <Space>
                                                <FileTextOutlined style={{ color: isSigned ? '#52c41a' : '#1890ff' }} />
                                                <Text strong>{note.title || "Untitled Note"}</Text>
                                                {isSigned ? (
                                                    <Tag icon={<CheckCircleOutlined />} color="green">
                                                        Signed
                                                    </Tag>
                                                ) : (
                                                    <Tag icon={<ClockCircleOutlined />} color="orange">
                                                        Draft
                                                    </Tag>
                                                )}
                                                <Tag color={getPriorityColor(note.priority)}>
                                                    {note.priority?.toUpperCase()}
                                                </Tag>
                                                <Tag>
                                                    {getCategoryIcon(note.category)} {note.category}
                                                </Tag>
                                            </Space>
                                        </Col>
                                        <Col>
                                            <Space>
                                                {isSigned && (
                                                    <Tooltip title="Signed and locked">
                                                        <LockOutlined style={{ color: '#52c41a' }} />
                                                    </Tooltip>
                                                )}
                                                <Text type="secondary" style={{ fontSize: 12 }}>
                                                    {formatDate(note.createdAt || note.created_at)}
                                                </Text>
                                            </Space>
                                        </Col>
                                    </Row>
                                }
                                extra={
                                    <Space>
                                        {!isSigned && canEdit && (
                                            <>
                                                <Tooltip title="Edit Note">
                                                    <Button
                                                        type="text"
                                                        icon={<EditOutlined />}
                                                        onClick={() => onEdit(note)}
                                                        size="small"
                                                    />
                                                </Tooltip>
                                                <Tooltip title="Delete Note">
                                                    <Button
                                                        type="text"
                                                        icon={<DeleteOutlined />}
                                                        onClick={() => handleDeleteClick(note)}
                                                        size="small"
                                                        danger
                                                    />
                                                </Tooltip>
                                            </>
                                        )}

                                        {!isSigned && canSign && (
                                            <Tooltip title="Sign Note">
                                                <Button
                                                    type="text"
                                                    icon={<SignatureOutlined />}
                                                    onClick={() => handleSignClick(note)}
                                                    size="small"
                                                    style={{ color: '#fa8c16' }}
                                                />
                                            </Tooltip>
                                        )}

                                        <Tooltip title="View Details">
                                            <Button
                                                type="text"
                                                icon={<EyeOutlined />}
                                                onClick={() => onView(note)}
                                                size="small"
                                            />
                                        </Tooltip>
                                    </Space>
                                }
                            >
                                <Row gutter={[16, 16]}>
                                    <Col span={24}>
                                        <div
                                            style={{
                                                maxHeight: 150,
                                                overflow: 'hidden',
                                                position: 'relative'
                                            }}
                                        >
                                            <div
                                                style={{
                                                    whiteSpace: 'pre-wrap',
                                                    wordBreak: 'break-word'
                                                }}
                                            >
                                                {noteText.substring(0, 500) + (noteText.length > 500 ? '...' : '')}
                                            </div>
                                            {noteText.length > 500 && (
                                                <div
                                                    style={{
                                                        position: 'absolute',
                                                        bottom: 0,
                                                        left: 0,
                                                        right: 0,
                                                        height: 40,
                                                        background: 'linear-gradient(transparent, white)',
                                                        pointerEvents: 'none'
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </Col>

                                    <Col span={24}>
                                        <Divider style={{ margin: '12px 0' }} />

                                        <Row justify="space-between" align="middle">
                                            <Col>
                                                <Space>
                                                    <Tooltip title="Author">
                                                        <Space>
                                                            <Avatar
                                                                size="small"
                                                                src={note.Staff?.profileImage}
                                                                icon={<UserOutlined />}
                                                            />
                                                            <Text type="secondary" style={{ fontSize: 12 }}>
                                                                {note.Staff?.firstName} {note.Staff?.lastName}
                                                            </Text>
                                                        </Space>
                                                    </Tooltip>

                                                    {isSigned && note.signed_at ? (
                                                        <Tooltip title="Signed Date">
                                                            <Space>
                                                                <SignatureOutlined style={{ color: '#52c41a' }} />
                                                                <Text type="secondary" style={{ fontSize: 12 }}>
                                                                    Signed: {formatDate(note.signed_at)}
                                                                </Text>
                                                            </Space>
                                                        </Tooltip>
                                                    ) : (
                                                        <Tooltip title="Not signed yet">
                                                            <Space>
                                                                <ClockCircleOutlined style={{ color: '#fa8c16' }} />
                                                                <Text type="secondary" style={{ fontSize: 12 }}>
                                                                    Awaiting signature
                                                                </Text>
                                                            </Space>
                                                        </Tooltip>
                                                    )}
                                                </Space>
                                            </Col>

                                            <Col>
                                                <Space>
                                                    {note.tags && note.tags.length > 0 && (
                                                        <Space wrap size={[0, 4]}>
                                                            {note.tags.slice(0, 3).map((tag, index) => (
                                                                <Tag key={index} size="small">
                                                                    {tag}
                                                                </Tag>
                                                            ))}
                                                            {note.tags.length > 3 && (
                                                                <Tag size="small">+{note.tags.length - 3}</Tag>
                                                            )}
                                                        </Space>
                                                    )}
                                                </Space>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Card>
                        );
                    })
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <Modal
                title="Confirm Delete"
                open={deleteModalVisible}
                onOk={confirmDelete}
                onCancel={cancelDelete}
                okText="Delete"
                cancelText="Cancel"
                okType="danger"
            >
                <p>Are you sure you want to delete this doctor's note?</p>
                <p>
                    <Text strong>{selectedNote?.title || "Untitled Note"}</Text>
                </p>
                <Text type="warning">
                    This action cannot be undone. Once deleted, the note cannot be recovered.
                </Text>
            </Modal>

            {/* Sign Confirmation Modal */}
            <Modal
                title={
                    <Space>
                        <SafetyCertificateOutlined style={{ color: '#fa8c16' }} />
                        <span>Sign Doctor's Note</span>
                    </Space>
                }
                open={signModalVisible}
                onOk={confirmSign}
                onCancel={cancelSign}
                okText={signing ? "Signing..." : "Confirm & Sign"}
                cancelText="Cancel"
                okButtonProps={{
                    type: 'primary',
                    loading: signing,
                    icon: <CheckOutlined />
                }}
            >
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Text strong>Are you sure you want to sign this note?</Text>

                    <Card size="small">
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Row justify="space-between">
                                <Text type="secondary">Title:</Text>
                                <Text strong>{selectedNote?.title || "Untitled Note"}</Text>
                            </Row>
                            <Row justify="space-between">
                                <Text type="secondary">Created:</Text>
                                <Text>{formatDate(selectedNote?.createdAt || selectedNote?.created_at)}</Text>
                            </Row>
                            <Row justify="space-between">
                                <Text type="secondary">Author:</Text>
                                <Text>
                                    {selectedNote?.Staff?.firstName} {selectedNote?.Staff?.lastName}
                                </Text>
                            </Row>
                        </Space>
                    </Card>

                    <Alert
                        type="warning"
                        message="Important Notice"
                        description={
                            <Space direction="vertical" size="small">
                                <Text>Once signed:</Text>
                                <ul style={{ margin: 0, paddingLeft: 20 }}>
                                    <li>The note will be locked and cannot be edited</li>
                                    <li>The signature will be recorded with timestamp</li>
                                    <li>The note will be considered a legal document</li>
                                    <li>Changes will require a new note with proper documentation</li>
                                </ul>
                            </Space>
                        }
                        showIcon
                    />

                    <Text type="secondary" style={{ fontSize: 12 }}>
                        By signing, you confirm that this note accurately reflects your medical assessment.
                    </Text>
                </Space>
            </Modal>
        </>
    );
};

// Import Alert if not already imported
import { Alert } from "antd";

export default DoctorsNoteList;