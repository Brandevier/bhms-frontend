import React, { useEffect, useState } from 'react';
import { Modal, Spin, Form, Input, InputNumber, Select, Button, Typography, Divider } from 'antd';
import { fetchTemplates } from '../../../../redux/slice/labSlice';
import { useSelector, useDispatch } from 'react-redux';
import { LoadingOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const CreateClaimLabTestModal = ({ visible, onSubmit, onCancel, visit_id, claim_id, patient_id }) => {
  const dispatch = useDispatch();
  const { templates, loading } = useSelector((state) => state.lab);
  const [form] = Form.useForm();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useSelector((state)=>state.auth)
  const antIcon = <LoadingOutlined style={{ fontSize: 20, color: "white" }} spin />;


  

  useEffect(() => {
    if (visible) {
      dispatch(fetchTemplates());
      form.resetFields();
      setSelectedTemplate(null);
    }
  }, [visible, dispatch, form]);

  const filteredTemplates = templates?.filter(template =>
    template.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.lab_tarrif?.test_description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.lab_tarrif?.g_drg_code?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTemplateSelect = (templateId) => {
    const template = templates.find(t => t.id === templateId);
    setSelectedTemplate(template);

    // Set default values for the form
    form.setFieldsValue({
      lab_template_id: templateId,
      description: template.description,
      quantity: template.quantity || 1,
      unit_price: template.lab_tarrif?.tariff_ghc || 0,
    });
  };

  const handleSubmit = (values) => {
    const submissionData = {
      templateId: selectedTemplate?.id,   // ✅ backend requires this
      visit_id,                           // ✅ comes from props
      claim_id,                           // ✅ comes from props
      patient_id,                         // ✅ comes from props
      user: user?.id,              // ✅ add logged in user
      note: values.results_comment || null,
      description: values.description,
      quantity: values.quantity,
      unit_price: values.unit_price,
      lab_tarrif_id: selectedTemplate?.lab_tarrif_id,
      // pass dynamic fields too
      fields: Object.keys(values)
        .filter(k => k.startsWith("field_"))
        .map(k => ({ fieldId: k.replace("field_", ""), value: values[k] })),
    };

    onSubmit(submissionData);
  };


  const renderField = (field, index) => {
    const fieldRules = field.required ? [{ required: true, message: `${field.label} is required` }] : [];

    switch (field.fieldType) {
      case 'text':
        return (
          <Form.Item
            key={field.id}
            name={`field_${field.id}`}
            label={field.label || `Field ${index + 1}`}
            rules={fieldRules}
          >
            <Input placeholder={`Enter ${field.label || 'value'}`} />
          </Form.Item>
        );

      case 'number':
        return (
          <Form.Item
            key={field.id}
            name={`field_${field.id}`}
            label={field.label || `Field ${index + 1}`}
            rules={fieldRules}
          >
            <InputNumber
              placeholder={`Enter ${field.label || 'value'}`}
              style={{ width: '100%' }}
            />
          </Form.Item>
        );

      case 'textarea':
        return (
          <Form.Item
            key={field.id}
            name={`field_${field.id}`}
            label={field.label || `Field ${index + 1}`}
            rules={fieldRules}
          >
            <TextArea placeholder={`Enter ${field.label || 'value'}`} rows={3} />
          </Form.Item>
        );

      case 'select':
        return (
          <Form.Item
            key={field.id}
            name={`field_${field.id}`}
            label={field.label || `Field ${index + 1}`}
            rules={fieldRules}
          >
            <Select placeholder={`Select ${field.label || 'option'}`}>
              {field.options?.map((option, optIndex) => (
                <Option key={optIndex} value={option}>
                  {option}
                </Option>
              ))}
            </Select>
          </Form.Item>
        );

      default:
        return (
          <Form.Item
            key={field.id}
            name={`field_${field.id}`}
            label={field.label || `Field ${index + 1}`}
            rules={fieldRules}
          >
            <Input placeholder={`Enter ${field.label || 'value'}`} />
          </Form.Item>
        );
    }
  };

  return (
    <Modal
      title="Add Lab Test"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
      centered
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="mt-4"
      >
        {/* Template Selection */}
        <Form.Item
          name="lab_template_id"
          label="Select Lab Test"
          rules={[{ required: true, message: 'Please select a lab test' }]}
        >
          <Select
            showSearch
            placeholder="Search for lab test..."
            onSearch={setSearchQuery}
            onChange={handleTemplateSelect}
            filterOption={false}
            loading={loading}
          >
            {filteredTemplates?.map((template) => (
              <Option key={template.id} value={template.id}>
                <div>
                  <div><strong>{template.lab_tarrif?.g_drg_code}</strong> - {template.description}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    Price: GHC {template.lab_tarrif?.tariff_ghc} | Category: {template.lab_tarrif?.test_description}
                  </div>
                </div>
              </Option>
            ))}
          </Select>
        </Form.Item>

        {selectedTemplate && (
          <>
            <Divider />

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Form.Item
                name="description"
                label="Test Description"
              >
                <Input readOnly />
              </Form.Item>

              <Form.Item
                name="quantity"
                label="Quantity"
                rules={[{ required: true, message: 'Quantity is required' }]}
              >
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                name="unit_price"
                label="Unit Price (GHC)"
              >
                <InputNumber
                  min={0}
                  step={0.01}
                  style={{ width: '100%' }}
                  readOnly
                />
              </Form.Item>

              <Form.Item
                name="gdrg_code"
                label="G-DRG Code"
              >
                <Input
                  value={selectedTemplate.lab_tarrif?.g_drg_code}
                  readOnly
                />
              </Form.Item>
            </div>

            {/* Dynamic Fields Section */}
            {selectedTemplate.fields && selectedTemplate.fields.length > 0 && (
              <>
                <Title level={5} className="mb-4">Test Parameters</Title>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  {selectedTemplate.fields.map((field, index) => renderField(field, index))}
                </div>
              </>
            )}

            {/* Results/Comments Section */}
            <Form.Item
              name="results_comment"
              label="Results/Comment"
            >
              <TextArea rows={3} placeholder="Enter any additional results or comments" />
            </Form.Item>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3">
              <Button onClick={onCancel}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
               {loading ? <Spin indicator={antIcon} /> : 'Add Lab Test'}
              </Button>
            </div>
          </>
        )}

        {!selectedTemplate && !loading && (
          <div className="text-center py-8 text-gray-500">
            <Text>Please select a lab test to continue</Text>
          </div>
        )}

        {loading && (
          <div className="text-center py-8">
            <Spin size="large" />
          </div>
        )}
      </Form>
    </Modal>
  );
};

export default CreateClaimLabTestModal;