import React, { useState, useCallback } from "react";
import { Modal, Upload, Button, Table, Alert, Spin, Typography } from "antd";
import { UploadOutlined, CloseOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import BhmsButton from "../heroComponents/BhmsButton";

const { Text } = Typography;

const BulkPatientRegistrationModal = ({ visible, onClose, onSubmit, status }) => {
  const [fileData, setFileData] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);

  const requiredFields = [
    'first_name',
    'last_name',
    'gender',
    'date_of_birth',
    'phone_number',
    'address'
  ];

  const optionalFields = [
    'middle_name',
    'nin_number',
    'nhis_number',
    'ghana_card_number',
    'city',
    'country',
    'religion',
    'email',
    'is_antenatal_patient',
    'next_of_kin_name',
    'next_of_kin_phone',
    'next_of_kin_relationship',
    'emergency_contact_name',
    'emergency_contact_phone',
    'emergency_contact_relationship'
  ];

  const beforeUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet);
      
      // Validate data
      const errors = [];
      const validatedData = jsonData.map((row, index) => {
        const rowErrors = {};
        
        // Check required fields
        requiredFields.forEach(field => {
          if (!row[field]) {
            rowErrors[field] = 'Required';
          }
        });
        
        // Validate phone numbers
        if (row.phone_number && !/^\+?\d{10,15}$/.test(row.phone_number)) {
          rowErrors.phone_number = 'Invalid phone format';
        }
        
        if (row.next_of_kin_phone && !/^\+?\d{10,15}$/.test(row.next_of_kin_phone)) {
          rowErrors.next_of_kin_phone = 'Invalid phone format';
        }
        
        if (row.emergency_contact_phone && !/^\+?\d{10,15}$/.test(row.emergency_contact_phone)) {
          rowErrors.emergency_contact_phone = 'Invalid phone format';
        }
        
        // Validate email if present
        if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
          rowErrors.email = 'Invalid email';
        }
        
        // Validate date format if present
        if (row.date_of_birth && isNaN(new Date(row.date_of_birth))) {
          rowErrors.date_of_birth = 'Invalid date format';
        }
        
        if (Object.keys(rowErrors).length > 0) {
          errors.push({
            row: index + 2, // +2 because Excel rows start at 1 and header is row 1
            errors: rowErrors
          });
        }
        
        return {
          ...row,
          _errors: rowErrors
        };
      });
      
      setFileData(validatedData);
      setValidationErrors(errors);
    };
    reader.readAsArrayBuffer(file);
    return false; // Prevent automatic upload
  };

  const handleSubmit = async () => {
    if (validationErrors.length > 0) {
      return;
    }
    
    setIsProcessing(true);
    try {
      await onSubmit(fileData);
      setFileData([]);
      setValidationErrors([]);
    } catch (error) {
      console.error("Error submitting bulk data:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const columns = [
    {
      title: 'First Name',
      dataIndex: 'first_name',
      key: 'first_name',
      render: (text, record) => (
        <Text type={record._errors?.first_name ? 'danger' : undefined}>
          {text}
        </Text>
      )
    },
    {
      title: 'Last Name',
      dataIndex: 'last_name',
      key: 'last_name',
      render: (text, record) => (
        <Text type={record._errors?.last_name ? 'danger' : undefined}>
          {text}
        </Text>
      )
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      render: (text, record) => (
        <Text type={record._errors?.gender ? 'danger' : undefined}>
          {text}
        </Text>
      )
    },
    {
      title: 'Phone',
      dataIndex: 'phone_number',
      key: 'phone_number',
      render: (text, record) => (
        <Text type={record._errors?.phone_number ? 'danger' : undefined}>
          {text}
        </Text>
      )
    },
    {
      title: 'Errors',
      key: 'errors',
      render: (_, record) => (
        Object.keys(record._errors || {}).map(errorKey => (
          <div key={errorKey}>
            <Text type="danger">{errorKey}: {record._errors[errorKey]}</Text>
          </div>
        ))
      )
    }
  ];

  const sampleData = [
    {
      key: 'sample',
      first_name: 'John',
      last_name: 'Doe',
      gender: 'Male',
      date_of_birth: '1990-01-01',
      phone_number: '+233123456789',
      address: '123 Main St, Accra',
      // ... other sample fields
    }
  ];

  const sampleColumns = [
    { title: 'First Name', dataIndex: 'first_name', key: 'first_name' },
    { title: 'Last Name', dataIndex: 'last_name', key: 'last_name' },
    { title: 'Gender', dataIndex: 'gender', key: 'gender' },
    { title: 'Date of Birth', dataIndex: 'date_of_birth', key: 'date_of_birth' },
    { title: 'Phone', dataIndex: 'phone_number', key: 'phone_number' },
    { title: 'Address', dataIndex: 'address', key: 'address' },
  ];

  return (
    <Modal
      title="Bulk Patient Registration"
      width={900}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button 
          key="preview" 
          onClick={() => setPreviewVisible(true)}
          disabled={fileData.length === 0}
        >
          Preview Data
        </Button>,
        <BhmsButton 
          key="submit" 
          onClick={handleSubmit}
          disabled={validationErrors.length > 0 || fileData.length === 0}
        >
          {isProcessing ? <Spin /> : 'Register Patients'}
        </BhmsButton>,
      ]}
    >
      <div style={{ marginBottom: 16 }}>
        <Upload
          accept=".xlsx,.xls,.csv"
          beforeUpload={beforeUpload}
          showUploadList={false}
        >
          <Button icon={<UploadOutlined />}>Select Excel File</Button>
        </Upload>
        
        <Button 
          type="link" 
          onClick={() => setPreviewVisible(true)}
          style={{ marginLeft: 8 }}
        >
          View Sample Format
        </Button>
      </div>
      
      {validationErrors.length > 0 && (
        <Alert
          message={`Found ${validationErrors.length} rows with errors`}
          type="error"
          showIcon
          closable
          style={{ marginBottom: 16 }}
        />
      )}
      
      {fileData.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text strong>Found {fileData.length} patients</Text>
            {validationErrors.length === 0 && (
              <Text type="success">All data is valid</Text>
            )}
            <Button 
              type="text" 
              icon={<CloseOutlined />} 
              onClick={() => {
                setFileData([]);
                setValidationErrors([]);
              }}
            >
              Clear
            </Button>
          </div>
          
          <Table
            columns={columns}
            dataSource={fileData.slice(0, 5)}
            pagination={false}
            scroll={{ x: true }}
            size="small"
          />
          
          {fileData.length > 5 && (
            <Text type="secondary" style={{ marginTop: 8 }}>
              Showing first 5 of {fileData.length} records
            </Text>
          )}
        </div>
      )}
      
      <Modal
        title={previewVisible ? "Sample Data Format" : "Preview Uploaded Data"}
        width={1000}
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
      >
        {previewVisible ? (
          <>
            <Text strong>Required Fields:</Text>
            <ul>
              {requiredFields.map(field => (
                <li key={field}>{field}</li>
              ))}
            </ul>
            
            <Text strong>Optional Fields:</Text>
            <ul>
              {optionalFields.map(field => (
                <li key={field}>{field}</li>
              ))}
            </ul>
            
            <Text strong>Sample Data:</Text>
            <Table
              columns={sampleColumns}
              dataSource={sampleData}
              pagination={false}
              size="small"
            />
            
            <div style={{ marginTop: 16 }}>
              <Text type="secondary">
                Download a template file to ensure proper formatting.
              </Text>
              <Button 
                type="link" 
                onClick={() => {
                  const ws = XLSX.utils.json_to_sheet(sampleData);
                  const wb = XLSX.utils.book_new();
                  XLSX.utils.book_append_sheet(wb, ws, "Patients");
                  XLSX.writeFile(wb, "patient_upload_template.xlsx");
                }}
              >
                Download Template
              </Button>
            </div>
          </>
        ) : (
          <Table
            columns={columns}
            dataSource={fileData}
            pagination={{ pageSize: 10 }}
            scroll={{ x: true }}
          />
        )}
      </Modal>
    </Modal>
  );
};

export default BulkPatientRegistrationModal;