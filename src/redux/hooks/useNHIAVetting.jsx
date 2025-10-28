import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  uploadNHIAXML,
  fetchValidationRules,
  fetchNHIAMappings,
  createNHIAMapping,
  resetUpload,
  resetCreateMapping,
  clearErrors,
  selectUploadStatus,
  selectUploadError,
  selectUploadResult,
  selectValidationRules,
  selectRulesStatus,
  selectRulesError,
  selectMappings,
  selectMappingsPagination,
  selectMappingsStatus,
  selectMappingsError,
  selectCreateMappingStatus,
  selectCreateMappingError,
  selectCreatedMapping,
} from '../slice/nhiaVettingSlice';

export const useNHIAVetting = () => {
  const dispatch = useDispatch();

  // Selectors
  const uploadStatus = useSelector(selectUploadStatus);
  const uploadError = useSelector(selectUploadError);
  const uploadResult = useSelector(selectUploadResult);

  const validationRules = useSelector(selectValidationRules);
  const rulesStatus = useSelector(selectRulesStatus);
  const rulesError = useSelector(selectRulesError);

  const mappings = useSelector(selectMappings);
  const mappingsPagination = useSelector(selectMappingsPagination);
  const mappingsStatus = useSelector(selectMappingsStatus);
  const mappingsError = useSelector(selectMappingsError);

  const createMappingStatus = useSelector(selectCreateMappingStatus);
  const createMappingError = useSelector(selectCreateMappingError);
  const createdMapping = useSelector(selectCreatedMapping);

  // Action creators
  const uploadXMLFile = useCallback((file) => {
    const formData = new FormData();
    formData.append('xmlFile', file);
    return dispatch(uploadNHIAXML(formData));
  }, [dispatch]);

  const getValidationRules = useCallback(() => {
    return dispatch(fetchValidationRules());
  }, [dispatch]);

  const getMappings = useCallback((params = {}) => {
    return dispatch(fetchNHIAMappings(params));
  }, [dispatch]);

  const addMapping = useCallback((mappingData) => {
    return dispatch(createNHIAMapping(mappingData));
  }, [dispatch]);

  const resetUploadState = useCallback(() => {
    dispatch(resetUpload());
  }, [dispatch]);

  const resetCreateMappingState = useCallback(() => {
    dispatch(resetCreateMapping());
  }, [dispatch]);

  const clearAllErrors = useCallback(() => {
    dispatch(clearErrors());
  }, [dispatch]);

  // Helper functions
  const isUploadLoading = uploadStatus === 'loading';
  const isUploadSuccess = uploadStatus === 'succeeded';
  const isUploadFailed = uploadStatus === 'failed';

  const isRulesLoading = rulesStatus === 'loading';
  const isRulesSuccess = rulesStatus === 'succeeded';
  const isRulesFailed = rulesStatus === 'failed';

  const isMappingsLoading = mappingsStatus === 'loading';
  const isMappingsSuccess = mappingsStatus === 'succeeded';
  const isMappingsFailed = mappingsStatus === 'failed';

  const isCreateMappingLoading = createMappingStatus === 'loading';
  const isCreateMappingSuccess = createMappingStatus === 'succeeded';
  const isCreateMappingFailed = createMappingStatus === 'failed';

  return {
    // State
    uploadStatus,
    uploadError,
    uploadResult,
    validationRules,
    rulesStatus,
    rulesError,
    mappings,
    mappingsPagination,
    mappingsStatus,
    mappingsError,
    createMappingStatus,
    createMappingError,
    createdMapping,

    // Actions
    uploadXMLFile,
    getValidationRules,
    getMappings,
    addMapping,
    resetUploadState,
    resetCreateMappingState,
    clearAllErrors,

    // Status helpers
    isUploadLoading,
    isUploadSuccess,
    isUploadFailed,
    isRulesLoading,
    isRulesSuccess,
    isRulesFailed,
    isMappingsLoading,
    isMappingsSuccess,
    isMappingsFailed,
    isCreateMappingLoading,
    isCreateMappingSuccess,
    isCreateMappingFailed,

    // Data helpers
    hasValidationResults: uploadResult?.data?.validationSummary != null,
    validationSummary: uploadResult?.data?.validationSummary,
    claims: uploadResult?.data?.claims || [],
    overallStatus: uploadResult?.data?.overallStatus,
  };
};

export default useNHIAVetting;