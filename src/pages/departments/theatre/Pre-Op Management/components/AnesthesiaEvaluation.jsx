import React from 'react';
import { Form, Input, Select, DatePicker, Card, Row, Col, Divider, Button, Alert } from 'antd';
import { 
  MedicineBoxOutlined,
  AlertOutlined,
  SafetyOutlined,
  UserOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;

const AnesthesiaEvaluation = ({ patient }) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Received values:', values);
    // Add your submission logic here
  };

  // Handle case when no patient is selected
  if (!patient) {
    return (
      <div className="flex justify-center items-center h-64">
        <Alert
          message="No Patient Selected"
          description="Please select a patient from the theatre list to perform anesthesia evaluation."
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

  const asaClassifications = [
    { value: 'ASA1', label: 'ASA I - Healthy patient' },
    { value: 'ASA2', label: 'ASA II - Mild systemic disease' },
    { value: 'ASA3', label: 'ASA III - Severe systemic disease' },
    { value: 'ASA4', label: 'ASA IV - Severe systemic disease that is a constant threat to life' },
    { value: 'ASA5', label: 'ASA V - Moribund patient not expected to survive without the operation' },
    { value: 'ASA6', label: 'ASA VI - Declared brain-dead patient whose organs are being removed for donor purposes' },
  ];

  return (
    <div className="p-4">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-semibold flex items-center">
            <MedicineBoxOutlined className="mr-3 text-blue-600" />
            Anesthesia Evaluation
          </h2>
          <div className="mt-2 space-y-1 text-gray-600">
            <div className="flex items-center">
              <UserOutlined className="mr-2" />
              <span className="font-medium">{patientName}</span>
              <span className="ml-3 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {folderNumber}
              </span>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <span>Age: {patientAge}</span>
              <span>Gender: {patientGender}</span>
            </div>
            <div className="flex items-center">
              <CalendarOutlined className="mr-2" />
              <span>
                {primaryProcedure} | {surgeryDate} 
                {surgeryTime && ` at ${surgeryTime}`}
              </span>
            </div>
          </div>
        </div>
        
        <Button 
          type="primary" 
          size="large" 
          icon={<SafetyOutlined />}
          onClick={() => form.submit()}
        >
          Save Evaluation
        </Button>
      </div>

      <Divider className="my-4" />

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          asaClass: 'ASA2',
          airway: 'normal',
          evaluationDate: moment(),
          anesthesiaType: 'general',
        }}
      >
        <Row gutter={[16, 16]}>
          {/* Patient Assessment */}
          <Col xs={24} lg={12}>
            <Card 
              title="Patient Assessment" 
              className="shadow-sm border" 
              size="small"
            >
              <Form.Item
                name="evaluationDate"
                label="Evaluation Date"
                rules={[{ required: true, message: 'Please select evaluation date' }]}
              >
                <DatePicker 
                  style={{ width: '100%' }} 
                  format="MMM DD, YYYY"
                />
              </Form.Item>
              
              <Form.Item
                name="asaClass"
                label="ASA Physical Status Classification"
                rules={[{ required: true, message: 'Please select ASA classification' }]}
              >
                <Select placeholder="Select ASA classification">
                  {asaClassifications.map(item => (
                    <Option key={item.value} value={item.value}>
                      {item.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              
              <Form.Item
                name="airway"
                label="Airway Assessment"
                rules={[{ required: true, message: 'Please assess airway' }]}
              >
                <Select placeholder="Select airway assessment">
                  <Option value="normal">Normal</Option>
                  <Option value="difficult">Potentially Difficult</Option>
                  <Option value="very-difficult">Very Difficult</Option>
                  <Option value="emergency">Emergency Airway</Option>
                </Select>
              </Form.Item>
              
              <Form.Item
                name="cardiacRisk"
                label="Cardiac Risk Factors"
              >
                <Select mode="multiple" placeholder="Select cardiac risk factors">
                  <Option value="none">None</Option>
                  <Option value="cad">Coronary Artery Disease</Option>
                  <Option value="chf">Congestive Heart Failure</Option>
                  <Option value="arrhythmia">Arrhythmia</Option>
                  <Option value="hypertension">Hypertension</Option>
                  <Option value="valvular">Valvular Heart Disease</Option>
                  <Option value="pacer">Pacemaker/ICD</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="respiratoryRisk"
                label="Respiratory Risk Factors"
              >
                <Select mode="multiple" placeholder="Select respiratory risk factors">
                  <Option value="none">None</Option>
                  <Option value="asthma">Asthma</Option>
                  <Option value="copd">COPD</Option>
                  <Option value="osa">Obstructive Sleep Apnea</Option>
                  <Option value="smoking">Current Smoker</Option>
                  <Option value="pneumonia">Recent Pneumonia</Option>
                </Select>
              </Form.Item>
            </Card>
          </Col>
          
          {/* Anesthesia Plan */}
          <Col xs={24} lg={12}>
            <Card 
              title="Anesthesia Plan" 
              className="shadow-sm border" 
              size="small"
            >
              <Form.Item
                name="anesthesiaType"
                label="Type of Anesthesia"
                rules={[{ required: true, message: 'Please select anesthesia type' }]}
              >
                <Select placeholder="Select anesthesia type">
                  <Option value="general">General Anesthesia</Option>
                  <Option value="regional">Regional Anesthesia</Option>
                  <Option value="monitored">Monitored Anesthesia Care (MAC)</Option>
                  <Option value="local">Local Anesthesia</Option>
                  <Option value="combined">Combined General + Regional</Option>
                </Select>
              </Form.Item>
              
              <Form.Item
                name="airwayManagement"
                label="Airway Management Plan"
              >
                <Select placeholder="Select airway management">
                  <Option value="eTT">Endotracheal Tube</Option>
                  <Option value="lma">Laryngeal Mask Airway (LMA)</Option>
                  <Option value="facemask">Face Mask</Option>
                  <Option value="trach">Tracheostomy</Option>
                </Select>
              </Form.Item>
              
              <Form.Item
                name="premedication"
                label="Premedication"
              >
                <Select mode="multiple" placeholder="Select premedication">
                  <Option value="midazolam">Midazolam</Option>
                  <Option value="fentanyl">Fentanyl</Option>
                  <Option value="ondansetron">Ondansetron</Option>
                  <Option value="dexamethasone">Dexamethasone</Option>
                  <Option value="ranitidine">Ranitidine</Option>
                  <Option value="metoclopramide">Metoclopramide</Option>
                </Select>
              </Form.Item>
              
              <Form.Item
                name="monitoring"
                label="Monitoring Plan"
              >
                <Select mode="multiple" placeholder="Select monitoring">
                  <Option value="standard">Standard Monitoring</Option>
                  <Option value="arterial-line">Arterial Line</Option>
                  <Option value="cvp">CVP Line</Option>
                  <Option value="pacu">PA Catheter</Option>
                  <Option value="bis">BIS Monitor</Option>
                  <Option value="nerve-stim">Nerve Stimulator</Option>
                </Select>
              </Form.Item>
            </Card>
          </Col>
        </Row>
        
        {/* Risk Assessment */}
        <Card 
          title={
            <span className="flex items-center text-red-600">
              <AlertOutlined className="mr-2" />
              Risk Assessment & Special Considerations
            </span>
          } 
          className="my-4 shadow-sm border" 
          size="small"
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="riskFactors"
                label="Identified Risk Factors"
              >
                <Select mode="multiple" placeholder="Select risk factors">
                  <Option value="allergy">Drug Allergy</Option>
                  <Option value="bleeding">Bleeding Risk</Option>
                  <Option value="diabetes">Diabetes</Option>
                  <Option value="obesity">Obesity</Option>
                  <Option value="smoking">Smoking</Option>
                  <Option value="sleep-apnea">Sleep Apnea</Option>
                  <Option value="renal">Renal Impairment</Option>
                  <Option value="hepatic">Hepatic Impairment</Option>
                  <Option value="geriatric">Geriatric Patient</Option>
                  <Option value="pediatric">Pediatric Patient</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="difficulty"
                label="Anticipated Difficulty"
              >
                <Select placeholder="Select anticipated difficulty">
                  <Option value="low">Low</Option>
                  <Option value="moderate">Moderate</Option>
                  <Option value="high">High</Option>
                  <Option value="very-high">Very High</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="specialConsiderations"
            label="Special Considerations & Comments"
          >
            <TextArea 
              rows={4} 
              placeholder="Enter any special considerations, comments, or specific instructions for this patient..."
            />
          </Form.Item>
          
          <Form.Item
            name="mitigationPlan"
            label="Risk Mitigation Plan"
          >
            <TextArea 
              rows={3} 
              placeholder="Describe specific risk mitigation strategies, backup plans, or contingency measures..."
            />
          </Form.Item>
        </Card>
        
        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <Button type="default" size="large">
            Save Draft
          </Button>
          <div className="space-x-3">
            <Button type="default" size="large">
              Print Evaluation
            </Button>
            <Button 
              type="primary" 
              htmlType="submit"
              icon={<SafetyOutlined />}
              size="large"
            >
              Complete Evaluation
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default AnesthesiaEvaluation;