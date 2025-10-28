import React, { useState } from 'react';
import { Card, Checkbox, Button, List, Typography, Divider } from 'antd';
import { 
  SafetyCertificateOutlined,
  CheckCircleOutlined,
  WarningOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const SafetyChecks = ({ timeoutCompleted, onTimeoutComplete }) => {
  const [checks, setChecks] = useState({
    patientIdentity: false,
    procedure: false,
    siteMarking: false,
    equipment: false,
    allergies: false,
    antibiotics: false
  });

  const handleCheck = (key) => {
    setChecks({
      ...checks,
      [key]: !checks[key]
    });
  };

  const allChecksComplete = Object.values(checks).every(Boolean);

  return (
    <Card
      title={
        <span>
          <SafetyCertificateOutlined className="mr-2" />
          Surgical Safety Checklist
        </span>
      }
      bordered={false}
      className="shadow-sm"
    >
      {!timeoutCompleted ? (
        <>
          <Title level={4} className="text-red-500">
            <WarningOutlined className="mr-2" />
            Time-Out Required Before Proceeding
          </Title>
          
          <List
            dataSource={[
              { key: 'patientIdentity', label: 'Patient Identity Verified' },
              { key: 'procedure', label: 'Correct Procedure Confirmed' },
              { key: 'siteMarking', label: 'Site Marking Verified' },
              { key: 'equipment', label: 'Equipment Available' },
              { key: 'allergies', label: 'Allergies Confirmed' },
              { key: 'antibiotics', label: 'Antibiotics Administered' }
            ]}
            renderItem={(item) => (
              <List.Item>
                <Checkbox
                  checked={checks[item.key]}
                  onChange={() => handleCheck(item.key)}
                >
                  {item.label}
                </Checkbox>
              </List.Item>
            )}
          />
          
          <Divider />
          
          <div className="text-center">
            <Button
              type="primary"
              size="large"
              icon={<CheckCircleOutlined />}
              disabled={!allChecksComplete}
              onClick={onTimeoutComplete}
            >
              Complete Time-Out
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <CheckCircleOutlined className="text-green-500 text-4xl mb-4" />
          <Title level={3} className="text-green-500">
            Time-Out Completed Successfully
          </Title>
          <Text type="secondary">All safety checks verified at {new Date().toLocaleTimeString()}</Text>
        </div>
      )}
    </Card>
  );
};

export default SafetyChecks;