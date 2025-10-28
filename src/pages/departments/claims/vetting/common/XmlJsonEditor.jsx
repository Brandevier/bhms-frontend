// components/XmlJsonEditor.js
import React, { useState, useEffect } from 'react';
import { Card, Button, Space, Alert, message, Tabs } from 'antd';
import { DownloadOutlined, SaveOutlined } from '@ant-design/icons';
import CodeEditor from './CodeEditor';
import xml2js from 'xml2js'; // Install with: npm install xml2js

const { TabPane } = Tabs;

const XmlJsonEditor = ({ xmlData, onSave }) => {
  const [activeTab, setActiveTab] = useState('xml');
  const [editedXml, setEditedXml] = useState('');
  const [jsonData, setJsonData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Parse XML to JSON when component mounts or xmlData changes
  useEffect(() => {
    const parseXmlToJson = async () => {
      if (xmlData?.content) {
        setEditedXml(xmlData.content);
        
        try {
          // Parse XML to JSON
          const parser = new xml2js.Parser({ explicitArray: false });
          const result = await parser.parseStringPromise(xmlData.content);
          setJsonData(result);
        } catch (error) {
          console.error('Error parsing XML:', error);
          message.error('Failed to parse XML: ' + error.message);
          setJsonData({ error: 'Failed to parse XML' });
        }
      } else {
        setEditedXml('<!-- No XML content available -->');
        setJsonData({ error: 'No XML data provided' });
      }
      setIsLoading(false);
    };

    parseXmlToJson();
  }, [xmlData]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    try {
      if (activeTab === 'xml') {
        // Validate XML before saving
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(editedXml, "text/xml");
        
        if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
          throw new Error('Invalid XML format');
        }
        
        onSave({
          content: editedXml,
          fileInfo: xmlData?.fileInfo
        });
      } else {
        // For JSON tab, we'd need to convert back to XML
        // This is more complex, so you might want to focus on XML editing
        message.info('Please edit the XML directly for now');
        return;
      }
      
      setIsEditing(false);
      message.success('Changes saved successfully');
    } catch (error) {
      message.error('Error: ' + error.message);
    }
  };

  const handleDownload = () => {
    const content = activeTab === 'xml' ? editedXml : JSON.stringify(jsonData, null, 2);
    const type = activeTab === 'xml' ? 'text/xml' : 'application/json';
    const extension = activeTab === 'xml' ? 'xml' : 'json';
    const filename = xmlData?.fileInfo?.originalname 
      ? `${xmlData.fileInfo.originalname.split('.')[0]}.${extension}`
      : `claim-data.${extension}`;
    
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return <Card loading={true}>Loading XML content...</Card>;
  }

  return (
    <Card>
      <Space direction="vertical" style={{ width: '100%' }}>
        <div style={{ marginBottom: 16, textAlign: 'right' }}>
          {isEditing ? (
            <Space>
              <Button onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button type="primary" onClick={handleSave} icon={<SaveOutlined />}>
                Save Changes
              </Button>
            </Space>
          ) : (
            <Space>
              <Button 
                onClick={handleEdit}
                type="primary"
                disabled={!xmlData?.content}
              >
                Edit XML
              </Button>
              <Button 
                onClick={handleDownload}
                icon={<DownloadOutlined />}
                disabled={!xmlData?.content}
              >
                Download {activeTab.toUpperCase()}
              </Button>
            </Space>
          )}
        </div>

        {isEditing ? (
          <Alert
            message="Editing Mode"
            description="You are now editing the XML data. Make your changes and save them when finished."
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
        ) : (
          <Alert
            message="View Mode"
            description="Viewing the uploaded XML file and its JSON representation."
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="XML View" key="xml">
            <CodeEditor
              value={editedXml}
              onChange={setEditedXml}
              readOnly={!isEditing}
              language="xml"
              height="500px"
            />
          </TabPane>
          <TabPane tab="JSON View" key="json">
            <CodeEditor
              value={JSON.stringify(jsonData, null, 2)}
              onChange={() => {}} // Read-only for JSON view
              readOnly={true}
              language="json"
              height="500px"
            />
          </TabPane>
        </Tabs>
      </Space>
    </Card>
  );
};

export default XmlJsonEditor;