// components/staff/StaffDocuments.js
import React, { useState } from 'react';
import { Card, List, Button, Modal, Typography, Tag, Upload, message } from 'antd';
import { FileTextOutlined, DownloadOutlined, EyeOutlined, UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title, Text } = Typography;

const StaffDocuments = ({ staffId, staffName }) => {
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);

  // Dummy data - replace with actual API data
  const documents = [
    {
      id: 1,
      name: 'Medical License.pdf',
      type: 'License',
      uploadDate: '2024-01-10',
      expiryDate: '2025-01-10',
      status: 'active',
      size: '2.4 MB'
    },
    {
      id: 2,
      name: 'Employment Contract.docx',
      type: 'Contract',
      uploadDate: '2023-12-15',
      expiryDate: null,
      status: 'active',
      size: '1.2 MB'
    },
    {
      id: 3,
      name: 'CPR Certification.pdf',
      type: 'Certification',
      uploadDate: '2023-11-20',
      expiryDate: '2024-11-20',
      status: 'expiring',
      size: '3.1 MB'
    },
    {
      id: 4,
      name: 'Performance Review 2023.pdf',
      type: 'Review',
      uploadDate: '2023-12-30',
      expiryDate: null,
      status: 'active',
      size: '0.8 MB'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'green';
      case 'expiring': return 'orange';
      case 'expired': return 'red';
      default: return 'default';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'License': return 'blue';
      case 'Contract': return 'purple';
      case 'Certification': return 'cyan';
      case 'Review': return 'green';
      default: return 'default';
    }
  };

  const handlePreview = (doc) => {
    setSelectedDoc(doc);
    setPreviewVisible(true);
  };

  const handleDownload = (doc) => {
    message.success(`Downloading ${doc.name}...`);
    // Actual download logic would go here
  };

  const handleDelete = (doc) => {
    message.success(`Deleted ${doc.name}`);
    // Actual delete logic would go here
  };

  const uploadProps = {
    beforeUpload: (file) => {
      const isPDF = file.type === 'application/pdf';
      const isDoc = file.type === 'application/msword' || 
                   file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      
      if (!isPDF && !isDoc) {
        message.error('You can only upload PDF or Word documents!');
      }
      return (isPDF || isDoc) || Upload.LIST_IGNORE;
    },
    onChange: (info) => {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <Card 
      title={
        <span className="flex items-center">
          <FileTextOutlined className="mr-2 text-gray-500" />
          Documents & Certifications
        </span>
      }
      className="mt-6"
      extra={
        <Upload {...uploadProps} showUploadList={false}>
          <Button type="primary" icon={<UploadOutlined />} size="small">
            Upload Document
          </Button>
        </Upload>
      }
    >
      <List
        dataSource={documents}
        renderItem={(doc) => (
          <List.Item
            actions={[
              <Button 
                type="link" 
                icon={<EyeOutlined />} 
                onClick={() => handlePreview(doc)}
                size="small"
              >
                View
              </Button>,
              <Button 
                type="link" 
                icon={<DownloadOutlined />} 
                onClick={() => handleDownload(doc)}
                size="small"
              >
                Download
              </Button>,
              <Button 
                type="link" 
                danger 
                icon={<DeleteOutlined />} 
                onClick={() => handleDelete(doc)}
                size="small"
              >
                Delete
              </Button>
            ]}
          >
            <List.Item.Meta
              avatar={<FileTextOutlined className="text-2xl text-blue-500" />}
              title={
                <div className="flex items-center">
                  <Text strong>{doc.name}</Text>
                  <Tag color={getStatusColor(doc.status)} className="ml-2">
                    {doc.status.toUpperCase()}
                  </Tag>
                </div>
              }
              description={
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Tag color={getTypeColor(doc.type)}>{doc.type}</Tag>
                    <Text type="secondary">{doc.size}</Text>
                  </div>
                  <div>
                    <Text type="secondary" className="text-sm">
                      Uploaded: {moment(doc.uploadDate).format('MMM D, YYYY')}
                    </Text>
                    {doc.expiryDate && (
                      <Text type="secondary" className="text-sm ml-3">
                        Expires: {moment(doc.expiryDate).format('MMM D, YYYY')}
                      </Text>
                    )}
                  </div>
                </div>
              }
            />
          </List.Item>
        )}
      />

      <Modal
        title="Document Preview"
        visible={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={[
          <Button key="download" icon={<DownloadOutlined />}>
            Download
          </Button>,
          <Button key="close" onClick={() => setPreviewVisible(false)}>
            Close
          </Button>
        ]}
        width={700}
      >
        {selectedDoc && (
          <div className="text-center">
            <FileTextOutlined className="text-6xl text-blue-500 my-6" />
            <Title level={4}>{selectedDoc.name}</Title>
            <div className="grid grid-cols-2 gap-4 my-4">
              <div>
                <Text strong>Type:</Text>
                <p>
                  <Tag color={getTypeColor(selectedDoc.type)}>
                    {selectedDoc.type}
                  </Tag>
                </p>
              </div>
              <div>
                <Text strong>Size:</Text>
                <p>{selectedDoc.size}</p>
              </div>
              <div>
                <Text strong>Uploaded:</Text>
                <p>{moment(selectedDoc.uploadDate).format('MMM D, YYYY')}</p>
              </div>
              {selectedDoc.expiryDate && (
                <div>
                  <Text strong>Expires:</Text>
                  <p>{moment(selectedDoc.expiryDate).format('MMM D, YYYY')}</p>
                </div>
              )}
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <Text strong>Status: </Text>
              <Tag color={getStatusColor(selectedDoc.status)}>
                {selectedDoc.status.toUpperCase()}
              </Tag>
            </div>
          </div>
        )}
      </Modal>
    </Card>
  );
};

export default StaffDocuments;