// src/components/claims/XMLGeneration/XMLGenerationModal.jsx
import React from 'react';
import { Modal, Form } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import { useXMLGeneration } from './components/useXMLGeneration';
import FilterSection from './components/FilterSection';
import ProgressSection from './components/ProgressSection';
import SuccessSection from './components/SuccessSection';
import ErrorSection from './components/ErrorSection';

const XMLGenerationModal = ({ visible, onCancel }) => {
  const [form] = Form.useForm();
  
  const {
    generationStep,
    generateXMLLoading,
    generateXMLError,
    generatedXMLData,
    selectedFilters,
    simulatedProgress,
    handleGenerate,
    handleCancel,
    handleRetry,
    handleDownload,
    toggleFilter,
    isFilterSelected
  } = useXMLGeneration({ visible, onCancel, form });

  const renderContent = () => {
    switch (generationStep) {
      case 'generating':
        return <ProgressSection progress={simulatedProgress} />;
      case 'success':
        return (
          <SuccessSection 
            onDownload={handleDownload}
            onClose={handleCancel}
            generatedData={generatedXMLData}
          />
        );
      case 'error':
        return (
          <ErrorSection 
            error={generateXMLError}
            onRetry={handleRetry}
            onCancel={handleCancel}
            loading={generateXMLLoading}
          />
        );
      default:
        return (
          <FilterSection
            form={form}
            selectedFilters={selectedFilters}
            onGenerate={handleGenerate}
            onCancel={handleCancel}
            loading={generateXMLLoading}
            toggleFilter={toggleFilter}
            isFilterSelected={isFilterSelected}
          />
        );
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center">
          <FileTextOutlined className="mr-2 text-blue-500" />
          <span>Generate XML Report</span>
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      width={900}
      footer={null}
      centered
      closable={!generateXMLLoading}
      maskClosable={!generateXMLLoading}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleGenerate}
        className="mt-4"
      >
        {renderContent()}
      </Form>
    </Modal>
  );
};

export default XMLGenerationModal;