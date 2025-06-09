import React from 'react';
import { Form, Input, Select, DatePicker, Card, Row, Col, Divider, Button } from 'antd';
import { 
  MedicineBoxOutlined,
  AlertOutlined,
  SafetyOutlined 
} from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

const AnesthesiaEvaluation = ({ patient }) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Received values:', values);
  };

  const asaClassifications = [
    { value: 'ASA1', label: 'ASA I - Healthy patient' },
    { value: 'ASA2', label: 'ASA II - Mild systemic disease' },
    { value: 'ASA3', label: 'ASA III - Severe systemic disease' },
    { value: 'ASA4', label: 'ASA IV - Severe systemic disease that is a constant threat to life' },
    { value: 'ASA5', label: 'ASA V - Moribund patient not expected to survive without the operation' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">
          <MedicineBoxOutlined className="mr-2" />
          Anesthesia Evaluation for {patient.name}
        </h2>
        <Button type="primary" onClick={() => form.submit()}>
          Save Evaluation
        </Button>
      </div>
      
      <Divider orientation="left" className="text-sm">
        Procedure: {patient.procedure} | Scheduled: {patient.surgeryDate}
      </Divider>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          asaClass: 'ASA2',
          airway: 'normal',
          evaluationDate: new Date(),
        }}
      >
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Card title="Patient Assessment" className="mb-4 shadow-sm" size="small">
              <Form.Item
                name="asaClass"
                label="ASA Physical Status Classification"
                rules={[{ required: true }]}
              >
                <Select>
                  {asaClassifications.map(item => (
                    <Option key={item.value} value={item.value}>{item.label}</Option>
                  ))}
                </Select>
              </Form.Item>
              
              <Form.Item
                name="airway"
                label="Airway Assessment"
                rules={[{ required: true }]}
              >
                <Select>
                  <Option value="normal">Normal</Option>
                  <Option value="difficult">Potentially Difficult</Option>
                  <Option value="very-difficult">Very Difficult</Option>
                </Select>
              </Form.Item>
              
              <Form.Item
                name="cardiacRisk"
                label="Cardiac Risk Factors"
              >
                <Select mode="multiple">
                  <Option value="none">None</Option>
                  <Option value="cad">CAD</Option>
                  <Option value="chf">CHF</Option>
                  <Option value="arrhythmia">Arrhythmia</Option>
                  <Option value="hypertension">Hypertension</Option>
                </Select>
              </Form.Item>
            </Card>
          </Col>
          
          <Col xs={24} md={12}>
            <Card title="Anesthesia Plan" className="mb-4 shadow-sm" size="small">
              <Form.Item
                name="anesthesiaType"
                label="Type of Anesthesia"
                rules={[{ required: true }]}
              >
                <Select>
                  <Option value="general">General Anesthesia</Option>
                  <Option value="regional">Regional Anesthesia</Option>
                  <Option value="monitored">Monitored Anesthesia Care</Option>
                  <Option value="local">Local Anesthesia</Option>
                </Select>
              </Form.Item>
              
              <Form.Item
                name="premedication"
                label="Premedication"
              >
                <Select mode="multiple">
                  <Option value="midazolam">Midazolam</Option>
                  <Option value="fentanyl">Fentanyl</Option>
                  <Option value="ondansetron">Ondansetron</Option>
                  <Option value="dexamethasone">Dexamethasone</Option>
                </Select>
              </Form.Item>
              
              <Form.Item
                name="specialConsiderations"
                label="Special Considerations"
              >
                <TextArea rows={3} placeholder="Enter any special considerations..." />
              </Form.Item>
            </Card>
          </Col>
        </Row>
        
        <Card 
          title={
            <span className="text-red-500">
              <AlertOutlined className="mr-2" />
              Risk Assessment
            </span>
          } 
          className="mb-4 shadow-sm" 
          size="small"
        >
          <Form.Item
            name="riskFactors"
            label="Identified Risk Factors"
          >
            <Select mode="multiple">
              <Option value="allergy">Allergy</Option>
              <Option value="bleeding">Bleeding Risk</Option>
              <Option value="diabetes">Diabetes</Option>
              <Option value="obesity">Obesity</Option>
              <Option value="smoking">Smoking</Option>
              <Option value="sleep-apnea">Sleep Apnea</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="mitigationPlan"
            label="Risk Mitigation Plan"
          >
            <TextArea rows={3} placeholder="Describe risk mitigation strategies..." />
          </Form.Item>
        </Card>
        
        <div className="flex justify-end">
          <Button 
            type="primary" 
            htmlType="submit"
            icon={<SafetyOutlined />}
          >
            Complete Evaluation
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AnesthesiaEvaluation;