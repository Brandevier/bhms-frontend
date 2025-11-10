import React from 'react';
import { Card, Table, Tag, Form, InputNumber, TimePicker, Button, Row, Col, Divider, Space, Badge } from 'antd';
import { DashboardOutlined, HeartOutlined } from '@ant-design/icons';
import moment from 'moment';

const VitalSignsCard = ({ vitals, onNewVital, loading }) => {
  const [form] = Form.useForm();

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

  const onFinish = (values) => {
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
      hrStatus: getHRStatus(values.hr),
      timestamp: new Date().toISOString()
    };
    
    onNewVital(newVital);
    form.resetFields(['sbp', 'dbp', 'hr', 'rr', 'temp', 'spo2']);
  };

  return (
    <Card 
      title={
        <Space>
          <DashboardOutlined />
          Vital Signs
          <Badge count={vitals.length} showZero style={{ backgroundColor: '#52c41a' }} />
        </Space>
      } 
      className="mb-4 shadow-sm border"
      extra={<Tag color="blue">Last: {vitals[vitals.length - 1]?.time || 'No data'}</Tag>}
    >
      <Table 
        columns={vitalColumns} 
        dataSource={vitals} 
        pagination={false}
        size="small"
        className="mb-4"
        loading={loading}
      />
      
      <Divider>Add New Vital Signs</Divider>
      
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Row gutter={16}>
          <Col xs={24} sm={8}>
            <Form.Item 
              name="time" 
              label="Time"
              rules={[{ required: true, message: 'Please select time' }]}
              initialValue={moment()}
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
                loading={loading}
              >
                Record Vitals
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default VitalSignsCard;