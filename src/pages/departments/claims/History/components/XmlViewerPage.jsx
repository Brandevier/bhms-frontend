import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Button, 
  Spin, 
  Alert, 
  Tabs, 
  Descriptions, 
  Tag, 
  Space,
  Breadcrumb 
} from 'antd';
import { 
  ArrowLeftOutlined, 
  DownloadOutlined, 
  CodeOutlined, 
  FileTextOutlined,
  HomeOutlined 
} from '@ant-design/icons';
import moment from 'moment';
import xml2js from 'xml2js'; // Install with: npm install xml2js
const { TabPane } = Tabs;

const XmlViewerPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { batch } = location.state || {};
  
  const [xmlData, setXmlData] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('formatted');

  useEffect(() => {
    if (batch) {
      fetchXmlData();
    }
  }, [batch]);

  // Fixed XML parsing function
  const parseXmlData = async (xmlContent) => {
    return new Promise((resolve, reject) => {
      const parser = new xml2js.Parser({
        explicitArray: false,
        mergeAttrs: true,
        explicitRoot: false,
        normalize: true,
        normalizeTags: true,
        trim: true
      });

      parser.parseString(xmlContent, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  };

  // Alternative XML parsing using a more stable approach
  const parseXmlSafely = async (xmlContent) => {
    try {
      const parser = new xml2js.Parser({
        explicitArray: false,
        mergeAttrs: true,
        explicitRoot: false
      });
      
      const result = await parser.parseStringPromise(xmlContent);
      return result;
    } catch (err) {
      throw new Error(`XML parsing failed: ${err.message}`);
    }
  };

  const fetchXmlData = async () => {
    if (!batch?.file_path) {
      setError('No file path available');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // For demo purposes, let's create a mock XML response since we don't have a real API
      // Replace this with your actual API call
      const mockXmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<claims batch="${batch.batch_number}" institution="${batch.institution}">
  <header>
    <generatedDate>${batch.createdAt}</generatedDate>
    <totalClaims>${batch.total_claims}</totalClaims>
    <totalAmount>${batch.total_amount}</totalAmount>
  </header>
  <claim id="1">
    <patient>
      <name>John Doe</name>
      <id>PAT001</id>
    </patient>
    <service>
      <code>A001</code>
      <description>Consultation</description>
      <amount>150.00</amount>
    </service>
  </claim>
  <claim id="2">
    <patient>
      <name>Jane Smith</name>
      <id>PAT002</id>
    </patient>
    <service>
      <code>A002</code>
      <description>Laboratory Test</description>
      <amount>75.50</amount>
    </service>
  </claim>
</claims>`;

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Use the mock data for now - replace with actual API call
      const xmlContent = mockXmlContent;
      setXmlData(xmlContent);
      
      // Parse XML using the safe method
      try {
        const parsed = await parseXmlSafely(xmlContent);
        setParsedData(parsed);
      } catch (parseError) {
        console.warn('XML parsing warning:', parseError);
        setError(`XML parsing issue: ${parseError.message}`);
        // Still set the XML data even if parsing fails
      }
      
    } catch (err) {
      console.error('Error fetching XML:', err);
      setError(err.message || 'Failed to load XML file');
    } finally {
      setLoading(false);
    }
  };

  // If you have a real API endpoint, use this version instead:
  /*
  const fetchXmlData = async () => {
    if (!batch?.file_path) {
      setError('No file path available');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/export-file?path=${encodeURIComponent(batch.file_path)}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch XML file: ${response.statusText}`);
      }

      const xmlContent = await response.text();
      setXmlData(xmlContent);
      
      // Parse XML using the safe method
      try {
        const parsed = await parseXmlSafely(xmlContent);
        setParsedData(parsed);
      } catch (parseError) {
        console.warn('XML parsing warning:', parseError);
        setError(`XML parsing issue: ${parseError.message}`);
      }
    } catch (err) {
      console.error('Error fetching XML:', err);
      setError(err.message || 'Failed to load XML file');
    } finally {
      setLoading(false);
    }
  };
  */

  const downloadXmlFile = () => {
    if (!xmlData) return;

    const blob = new Blob([xmlData], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = batch.file_name || 'exported-claims.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderFormattedView = () => {
    if (!parsedData) {
      return (
        <Alert
          message="No parsed data available"
          description="The XML file could not be parsed or is empty."
          type="warning"
          showIcon
        />
      );
    }

    const renderObject = (obj, depth = 0, parentKey = '') => {
      if (!obj || typeof obj !== 'object') {
        return <span className="text-gray-600">No data</span>;
      }

      return Object.keys(obj).map((key) => {
        const value = obj[key];
        const isObject = typeof value === 'object' && value !== null;
        const isArray = Array.isArray(value);
        const fullKey = parentKey ? `${parentKey}.${key}` : key;

        return (
          <div key={fullKey} className={`ml-${Math.min(depth * 4, 20)} mb-3 p-2 border-l-2 border-gray-200`}>
            <div className="flex items-start">
              <span className="font-semibold text-purple-600 mr-2 min-w-32 break-words">{key}:</span>
              <div className="flex-1">
                {!isObject && !isArray ? (
                  <span className="text-gray-800 break-all bg-gray-50 p-1 rounded text-sm">
                    {String(value)}
                  </span>
                ) : isArray ? (
                  <div>
                    <Tag color="blue" className="mb-2">
                      {value.length} item{value.length !== 1 ? 's' : ''}
                    </Tag>
                    {value.map((item, index) => (
                      <div key={index} className="ml-4 border-l-2 border-blue-200 pl-2 mb-2">
                        {typeof item === 'object' && item !== null ? 
                          renderObject(item, depth + 1, fullKey) : 
                          <span className="text-gray-700 text-sm">{String(item)}</span>
                        }
                      </div>
                    ))}
                  </div>
                ) : (
                  renderObject(value, depth + 1, fullKey)
                )}
              </div>
            </div>
          </div>
        );
      });
    };

    return (
      <Card 
        title="Formatted XML View" 
        className="h-full"
        bodyStyle={{ maxHeight: '600px', overflow: 'auto' }}
      >
        {renderObject(parsedData)}
      </Card>
    );
  };

  const renderRawView = () => {
    if (!xmlData) {
      return (
        <Alert
          message="No XML data available"
          description="The XML file could not be loaded or is empty."
          type="warning"
          showIcon
        />
      );
    }

    return (
      <Card 
        title="Raw XML View"
        bodyStyle={{ padding: 0 }}
        className="h-full"
      >
        <pre className="bg-gray-900 text-green-400 p-4 h-full overflow-auto text-sm">
          <code>{xmlData}</code>
        </pre>
      </Card>
    );
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (!batch) {
    return (
      <div className="p-6">
        <Alert
          message="No Batch Data"
          description="Please select a batch from the export history page to view XML details."
          type="warning"
          showIcon
          action={
            <Button type="primary" onClick={() => navigate('/claims/export-history')}>
              Go to Export History
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item onClick={() => navigate('/')} className="cursor-pointer">
          <HomeOutlined /> Home
        </Breadcrumb.Item>
        <Breadcrumb.Item onClick={() => navigate('/claims/export-history')} className="cursor-pointer">
          Export History
        </Breadcrumb.Item>
        <Breadcrumb.Item>XML Viewer</Breadcrumb.Item>
      </Breadcrumb>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={handleBack}
            className="mr-4"
          >
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">XML File Viewer</h1>
            <p className="text-gray-600">{batch.file_name}</p>
          </div>
        </div>
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={downloadXmlFile}
          disabled={!xmlData}
          size="large"
        >
          Download XML
        </Button>
      </div>

      <Card className="mb-6">
        <Descriptions column={{ xxl: 4, xl: 3, lg: 3, md: 2, sm: 1 }} bordered size="small">
          <Descriptions.Item label="Batch Number">
            <span className="font-mono">{batch.batch_number}</span>
          </Descriptions.Item>
          <Descriptions.Item label="Institution">
            {batch.institution}
          </Descriptions.Item>
          <Descriptions.Item label="Generated Date">
            {moment(batch.createdAt).format('MMM DD, YYYY hh:mm A')}
          </Descriptions.Item>
          <Descriptions.Item label="Total Claims">
            <Tag color="blue">{batch.total_claims}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Total Amount">
            <span className="font-semibold">
              ${parseFloat(batch.total_amount || 0).toLocaleString()}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color="green">{batch.export_status}</Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" tip="Loading XML file..." />
        </div>
      )}

      {error && (
        <Alert
          message="Error Loading XML"
          description={error}
          type="error"
          showIcon
          className="mb-6"
          action={
            <Button size="small" onClick={fetchXmlData}>
              Retry
            </Button>
          }
        />
      )}

      {!loading && xmlData && (
        <Card className="min-h-[700px]">
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            type="card"
            items={[
              {
                key: 'formatted',
                label: (
                  <span>
                    <CodeOutlined />
                    Formatted View
                  </span>
                ),
                children: renderFormattedView()
              },
              {
                key: 'raw',
                label: (
                  <span>
                    <FileTextOutlined />
                    Raw XML
                  </span>
                ),
                children: renderRawView()
              }
            ]}
          />
        </Card>
      )}

      {!loading && !error && !xmlData && (
        <Card className="text-center py-12">
          <FileTextOutlined className="text-4xl text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No XML Data Available</h3>
          <p className="text-gray-500 mb-4">The XML file could not be loaded or is empty.</p>
          <Button onClick={fetchXmlData} loading={loading}>
            Retry Loading
          </Button>
        </Card>
      )}
    </div>
  );
};

export default XmlViewerPage;