import React, { useState } from 'react';
import { Modal, Form, Tabs, message, Upload, Button, Input } from 'antd';
import { InboxOutlined, PaperClipOutlined, EyeOutlined } from '@ant-design/icons';
import TestDetailsPanel from './TestDetailsPanel';
import { renderFormField } from '../utils/fieldRenderer';

const { TabPane } = Tabs;
const { Dragger } = Upload;
const { TextArea } = Input; // Import TextArea from Input

const EnterResultsModal = ({ visible, currentTest, onCancel, onSubmit }) => {
    const [form] = Form.useForm();
    const [activeTab, setActiveTab] = useState('results');
    const [fileList, setFileList] = useState([]);
    const [uploading, setUploading] = useState(false);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            
            // Extract field values and notes
            const fieldValues = {};
            Object.keys(values).forEach(key => {
                if (key !== 'notes' && key !== 'attachments') {
                    fieldValues[key] = values[key];
                }
            });

            const formData = {
                fieldValues,
                notes: values.notes || '',
                attachments: fileList.map(file => ({
                    name: file.name,
                    url: file.url || URL.createObjectURL(file.originFileObj),
                    type: file.type
                }))
            };

            await onSubmit(formData);
            form.resetFields();
            setFileList([]);
        } catch (error) {
            message.error('Please fill in all required fields');
        }
    };

    const uploadProps = {
        onRemove: (file) => {
            setFileList(prev => prev.filter(f => f.uid !== file.uid));
        },
        beforeUpload: (file) => {
            // Validate file type and size
            const isImage = file.type.startsWith('image/');
            const isPdf = file.type === 'application/pdf';
            const isLt10M = file.size / 1024 / 1024 < 10;

            if (!isImage && !isPdf) {
                message.error('You can only upload image or PDF files!');
                return false;
            }

            if (!isLt10M) {
                message.error('File must be smaller than 10MB!');
                return false;
            }

            setFileList(prev => [...prev, file]);
            return false; // Prevent auto upload
        },
        fileList,
        multiple: true,
        accept: 'image/*,.pdf',
    };

    if (!currentTest) return null;

    return (
        <Modal
            title={
                <div className="flex items-center space-x-2">
                    <PaperClipOutlined className="text-blue-500" />
                    <span onClick={()=>console.log(currentTest)}>Enter Laboratory Results</span>
                </div>
            }
            visible={visible}
            onCancel={onCancel}
            onOk={handleSubmit}
            width={1000}
            style={{ top: 20 }}
            okText="Submit Results"
            cancelText="Cancel"
            okButtonProps={{ 
                className: 'bg-blue-500 hover:bg-blue-600 border-blue-500',
                size: 'large'
            }}
            cancelButtonProps={{ size: 'large' }}
        >
            <div className="flex space-x-6">
                {/* Left Side - Test Details */}
                <div className="w-1/3">
                    <TestDetailsPanel currentTest={currentTest} />
                </div>

                {/* Right Side - Results Form */}
                <div className="flex-1">
                    <Tabs 
                        activeKey={activeTab} 
                        onChange={setActiveTab}
                        className="lab-results-tabs"
                    >
                        <TabPane tab="Test Results" key="results">
                            <Form
                                form={form}
                                layout="vertical"
                                className="space-y-4"
                            >
                                {currentTest.template?.fields
                                    ?.slice()
                                    ?.sort((a, b) => a.order - b.order)
                                    ?.map((field) => (
                                        <Form.Item
                                            key={field.id}
                                            name={field.label}
                                            label={
                                                <span className="font-medium text-gray-700">
                                                    {field.label}
                                                    {field.required && <span className="text-red-500 ml-1">*</span>}
                                                </span>
                                            }
                                            rules={[
                                                {
                                                    required: field.required,
                                                    message: `${field.label} is required`
                                                }
                                            ]}
                                        >
                                            {renderFormField(field)}
                                        </Form.Item>
                                    ))}

                                <Form.Item 
                                    label="Technician Notes" 
                                    name="notes"
                                >
                                    <TextArea // Changed from Form.TextArea to TextArea
                                        rows={3} 
                                        placeholder="Enter any additional notes or observations..."
                                        maxLength={500}
                                        showCount
                                    />
                                </Form.Item>
                            </Form>
                        </TabPane>

                        <TabPane tab="Attachments" key="attachments">
                            <div className="space-y-4">
                                <Dragger {...uploadProps}>
                                    <p className="ant-upload-drag-icon">
                                        <InboxOutlined className="text-blue-400" />
                                    </p>
                                    <p className="ant-upload-text">
                                        Click or drag files to upload lab images/scans
                                    </p>
                                    <p className="ant-upload-hint">
                                        Support for images (JPG, PNG, etc.) and PDF files. Max file size: 10MB
                                    </p>
                                </Dragger>

                                {fileList.length > 0 && (
                                    <div className="mt-4">
                                        <h4 className="font-medium mb-2">Selected Files:</h4>
                                        <div className="space-y-2">
                                            {fileList.map(file => (
                                                <div 
                                                    key={file.uid}
                                                    className="flex items-center justify-between p-2 border rounded"
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <PaperClipOutlined className="text-gray-400" />
                                                        <span className="text-sm">{file.name}</span>
                                                    </div>
                                                    <Button 
                                                        type="link" 
                                                        icon={<EyeOutlined />}
                                                        onClick={() => window.open(URL.createObjectURL(file.originFileObj))}
                                                        size="small"
                                                    >
                                                        Preview
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        </Modal>
    );
};

export default EnterResultsModal;