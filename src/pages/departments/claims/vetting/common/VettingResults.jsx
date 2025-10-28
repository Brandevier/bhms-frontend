// components/VettingResults.js
import React, { useState } from 'react';
import { Card, Row, Col, Statistic, Typography, Tabs, Alert, Button, Space, Divider, List, Tag, message } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, EditOutlined, FileTextOutlined, WarningOutlined, EyeOutlined } from '@ant-design/icons';
import VettingTable from './VettingTable';
import ValidationStatus from './ValidationStatus';
import XmlJsonEditor from './XmlJsonEditor';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const VettingResults = ({ results, onSaveChanges }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  
  // Extract data from the backend response structure
  const validationSummary = results?.validationSummary;
  const claims = results?.claims || [];
  const xmlData = results?.xmlData || {}; // Assuming we have xmlData in the response
  const overallStatus = results?.overallStatus;

  // Flatten all services from all claims for the table
  const allServices = claims.flatMap(claim => 
    claim.services.map(service => ({
      ...service,
      claimId: claim.claimId,
      memberName: claim.memberName,
      claimStatus: claim.validationStatus,
      diagnosis: claim.diagnosis
    }))
  );

  const handleSave = () => {
    // Implement save logic here
    console.log('Saving changes...');
    setIsEditing(false);
    message.success('Changes saved successfully');
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDataChange = (newData) => {
    // Handle data changes if needed
    console.log('Data changed:', newData);
  };

  const handleXmlJsonSave = (newData) => {
    // Handle saving the modified XML/JSON data
    console.log('Saving XML/JSON data:', newData);
    // You would typically send this to your backend here
  };

  // Count failed services across all claims
  const totalFailedServices = allServices.filter(service => 
    !service.validation?.isValid
  ).length;

  // Get all validation issues for the issues tab
  const allIssues = claims.flatMap(claim => 
    claim.services
      .filter(service => !service.validation?.isValid)
      .map(service => ({
        claimId: claim.claimId,
        memberName: claim.memberName,
        serviceCode: service.serviceCode,
        serviceDescription: service.description,
        issues: service.validation?.issues || [],
        diagnosis: claim.diagnosis
      }))
  );

  return (
    <Card style={{ marginTop: 24 }}>
      {/* Summary Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Statistic
            title="Total Claims"
            value={validationSummary?.totalClaims || 0}
            prefix={<FileTextOutlined />}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic
            title="Total Services"
            value={validationSummary?.totalServices || 0}
            valueStyle={{ color: '#1890ff' }}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic
            title="Passed Services"
            value={validationSummary?.passedServices || 0}
            valueStyle={{ color: '#52c41a' }}
            prefix={<CheckCircleOutlined />}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic
            title="Failed Services"
            value={validationSummary?.failedServices || 0}
            valueStyle={{ color: '#ff4d4f' }}
            prefix={<CloseCircleOutlined />}
          />
        </Col>
      </Row>

      {/* Success Rate */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Statistic
            title="Success Rate"
            value={validationSummary?.successRate || 0}
            suffix="%"
            valueStyle={{ 
              color: validationSummary?.successRate >= 80 ? '#52c41a' : 
                     validationSummary?.successRate >= 50 ? '#faad14' : '#ff4d4f' 
            }}
          />
        </Col>
      </Row>

      {/* Overall Status */}
      <ValidationStatus status={overallStatus} successRate={validationSummary?.successRate} />

      {/* Action Buttons */}
      <div style={{ marginBottom: 16, textAlign: 'right' }}>
        {isEditing ? (
          <Space>
            <Button onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button type="primary" onClick={handleSave}>
              Save Changes
            </Button>
          </Space>
        ) : (
          <Button 
            icon={<EditOutlined />} 
            onClick={handleEdit}
            type="primary"
            disabled={totalFailedServices === 0}
          >
            Edit Failed Claims
          </Button>
        )}
      </div>

      {/* Results Tabs */}
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        type="card"
      >
        <TabPane tab="Service Details" key="details">
          <VettingTable
            data={allServices}
            isEditing={isEditing}
            onDataChange={handleDataChange}
          />
        </TabPane>
        
        <TabPane tab="Validation Issues" key="issues">
          <div style={{ padding: 16 }}>
            {allIssues.length === 0 ? (
              <Alert
                message="No Validation Issues"
                description="All services passed the NHIA validation checks."
                type="success"
                showIcon
              />
            ) : (
              <div>
                <Alert
                  message={`${allIssues.length} Validation Issues Found`}
                  description="Detailed breakdown of all validation errors:"
                  type="warning"
                  showIcon
                  style={{ marginBottom: 24 }}
                />
                
                <List
                  dataSource={allIssues}
                  renderItem={(item, index) => (
                    <List.Item key={index}>
                      <Card size="small" style={{ width: '100%', borderLeft: '4px solid #ff4d4f' }}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                          <div>
                            <Text strong>Claim ID: </Text>
                            <Text code>{item.claimId}</Text>
                            <Text strong style={{ marginLeft: 16 }}>Member: </Text>
                            <Text>{item.memberName}</Text>
                          </div>
                          
                          <div>
                            <Text strong>Service: </Text>
                            <Text>{item.serviceCode} - {item.serviceDescription}</Text>
                          </div>
                          
                          <div>
                            <Text strong>Diagnosis: </Text>
                            <Text>{item.diagnosis?.originalCode} - {
                              item.diagnosis?.isValid ? 
                              <Tag color="green">Valid</Tag> : 
                              <Tag color="red">Invalid</Tag>
                            }</Text>
                          </div>
                          
                          <div>
                            <Text strong>Issues: </Text>
                            <Space size={[0, 8]} wrap>
                              {item.issues.map((issue, issueIndex) => (
                                <Tag key={issueIndex} color="red" icon={<WarningOutlined />}>
                                  {issue}
                                </Tag>
                              ))}
                            </Space>
                          </div>
                        </Space>
                      </Card>
                    </List.Item>
                  )}
                />
              </div>
            )}
          </div>
        </TabPane>
        
        <TabPane tab="Claims Summary" key="summary">
          <div style={{ padding: 16 }}>
            {claims.map(claim => (
              <Card key={claim.claimId} style={{ marginBottom: 24 }} title={
                <Space>
                  <Text>Claim: {claim.claimId}</Text>
                  <Tag color={claim.validationStatus === 'pass' ? 'green' : 'red'}>
                    {claim.validationStatus?.toUpperCase()}
                  </Tag>
                </Space>
              }>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Text strong>Member: </Text>
                      <Text>{claim.memberName} ({claim.nhisNumber})</Text>
                    </Col>
                    <Col span={12}>
                      <Text strong>Total Amount: </Text>
                      <Text>₵{claim.totalAmount}</Text>
                    </Col>
                  </Row>
                  
                  <Row gutter={16}>
                    <Col span={12}>
                      <Text strong>Diagnosis: </Text>
                      <Text>{claim.diagnosis?.originalCode} - {
                        claim.diagnosis?.isValid ? 
                        <Tag color="green">Valid</Tag> : 
                        <Tag color="red">Invalid: {claim.diagnosis?.issues?.join(', ')}</Tag>
                      }</Text>
                    </Col>
                    <Col span={12}>
                      <Text strong>Services: </Text>
                      <Text>{claim.servicesCount} services</Text>
                    </Col>
                  </Row>
                  
                  <Divider />
                  
                  <Text strong>Services Breakdown:</Text>
                  <List
                    size="small"
                    dataSource={claim.services}
                    renderItem={service => (
                      <List.Item>
                        <Space>
                          <Text>{service.serviceCode}</Text>
                          <Text>-</Text>
                          <Text>{service.description}</Text>
                          <Tag color={service.validation?.isValid ? 'green' : 'red'} size="small">
                            {service.validation?.isValid ? 'PASS' : 'FAIL'}
                          </Tag>
                          {!service.validation?.isValid && (
                            <Button 
                              type="link" 
                              size="small" 
                              icon={<EyeOutlined />}
                              onClick={() => setActiveTab('issues')}
                            >
                              View Issues
                            </Button>
                          )}
                        </Space>
                      </List.Item>
                    )}
                  />
                </Space>
              </Card>
            ))}
          </div>
        </TabPane>
        
        <TabPane tab="Diagnosis Validation" key="diagnosis">
          <div style={{ padding: 16 }}>
            <List
              dataSource={claims}
              renderItem={claim => (
                <List.Item>
                  <Card size="small" style={{ width: '100%' }}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <div>
                        <Text strong>Claim: </Text>
                        <Text code>{claim.claimId}</Text>
                        <Text strong style={{ marginLeft: 16 }}>Member: </Text>
                        <Text>{claim.memberName}</Text>
                      </div>
                      
                      <div>
                        <Text strong>Diagnosis Code: </Text>
                        <Text>{claim.diagnosis?.originalCode}</Text>
                        <Tag 
                          color={claim.diagnosis?.isValid ? 'green' : 'red'} 
                          style={{ marginLeft: 8 }}
                        >
                          {claim.diagnosis?.isValid ? 'VALID' : 'INVALID'}
                        </Tag>
                      </div>
                      
                      {!claim.diagnosis?.isValid && (
                        <div>
                          <Text strong>Validation Issues: </Text>
                          <Space size={[0, 8]} wrap>
                            {claim.diagnosis?.issues?.map((issue, index) => (
                              <Tag key={index} color="red" icon={<WarningOutlined />}>
                                {issue}
                              </Tag>
                            ))}
                          </Space>
                        </div>
                      )}
                      
                      {claim.diagnosis?.mappedDiagnosis && (
                        <div>
                          <Text strong>Mapped To: </Text>
                          <Text>{claim.diagnosis.mappedDiagnosis.diagnosis_name}</Text>
                        </div>
                      )}
                    </Space>
                  </Card>
                </List.Item>
              )}
            />
          </div>
        </TabPane>
        
        <TabPane tab="XML/JSON Viewer" key="xmljson">
          <XmlJsonEditor 
            xmlData={xmlData} 
            onSave={handleXmlJsonSave}
          />
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default VettingResults;