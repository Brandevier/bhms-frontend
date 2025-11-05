import React, { useEffect } from 'react';
import { Checkbox, Card, List, Tag, Button, Divider, Badge, Alert, Space, Spin } from 'antd';
import {
  FileDoneOutlined,
  CheckOutlined,
  WarningOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import { fetchOrCreateChecklist, updateChecklist } from '../../../../../redux/slice/theatre/preOpChecklistSlice';
import { useDispatch, useSelector } from 'react-redux';

const PreOpChecklist = ({ patient }) => {
  const dispatch = useDispatch();
  const { checklist, loading } = useSelector((state) => state.preOpChecklist);

  // 🔹 Fetch checklist on mount or when patient changes
  useEffect(() => {
    if (patient) {
      dispatch(fetchOrCreateChecklist({
        visit_id: patient?.visit?.id,
        surgery_schedule_id: patient?.id,
      }));
    }
  }, [patient, dispatch]);

  // 🔸 Handle case when no patient is selected
  if (!patient) {
    return (
      <div className="flex justify-center items-center h-64">
        <Alert
          message="No Patient Selected"
          description="Please select a patient from the theatre list to view their pre-operative checklist."
          type="info"
          showIcon
        />
      </div>
    );
  }

  if (loading || !checklist) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" tip="Loading Checklist..." />
      </div>
    );
  }

  // 🔹 Safely extract patient details
  const patientName = patient.patient?.name || 'Unknown Patient';
  const primaryProcedure = patient.procedure?.primary || 'No procedure specified';
  const surgeryDate = patient.schedule?.formattedDate || 'Not scheduled';
  const surgeryTime = patient.schedule?.formattedTime || '';
  const diagnosis = patient.diagnosis?.primary || 'No diagnosis specified';

  // ✅ Use actual checklist data from Redux
  const checklistItems = checklist?.checklist_data || [];

  // 🔹 Status tag helper
  const getStatusTag = (status) => {
    switch (status) {
      case 'completed':
        return <Tag icon={<CheckOutlined />} color="green">Completed</Tag>;
      case 'pending':
        return <Tag icon={<WarningOutlined />} color="orange">Pending</Tag>;
      case 'not-started':
        return <Tag color="blue">Not Started</Tag>;
      case 'not-required':
        return <Tag color="default">Not Required</Tag>;
      default:
        return <Tag>Not Started</Tag>;
    }
  };

  // 🔹 Calculate progress
  const calculateProgress = () => {
    let totalItems = 0;
    let completedItems = 0;
    let requiredItems = 0;
    let completedRequired = 0;

    checklistItems.forEach((section) => {
      section.items.forEach((item) => {
        totalItems++;
        if (item.required) requiredItems++;
        if (item.status === 'completed') {
          completedItems++;
          if (item.required) completedRequired++;
        }
      });
    });

    return {
      totalItems,
      completedItems,
      requiredItems,
      completedRequired,
      overallProgress: totalItems ? Math.round((completedItems / totalItems) * 100) : 0,
      requiredProgress: requiredItems ? Math.round((completedRequired / requiredItems) * 100) : 0,
    };
  };

  const progress = calculateProgress();

  // 🔹 Toggle item status
  const handleToggleItem = (sectionId, itemId, checked) => {
    const updatedChecklist = checklistItems.map((section) => {
      if (section.id !== sectionId) return section;
      return {
        ...section,
        items: section.items.map((item) =>
          item.id === itemId
            ? { ...item, status: checked ? 'completed' : 'not-started' }
            : item
        ),
      };
    });

    dispatch(updateChecklist({
      id: checklist.id,
      checklist_data: updatedChecklist,
      status: 'in-progress',
    }));
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-semibold flex items-center">
            <FileDoneOutlined className="mr-3 text-blue-600" />
            Pre-Operative Checklist
          </h2>
          <div className="mt-2 space-y-1 text-gray-600">
            <div className="flex items-center">
              <UserOutlined className="mr-2" />
              <span className="font-medium">{patientName}</span>
              <Badge count={patient.patient?.folderNumber} style={{ backgroundColor: '#1890ff', marginLeft: 8 }} />
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
          <Button type="primary" size="large" disabled={progress.requiredProgress < 100}>
            Mark Checklist Complete
          </Button>
          <div className="text-xs text-gray-500 text-right">
            {progress.completedItems} of {progress.totalItems} items complete
          </div>
        </Space>
      </div>

      {/* Progress Overview */}
      <Card className="mb-6 shadow-sm" size="small">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{progress.overallProgress}%</div>
            <div className="text-xs text-gray-500">Overall Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {progress.completedRequired}/{progress.requiredItems}
            </div>
            <div className="text-xs text-gray-500">Required Items</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{progress.completedItems}</div>
            <div className="text-xs text-gray-500">Completed</div>
          </div>
        </div>
      </Card>

      <Divider orientation="left" className="text-sm font-medium">
        Diagnosis: {diagnosis}
      </Divider>

      {/* Checklist Sections */}
      <div className="space-y-4">
        {checklistItems.map((section) => (
          <Card
            key={section.id}
            title={
              <div className="flex justify-between items-center">
                <span className="font-medium">{section.category}</span>
                <Badge
                  count={section.items.filter((i) => i.status === 'completed').length}
                  showZero
                  style={{ backgroundColor: '#52c41a' }}
                />
              </div>
            }
            className="shadow-sm border"
            size="small"
          >
            <List
              itemLayout="horizontal"
              dataSource={section.items}
              renderItem={(item) => (
                <List.Item
                  className="hover:bg-gray-50 transition-colors"
                  actions={[
                    <Checkbox
                      checked={item.status === 'completed'}
                      disabled={item.status === 'not-required'}
                      onChange={(e) => handleToggleItem(section.id, item.id, e.target.checked)}
                    />,
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className={item.required ? 'font-medium text-gray-900' : 'text-gray-600'}>
                            {item.name}
                          </span>
                          {!item.required && <Tag size="small" className="ml-2">Optional</Tag>}
                        </div>
                        {getStatusTag(item.status)}
                      </div>
                    }
                    description={
                      item.required ? (
                        <span className="text-red-500 text-xs">Required</span>
                      ) : (
                        <span className="text-gray-400 text-xs">Optional</span>
                      )
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
        <Button type="default">Print Checklist</Button>
        <Space>
          <Button type="default" onClick={() => dispatch(updateChecklist({
            id: checklist.id,
            checklist_data: checklistItems,
            status: 'in-progress'
          }))}>
            Save Progress
          </Button>
          <Button type="primary" disabled={progress.requiredProgress < 100}>
            Complete All Required
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default PreOpChecklist;
