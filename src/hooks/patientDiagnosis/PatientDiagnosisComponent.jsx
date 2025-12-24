// Updated PatientDiagnosis.js
import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom'
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Tabs, 
  Button, 
  Space, 
  Badge,
  Empty,
  Dropdown,
  Menu
} from "antd";
import { 
  FileTextOutlined,
  PlusOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  BookOutlined,
  DownOutlined
} from "@ant-design/icons";

import { useDispatch, useSelector } from "react-redux";
import { deleteDiagnosis } from "../../redux/slice/diagnosisSlice";
import { message } from "antd";
import { 
  createDoctorsNote, 
  getNotesByVisit,
  updateDoctorsNote,
  deleteDoctorsNote 
} from "../../redux/slice/doctorsNoteSlice";

// Import components
import DiagnosisCard from "./DiagnosisCard"; 
import DiagnosisDetailModal from "./DiagnosisDetailModal";
import DoctorsNoteModal from "./DoctorsNoteModal";
import DoctorsNoteList from "./DoctorsNoteList"; // New component
import DoctorsNoteViewModal from "./DoctorsNoteViewModal"; // New component
import DiagnosisStats from "./DiagnosisStats";
import { filterDiagnosesByType, sortDiagnosesByDate } from "./utils";
import { styles } from "./style";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const PatientDiagnosis = ({ diagnosis, onSubmit }) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("all");
  const [loadingId, setLoadingId] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [doctorsNoteModalVisible, setDoctorsNoteModalVisible] = useState(false);
  const [doctorsNoteViewModalVisible, setDoctorsNoteViewModalVisible] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
  
  const { loading } = useSelector((state) => state.diagnosis);
  const { notes, loading: noteLoading } = useSelector((state) => state.doctorsNote);
  const { user } = useSelector((state) => state.auth);
  const { id } = useParams();
  const department_id = localStorage.getItem('department_id');

  // Fetch doctor's notes on component mount and when activeTab changes
  useEffect(() => {
    if (activeTab === "doctors_note") {
      dispatch(getNotesByVisit(id));
    }
  }, [dispatch, id, activeTab]);

  // Sort diagnoses by date (newest first)
  const sortedDiagnoses = sortDiagnosesByDate(diagnosis || [], false);

  // Sort doctor's notes by date (newest first)
  const sortedNotes = [...(notes || [])].sort((a, b) => 
    new Date(b.createdAt || b.created_at) - new Date(a.createdAt || a.created_at)
  );

  // Filter diagnoses based on active tab
  const filteredDiagnoses = filterDiagnosesByType(sortedDiagnoses, activeTab);

  const handleViewDetails = (diagnosis) => {
    setSelectedDiagnosis(diagnosis);
    setDetailModalVisible(true);
  };

  const handleEdit = (diagnosis) => {
    console.log("Edit Diagnosis:", diagnosis);
  };

  const handleDelete = async (id) => {
    setLoadingId(id);
    try {
      await dispatch(deleteDiagnosis(id)).unwrap();
      message.success("Diagnosis deleted successfully");
      onSubmit?.();
    } catch (error) {
      message.error("Failed to delete diagnosis");
    } finally {
      setLoadingId(null);
    }
  };

  // Doctor's Note handlers
  const handleViewNote = (note) => {
    setSelectedNote(note);
    setDoctorsNoteViewModalVisible(true);
  };

  const handleEditNote = (note) => {
    if (note.is_signed) {
      message.warning("Cannot edit a signed note");
      return;
    }
    setEditingNote(note);
    setDoctorsNoteModalVisible(true);
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await dispatch(deleteDoctorsNote(noteId)).unwrap();
      message.success("Doctor's note deleted successfully");
      dispatch(getNotesByVisit(id)); // Refresh the list
    } catch (error) {
      message.error("Failed to delete doctor's note");
    }
  };

  const handleAddDoctorsNote = (noteData) => {
    const data = {
      ...noteData,
      visit_id: id,
      institution_id: user?.institution?.id,
      department_id,
      staff_id: user.id
    };

    if (editingNote) {
      // Update existing note
      dispatch(updateDoctorsNote({ id: editingNote.id, data })).unwrap()
        .then(() => {
          message.success("Doctor's note updated successfully");
          setDoctorsNoteModalVisible(false);
          setEditingNote(null);
          dispatch(getNotesByVisit(id));
          onSubmit?.();
        })
        .catch(() => {
          message.error("Failed to update doctor's note");
        });
    } else {
      // Create new note
      dispatch(createDoctorsNote(data)).unwrap()
        .then(() => {
          message.success("Doctor's note added successfully");
          setDoctorsNoteModalVisible(false);
          dispatch(getNotesByVisit(id));
          onSubmit?.();
        })
        .catch(() => {
          message.error("Failed to add doctor's note");
        });
    }
  };

  const handleAddNewNote = () => {
    setEditingNote(null);
    setDoctorsNoteModalVisible(true);
  };

  // Count signed notes
  const signedNotesCount = sortedNotes.filter(note => note.is_signed).length;
  const unsignedNotesCount = sortedNotes.filter(note => !note.is_signed).length;

  // Create dropdown menu for "Add New" button
  const addMenu = (
    <Menu onClick={({ key }) => {
      if (key === 'diagnosis') {
        console.log("Add new diagnosis");
      } else if (key === 'doctors_note') {
        handleAddNewNote();
      } else if (key === 'prescription') {
        console.log("Add prescription");
      }
    }}>
      <Menu.Item key="diagnosis" icon={<FileTextOutlined />}>
        New Diagnosis
      </Menu.Item>
      <Menu.Item key="doctors_note" icon={<BookOutlined />}>
        Doctor's Note
      </Menu.Item>
      <Menu.Item key="prescription" icon={<FileTextOutlined />}>
        Prescription
      </Menu.Item>
    </Menu>
  );

  const tabItems = [
    {
      key: "all",
      label: (
        <Space>
          <FileTextOutlined />
          All Diagnoses
          <Badge 
            count={sortedDiagnoses.length} 
            showZero 
            style={{ backgroundColor: '#1890ff' }}
          />
        </Space>
      )
    },
    {
      key: "confirmed_diagnosis",
      label: (
        <Space>
          <CheckCircleOutlined style={{ color: '#52c41a' }} />
          Confirmed
          <Badge 
            count={filterDiagnosesByType(sortedDiagnoses, 'confirmed_diagnosis').length}
            style={{ backgroundColor: '#52c41a' }}
          />
        </Space>
      )
    },
    {
      key: "provisional_diagnosis",
      label: (
        <Space>
          <ClockCircleOutlined style={{ color: '#fa8c16' }} />
          Provisional
          <Badge 
            count={filterDiagnosesByType(sortedDiagnoses, 'provisional_diagnosis').length}
            style={{ backgroundColor: '#fa8c16' }}
          />
        </Space>
      )
    },
    {
      key: "doctors_note",
      label: (
        <Space>
          <BookOutlined style={{ color: '#722ed1' }} />
          Doctors Note
          <Badge 
            count={sortedNotes.length}
            style={{ backgroundColor: '#722ed1' }}
            overflowCount={99}
          >
            <Space>
              <Badge 
                count={signedNotesCount} 
                style={{ backgroundColor: '#52c41a', marginRight: 4 }}
                size="small"
              />
              <Badge 
                count={unsignedNotesCount} 
                style={{ backgroundColor: '#faad14' }}
                size="small"
              />
            </Space>
          </Badge>
        </Space>
      )
    }
  ];

  const renderContent = () => {
    if (activeTab === "doctors_note") {
      if (sortedNotes.length === 0) {
        return (
          <Empty 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div>
                <Title level={5} type="secondary">
                  No Doctor's Notes Found
                </Title>
                <Text type="secondary">
                  No doctor's notes have been created for this patient yet.
                </Text>
              </div>
            }
            style={{ margin: '40px 0' }}
          >
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleAddNewNote}
            >
              Add First Doctor's Note
            </Button>
          </Empty>
        );
      }

      return (
        <DoctorsNoteList
          notes={sortedNotes}
          loading={noteLoading}
          onView={handleViewNote}
          onEdit={handleEditNote}
          onDelete={handleDeleteNote}
          canEdit={true}
        />
      );
    } else {
      if (filteredDiagnoses.length === 0) {
        return (
          <Empty 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div>
                <Title level={5} type="secondary">
                  No {activeTab === 'all' ? '' : activeTab.replace('_', ' ')} diagnoses found
                </Title>
                <Text type="secondary">
                  {activeTab === 'all' 
                    ? 'No diagnosis records available for this patient.'
                    : `No ${activeTab.replace('_', ' ')} diagnoses found.`
                  }
                </Text>
              </div>
            }
            style={{ margin: '40px 0' }}
          >
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => {
                if (activeTab === 'doctors_note') {
                  handleAddNewNote();
                } else {
                  console.log("Add new diagnosis");
                }
              }}
            >
              Add {activeTab === 'doctors_note' ? 'Doctor\'s Note' : 'First Diagnosis'}
            </Button>
          </Empty>
        );
      }

      return (
        <div className="diagnosis-list">
          {filteredDiagnoses.map((item) => (
            <DiagnosisCard
              key={item.id}
              item={item}
              onViewDetails={handleViewDetails}
              onEdit={handleEdit}
              onDelete={handleDelete}
              loadingId={loadingId}
            />
          ))}
        </div>
      );
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card 
        style={styles.mainCard}
        bodyStyle={{ padding: '24px' }}
      >
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <Title level={3} style={{ margin: 0 }}>Patient Diagnosis</Title>
            <Text type="secondary">
              Review and manage patient diagnosis records
            </Text>
          </Col>
          <Col>
            <Dropdown 
              overlay={addMenu} 
              placement="bottomRight"
              trigger={['click']}
            >
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={(e) => e.preventDefault()}
              >
                Add New
                <DownOutlined />
              </Button>
            </Dropdown>
          </Col>
        </Row>

        {/* Statistics - Update to include doctor's notes */}
        <DiagnosisStats 
          diagnoses={sortedDiagnoses}
          doctorsNotes={sortedNotes}
        />

        {/* Diagnosis Tabs */}
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          type="card"
          items={tabItems}
        />

        {/* Content based on active tab */}
        {renderContent()}

        {/* Detail Modal */}
        <DiagnosisDetailModal
          visible={detailModalVisible}
          diagnosis={selectedDiagnosis}
          onClose={() => setDetailModalVisible(false)}
          onEdit={handleEdit}
        />

        {/* Doctor's Note Modal */}
        <DoctorsNoteModal
          visible={doctorsNoteModalVisible}
          onClose={() => {
            setDoctorsNoteModalVisible(false);
            setEditingNote(null);
          }}
          onSave={handleAddDoctorsNote}
          loading={noteLoading}
          initialData={editingNote}
        />

        {/* Doctor's Note View Modal */}
        <DoctorsNoteViewModal
          visible={doctorsNoteViewModalVisible}
          note={selectedNote}
          onClose={() => setDoctorsNoteViewModalVisible(false)}
        />
      </Card>
    </div>
  );
};

export default PatientDiagnosis; 