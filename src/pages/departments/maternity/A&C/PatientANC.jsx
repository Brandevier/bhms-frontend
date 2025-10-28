// components/maternity/PatientANC.js
import React, { useEffect, useState } from 'react';
import { Spin, Row, Col, Alert, Button } from 'antd';
import { useANCActions, useANC, useANCLoading, useANCError } from '../../../../redux/hooks/useANC';
import ANCHeader from './common/ANCHeader';
import ANCStatistics from './common/ANCStats';
import ANCBasicInfo from './common/ANCBasicInfo';
import ANCVisitDetails from './common/ANCVisitDetails';
import ANCAdditionalInfo from './common/ANCAdditionalInfo';
import ANCEmptyState from './common/ANCEmptyState';
import ANCRegistrationModal from './common/ANCRegistrationModal';

const PatientANC = ({ visitId }) => {
  const { fetchANCByVisitId, clearANCError } = useANCActions();
  const ancData = useANC(); // This is now an array
  const loading = useANCLoading();
  const error = useANCError();
  const [hasFetched, setHasFetched] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Get the first ANC record from the array (or null if empty)
  const ancRecord = ancData && ancData.length > 0 ? ancData[0] : null;

  useEffect(() => {
    if (visitId) {
      fetchANCByVisitId(visitId).finally(() => {
        setHasFetched(true);
      });
    }
  }, [visitId, fetchANCByVisitId]);

  useEffect(() => {
    if (error) {
      console.error('ANC Fetch Error:', error);
    }
  }, [error]);

  const handleRetry = () => {
    clearANCError();
    if (visitId) {
      fetchANCByVisitId(visitId);
    }
  };

  const handleRefresh = () => {
    if (visitId) {
      fetchANCByVisitId(visitId);
    }
  };

  const handleModalOpen = () => {
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleSuccess = () => {
    setModalVisible(false);
    handleRefresh(); // Refresh data after successful registration
  };

  if (loading && !hasFetched) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Spin size="large" tip="Loading ANC record..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert
          message="Error Loading ANC Record"
          description={error || 'Failed to load ANC record. Please try again.'}
          type="error"
          showIcon
          action={
            <Button size="small" type="primary" onClick={handleRetry}>
              Retry
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <ANCHeader loading={loading} onRefresh={handleRefresh} />
      
      {/* Always show the registration button */}
      <Button 
        type="primary" 
        onClick={handleModalOpen}
        className="mb-4"
      >
        Register New ANC Visit
      </Button>

      {!ancRecord ? (
        <ANCEmptyState visitId={visitId} />
      ) : (
        <Spin spinning={loading} tip="Refreshing...">
          <ANCStatistics ancRecord={ancRecord} />
          
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <ANCBasicInfo ancRecord={ancRecord} />
            </Col>
            <Col span={12}>
              <ANCVisitDetails ancRecord={ancRecord} />
            </Col>
          </Row>

          <ANCAdditionalInfo ancRecord={ancRecord} />
        </Spin>
      )}

      <ANCRegistrationModal
        visitId={visitId}
        visible={modalVisible}
        onCancel={handleModalClose}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default PatientANC;
