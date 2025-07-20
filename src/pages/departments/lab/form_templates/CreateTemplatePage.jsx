import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  Card,
  Row,
  Col,
  Divider,
  Space,
  Typography,
  InputNumber,
  Switch,
  message,
  Checkbox
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  SaveOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';

import { createTemplate } from '../../../../redux/slice/labSlice';
import { useDispatch, useSelector } from 'react-redux';
const { Title, Text } = Typography;
const { Option } = Select;

const fieldTypes = [
  { value: 'text', label: 'Text Field' },
  { value: 'number', label: 'Number Field' },
  { value: 'select', label: 'Dropdown' },
  { value: 'checkbox', label: 'Checkbox Group' },
  { value: 'radio', label: 'Radio Buttons' },
  { value: 'date', label: 'Date Picker' },
  { value: 'textarea', label: 'Long Text' }
];


const CreateTemplatePage = () => {
  const [form] = Form.useForm();
  const [fields, setFields] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.lab);

  // Function to save templates

  const handleSaveTemplate = async () => {
    try {
      setIsSubmitting(true);
      const values = await form.validateFields();

      // Prepare template data
      const templateData = {
        name: values.name,
        description: values.description,
        fields: fields.map(field => ({
          label: field.label,
          fieldType: field.type,
          options: field.options,
          required: field.required,
          order: field.order
        }))
      };



      // Reset form and fields
      form.resetFields();
      setFields([]);
    } catch (error) {
      message.error('Please complete all required fields');
    } finally {
      setIsSubmitting(false);
    }
  }






  const addField = () => {
    setFields([...fields, {
      id: Date.now(),
      type: 'text',
      label: '',
      required: false,
      options: [],
      order: fields.length
    }]);



  };

  const removeField = (id) => {
    setFields(fields.filter(field => field.id !== id));
  };

  const handleFieldChange = (id, key, value) => {
    setFields(fields.map(field =>
      field.id === id ? { ...field, [key]: value } : field
    ));
  };

  const addOption = (fieldId) => {
    setFields(fields.map(field =>
      field.id === fieldId
        ? { ...field, options: [...field.options, { value: '', label: '' }] }
        : field
    ));
  };

  const handleOptionChange = (fieldId, index, key, value) => {
    setFields(fields.map(field => {
      if (field.id === fieldId) {
        const newOptions = [...field.options];
        newOptions[index][key] = value;
        return { ...field, options: newOptions };
      }
      return field;
    }));
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Prepare template data
      const templateData = {
        name: values.name,
        description: values.description,
        unitCost: values.unitCost,
        nhis_covered: values.nhis_covered,
        fields: fields.map(field => ({
          label: field.label,
          fieldType: field.type,
          options: field.options,
          required: field.required,
          order: field.order
        }))

      };

      // 
      // API call would go here
      // Dispatch action to create template
      await dispatch(createTemplate(templateData)).unwrap();
      message.success('Template created successfully!');
      console.log('Template created successfully!', templateData);

      // Reset form
      form.resetFields();
      setFields([]);
    } catch (error) {
      message.error('Please complete all required fields');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="template-creator">
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        style={{ marginBottom: 16 }}
        onClick={() => window.history.back()}
      >
        Back to Templates
      </Button>

      <Card title={<Title level={4}>Create New Test Template</Title>}>
        <Form
          form={form}
          layout="vertical"
          initialValues={{ name: '', description: '' }}
        >
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                name="name"
                label="Template Name"
                rules={[{ required: true, message: 'Please enter template name' }]}
              >
                <Input placeholder="e.g. Malaria Test, CBC Panel" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="unitCost"
                label="Unit Cost"
                rules={[
                  { required: true, message: 'Please enter unit cost' },
                  { pattern: /^\d+(\.\d{1,2})?$/, message: 'Please enter a valid amount' }
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  step={0.01}
                  formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  placeholder="0.00"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="nhis_covered"
                label="NHIS Covered"
                valuePropName="checked"
                initialValue={false}
              >
                <Checkbox>Covered by NHIS</Checkbox>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item
                name="description"
                label="Description (Optional)"
              >
                <Input.TextArea rows={1} placeholder="Brief description of this test..." />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">
            <Space>
              <Text strong>Test Fields</Text>
              <Text type="secondary">{fields.length} fields added</Text>
            </Space>
          </Divider>

          <div className="field-list" style={{ marginBottom: 24 }}>
            {fields.map((field, index) => (
              <Card
                key={field.id}
                title={`Field ${index + 1}`}
                style={{ marginBottom: 16 }}
                extra={
                  <Button
                    danger
                    type="text"
                    icon={<DeleteOutlined />}
                    onClick={() => removeField(field.id)}
                  />
                }
              >
                <Row gutter={16} align="middle">
                  <Col span={8}>
                    <Input
                      placeholder="Field Label"
                      value={field.label}
                      onChange={(e) => handleFieldChange(field.id, 'label', e.target.value)}
                    />
                  </Col>
                  <Col span={6}>
                    <Select
                      style={{ width: '100%' }}
                      value={field.type}
                      onChange={(value) => handleFieldChange(field.id, 'type', value)}
                    >
                      {fieldTypes.map(type => (
                        <Option key={type.value} value={type.value}>
                          {type.label}
                        </Option>
                      ))}
                    </Select>
                  </Col>
                  <Col span={4}>
                    <Switch
                      checkedChildren="Required"
                      unCheckedChildren="Optional"
                      checked={field.required}
                      onChange={(checked) => handleFieldChange(field.id, 'required', checked)}
                    />
                  </Col>
                </Row>

                {(field.type === 'select' || field.type === 'checkbox' || field.type === 'radio') && (
                  <div style={{ marginTop: 16 }}>
                    <Text strong>Options:</Text>
                    {field.options?.map((option, i) => (
                      <Row gutter={16} key={i} style={{ marginTop: 8 }}>
                        <Col span={10}>
                          <Input
                            placeholder="Display text"
                            value={option.label}
                            onChange={(e) => handleOptionChange(field.id, i, 'label', e.target.value)}
                          />
                        </Col>
                        <Col span={10}>
                          <Input
                            placeholder="Stored value"
                            value={option.value}
                            onChange={(e) => handleOptionChange(field.id, i, 'value', e.target.value)}
                          />
                        </Col>
                        <Col span={4}>
                          <Button
                            danger
                            type="text"
                            icon={<DeleteOutlined />}
                            onClick={() => {
                              const newOptions = [...field.options];
                              newOptions.splice(i, 1);
                              handleFieldChange(field.id, 'options', newOptions);
                            }}
                          />
                        </Col>
                      </Row>
                    ))}
                    <Button
                      type="dashed"
                      onClick={() => addOption(field.id)}
                      icon={<PlusOutlined />}
                      style={{ marginTop: 8 }}
                    >
                      Add Option
                    </Button>
                  </div>
                )}
              </Card>
            ))}

            <Button
              type="dashed"
              onClick={addField}
              icon={<PlusOutlined />}
              block
            >
              Add Field
            </Button>
          </div>

          <Divider />

          <Form.Item>
            <Space>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSubmit}
                loading={loading}
                disabled={fields.length === 0}
              >
                Save Template
              </Button>
              <Button onClick={() => {
                form.resetFields();
                setFields([]);
              }}>
                Reset
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <style jsx>{`
        .template-creator {
          margin: 0 auto;
          padding: 24px;
        }
        .field-list {
          max-height: 60vh;
          overflow-y: auto;
          padding-right: 8px;
        }
      `}</style>
    </div>
  );
};

export default CreateTemplatePage;