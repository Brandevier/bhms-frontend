import React, { useState } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Select, 
  DatePicker, 
  TimePicker, 
  Checkbox, 
  Row, 
  Col, 
  Divider, 
  InputNumber,
  Table,
  Alert,
  Space,
  Badge,
  Tag
} from 'antd';
import { 
  UserOutlined,
  HeartOutlined,
  DashboardOutlined,
  FileTextOutlined,
  SafetyOutlined,
  MedicineBoxOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import moment from 'moment';

const { TextArea } = Input;
const { Option } = Select;

const NursingDocumentation = ({ patient }) => {
  const [form] = Form.useForm();
  const [vitals, setVitals] = useState([
    { 
      key: '1',
      time: '08:00', 
      bp: '120/80', 
      hr: 72, 
      rr: 16, 
      temp: 36.8, 
      spo2: 98,
      bpStatus: 'normal',
      hrStatus: 'normal'
    }
  ]);

  // Handle case when no patient is selected
  if (!patient) {
    return (
      <div className="flex justify-center items-center h-64">
        <Alert
          message="No Patient Selected"
          description="Please select a patient from the theatre list to document nursing care."
          type="info"
          showIcon
        />
      </div>
    );
  }

  // Safely extract patient data with fallbacks
  const patientName = patient.patient?.name || 'Unknown Patient';
  const primaryProcedure = patient.procedure?.primary || 'No procedure specified';
  const surgeryDate = patient.schedule?.formattedDate || 'Not scheduled';
  const surgeryTime = patient.schedule?.formattedTime || '';
  const patientAge = patient.patient?.age || 'N/A';
  const patientGender = patient.patient?.gender || 'N/A';
  const folderNumber = patient.patient?.folderNumber || 'N/A';
  const isEmergency = patient.isEmergency || false;

  const onFinish = (values) => {
    console.log('Received values:', values);
    
    // Determine vital sign status
    const getBPStatus = (sbp, dbp) => {
      if (sbp > 140 || dbp > 90) return 'high';
      if (sbp < 90 || dbp < 60) return 'low';
      return 'normal';
    };

    const getHRStatus = (hr) => {
      if (hr > 100) return 'high';
      if (hr < 60) return 'low';
      return 'normal';
    };

    const newVital = {
      key: Date.now().toString(),
      time: values.time.format('HH:mm'),
      bp: `${values.sbp}/${values.dbp}`,
      hr: values.hr,
      rr: values.rr,
      temp: values.temp,
      spo2: values.spo2,
      bpStatus: getBPStatus(values.sbp, values.dbp),
      hrStatus: getHRStatus(values.hr)
    };
    
    setVitals(prev => [...prev, newVital]);
    form.resetFields(['sbp', 'dbp', 'hr', 'rr', 'temp', 'spo2']);
  };

  const vitalColumns = [
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      render: (time) => <span className="font-medium">{time}</span>,
    },
    {
      title: 'BP',
      dataIndex: 'bp',
      key: 'bp',
      render: (bp, record) => (
        <Tag color={
          record.bpStatus === 'high' ? 'red' : 
          record.bpStatus === 'low' ? 'orange' : 'green'
        }>
          {bp}
        </Tag>
      ),
    },
    {
      title: 'HR',
      dataIndex: 'hr',
      key: 'hr',
      render: (hr, record) => (
        <Tag color={
          record.hrStatus === 'high' ? 'red' : 
          record.hrStatus === 'low' ? 'orange' : 'green'
        }>
          {hr} bpm
        </Tag>
      ),
    },
    {
      title: 'RR',
      dataIndex: 'rr',
      key: 'rr',
      render: (rr) => <span>{rr} /min</span>,
    },
    {
      title: 'Temp',
      dataIndex: 'temp',
      key: 'temp',
      render: (temp) => <span>{temp}°C</span>,
    },
    {
      title: 'SpO₂',
      dataIndex: 'spo2',
      key: 'spo2',
      render: (spo2) => (
        <Tag color={spo2 < 95 ? 'orange' : 'green'}>
          {spo2}%
        </Tag>
      ),
    },
  ];

  return (
    <div className="p-4">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-semibold flex items-center">
            <UserOutlined className="mr-3 text-blue-600" />
            Nursing Documentation
          </h2>
          <div className="mt-2 space-y-1 text-gray-600">
            <div className="flex items-center">
              <span className="font-medium">{patientName}</span>
              <Badge 
                count={folderNumber} 
                style={{ backgroundColor: '#1890ff', marginLeft: 8 }}
              />
              {isEmergency && (
                <Tag color="red" className="ml-2">Emergency</Tag>
              )}
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <span>Age: {patientAge}</span>
              <span>Gender: {patientGender}</span>
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
        
        <Button type="primary" size="large" icon={<FileTextOutlined />}>
          Complete Assessment
        </Button>
      </div>

      <Divider className="my-4" />

      <Row gutter={[16, 16]}>
        {/* Left Column */}
        <Col xs={24} lg={12}>
          {/* Vital Signs Card */}
          <Card 
            title={
              <Space>
                <DashboardOutlined />
                Vital Signs
                <Badge count={vitals.length} showZero style={{ backgroundColor: '#52c41a' }} />
              </Space>
            } 
            className="mb-4 shadow-sm border"
            extra={<Tag color="blue">Last: {vitals[vitals.length - 1]?.time}</Tag>}
          >
            <Table 
              columns={vitalColumns} 
              dataSource={vitals} 
              pagination={false}
              size="small"
              className="mb-4"
            />
            
            <Divider>Add New Vital Signs</Divider>
            
            <Form form={form} onFinish={onFinish} layout="vertical">
              <Row gutter={16}>
                <Col xs={24} sm={8}>
                  <Form.Item 
                    name="time" 
                    label="Time"
                    rules={[{ required: true, message: 'Please select time' }]}
                  >
                    <TimePicker 
                      format="HH:mm" 
                      style={{ width: '100%' }}
                      placeholder="Select time"
                    />
                  </Form.Item>
                </Col>
                <Col xs={12} sm={8}>
                  <Form.Item 
                    name="sbp" 
                    label="SBP"
                    rules={[{ required: true, message: 'Enter SBP' }]}
                  >
                    <InputNumber 
                      placeholder="SBP" 
                      min={50} 
                      max={250} 
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={12} sm={8}>
                  <Form.Item 
                    name="dbp" 
                    label="DBP"
                    rules={[{ required: true, message: 'Enter DBP' }]}
                  >
                    <InputNumber 
                      placeholder="DBP" 
                      min={30} 
                      max={150} 
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              
              <Row gutter={16}>
                <Col xs={12} sm={8}>
                  <Form.Item 
                    name="hr" 
                    label="Heart Rate"
                    rules={[{ required: true, message: 'Enter HR' }]}
                  >
                    <InputNumber 
                      placeholder="HR" 
                      min={30} 
                      max={200} 
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={12} sm={8}>
                  <Form.Item 
                    name="rr" 
                    label="Respiratory Rate"
                    rules={[{ required: true, message: 'Enter RR' }]}
                  >
                    <InputNumber 
                      placeholder="RR" 
                      min={8} 
                      max={40} 
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={12} sm={8}>
                  <Form.Item 
                    name="temp" 
                    label="Temp (°C)"
                    rules={[{ required: true, message: 'Enter temperature' }]}
                  >
                    <InputNumber 
                      placeholder="Temp" 
                      min={30} 
                      max={42} 
                      step={0.1}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              
              <Row gutter={16}>
                <Col xs={12} sm={8}>
                  <Form.Item 
                    name="spo2" 
                    label="SpO₂"
                    rules={[{ required: true, message: 'Enter SpO₂' }]}
                  >
                    <InputNumber 
                      placeholder="SpO₂" 
                      min={50} 
                      max={100} 
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={12} sm={8}>
                  <Form.Item label=" " colon={false}>
                    <Button 
                      htmlType="submit" 
                      type="primary" 
                      icon={<HeartOutlined />}
                      style={{ width: '100%' }}
                    >
                      Record Vitals
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
          
          {/* Allergies Card */}
          <Card 
            title={
              <Space>
                <SafetyOutlined />
                Allergies & Sensitivities
              </Space>
            } 
            className="mb-4 shadow-sm border"
          >
            <Form layout="vertical">
              <Form.Item 
                name="allergies" 
                label="Known Allergies"
                help="Type and press enter to add multiple allergies"
              >
                <Select mode="tags" placeholder="Add allergies (e.g., Penicillin, Latex)">
                  <Option value="penicillin">Penicillin</Option>
                  <Option value="sulfa">Sulfa Drugs</Option>
                  <Option value="latex">Latex</Option>
                  <Option value="iodine">Iodine Contrast</Option>
                  <Option value="aspirin">Aspirin</Option>
                  <Option value="nsaids">NSAIDs</Option>
                  <Option value="eggs">Eggs</Option>
                  <Option value="shellfish">Shellfish</Option>
                </Select>
              </Form.Item>
              
              <Form.Item name="allergyReaction" label="Reaction Description">
                <TextArea 
                  rows={2} 
                  placeholder="Describe reaction type and severity..." 
                />
              </Form.Item>
              
              <Form.Item name="allergySeverity" label="Severity">
                <Select placeholder="Select severity level">
                  <Option value="mild">Mild</Option>
                  <Option value="moderate">Moderate</Option>
                  <Option value="severe">Severe</Option>
                  <Option value="anaphylaxis">Anaphylaxis</Option>
                </Select>
              </Form.Item>
              
              <div className="flex justify-end">
                <Button type="primary">Save Allergy Information</Button>
              </div>
            </Form>
          </Card>
        </Col>
        
        {/* Right Column */}
        <Col xs={24} lg={12}>
          {/* Pre-Op Assessment Card */}
          <Card 
            title={
              <Space>
                <FileTextOutlined />
                Pre-Operative Assessment
              </Space>
            } 
            className="mb-4 shadow-sm border"
          >
            <Form layout="vertical">
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item name="skinAssessment" label="Skin Assessment">
                    <Select placeholder="Select skin condition">
                      <Option value="normal">Normal - Intact</Option>
                      <Option value="dry">Dry Skin</Option>
                      <Option value="abrasions">Abrasions</Option>
                      <Option value="lesions">Lesions/Pressure Areas</Option>
                      <Option value="edema">Edema Present</Option>
                      <Option value="jaundice">Jaundice</Option>
                      <Option value="cyanosis">Cyanosis</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="painScore" label="Pain Score (0-10)">
                    <InputNumber 
                      min={0} 
                      max={10} 
                      style={{ width: '100%' }}
                      placeholder="0-10"
                    />
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item name="assessmentNotes" label="Assessment Notes">
                <TextArea 
                  rows={3} 
                  placeholder="Document comprehensive assessment findings, patient concerns, and observations..." 
                />
              </Form.Item>
              
              <Divider>Safety Verification</Divider>
              
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item name="idBand" valuePropName="checked">
                    <Checkbox>ID Band Verified & Correct</Checkbox>
                  </Form.Item>
                  <Form.Item name="consent" valuePropName="checked">
                    <Checkbox>Surgical Consent Verified</Checkbox>
                  </Form.Item>
                  <Form.Item name="allergyCheck" valuePropName="checked">
                    <Checkbox>Allergy Status Confirmed</Checkbox>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="npo" valuePropName="checked">
                    <Checkbox>NPO Status Confirmed</Checkbox>
                  </Form.Item>
                  <Form.Item name="jewelry" valuePropName="checked">
                    <Checkbox>Jewelry/Metal Objects Removed</Checkbox>
                  </Form.Item>
                  <Form.Item name="prosthesis" valuePropName="checked">
                    <Checkbox>Dentures/Prosthesis Removed</Checkbox>
                  </Form.Item>
                </Col>
              </Row>
              
              <Divider>Documentation</Divider>
              
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item 
                    name="nurse" 
                    label="Documenting Nurse"
                    rules={[{ required: true, message: 'Please enter your name' }]}
                  >
                    <Input placeholder="Enter nurse's name" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item 
                    name="date" 
                    label="Date & Time"
                    rules={[{ required: true, message: 'Please select date' }]}
                  >
                    <DatePicker 
                      showTime 
                      style={{ width: '100%' }} 
                      format="MMM DD, YYYY HH:mm"
                    />
                  </Form.Item>
                </Col>
              </Row>
              
              <div className="flex justify-end">
                <Button type="primary" icon={<FileTextOutlined />}>
                  Sign & Save Assessment
                </Button>
              </div>
            </Form>
          </Card>
          
          {/* Pre-Op Checklist Card */}
          <Card 
            title={
              <Space>
                <SafetyOutlined />
                Pre-Operative Checklist
                <Tag color="orange">Required</Tag>
              </Space>
            } 
            className="shadow-sm border"
          >
            <Form layout="vertical">
              <Form.Item 
                name="checklist" 
                label="Complete the following checks:"
                rules={[{ required: true, message: 'Please complete all required checks' }]}
              >
                <Checkbox.Group style={{ width: '100%' }}>
                  <Row gutter={[0, 8]}>
                    <Col span={24}>
                      <Checkbox value="history">History & Physical completed and reviewed</Checkbox>
                    </Col>
                    <Col span={24}>
                      <Checkbox value="labs">Pre-operative labs and diagnostics reviewed</Checkbox>
                    </Col>
                    <Col span={24}>
                      <Checkbox value="meds">Pre-operative medications administered as ordered</Checkbox>
                    </Col>
                    <Col span={24}>
                      <Checkbox value="site">Surgical site marked and verified with patient</Checkbox>
                    </Col>
                    <Col span={24}>
                      <Checkbox value="void">Patient voided before transfer to OR</Checkbox>
                    </Col>
                    <Col span={24}>
                      <Checkbox value="belongings">Patient belongings secured and documented</Checkbox>
                    </Col>
                    <Col span={24}>
                      <Checkbox value="timeout">Pre-procedure timeout completed</Checkbox>
                    </Col>
                    <Col span={24}>
                      <Checkbox value="handover">OR handover report prepared</Checkbox>
                    </Col>
                  </Row>
                </Checkbox.Group>
              </Form.Item>
              
              <Form.Item name="comments" label="Additional Comments/Notes">
                <TextArea 
                  rows={2} 
                  placeholder="Document any issues, concerns, or special instructions..." 
                />
              </Form.Item>
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Last updated: {moment().format('MMM DD, YYYY HH:mm')}
                </div>
                <Button type="primary" size="large">
                  Complete Pre-Op Checklist
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default NursingDocumentation;