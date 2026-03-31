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
  DownOutlined,
  MessageOutlined,
  HistoryOutlined,
  MedicineBoxOutlined,
  EyeInvisibleOutlined,
  HeartOutlined
} from "@ant-design/icons";

import { useDispatch, useSelector } from "react-redux";
import { deleteDiagnosis, addDiagnosis } from "../../redux/slice/diagnosisSlice";
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
import DoctorsNoteList from "./DoctorsNoteList";
import DoctorsNoteViewModal from "./DoctorsNoteViewModal";
import DiagnosisStats from "./DiagnosisStats";
import { filterDiagnosesByType, sortDiagnosesByDate } from "./utils";
import { styles } from "./style";

// Import new components for tabs
import PatientComplainsTab from "./PatientComplainsTab";
import PastMedicalHistoryTab from "./PastMedicalHistoryTab";
import DrugHistoryTab from "./DrugHistoryTab";
import ObstetricHistoryTab from "./ObstetricHistoryTab";
import OccupationalHistoryTab from "./OccupationalHistoryTab";
import OETab from "./OETab"; // On Examination Tab
import DiagnosisDrawer from "../../drawers/DiagnosisDrawer";
import AIPanel from "../patientAI/AIPanel";

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
  const [addDiagnosisModalVisible, setAddDiagnosisModalVisible] = useState(false);

  const { loading, addDiagnosisStatus } = useSelector((state) => state.diagnosis);
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
      dispatch(getNotesByVisit(id));
    } catch (error) {
      message.error("Failed to delete doctor's note");
    }
  };

  const handleAddDiagnosis = async (diagnosisData) => {
    try {
      const data = {
        ...diagnosisData,
        visit_id: id,
      };
      await dispatch(addDiagnosis(data)).unwrap();
      message.success("Diagnosis added successfully");
      setAddDiagnosisModalVisible(false);
      onSubmit?.();
    } catch (error) {
      message.error("Failed to add diagnosis");
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
        setAddDiagnosisModalVisible(true);
      } else if (key === 'doctors_note') {
        handleAddNewNote();
      } else if (key === 'patient_complains') {
        console.log("Add Patient Complains");
      } else if (key === 'pmh') {
        console.log("Add Past Medical History");
      } else if (key === 'dh') {
        console.log("Add Drug History");
      } else if (key === 'oh') {
        console.log("Add Obstetric History");
      } else if (key === 'odq') {
        console.log("Add Occupational History");
      } else if (key === 'oe') {
        console.log("Add On Examination");
      }
    }}>
      <Menu.Item key="diagnosis" icon={<FileTextOutlined />}>
        New Diagnosis
      </Menu.Item>
      <Menu.Item key="patient_complains" icon={<MessageOutlined />}>
        Patient Complains
      </Menu.Item>
      <Menu.Item key="pmh" icon={<HistoryOutlined />}>
        Past Medical History
      </Menu.Item>
      <Menu.Item key="dh" icon={<MedicineBoxOutlined />}>
        Drug History
      </Menu.Item>
      <Menu.Item key="oh" icon={<HeartOutlined />}>
        Obstetric History
      </Menu.Item>
      <Menu.Item key="odq" icon={<EyeInvisibleOutlined />}>
        Occupational History
      </Menu.Item>
      <Menu.Item key="oe" icon={<EyeOutlined />}>
        On Examination
      </Menu.Item>
      <Menu.Item key="doctors_note" icon={<BookOutlined />}>
        Doctor's Note
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
      key: "patient_complains",
      label: (
        <Space>
          <MessageOutlined style={{ color: '#13c2c2' }} />
          Patient Complains
          <Badge
            count={0}
            showZero
            style={{ backgroundColor: '#13c2c2' }}
          />
        </Space>
      )
    },
    {
      key: "pmh",
      label: (
        <Space>
          <HistoryOutlined style={{ color: '#722ed1' }} />
          PMH
          <Badge
            count={0}
            showZero
            style={{ backgroundColor: '#722ed1' }}
          />
        </Space>
      )
    },
    {
      key: "dh",
      label: (
        <Space>
          <MedicineBoxOutlined style={{ color: '#f5222d' }} />
          DH
          <Badge
            count={0}
            showZero
            style={{ backgroundColor: '#f5222d' }}
          />
        </Space>
      )
    },
    {
      key: "oh",
      label: (
        <Space>
          <HeartOutlined style={{ color: '#eb2f96' }} />
          OH
          <Badge
            count={0}
            showZero
            style={{ backgroundColor: '#eb2f96' }}
          />
        </Space>
      )
    },
    {
      key: "odq",
      label: (
        <Space>
          <EyeInvisibleOutlined style={{ color: '#fa8c16' }} />
          ODQ
          <Badge
            count={0}
            showZero
            style={{ backgroundColor: '#fa8c16' }}
          />
        </Space>
      )
    },
    {
      key: "oe",
      label: (
        <Space>
          <EyeOutlined style={{ color: '#52c41a' }} />
          OE
          <Badge
            count={0}
            showZero
            style={{ backgroundColor: '#52c41a' }}
          />
        </Space>
      )
    },
    {
      key: "doctors_note",
      label: (
        <Space>
          <BookOutlined style={{ color: '#1890ff' }} />
          Doctors Note
          <Badge
            count={sortedNotes.length}
            style={{ backgroundColor: '#1890ff' }}
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
    switch (activeTab) {
      case "doctors_note":
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

      case "patient_complains":
        return <PatientComplainsTab visitId={id} />;

      case "pmh":
        return <PastMedicalHistoryTab visitId={id} />;

      case "dh":
        return <DrugHistoryTab visitId={id} />;

      case "oh":
        return <ObstetricHistoryTab visitId={id} />;

      case "odq":
        return <OccupationalHistoryTab visitId={id} />;

      case "oe":
        return <OETab visitId={id} />;

      default:
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
                    setAddDiagnosisModalVisible(true);
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
<AIPanel patientId={id} visitId={id} />

        {/* Diagnosis Tabs */}
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          type="card"
          items={tabItems}
          tabBarStyle={{ marginBottom: 0 }}
          size="middle"
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
        
        {/* Diagnosis Drawer like PatientProfileHeader */}
        <DiagnosisDrawer
          visible={addDiagnosisModalVisible}
          onClose={() => setAddDiagnosisModalVisible(false)}
          visit_id={id}
          claim_id={null}
          onFinished={onSubmit}
        />
      </Card>
    </div>
  );
};

export default PatientDiagnosis;