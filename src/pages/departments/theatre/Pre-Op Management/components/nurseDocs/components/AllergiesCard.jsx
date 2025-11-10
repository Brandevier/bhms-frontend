import React, { useState, useEffect } from 'react';
import { Card, Form, Select, Input, Button, Tag, Space, List, Divider, Alert,Row,Col } from 'antd';
import { SafetyOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { createAllergy, fetchAllergies, deleteAllergy } from '../../../../../../../redux/slice/theatre/educationMaterialsSlice';
import { useDispatch, useSelector } from 'react-redux';

const { TextArea } = Input;
const { Option } = Select;

const AllergiesCard = ({ patient }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { loading, allergies } = useSelector((state) => state.educationMaterial);
  const [selectedAllergies, setSelectedAllergies] = useState([]);
  const [customAllergy, setCustomAllergy] = useState('');

  // Fetch allergies when component mounts or patient changes
  useEffect(() => {
    if (patient?.patient?.id) {
      dispatch(fetchAllergies(patient.patient.id));
    }
  }, [patient, dispatch]);

  
  // Common allergy options
  const commonAllergies = [
    'Penicillin',
    'Sulfa Drugs',
    'Latex',
    'Iodine Contrast',
    'Aspirin',
    'NSAIDs',
    'Eggs',
    'Shellfish',
    'Peanuts',
    'Dairy',
    'Codeine',
    'Morphine',
    'Local Anesthetics',
    'Antibiotics',
    'Insect Stings'
  ];

  const onFinish = (values) => {
    if (!patient?.patient?.id) {
      Alert.error('No patient selected');
      return;
    }

    const allergyData = {
      patient_id: patient.patient.id,
      allergies: selectedAllergies,
      reaction: values.allergyReaction,
      severity: values.allergySeverity,
      notes: values.additionalNotes || ''
    };

    dispatch(createAllergy(allergyData))
      .unwrap()
      .then(() => {
        form.resetFields();
        setSelectedAllergies([]);
        setCustomAllergy('');
        Alert.success('Allergies saved successfully');
      })
      .catch((error) => {
        Alert.error('Failed to save allergies: ' + (error.message || 'Unknown error'));
      });
  };

  // Handle adding allergy from dropdown
  const handleAllergyChange = (values) => {
    setSelectedAllergies(values);
  };

  // Handle custom allergy input
  const handleCustomAllergy = () => {
    if (customAllergy.trim() && !selectedAllergies.includes(customAllergy.trim())) {
      setSelectedAllergies(prev => [...prev, customAllergy.trim()]);
      setCustomAllergy('');
    }
  };

  // Handle removing an allergy
  const handleRemoveAllergy = (allergyToRemove) => {
    setSelectedAllergies(prev => prev.filter(allergy => allergy !== allergyToRemove));
  };

  // Handle deleting saved allergy
  const handleDeleteSavedAllergy = (allergyId) => {
    dispatch(deleteAllergy(allergyId))
      .unwrap()
      .then(() => {
        Alert.success('Allergy removed successfully');
      })
      .catch((error) => {
        Alert.error('Failed to remove allergy: ' + (error.message || 'Unknown error'));
      });
  };

  return (
    <Card 
      title={
        <span>
          <SafetyOutlined className="mr-2" />
          Allergies & Sensitivities
        </span>
      } 
      className="mb-4 shadow-sm border"
      loading={loading}
    >
      {/* Display Saved Allergies */}
      {allergies && allergies.length > 0 && (
        <>
          <Divider orientation="left">Saved Allergies</Divider>
          <div className="mb-4">
            <List
              size="small"
              dataSource={allergies}
              renderItem={(allergy) => (
                <List.Item
                  actions={[
                    <Button 
                      type="link" 
                      danger 
                      size="small" 
                      icon={<CloseOutlined />}
                      onClick={() => handleDeleteSavedAllergy(allergy.id)}
                    >
                      Remove
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <Space>
                        <Tag color="red">{allergy.allergy_name}</Tag>
                        {allergy.severity && (
                          <Tag color={
                            allergy.severity === 'severe' ? 'red' : 
                            allergy.severity === 'moderate' ? 'orange' : 'blue'
                          }>
                            {allergy.severity}
                          </Tag>
                        )}
                      </Space>
                    }
                    description={
                      allergy.reaction && (
                        <span className="text-gray-600">Reaction: {allergy.reaction}</span>
                      )
                    }
                  />
                </List.Item>
              )}
              className="mb-4"
            />
          </div>
          <Divider />
        </>
      )}

      {/* Add New Allergies Form */}
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item 
          name="allergies" 
          label="Known Allergies"
          help="Select from common allergies or type custom ones"
        >
          <div className="space-y-2">
            {/* Selected Allergies Display */}
            {selectedAllergies.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2 p-2 border rounded">
                {selectedAllergies.map((allergy, index) => (
                  <Tag
                    key={index}
                    closable
                    onClose={() => handleRemoveAllergy(allergy)}
                    color="blue"
                    className="flex items-center"
                  >
                    {allergy}
                  </Tag>
                ))}
              </div>
            )}

            {/* Allergy Selection */}
            <Select
              mode="multiple"
              placeholder="Select allergies or type to add custom"
              value={selectedAllergies}
              onChange={handleAllergyChange}
              style={{ width: '100%' }}
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <Divider style={{ margin: '8px 0' }} />
                  <Space style={{ padding: '0 8px 4px' }}>
                    <Input
                      placeholder="Enter custom allergy"
                      value={customAllergy}
                      onChange={(e) => setCustomAllergy(e.target.value)}
                      onPressEnter={handleCustomAllergy}
                    />
                    <Button 
                      type="text" 
                      icon={<PlusOutlined />} 
                      onClick={handleCustomAllergy}
                    >
                      Add
                    </Button>
                  </Space>
                </>
              )}
            >
              {commonAllergies.map((allergy) => (
                <Option key={allergy} value={allergy}>
                  {allergy}
                </Option>
              ))}
            </Select>
          </div>
        </Form.Item>
        
        <Form.Item name="allergyReaction" label="Reaction Description">
          <TextArea 
            rows={2} 
            placeholder="Describe reaction type and severity (e.g., rash, anaphylaxis, breathing difficulty)..." 
          />
        </Form.Item>
        
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="allergySeverity" label="Severity">
              <Select placeholder="Select severity level">
                <Option value="mild">Mild</Option>
                <Option value="moderate">Moderate</Option>
                <Option value="severe">Severe</Option>
                <Option value="anaphylaxis">Anaphylaxis (Life-threatening)</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="additionalNotes" label="Additional Notes">
              <Input placeholder="Any additional information..." />
            </Form.Item>
          </Col>
        </Row>
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {selectedAllergies.length} allergies selected
          </div>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            disabled={selectedAllergies.length === 0}
          >
            Save Allergy Information
          </Button>
        </div>
      </Form>

      {/* Instructions */}
      <Alert
        message="Allergy Management"
        description="Add all known allergies. Type and press Enter to add custom allergies not in the list. Click the 'x' on tags to remove allergies before saving."
        type="info"
        showIcon
        className="mt-4"
      />
    </Card>
  );
};

export default AllergiesCard;