import React, { useState } from 'react';
import { Card, Button, Collapse, Tag, Spin, Alert, Badge, List, Typography } from 'antd';
import { RobotOutlined, HighlightOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { analyzePatient, setSelectedEntities, clearAnalysis } from '../../redux/slice/patientAISlice';
import { message } from 'antd';
import apiClient from '../../redux/middleware/apiClient';

const { Panel } = Collapse;
const { Title, Text } = Typography;

const AIPanel = ({ patientId, visitId }) => {
  const dispatch = useDispatch();
  const { analysis, loading, error } = useSelector((state) => state.patientAI);
  const [open, setOpen] = useState(false);

  const handleAnalyze = async () => {
    try {
      // Fetch full patient data from backend
      const response = await apiClient.get('/diagnosis/patient/get-diagnosis', {
        params: {
          patient_id: patientId,
          institution_id: 1
        }
      });
      const data = response.data;
      
      // Handle if response is not an array (e.g., error or empty)
      const diagnoses = Array.isArray(data) ? data : [];
      
      // Concatenate all text fields
      const patientText = diagnoses.map(d => 
        [d.diagnosis_name, d.patient_complaints, d.doctors_note, d.diagnosisDetails]
          .filter(Boolean)
          .join(' ')
      ).join(' ').substring(0, 4000);
      
      if (!patientText.trim()) {
        message.warning('No patient text available for analysis');
        return;
      }
      
      dispatch(analyzePatient({ patientId, visitId, text: patientText }));
    } catch (error) {
      message.error('Failed to fetch patient data');
      console.error('Patient data fetch error:', error);
    }
  };

  const renderEntityTags = (entities, group) => (
    <div>
      <Text strong>{group.toUpperCase()}</Text>
      <div style={{ marginTop: 8 }}>
        {entities.slice(0, 10).map((ent, idx) => (
          <Tag
            key={idx}
            color="blue"
            style={{ cursor: 'pointer', margin: '2px' }}
            onClick={() => dispatch(setSelectedEntities([ent]))}
          >
            {ent.word} ({(ent.score * 100).toFixed(1)}%)
          </Tag>
        ))}
        {entities.length > 10 && (
          <Tag style={{ margin: '2px' }}>
            +{entities.length - 10} more
          </Tag>
        )}
      </div>
    </div>
  );

  const mockAnalysis = {
    patient_id: patientId,
    entities: [],
    summary: {
      diseases: [{ word: 'hypertension', score: 0.95 }],
      drugs: [{ word: 'amlodipine', score: 0.92 }],
    },
  }; // Fallback if backend down

  return (
    <Card
      size="small"
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <RobotOutlined style={{ marginRight: 8 }} />
          AI Patient Analysis
          {analysis && <Badge style={{ marginLeft: 8 }} status="success" text="Ready" />}
        </div>
      }
      extra={
        <Button size="small" onClick={handleAnalyze} loading={loading} icon={<HighlightOutlined />}>
          Analyze
        </Button>
      }
      style={{ marginTop: 16 }}
    >
      {error && (
        <Alert
          message="AI Analysis Error"
          description={error}
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}
      <Collapse activeKey={open ? '1' : undefined} onChange={() => setOpen(!open)}>
        <Panel header="AI Insights" key="1">
          {loading ? (
            <div style={{ textAlign: 'center', padding: 24 }}>
              <Spin size="large" />
              <div style={{ marginTop: 16 }}>Analyzing patient data...</div>
            </div>
          ) : analysis ? (
            <div>
              <List
                size="small"
                header={<div><Text strong>Key Findings</Text></div>}
                bordered
                dataSource={[
                  `Diseases detected: ${analysis.summary?.diseases?.length || 0}`,
                  `Drugs mentioned: ${analysis.summary?.drugs?.length || 0}`,
                  `Total entities: ${analysis.entities?.length || 0}`,
                ]}
                renderItem={(item) => <List.Item>{item}</List.Item>}
              />
              {renderEntityTags(analysis.summary?.diseases || [], 'Diseases')}
              {renderEntityTags(analysis.summary?.drugs || [], 'Drugs')}
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#999', padding: 24 }}>
              <RobotOutlined style={{ fontSize: 48 }} />
              <div style={{ marginTop: 16 }}>Click Analyze to run AI on patient notes & history</div>
            </div>
          )}
        </Panel>
      </Collapse>
    </Card>
  );
};

export default AIPanel;

