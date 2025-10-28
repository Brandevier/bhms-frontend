// components/maternity/UltrasoundForm.js
import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Upload,
  message,
  Spin,
  Row,
  Col,
  Divider
} from 'antd';
import {
  PlusOutlined,
  UploadOutlined
} from '@ant-design/icons';
import { useUltrasoundActions, useUltrasoundLoading, useUltrasoundError, useUltrasoundSuccess } from '../../../../redux/hooks/useUltrasound';
import { useSelector } from 'react-redux';

const { Option } = Select;
const { TextArea } = Input;

const UltrasoundForm = ({ visitId, ultrasound, visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const { createUltrasoundRecord, updateUltrasoundRecord, clearUltrasoundError } = useUltrasoundActions();
  const loading = useUltrasoundLoading();
  const error = useUltrasoundError();
  const success = useUltrasoundSuccess();
  const [fileList, setFileList] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (ultrasound && visible) {
      // Pre-fill form for editing
      form.setFieldsValue({
        scan_type: ultrasound.scan_type,
        gestational_age: ultrasound.gestational_age,
        indication: ultrasound.indication,
        findings: ultrasound.findings,
        conclusion: ultrasound.conclusion,
      });
      
      // Set existing images if editing
      if (ultrasound.images && ultrasound.images.length > 0) {
        setFileList(ultrasound.images.map((image, index) => ({
          uid: `existing-${index}`,
          name: `image-${index}.jpg`,
          status: 'done',
          url: image
        })));
      }
    } else {
      // Reset form for new record
      form.resetFields();
      setFileList([]);
    }
  }, [ultrasound, form, visible]);

  useEffect(() => {
    if (error) {
      message.error(error);
      clearUltrasoundError();
    }
  }, [error, clearUltrasoundError]);

  useEffect(() => {
    if (success) {
      message.success(ultrasound ? 'Ultrasound updated successfully!' : 'Ultrasound created successfully!');
      onSuccess();
    }
  }, [success, ultrasound, onSuccess]);

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    onCancel();
  };

  const handlePreview = async (file) => {
    if (file.url) {
      setPreviewImage(file.url);
      setPreviewVisible(true);
    }
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
      return Upload.LIST_IGNORE;
    }
    
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Image must be smaller than 5MB!');
      return Upload.LIST_IGNORE;
    }

    return false; // Return false to prevent automatic upload
  };

  const onFinish = async (values) => {
    try {
      const formData = new FormData();
      
      // Append all form values
      Object.keys(values).forEach(key => {
        if (values[key] !== undefined && values[key] !== null) {
          formData.append(key, values[key]);
        }
      });
      
      // Append required fields
      formData.append('visit_id', visitId);
      formData.append('department_id', user.department_id);
      formData.append('performed_by', user.id);
      
      // Append new image files (excluding existing URLs)
      fileList.forEach(file => {
        if (file.originFileObj) {
          formData.append('images', file.originFileObj);
        }
      });

      // Log form data for debugging (remove in production)
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      if (ultrasound) {
        // Update existing record
        await updateUltrasoundRecord({ id: ultrasound.id, formData });
      } else {
        // Create new record
        await createUltrasoundRecord(formData);
      }
    } catch (err) {
      console.error('Form submission error:', err);
      message.error('Failed to submit form. Please try again.');
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <>
      <Modal
        title={ultrasound ? 'Edit Ultrasound Record' : 'Create Ultrasound Record'}
        open={visible}
        onCancel={handleCancel}
        footer={null}
        width={800}
        destroyOnClose
        maskClosable={false}
      >
        <Spin spinning={loading}>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="mt-4"
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="scan_type"
                  label="Scan Type"
                  rules={[{ required: true, message: 'Please select scan type' }]}
                >
                  <Select placeholder="Select scan type">
                    <Option value="Obstetric">Obstetric</Option>
                    <Option value="Transvaginal">Transvaginal</Option>
                    <Option value="Doppler">Doppler</Option>
                    <Option value="3D/4D">3D/4D</Option>
                    <Option value="Growth Scan">Growth Scan</Option>
                    <Option value="Anomaly Scan">Anomaly Scan</Option>
                    <Option value="Other">Other</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="gestational_age"
                  label="Gestational Age (weeks)"
                  rules={[{ required: true, message: 'Please enter gestational age' }]}
                >
                  <InputNumber
                    min={0}
                    max={42}
                    className="w-full"
                    placeholder="Enter weeks"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="indication"
              label="Indication"
              rules={[{ required: true, message: 'Please enter indication' }]}
            >
              <TextArea
                rows={2}
                placeholder="Reason for ultrasound scan"
              />
            </Form.Item>

            <Form.Item
              name="findings"
              label="Findings"
              rules={[{ required: true, message: 'Please enter findings' }]}
            >
              <TextArea
                rows={3}
                placeholder="Detailed findings from the ultrasound"
              />
            </Form.Item>

            <Form.Item
              name="conclusion"
              label="Conclusion"
              rules={[{ required: true, message: 'Please enter conclusion' }]}
            >
              <TextArea
                rows={2}
                placeholder="Conclusion and recommendations"
              />
            </Form.Item>

            <Divider>Ultrasound Images</Divider>

            <Form.Item label="Upload Images">
              <Upload
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                beforeUpload={beforeUpload}
                multiple
                accept="image/*"
              >
                {fileList.length >= 8 ? null : uploadButton}
              </Upload>
              <div className="text-xs text-gray-500 mt-2">
                Upload up to 8 images (Max 5MB each)
              </div>
            </Form.Item>

            <Form.Item className="mb-0">
              <div className="flex justify-end space-x-3">
                <Button onClick={handleCancel} disabled={loading}>
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<UploadOutlined />}
                >
                  {ultrasound ? 'Update Record' : 'Create Record'}
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Spin>
      </Modal>

      {/* Image Preview Modal */}
      <Modal
        open={previewVisible}
        title="Image Preview"
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="Preview" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};

export default UltrasoundForm;