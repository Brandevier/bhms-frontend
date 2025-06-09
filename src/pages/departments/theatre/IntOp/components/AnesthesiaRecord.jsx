import React, { useState } from 'react';
import { Table, Card, Button, InputNumber, Form, Row, Col, Tag } from 'antd';
import { 
  PlusOutlined,
  LineChartOutlined,
  SaveOutlined
} from '@ant-design/icons';

const { TextArea } = Form;

const AnesthesiaRecord = () => {
  const [vitals, setVitals] = useState([
    { time: '08:45', bp: '120/80', hr: 72, spo2: 98, etco2: 35, temp: 36.8 }
  ]);
  const [medications, setMedications] = useState([
    { medication: 'Propofol', dose: '150 mg', time: '08:45', route: 'IV' }
  ]);

  const onAddVital = (values) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setVitals([
      ...vitals,
      {
        time: timeString,
        bp: `${values.sbp}/${values.dbp}`,
        hr: values.hr,
        spo2: values.spo2,
        etco2: values.etco2,
        temp: values.temp
      }
    ]);
  };

  return (
    <Row gutter={16}>
      <Col xs={24} lg={12}>
        <Card 
          title="Vital Signs" 
          extra={
            <Button icon={<LineChartOutlined />}>Trends</Button>
          }
        >
          <Table 
            columns={[
              { title: 'Time', dataIndex: 'time' },
              { title: 'BP', dataIndex: 'bp' },
              { title: 'HR', dataIndex: 'hr' },
              { title: 'SpO2', dataIndex: 'spo2' },
              { title: 'ETCO2', dataIndex: 'etco2' },
              { title: 'Temp', dataIndex: 'temp' }
            ]} 
            dataSource={vitals} 
            size="small"
          />
        </Card>
      </Col>
      <Col xs={24} lg={12}>
        <Card 
          title="Medications" 
          extra={
            <Button icon={<SaveOutlined />}>Save</Button>
          }
        >
          <Table 
            columns={[
              { title: 'Medication', dataIndex: 'medication' },
              { title: 'Dose', dataIndex: 'dose' },
              { title: 'Time', dataIndex: 'time' },
              { title: 'Route', dataIndex: 'route' }
            ]} 
            dataSource={medications} 
            size="small"
          />
        </Card>
      </Col>
    </Row>
  );
};

export default AnesthesiaRecord;