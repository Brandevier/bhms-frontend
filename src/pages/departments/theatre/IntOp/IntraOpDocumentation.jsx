import React, { useState, useEffect, useCallback } from 'react';
import { Tabs, Card, Row, Col, Button, Badge, Tag, Modal, Form, Input, Select, InputNumber, message, Space, Statistic, Alert } from 'antd';
import { 
  EditOutlined,
  TeamOutlined,
  MedicineBoxOutlined,
  DropboxOutlined,
  SafetyCertificateOutlined,
  DashboardOutlined,
  PlayCircleOutlined,
  StopOutlined as StopCircleOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { 
  startSurgery, 
  completeSurgery, 
  getSurgeryStatus, 
  getAllTheatreBookings 
} from '../../../../redux/slice/theatreSlice';
import { fetchOrCreateChecklist } from '../../../../redux/slice/theatre/preOpChecklistSlice';

import ProcedureTimeline from './components/ProcedureTimeline';
import AnesthesiaRecord from './components/AnesthesiaRecord';
import SurgicalTeam from './components/SurgicalTeam';
import BloodLossCalculator from './components/BloodLossCalculator';
import SpecimenTracking from './components/SpecimenTracking';
import ImplantTracker from '../resourceAllocation/components/ImplantTracker';
import SafetyChecks from './components/SafetyChecks';
import ImplantDocumentation from './components/ImplantDocumentation';

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

const IntraOpDocumentation = ({ booking, patient: propPatient }) => {
  const dispatch = useDispatch();
  const { currentBooking, loading, surgeryInProgress } = useSelector((state) => state.theatre);
  const { checklist } = useSelector((state) => state.preOpChecklist);
  
  const [activeTab, setActiveTab] = useState('1');
  const [caseStatus, setCaseStatus] = useState('pre-op');
  const [timeoutCompleted, setTimeoutCompleted] = useState(false);
  const [surgeryTimer, setSurgeryTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [completeModalVisible, setCompleteModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Use prop patient or current booking
  const currentCase = currentBooking || booking;
  const patient = propPatient || currentCase?.visit?.patient || currentCase?.patient;
  
  // Check if pre-op is complete
  const isPreOpComplete = checklist?.status === 'completed' || 
    (checklist?.checklist_data?.every(section => 
      section.items?.every(item => item.status === 'completed' || !item.required)
    ) && checklist?.checklist_data?.length > 0);

  // Fetch booking details on mount
  useEffect(() => {
    if (booking?.id) {
      dispatch(getSurgeryStatus(booking.id));
      dispatch(fetchOrCreateChecklist({
        visit_id: booking.visit_id,
        surgery_schedule_id: booking.id,
      }));
    }
  }, [booking?.id, dispatch]);

  // Sync case status with booking status
  useEffect(() => {
    if (currentCase?.status) {
      switch (currentCase.status) {
        case 'intra-operation':
          setCaseStatus('in-progress');
          break;
        case 'post-operation':
        case 'completed':
          setCaseStatus('completed');
          break;
        default:
          setCaseStatus('pre-op');
      }
    }
  }, [currentCase?.status]);

  // Surgery timer logic
  useEffect(() => {
    let interval;
    if (caseStatus === 'in-progress' && currentCase?.actual_start_time) {
      setIsTimerRunning(true);
      const startTime = new Date(currentCase.actual_start_time).getTime();
      
      interval = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - startTime) / 1000);
        setSurgeryTimer(elapsed);
      }, 1000);
    } else if (currentCase?.actual_end_time) {
      setIsTimerRunning(false);
      const startTime = new Date(currentCase.actual_start_time).getTime();
      const endTime = new Date(currentCase.actual_end_time).getTime();
      setSurgeryTimer(Math.floor((endTime - startTime) / 1000));
    } else {
      setSurgeryTimer(0);
      setIsTimerRunning(false);
    }

    return () => clearInterval(interval);
  }, [caseStatus, currentCase?.actual_start_time, currentCase?.actual_end_time]);

  // Format timer to HH:MM:SS
  const formatTimer = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle start surgery
  const handleStartSurgery = async () => {
    if (!booking?.id) {
      message.error('No booking selected');
      return;
    }

    // Show confirmation for starting surgery
    Modal.confirm({
      title: 'Start Surgery',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure you want to start the surgery? This will begin the timer and change the case status.',
      okText: 'Yes, Start Surgery',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await dispatch(startSurgery(booking.id)).unwrap();
          message.success('Surgery started successfully!');
          setCaseStatus('in-progress');
        } catch (error) {
          message.error(error || 'Failed to start surgery');
        }
      },
    });
  };

  // Handle complete surgery
  const handleCompleteSurgery = async (values) => {
    if (!booking?.id) {
      message.error('No booking selected');
      return;
    }

    try {
      await dispatch(completeSurgery({
        bookingId: booking.id,
        outcome: values.outcome,
        notes: values.notes,
        blood_loss_ml: values.blood_loss_ml,
        complications: values.complications,
        specimens_collected: values.specimens_collected,
        implants_used: values.implants || []
      })).unwrap();
      
      message.success('Surgery completed successfully!');
      setCaseStatus('completed');
      setCompleteModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error(error || 'Failed to complete surgery');
    }
  };

  // Get status badge color
  const getStatusBadge = () => {
    switch (caseStatus) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'processing';
      default:
        return 'warning';
    }
  };

  const getStatusTagColor = () => {
    switch (caseStatus) {
      case 'completed':
        return 'green';
      case 'in-progress':
        return 'blue';
      default:
        return 'orange';
    }
  };

  const getStatusText = () => {
    switch (caseStatus) {
      case 'completed':
        return 'Case Completed';
      case 'in-progress':
        return 'Case In Progress';
      default:
        return 'Pre-Op';
    }
  };

  // Determine if start button should be shown
  const canStartSurgery = (caseStatus === 'pre-op' || currentCase?.status === 'scheduled' || currentCase?.status === 'pre-operation') && booking?.id;

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          <EditOutlined className="mr-2" />
          Intraoperative Documentation
        </h1>
        
        <div className="flex items-center">
          {/* Timer Display */}
          {(caseStatus === 'in-progress' || caseStatus === 'completed') && (
            <div className="mr-4 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center">
                <ClockCircleOutlined className="mr-2 text-blue-600 text-lg" />
                <span className="text-xl font-mono font-bold text-blue-700">
                  {formatTimer(surgeryTimer)}
                </span>
                {isTimerRunning && (
                  <Badge status="processing" className="ml-2" />
                )}
              </div>
            </div>
          )}
          
          <Badge status={getStatusBadge()} className="mr-2" />
          <Tag color={getStatusTagColor()} className="mr-4">
            {getStatusText()}
          </Tag>
          
          {/* Start Surgery Button */}
          {canStartSurgery && (
            <Button 
              type="primary" 
              icon={<PlayCircleOutlined />}
              onClick={handleStartSurgery}
              loading={loading}
              className="mr-2"
              size="large"
              style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
            >
              Start Operation
            </Button>
          )}
          
          {/* Complete Case Button */}
          {caseStatus === 'in-progress' && (
            <Button 
              type="primary" 
              danger
              icon={<StopCircleOutlined />}
              onClick={() => setCompleteModalVisible(true)}
            >
              Complete Case
            </Button>
          )}
        </div>
      </div>

      {/* Case Overview Card */}
      <Card className="mb-4 shadow-sm" style={{ background: 'linear-gradient(to right, #f0f5ff, #fff)' }}>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
          <div>
            <div className="text-gray-500 text-xs">Patient</div>
            <div className="font-medium">
              {patient?.name || currentCase?.patient || 'N/A'}
            </div>
          </div>
          <div>
            <div className="text-gray-500 text-xs">Procedure</div>
            <div className="font-medium">
              {currentCase?.procedure_names?.[0] || currentCase?.procedure || 'N/A'}
            </div>
          </div>
          <div>
            <div className="text-gray-500 text-xs">Location</div>
            <div className="font-medium">
              {currentCase?.operatingRoom?.room_name || currentCase?.location || 'N/A'}
            </div>
          </div>
          <div>
            <div className="text-gray-500 text-xs">Start Time</div>
            <div className="font-medium">
              {currentCase?.actual_start_time 
                ? new Date(currentCase.actual_start_time).toLocaleTimeString()
                : currentCase?.startTime || 'Not Started'}
            </div>
          </div>
          <div>
            <div className="text-gray-500 text-xs">Duration</div>
            <div className="font-medium text-blue-600">
              {formatTimer(surgeryTimer)}
            </div>
          </div>
          <div>
            <div className="text-gray-500 text-xs">Anesthesia</div>
            <div className="font-medium">
              {currentCase?.anesthesia || 'General'}
            </div>
          </div>
        </div>
      </Card>

      {/* Pre-op completion warning */}
      {!isPreOpComplete && caseStatus === 'pre-op' && (
        <Alert
          message="Pre-Op Checklist Not Complete"
          description="Please complete the pre-operative checklist before starting the surgery. This ensures all safety protocols are followed."
          type="warning"
          showIcon
          className="mb-4"
          icon={<ExclamationCircleOutlined />}
          action={
            <Button size="small" onClick={() => setActiveTab('5')}>
              View Checklist
            </Button>
          }
        />
      )}

      {/* Main Tabs */}
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        type="card"
      >
        <TabPane 
          tab={
            <span>
              <DashboardOutlined />
              Procedure Timeline
            </span>
          } 
          key="1"
        >
          <ProcedureTimeline 
            caseStatus={caseStatus}
            timeoutCompleted={timeoutCompleted}
            onTimeoutComplete={() => setTimeoutCompleted(true)}
            bookingId={booking?.id}
          />
        </TabPane>
        <TabPane 
          tab={
            <span>
              <MedicineBoxOutlined />
              Anesthesia Record
            </span>
          } 
          key="2"
        >
          <AnesthesiaRecord 
            bookingId={booking?.id}
            caseStatus={caseStatus}
          />
        </TabPane>
        <TabPane 
          tab={
            <span>
              <TeamOutlined />
              Surgical Team
            </span>
          } 
          key="3"
        >
          <SurgicalTeam 
            booking={currentCase}
            caseStatus={caseStatus}
          />
        </TabPane>
        <TabPane 
          tab={
            <span>
              <DropboxOutlined />
              Specimens & Implants
            </span>
          } 
          key="4"
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <SpecimenTracking 
                bookingId={booking?.id}
                caseStatus={caseStatus}
              />
            </Col>
            <Col xs={24} md={12}>
              <ImplantDocumentation 
                bookingId={booking?.id}
                caseStatus={caseStatus}
              />
            </Col>
          </Row>
        </TabPane>
        <TabPane 
          tab={
            <span>
              <SafetyCertificateOutlined />
              Safety Checks
            </span>
          } 
          key="5"
        >
          <SafetyChecks 
            timeoutCompleted={timeoutCompleted}
            onTimeoutComplete={() => setTimeoutCompleted(true)}
            bookingId={booking?.id}
          />
        </TabPane>
      </Tabs>

      {/* Complete Surgery Modal */}
      <Modal
        title={
          <span>
            <StopCircleOutlined className="mr-2 text-red-500" />
            Complete Surgery
          </span>
        }
        open={completeModalVisible}
        onCancel={() => setCompleteModalVisible(false)}
        footer={null}
        width={600}
      >
        <Alert
          message="Complete Surgery Details"
          description="Please provide the surgery outcome and any relevant details before completing."
          type="info"
          showIcon
          className="mb-4"
        />
        
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCompleteSurgery}
          initialValues={{
            outcome: 'successful',
            blood_loss_ml: 0,
            specimens_collected: 0
          }}
        >
          <Form.Item
            name="outcome"
            label="Surgery Outcome"
            rules={[{ required: true, message: 'Please select outcome' }]}
          >
            <Select>
              <Option value="successful">Successful</Option>
              <Option value="successful-with-complications">Successful with Complications</Option>
              <Option value="partial">Partial Success</Option>
              <Option value="aborted">Aborted</Option>
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="blood_loss_ml"
                label="Blood Loss (ml)"
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="specimens_collected"
                label="Specimens Collected"
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="complications"
                label="Complications"
              >
                <Input placeholder="If any" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="notes"
            label="Post-Operative Notes"
          >
            <TextArea rows={4} placeholder="Enter any relevant notes about the surgery..." />
          </Form.Item>

          <Form.Item
            name="implants"
            label="Implants Used"
          >
            <Select mode="tags" placeholder="Add implants used">
            </Select>
          </Form.Item>

          <Form.Item className="mb-0 text-right">
            <Space>
              <Button onClick={() => setCompleteModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" danger htmlType="submit" loading={loading}>
                Complete Surgery
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default IntraOpDocumentation;

