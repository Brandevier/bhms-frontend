// src/components/claims/XMLGeneration/hooks/useXMLGeneration.js
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { notification } from 'antd';
import moment from 'moment';
import { generateClaimXML } from '../../../../../redux/slice/claimSlice';

export const useXMLGeneration = ({ visible, onCancel, form }) => {
  const dispatch = useDispatch();
  
  // Redux state
  const { 
    generateXMLLoading, 
    generateXMLError, 
    generatedXMLData 
  } = useSelector((state) => state.claims);
  
  const [selectedFilters, setSelectedFilters] = useState({
    patientCategory: [],
    claimTypes: [],
    statuses: [],
    financialOptions: [],
    patientTypes: []
  });

  const [generationStep, setGenerationStep] = useState('idle');
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [simulatedProgress, setSimulatedProgress] = useState(0);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (visible) {
      setGenerationStep('idle');
      setDownloadUrl(null);
      setSimulatedProgress(0);
      form.resetFields();
      setSelectedFilters({
        patientCategory: [],
        claimTypes: [],
        statuses: [],
        financialOptions: [],
        patientTypes: []
      });
    }
  }, [visible, form]);

  // Handle generation progress simulation
  useEffect(() => {
    let progressInterval;
    
    if (generationStep === 'generating') {
      setSimulatedProgress(0);
      
      progressInterval = setInterval(() => {
        setSimulatedProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }

    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [generationStep]);

  // Handle actual generation completion
  useEffect(() => {
    if (generatedXMLData && generationStep === 'generating') {
      setSimulatedProgress(100);
      
      const timer = setTimeout(() => {
        setGenerationStep('success');
        createDownloadLink(generatedXMLData);
        notification.success({
          message: 'XML Generated Successfully',
          description: 'Your claim XML file is ready for download.',
          placement: 'topRight',
        });
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [generatedXMLData, generationStep]);

  // Handle errors
  useEffect(() => {
    if (generateXMLError && generationStep === 'generating') {
      setGenerationStep('error');
      notification.error({
        message: 'Generation Failed',
        description: generateXMLError,
        placement: 'topRight',
      });
    }
  }, [generateXMLError, generationStep]);

  const toggleFilter = (category, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  const isFilterSelected = (category, value) => {
    return selectedFilters[category].includes(value);
  };

  const createDownloadLink = (xmlData) => {
    try {
      const blob = new Blob([xmlData], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (error) {
      console.error('Error creating download link:', error);
      notification.error({
        message: 'Download Error',
        description: 'Failed to create download file.',
      });
    }
  };

  const handleDownload = () => {
    if (downloadUrl) {
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `claims-export-${moment().format('YYYY-MM-DD-HH-mm')}.xml`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      notification.info({
        message: 'Download Started',
        description: 'Your XML file is being downloaded.',
      });
    }
  };

  const handleGenerate = async (values) => {
    try {
      setGenerationStep('generating');
      
      const payload = {
        ...values,
        ...selectedFilters,
        dateRange: values.dateRange ? [
          values.dateRange[0].format('YYYY-MM-DD'),
          values.dateRange[1].format('YYYY-MM-DD')
        ] : null,
        timestamp: moment().toISOString(),
        institutionId: localStorage.getItem('institution_id'),
        departmentId: localStorage.getItem('department_id')
      };

      dispatch(generateClaimXML(payload));

    } catch (error) {
      setGenerationStep('error');
      console.error('XML Generation Error:', error);
    }
  };

  const handleCancel = () => {
    setGenerationStep('idle');
    setDownloadUrl(null);
    setSimulatedProgress(0);
    onCancel();
  };

  const handleRetry = () => {
    setGenerationStep('idle');
    form.submit();
  };

  return {
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
  };
};