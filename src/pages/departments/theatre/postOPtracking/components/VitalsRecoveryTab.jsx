import React from 'react';
import { Card, List, Tag, Button, Table, Row, Col, Badge } from 'antd';
import { AlertOutlined, CheckCircleOutlined } from '@ant-design/icons';
import PostOpVitalsChart from './PostOpVitalsChart';



const VitalsRecoveryTab = ({ vitals, alerts, medications, onResolveAlert }) => {
  const getPriorityTag = (priority) => {
    switch(priority) {
      case 'high':
        return <Tag color="red">High</Tag>;
      case 'medium':
        return <Tag color="orange">Medium</Tag>;
      default:
        return <Tag color="blue">Low</Tag>;
    }
  };

  return (
    <>
      <Row gutter={16}>
        <Col xs={24} lg={16}>
          <Card title="Vitals Trend" className="mb-4 shadow-sm">
            <PostOpVitalsChart data={vitals} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Latest Vitals" className="mb-4 shadow-sm">
            <List
              dataSource={vitals.slice(0, 3)}
              renderItem={(item, index) => (
                <List.Item>
                  <div className="w-full">
                    <div className="flex justify-between">
                      <span className="font-medium">{item.time}</span>
                      <Tag color={index === 0 ? 'blue' : 'default'}>
                        {index === 0 ? 'Current' : ''}
                      </Tag>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <div>
                        <div className="text-gray-500 text-xs">BP</div>
                        <div>{item.bp}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 text-xs">HR</div>
                        <div>{item.hr}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 text-xs">SpO2</div>
                        <div>{item.spo2}%</div>
                      </div>
                      <div>
                        <div className="text-gray-500 text-xs">Temp</div>
                        <div>{item.temp}°C</div>
                      </div>
                      <div>
                        <div className="text-gray-500 text-xs">RR</div>
                        <div>{item.rr}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 text-xs">Pain</div>
                        <div>
                          <Badge 
                            count={item.pain} 
                            style={{ 
                              backgroundColor: item.pain > 3 ? '#f5222d' : '#52c41a' 
                            }} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <Card title="Active Alerts" className="mb-4 shadow-sm">
            {alerts.filter(a => !a.resolved).length > 0 ? (
              <List
                dataSource={alerts.filter(a => !a.resolved)}
                renderItem={alert => (
                  <List.Item>
                    <div className="w-full">
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <AlertOutlined className="text-red-500 mr-2" />
                          <span className="font-medium">{alert.message}</span>
                        </div>
                        {getPriorityTag(alert.priority)}
                      </div>
                      <div className="flex justify-end mt-2">
                        <Button 
                          size="small"
                          onClick={() => onResolveAlert(alert.id)}
                        >
                          Mark Resolved
                        </Button>
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            ) : (
              <div className="text-center py-4 text-green-500">
                <CheckCircleOutlined className="text-2xl mb-2" />
                <div>No Active Alerts</div>
              </div>
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Medication Administration" className="mb-4 shadow-sm">
            <Table
              columns={[
                { title: 'Medication', dataIndex: 'medication' },
                { title: 'Dose', dataIndex: 'dose' },
                { title: 'Route', dataIndex: 'route' },
                { title: 'Time', dataIndex: 'time' },
                { title: 'Given By', dataIndex: 'givenBy' }
              ]}
              dataSource={medications}
              size="small"
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};     

export default VitalsRecoveryTab;