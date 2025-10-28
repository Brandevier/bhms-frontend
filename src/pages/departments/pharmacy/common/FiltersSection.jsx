import React from 'react';
import { Card, Row, Col, Select, DatePicker } from 'antd';

const { RangePicker } = DatePicker;
const { Option } = Select;

const FiltersSection = () => {
  return (
    <Card style={{ marginBottom: 24 }}>
      <Row gutter={16}>
        <Col span={8}>
          <RangePicker 
            style={{ width: '100%' }} 
            placeholder={['Start Date', 'End Date']}
          />
        </Col>
        <Col span={8}>
          <Select
            style={{ width: '100%' }}
            placeholder="Filter by Department"
            defaultValue="all"
          >
            <Option value="all">All Departments</Option>
            <Option value="consultation">Consultation</Option>
            <Option value="pharmacy">Pharmacy</Option>
          </Select>
        </Col>
        <Col span={8}>
          <Select
            style={{ width: '100%' }}
            placeholder="Filter by Drug Category"
            defaultValue="all"
          >
            <Option value="all">All Categories</Option>
            <Option value="antibiotics">Antibiotics</Option>
            <Option value="analgesics">Analgesics</Option>
          </Select>
        </Col>
      </Row>
    </Card>
  );
};

export default FiltersSection;