import React, { useRef } from 'react';
import { Button } from 'antd';
import { useReactToPrint } from 'react-to-print';
import { Typography, Table, Divider, Row, Col, Card } from 'antd';
import moment from 'moment';

const { Title, Text, Paragraph } = Typography;

const LabReportPDFContent = React.forwardRef(({ result, patient, institution, testDescription }, ref) => {
  const createdAt = result?.createdAt ? moment(result.createdAt).format("MMMM DD, YYYY") : '';
  const updatedAt = result?.updatedAt ? moment(result.updatedAt).format("MMMM DD, YYYY HH:mm") : '';
  const reportDate = updatedAt || moment().format("MMMM DD, YYYY HH:mm");

  // Process test results data
  const getResultsData = () => {
    if (!result.values) return [];

    if (Array.isArray(result.values)) {
      return result.values.map((item, index) => ({
        key: index,
        parameter: item.parameter || item.test_name || `Test ${index + 1}`,
        value: item.value || item.result || 'N/A',
        unit: item.unit || '-',
        reference_range: item.reference_range || item.normal_range || 'See reference',
        status: item.status || 'normal'
      }));
    } else if (typeof result.values === 'object') {
      return Object.entries(result.values).map(([key, value], index) => {
        const valueObj = typeof value === 'object' ? value : { value, unit: '-' };
        return {
          key: index,
          parameter: key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
          value: valueObj.value || value,
          unit: valueObj.unit || '-',
          reference_range: valueObj.reference_range || valueObj.normal_range || 'See reference',
          status: valueObj.status || 'normal'
        };
      });
    }
    
    return [];
  };

  const resultsData = getResultsData();

  const columns = [
    {
      title: 'Test Parameter',
      dataIndex: 'parameter',
      key: 'parameter',
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: 'Result',
      dataIndex: 'value',
      key: 'value',
      render: (value, record) => (
        <Text style={{ 
          color: record.status === 'abnormal' ? '#ff4d4f' : '#52c41a',
          fontWeight: 'bold'
        }}>
          {value}
        </Text>
      )
    },
    {
      title: 'Unit',
      dataIndex: 'unit',
      key: 'unit'
    },
    {
      title: 'Reference Range',
      dataIndex: 'reference_range',
      key: 'reference_range'
    }
  ];

  return (
    <div ref={ref} style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: 'white' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '2px solid #1890ff', paddingBottom: '20px' }}>
        <Title level={1} style={{ color: '#1890ff', marginBottom: '8px', fontSize: '24px' }}>
          {institution?.name || 'MEDICAL INSTITUTION'}
        </Title>
        <Text strong style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>
          {institution?.address || 'Medical Address'}
        </Text>
        <Text style={{ color: '#666', fontSize: '12px' }}>
          Tel: {institution?.contact || 'N/A'} | Email: {institution?.email || 'N/A'}
        </Text>
        
        <Title level={2} style={{ color: '#52c41a', marginTop: '20px', marginBottom: '10px', fontSize: '20px' }}>
          LABORATORY TEST REPORT
        </Title>
        <Title level={3} style={{ color: '#262626', margin: 0, fontSize: '16px' }}>
          {testDescription}
        </Title>
      </div>

      {/* Patient Information */}
      <Card title="PATIENT INFORMATION" style={{ marginBottom: '20px' }}>
        <Row gutter={[16, 8]}>
          <Col span={8}>
            <Text strong>Patient Name: </Text>
            <Text>{patient?.first_name} {patient?.middle_name} {patient?.last_name}</Text>
          </Col>
          <Col span={8}>
            <Text strong>Patient ID: </Text>
            <Text>{patient?.folder_number || 'N/A'}</Text>
          </Col>
          <Col span={8}>
            <Text strong>Date of Birth: </Text>
            <Text>{patient?.date_of_birth ? moment(patient.date_of_birth).format('MMMM DD, YYYY') : 'N/A'}</Text>
          </Col>
          <Col span={8}>
            <Text strong>Age: </Text>
            <Text>{patient?.date_of_birth ? moment().diff(moment(patient.date_of_birth), 'years') + ' years' : 'N/A'}</Text>
          </Col>
          <Col span={8}>
            <Text strong>Gender: </Text>
            <Text>{patient?.gender || 'N/A'}</Text>
          </Col>
          <Col span={8}>
            <Text strong>NHIS Number: </Text>
            <Text>{patient?.nhis_number || 'N/A'}</Text>
          </Col>
        </Row>
      </Card>

      {/* Report Details */}
      <Card title="REPORT DETAILS" style={{ marginBottom: '20px' }}>
        <Row gutter={[16, 8]}>
          <Col span={12}>
            <Text strong>Test Requested: </Text>
            <Text>{createdAt}</Text>
          </Col>
          <Col span={12}>
            <Text strong>Report Date: </Text>
            <Text>{reportDate}</Text>
          </Col>
          <Col span={12}>
            <Text strong>Test Status: </Text>
            <Text style={{ 
              color: result.status === 'completed' ? '#52c41a' : 
                     result.status === 'pending' ? '#faad14' : '#ff4d4f',
              fontWeight: 'bold'
            }}>
              {result.status?.toUpperCase() || 'PENDING'}
            </Text>
          </Col>
          <Col span={12}>
            <Text strong>Report ID: </Text>
            <Text>{result.id}</Text>
          </Col>
        </Row>
      </Card>

      {/* Test Results */}
      <Card title="TEST RESULTS">
        {resultsData.length > 0 ? (
          <Table 
            dataSource={resultsData}
            columns={columns}
            pagination={false}
            size="middle"
            bordered
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
            <Text italic>No test results available for this report</Text>
          </div>
        )}
      </Card>

      {/* Notes */}
      {result.notes && (
        <Card title="TECHNICIAN NOTES" style={{ marginTop: '20px' }}>
          <Paragraph style={{ margin: 0 }}>
            {result.notes}
          </Paragraph>
        </Card>
      )}

      {/* Footer */}
      <Divider />
      <div style={{ textAlign: 'center', marginTop: '40px', color: '#666', fontSize: '12px' }}>
        <Text strong>CONFIDENTIAL - FOR MEDICAL USE ONLY</Text>
        <br />
        <Text>Generated by Hospital Management System • {moment().format('MMMM DD, YYYY HH:mm')}</Text>
        <br />
        <Text>This is a computer-generated report and does not require a signature</Text>
      </div>
    </div>
  );
});

LabReportPDFContent.displayName = 'LabReportPDFContent';

const LabReportPDF = ({ result, patient, institution, testDescription, children, printing, onPrint }) => {
  const contentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => contentRef.current,
    documentTitle: `Lab_Report_${patient?.first_name}_${patient?.last_name}_${moment().format('YYYYMMDD')}`,
    onBeforeGetContent: () => {
      if (onPrint) onPrint();
    },
    onAfterPrint: () => console.log("PDF printed successfully")
  });

  return (
    <>
      <div onClick={handlePrint} style={{ display: 'inline-block' }}>
        {children}
      </div>
      
      {/* Hidden PDF Content */}
      <div style={{ display: 'none' }}>
        <LabReportPDFContent 
          ref={contentRef}
          result={result}
          patient={patient}
          institution={institution}
          testDescription={testDescription}
        />
      </div>
    </>
  );
};

export default LabReportPDF;