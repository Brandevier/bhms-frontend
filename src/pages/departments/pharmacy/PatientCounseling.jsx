import React, { useState } from 'react';
import {
  Card,
  Button,
  Form,
  Checkbox,
  Input,
  DatePicker,
  Select,
  Table,
  Tag,
  Divider,
  Typography,
  Modal,
  Row,
  Col,
  Alert
} from 'antd';
import {
  MedicineBoxOutlined,
  UserOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import moment from 'moment';
const { Text, Title } = Typography;
const { TextArea } = Input;

const PatientCounseling = () => {
  const [form] = Form.useForm();
  const [counselingModalVisible, setCounselingModalVisible] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [counselingRecords, setCounselingRecords] = useState([]);

  // Dummy data - would come from API in real app
  const pendingPrescriptions = [
    {
      id: 'rx-001',
      patient: { name: 'Kwame Addo', id: 'pat-001' },
      medication: 'Amoxicillin 500mg',
      instructions: 'Take 1 tablet 3 times daily for 7 days',
      isHighRisk: true
    },
    {
      id: 'rx-002',
      patient: { name: 'Ama Serwaa', id: 'pat-002' },
      medication: 'Metformin 850mg',
      instructions: 'Take 1 tablet with breakfast and dinner',
      isHighRisk: false
    }
  ];

  // Dummy counseling topics
  const counselingTopics = [
    'Purpose of medication',
    'How and when to take',
    'Duration of treatment',
    'Common side effects',
    'Missed dose instructions',
    'Storage requirements',
    'Drug interactions',
    'Special warnings'
  ];

  const handleStartCounseling = (prescription) => {
    setSelectedPrescription(prescription);
    setCounselingModalVisible(true);
  };

  const handleSubmitCounseling = (values) => {
    const newRecord = {
      id: `counsel-${Date.now()}`,
      prescriptionId: selectedPrescription.id,
      patient: selectedPrescription.patient,
      medication: selectedPrescription.medication,
      date: values.date.format('YYYY-MM-DD'),
      topicsCovered: counselingTopics.filter((_, index) => values.topics[index]),
      notes: values.notes,
      language: values.language,
      duration: values.duration,
      counseledBy: 'Pharmacist Name' // Would be current user in real app
    };

    setCounselingRecords([newRecord, ...counselingRecords]);
    setCounselingModalVisible(false);
    form.resetFields();
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>
        <FileTextOutlined /> Patient Medication Counseling
      </Title>
      <Text type="secondary">
        Document patient education for dispensed medications
      </Text>
      <Divider />

      {/* Counseling Alert */}
      <Alert
        message="Remember: Counseling is required for all new prescriptions and high-risk medications"
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      {/* Pending Counseling Table */}
      <Card
        title="Prescriptions Requiring Counseling"
        style={{ marginBottom: 24 }}
        extra={<Tag color="blue">{pendingPrescriptions.length} pending</Tag>}
      >
        <Table
          dataSource={pendingPrescriptions}
          columns={[
            {
              title: 'Patient',
              dataIndex: ['patient', 'name'],
              key: 'patient',
              render: (text, record) => (
                <>
                  <UserOutlined style={{ marginRight: 8 }} />
                  {text}
                </>
              )
            },
            {
              title: 'Medication',
              dataIndex: 'medication',
              key: 'medication',
              render: (text) => (
                <>
                  <MedicineBoxOutlined style={{ marginRight: 8 }} />
                  {text}
                </>
              )
            },
            {
              title: 'Status',
              key: 'status',
              render: (_, record) => (
                <Tag color={record.isHighRisk ? 'red' : 'orange'}>
                  {record.isHighRisk ? 'HIGH RISK' : 'Counseling Needed'}
                </Tag>
              )
            },
            {
              title: 'Action',
              key: 'action',
              render: (_, record) => (
                <Button
                  type="primary"
                  onClick={() => handleStartCounseling(record)}
                >
                  Start Counseling
                </Button>
              )
            }
          ]}
          rowKey="id"
        />
      </Card>

      {/* Counseling Records */}
      <Card title="Completed Counseling Sessions">
        <Table
          dataSource={counselingRecords}
          columns={[
            {
              title: 'Date',
              dataIndex: 'date',
              key: 'date'
            },
            {
              title: 'Patient',
              dataIndex: ['patient', 'name'],
              key: 'patient'
            },
            {
              title: 'Medication',
              dataIndex: 'medication',
              key: 'medication'
            },
            {
              title: 'Topics Covered',
              dataIndex: 'topicsCovered',
              key: 'topics',
              render: (topics) => (
                <Text ellipsis={{ tooltip: topics.join(', ') }}>
                  {topics.length} topics
                </Text>
              )
            },
            {
              title: 'Status',
              key: 'status',
              render: () => (
                <Tag icon={<CheckCircleOutlined />} color="green">
                  Completed
                </Tag>
              )
            }
          ]}
          rowKey="id"
          locale={{
            emptyText: 'No counseling sessions recorded yet'
          }}
        />
      </Card>

      {/* Counseling Modal */}
      <Modal
        title={`Patient Counseling - ${selectedPrescription?.patient?.name}`}
        visible={counselingModalVisible}
        onCancel={() => {
          setCounselingModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={800}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmitCounseling}
          initialValues={{
            date: moment(),
            topics: counselingTopics.map(() => true), // Default all checked
            duration: 5
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Patient">
                <Input
                  value={selectedPrescription?.patient?.name}
                  disabled
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Medication">
                <Input
                  value={selectedPrescription?.medication}
                  disabled
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Date" name="date">
            <DatePicker style={{ width: '100%' }} disabled />
          </Form.Item>

          <Form.Item label="Language" name="language">
            <Select>
              <Select.Option value="english">English</Select.Option>
              <Select.Option value="twi">Twi</Select.Option>
              <Select.Option value="ewe">Ewe</Select.Option>
              <Select.Option value="ga">Ga</Select.Option>
              <Select.Option value="hausa">Hausa</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Duration (minutes)" name="duration">
            <Select>
              {[1, 2, 3, 4, 5, 10, 15].map(num => (
                <Select.Option key={num} value={num}>
                  {num} min
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Divider orientation="left">Topics Covered</Divider>
          
          <Form.Item name="topics">
            <Checkbox.Group style={{ width: '100%' }}>
              <Row gutter={[16, 16]}>
                {counselingTopics.map((topic, index) => (
                  <Col span={12} key={index}>
                    <Checkbox value={index}>{topic}</Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item
            label="Additional Notes"
            name="notes"
            extra="Record any special instructions or patient concerns"
          >
            <TextArea rows={4} />
          </Form.Item>

          {selectedPrescription?.isHighRisk && (
            <Alert
              message="High-Risk Medication"
              description="Extra counseling is required for this medication"
              type="warning"
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              <CheckCircleOutlined /> Complete Counseling Session
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PatientCounseling;