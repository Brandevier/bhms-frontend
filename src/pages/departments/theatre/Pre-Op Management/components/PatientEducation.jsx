import React, { useState, useEffect } from 'react';
import {
  Card,
  Collapse,
  Button,
  List,
  Tag,
  Divider,
  Progress,
  Checkbox,
  Alert,
  Space,
  Badge
} from 'antd';
import {
  FileTextOutlined,
  CheckOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  CalendarOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchOrCreateEducation,
  updateEducation,
} from '../../../../../redux/slice/theatre/educationMaterialsSlice';

const { Panel } = Collapse;

const PatientEducation = ({ patient }) => {
  const dispatch = useDispatch();

  // 🔹 Redux state
  const { materials, loading, error } = useSelector((state) => state.educationMaterial);

  // 🔹 Fetch or create education record when patient changes
  useEffect(() => {
    if (patient) {
      dispatch(fetchOrCreateEducation({
        visit_id: patient?.visit?.id,
        surgery_schedule_id: patient?.id,
      }));
    }
  }, [patient, dispatch]);

  // 🧠 Local copy of materials_data (so user can mark viewed before saving)
  const [educationMaterials, setEducationMaterials] = useState([]);

  // 🔹 When Redux updates, sync with local
  useEffect(() => {
    if (materials?.materials_data) {
      setEducationMaterials(materials.materials_data);
    }
  }, [materials]);

  // 🧩 Handle marking a section viewed/unviewed
  const handleMarkViewed = (key, viewed) => {
    const updated = educationMaterials.map((material) =>
      material.key === key ? { ...material, viewed } : material
    );
    setEducationMaterials(updated);

    // Persist change to backend
    dispatch(
      updateEducation({
        id: materials.id,
        materials_data: updated,
      })
    );
  };

  // 🧩 Mark all sections viewed
  const handleMarkAllViewed = () => {
    const updated = educationMaterials.map((m) => ({ ...m, viewed: true }));
    setEducationMaterials(updated);

    dispatch(
      updateEducation({
        id: materials.id,
        materials_data: updated,
      })
    );
  };

  // 🧩 Compute completion stats
  const completedCount = educationMaterials.filter((m) => m.viewed).length;
  const totalCount = educationMaterials.length || 0;
  const completionPercentage = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

  // 🧩 Handle empty patient
  if (!patient) {
    return (
      <div className="flex justify-center items-center h-64">
        <Alert
          message="No Patient Selected"
          description="Please select a patient from the theatre list to view education materials."
          type="info"
          showIcon
        />
      </div>
    );
  }

  // 🧩 Extract patient details
  const patientName = patient.patient?.name || 'Unknown Patient';
  const primaryProcedure = patient.procedure?.primary || 'No procedure specified';
  const surgeryDate = patient.schedule?.formattedDate || 'Not scheduled';
  const surgeryTime = patient.schedule?.formattedTime || '';
  const folderNumber = patient.patient?.folderNumber || 'N/A';

  // 🧩 Loading / Error states
  if (loading) {
    return <Alert message="Loading patient education data..." type="info" showIcon />;
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  return (
    <div className="p-4">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-semibold flex items-center">
            <FileTextOutlined className="mr-3 text-blue-600" />
            Patient Education
          </h2>
          <div className="mt-2 space-y-1 text-gray-600">
            <div className="flex items-center">
              <UserOutlined className="mr-2" />
              <span className="font-medium">{patientName}</span>
              <Badge count={folderNumber} style={{ backgroundColor: '#1890ff', marginLeft: 8 }} />
            </div>
            <div className="flex items-center">
              <MedicineBoxOutlined className="mr-2" />
              <span>{primaryProcedure}</span>
            </div>
            <div className="flex items-center">
              <CalendarOutlined className="mr-2" />
              <span>
                {surgeryDate}
                {surgeryTime && ` at ${surgeryTime}`}
              </span>
            </div>
          </div>
        </div>

        <Space direction="vertical" align="end">
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={handleMarkAllViewed}
            disabled={completionPercentage === 100}
            size="large"
          >
            Mark All Complete
          </Button>
          <div className="text-sm text-gray-500">
            {completedCount} of {totalCount} sections complete
          </div>
        </Space>
      </div>

      <Divider className="my-4" />

      {/* Progress Overview */}
      <Card className="mb-6 shadow-sm border" size="small">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-gray-600 mr-4 font-medium">Education Completion:</span>
            <span
              className={`text-lg font-bold ${
                completionPercentage === 100 ? 'text-green-600' : 'text-blue-600'
              }`}
            >
              {completionPercentage}%
            </span>
          </div>
          <Progress
            percent={completionPercentage}
            strokeColor={completionPercentage === 100 ? '#52c41a' : '#1890ff'}
            style={{ width: '300px' }}
            showInfo={false}
          />
        </div>
      </Card>

      {/* Education Materials */}
      <Card
        title={
          <Space>
            <FileTextOutlined />
            Educational Materials
            <Badge count={totalCount} showZero style={{ backgroundColor: '#1890ff' }} />
          </Space>
        }
        className="mb-6 shadow-sm border"
        extra={
          <Tag color={completionPercentage === 100 ? 'green' : 'blue'}>
            {completionPercentage === 100 ? 'All Complete' : 'In Progress'}
          </Tag>
        }
      >
        <List
          dataSource={educationMaterials}
          renderItem={(material) => (
            <List.Item
              className="mb-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
              actions={[
                <Checkbox
                  checked={material.viewed}
                  onChange={(e) => handleMarkViewed(material.key, e.target.checked)}
                  className={material.viewed ? 'text-green-600' : ''}
                >
                  {material.viewed ? 'Completed' : 'Mark Complete'}
                </Checkbox>,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <div
                    className={`p-3 rounded-full ${
                      material.viewed ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                    }`}
                  >
                    <FileTextOutlined className="text-lg" />
                  </div>
                }
                title={
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span
                        className={`text-lg ${
                          material.viewed
                            ? 'text-gray-600 line-through'
                            : 'font-semibold text-gray-900'
                        }`}
                      >
                        {material.title}
                      </span>
                      <Tag color="blue" className="ml-2 text-xs">
                        {material.category}
                      </Tag>
                    </div>
                    {material.viewed && (
                      <Tag icon={<CheckOutlined />} color="green" className="ml-2">
                        Reviewed
                      </Tag>
                    )}
                  </div>
                }
                description={
                  <Collapse ghost className="mt-2" expandIconPosition="end">
                    <Panel
                      header={
                        <span className="text-blue-600 font-medium">
                          View Details ({material.items.length} topics)
                        </span>
                      }
                      key="1"
                    >
                      <List
                        size="small"
                        dataSource={material.items}
                        renderItem={(item, index) => (
                          <List.Item className="border-0 py-2">
                            <div className="flex items-center w-full">
                              <div
                                className={`w-2 h-2 rounded-full mr-3 ${
                                  material.viewed ? 'bg-green-500' : 'bg-gray-300'
                                }`}
                              />
                              <span
                                className={
                                  material.viewed ? 'text-gray-600' : 'text-gray-800'
                                }
                              >
                                {item}
                              </span>
                            </div>
                          </List.Item>
                        )}
                        className="bg-gray-50 rounded-lg p-2"
                      />
                    </Panel>
                  </Collapse>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      {/* Completion Status */}
      {completionPercentage === 100 && (
        <Alert
          message="Education Complete"
          description="All patient education materials have been reviewed and completed."
          type="success"
          showIcon
          className="mt-6"
        />
      )}
    </div>
  );
};

export default PatientEducation;
