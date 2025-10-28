import React, { useState } from 'react';
import { Card, Form, Input, Button, Select, DatePicker, TimePicker, Checkbox, Row, Col, Divider,InputNumber } from 'antd';
import { 
  UserOutlined,
  HeartOutlined,
  DashboardOutlined,
  FileTextOutlined,
  SafetyOutlined
} from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;

const NursingDocumentation = ({ patient }) => {
  const [form] = Form.useForm();
  const [vitals, setVitals] = useState([
    { time: '08:00', bp: '120/80', hr: 72, rr: 16, temp: 36.8, spo2: 98 }
  ]);

  const onFinish = (values) => {
    console.log('Received values:', values);
    const newVital = {
      time: values.time.format('HH:mm'),
      bp: `${values.sbp}/${values.dbp}`,
      hr: values.hr,
      rr: values.rr,
      temp: values.temp,
      spo2: values.spo2
    };
    setVitals([...vitals, newVital]);
    form.resetFields(['sbp', 'dbp', 'hr', 'rr', 'temp', 'spo2']);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">
          <UserOutlined className="mr-2" />
          Nursing Documentation for {patient.name}
        </h2>
        <Button type="primary">Complete Assessment</Button>
      </div>
      
      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <Card title="Vital Signs" className="mb-4 shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Time</th>
                  <th className="text-left p-2">BP</th>
                  <th className="text-left p-2">HR</th>
                  <th className="text-left p-2">RR</th>
                  <th className="text-left p-2">Temp</th>
                  <th className="text-left p-2">SpO2</th>
                </tr>
              </thead>
              <tbody>
                {vitals.map((vital, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{vital.time}</td>
                    <td className="p-2">{vital.bp}</td>
                    <td className="p-2">{vital.hr}</td>
                    <td className="p-2">{vital.rr}</td>
                    <td className="p-2">{vital.temp}°C</td>
                    <td className="p-2">{vital.spo2}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <Divider />
            
            <Form form={form} onFinish={onFinish} layout="vertical">
              <Row gutter={16}>
                <Col xs={24} sm={6}>
                  <Form.Item name="time" label="Time">
                    <TimePicker format="HH:mm" />
                  </Form.Item>
                </Col>
                <Col xs={12} sm={6}>
                  <Form.Item name="sbp" label="SBP">
                    <InputNumber placeholder="SBP" min={50} max={250} />
                  </Form.Item>
                </Col>
                <Col xs={12} sm={6}>
                  <Form.Item name="dbp" label="DBP">
                    <InputNumber placeholder="DBP" min={30} max={150} />
                  </Form.Item>
                </Col>
                <Col xs={12} sm={6}>
                  <Form.Item name="hr" label="HR">
                    <InputNumber placeholder="HR" min={30} max={200} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={12} sm={6}>
                  <Form.Item name="rr" label="RR">
                    <InputNumber placeholder="RR" min={8} max={40} />
                  </Form.Item>
                </Col>
                <Col xs={12} sm={6}>
                  <Form.Item name="temp" label="Temp (°C)">
                    <InputNumber placeholder="Temp" min={30} max={42} step={0.1} />
                  </Form.Item>
                </Col>
                <Col xs={12} sm={6}>
                  <Form.Item name="spo2" label="SpO2">
                    <InputNumber placeholder="SpO2" min={50} max={100} />
                  </Form.Item>
                </Col>
                <Col xs={12} sm={6}>
                  <Form.Item label=" " colon={false}>
                    <Button htmlType="submit" type="primary">
                      Add Vital
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
          
          <Card title="Allergies" className="mb-4 shadow-sm">
            <Form layout="vertical">
              <Form.Item name="allergies" label="Known Allergies">
                <Select mode="tags" placeholder="Add allergies">
                  <Option value="penicillin">Penicillin</Option>
                  <Option value="sulfa">Sulfa Drugs</Option>
                  <Option value="latex">Latex</Option>
                  <Option value="iodine">Iodine</Option>
                </Select>
              </Form.Item>
              <Form.Item name="allergyReaction" label="Reaction">
                <TextArea rows={2} placeholder="Describe reaction" />
              </Form.Item>
              <div className="flex justify-end">
                <Button type="primary">Save Allergies</Button>
              </div>
            </Form>
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card title="Pre-Op Assessment" className="mb-4 shadow-sm">
            <Form layout="vertical">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item name="skinAssessment" label="Skin Assessment">
                  <Select placeholder="Select skin condition">
                    <Option value="normal">Normal</Option>
                    <Option value="abrasions">Abrasions</Option>
                    <Option value="lesions">Lesions</Option>
                    <Option value="pressure-areas">Pressure Areas</Option>
                  </Select>
                </Form.Item>
                <Form.Item name="painScore" label="Pain Score (0-10)">
                  <InputNumber min={0} max={10} />
                </Form.Item>
              </div>
              
              <Form.Item name="assessmentNotes" label="Assessment Notes">
                <TextArea rows={3} placeholder="Document assessment findings" />
              </Form.Item>
              
              <Divider />
              
              <h3 className="font-medium mb-2">
                <SafetyOutlined className="mr-2" />
                Safety Checks
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item name="idBand" valuePropName="checked">
                  <Checkbox>ID Band Verified</Checkbox>
                </Form.Item>
                <Form.Item name="consent" valuePropName="checked">
                  <Checkbox>Consent Verified</Checkbox>
                </Form.Item>
                <Form.Item name="npo" valuePropName="checked">
                  <Checkbox>NPO Status Confirmed</Checkbox>
                </Form.Item>
                <Form.Item name="jewelry" valuePropName="checked">
                  <Checkbox>Jewelry Removed</Checkbox>
                </Form.Item>
              </div>
              
              <Divider />
              
              <div className="flex justify-between">
                <Form.Item name="nurse" label="Nurse" className="w-full mr-2">
                  <Input placeholder="Nurse name" />
                </Form.Item>
                <Form.Item name="date" label="Date" className="w-full">
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </div>
              
              <div className="flex justify-end">
                <Button type="primary">Sign Documentation</Button>
              </div>
            </Form>
          </Card>
          
          <Card title="Pre-Op Checklist" className="shadow-sm">
            <Form layout="vertical">
              <Form.Item name="checklist" label="Pre-Operative Checklist">
                <Checkbox.Group style={{ width: '100%' }}>
                  <Row>
                    <Col span={24}>
                      <Checkbox value="history">History and Physical completed</Checkbox>
                    </Col>
                    <Col span={24}>
                      <Checkbox value="labs">Pre-op labs reviewed</Checkbox>
                    </Col>
                    <Col span={24}>
                      <Checkbox value="meds">Pre-op medications administered</Checkbox>
                    </Col>
                    <Col span={24}>
                      <Checkbox value="site">Surgical site marked</Checkbox>
                    </Col>
                    <Col span={24}>
                      <Checkbox value="void">Patient voided</Checkbox>
                    </Col>
                    <Col span={24}>
                      <Checkbox value="belongings">Belongings secured</Checkbox>
                    </Col>
                  </Row>
                </Checkbox.Group>
              </Form.Item>
              
              <Form.Item name="comments" label="Additional Comments">
                <TextArea rows={2} placeholder="Any additional comments" />
              </Form.Item>
              
              <div className="flex justify-end">
                <Button type="primary">Complete Checklist</Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default NursingDocumentation;