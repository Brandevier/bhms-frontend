import React, { useState } from 'react';
import { Upload, Button, Table, Alert, Spin, Typography, Card } from 'antd';
import { UploadOutlined, FileExcelOutlined, DownloadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';

const { Text } = Typography;

const ExcelUploadComponent = ({ onDataUpload, requiredFields }) => {
  const [uploadedData, setUploadedData] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sample data structure for download
  const sampleData = [
    {
      name: 'Paracetamol 500mg',
      supplier_name: 'Pharma Inc',
      quantity: 100,
      purchase_date: '2023-01-15',
      expiry_date: '2024-01-15',
      category: 'pharmaceuticals',
      unit_cost: 0.50,
      description: 'Pain relief medication'
    },
    {
      name: 'Surgical Gloves',
      supplier_name: 'MediSupply',
      quantity: 200,
      purchase_date: '2023-01-10',
      expiry_date: '2025-01-10',
      category: 'consumables',
      unit_cost: 1.20,
      description: 'Latex-free, medium size'
    }
  ];

  const downloadSample = () => {
    const ws = XLSX.utils.json_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sample");
    XLSX.writeFile(wb, "stock_sample_format.xlsx");
  };

  const beforeUpload = (file) => {
    const reader = new FileReader();
    setLoading(true);
    
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Validate data
      const { validData, errors } = validateExcelData(jsonData, requiredFields);
      
      setUploadedData(validData);
      setValidationErrors(errors);
      onDataUpload(validData);
      setLoading(false);
    };
    
    reader.readAsArrayBuffer(file);
    return false; // Prevent automatic upload
  };

  const validateExcelData = (data, requiredFields) => {
    const errors = [];
    const validData = [];
    
    data.forEach((row, index) => {
      const rowErrors = [];
      let isValid = true;
      
      requiredFields.forEach(field => {
        if (!row[field]) {
          rowErrors.push(`${field} is required`);
          isValid = false;
        } else if (field.includes('date') && isNaN(new Date(row[field]))) {
          rowErrors.push(`${field} must be a valid date (YYYY-MM-DD)`);
          isValid = false;
        } else if (field === 'quantity' && isNaN(Number(row[field]))) {
          rowErrors.push(`${field} must be a number`);
          isValid = false;
        }
      });
      
      if (isValid) {
        validData.push({
          ...row,
          // Format dates consistently
          purchase_date: row.purchase_date ? new Date(row.purchase_date).toISOString().split('T')[0] : null,
          expiry_date: row.expiry_date ? new Date(row.expiry_date).toISOString().split('T')[0] : null
        });
      } else {
        errors.push({
          row: index + 2, // +2 because Excel rows start at 1 and header is row 1
          errors: rowErrors,
          data: row
        });
      }
    });
    
    return { validData, errors };
  };

  const columns = [
    {
      title: 'Row',
      dataIndex: 'row',
      key: 'row',
      width: 80,
    },
    {
      title: 'Errors',
      dataIndex: 'errors',
      key: 'errors',
      render: (errors) => (
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          {errors.map((error, i) => (
            <li key={i}>{error}</li>
          ))}
        </ul>
      ),
    },
    {
      title: 'Data',
      dataIndex: 'data',
      key: 'data',
      render: (data) => (
        <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
          {JSON.stringify(data, null, 2)}
        </div>
      ),
    },
  ];

  const sampleColumns = requiredFields.map(field => ({
    title: field.replace('_', ' ').toUpperCase(),
    dataIndex: field,
    key: field,
  }));

  return (
    <div style={{ marginTop: 16 }}>
      <Card
        title="Excel Upload Guide"
        size="small"
        style={{ marginBottom: 16 }}
        extra={
          <Button 
            type="link" 
            icon={<DownloadOutlined />} 
            onClick={downloadSample}
          >
            Download Sample
          </Button>
        }
      >
        
      </Card>

      <Upload
        accept=".xlsx, .xls"
        beforeUpload={beforeUpload}
        showUploadList={false}
        disabled={loading}
      >
        <Button 
          type="primary" 
          icon={<FileExcelOutlined />} 
          loading={loading}
          style={{ marginBottom: 16 }}
        >
          Upload Your Excel File
        </Button>
      </Upload>

      {uploadedData.length > 0 && (
        <Alert
          message={`${uploadedData.length} valid rows ready for import`}
          type="success"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      {validationErrors.length > 0 && (
        <>
          <Alert
            message={`${validationErrors.length} rows have errors`}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
          <Table
            columns={columns}
            dataSource={validationErrors}
            rowKey="row"
            size="small"
            pagination={false}
            bordered
            scroll={{ x: true }}
          />
        </>
      )}

      {loading && <Spin style={{ marginTop: 16 }} />}
    </div>
  );
};

export default ExcelUploadComponent;