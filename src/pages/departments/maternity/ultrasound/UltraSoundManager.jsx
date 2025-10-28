// components/maternity/UltraSoundManager.js
import React, { useEffect, useState } from 'react';
import { useUltrasoundActions, useUltrasounds, useUltrasoundLoading, useUltrasoundError } from '../../../../redux/hooks/useUltrasound';
import UltrasoundForm from './UltrasoundForm';
import UltrasoundHeader from './UltrasoundHeader';
import UltrasoundGrid from './UltrasoundGrid';
import UltrasoundEmptyState from './UltrasoundEmptyState';

const UltraSoundManager = ({ visitId }) => {
  const { fetchAllUltrasounds, clearUltrasoundError } = useUltrasoundActions();
  const ultrasounds = useUltrasounds();
  const loading = useUltrasoundLoading();
  const error = useUltrasoundError();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUltrasound, setSelectedUltrasound] = useState(null);
  const [filteredUltrasounds, setFilteredUltrasounds] = useState([]);

  useEffect(() => {
    if (visitId) {
      fetchAllUltrasounds();
    }
  }, [visitId, fetchAllUltrasounds]);

  useEffect(() => {
    // Filter ultrasounds by visitId
    if (ultrasounds && ultrasounds.length > 0) {
      const filtered = ultrasounds.filter(us => us.visit_id === visitId);
      setFilteredUltrasounds(filtered);
    } else {
      setFilteredUltrasounds([]);
    }
  }, [ultrasounds, visitId]);

  useEffect(() => {
    if (error) {
      console.error('Ultrasound Error:', error);
      clearUltrasoundError();
    }
  }, [error, clearUltrasoundError]);

  const handleOpenModal = (ultrasound = null) => {
    setSelectedUltrasound(ultrasound);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedUltrasound(null);
  };

  const handleSuccess = () => {
    fetchAllUltrasounds();
    setModalVisible(false);
    setSelectedUltrasound(null);
  };

  const handleRefresh = () => {
    fetchAllUltrasounds();
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <UltrasoundHeader
        loading={loading}
        onRefresh={handleRefresh}
        onAddNew={() => handleOpenModal()}
      />

      {filteredUltrasounds.length === 0 ? (
        <UltrasoundEmptyState onCreate={() => handleOpenModal()} />
      ) : (
        <UltrasoundGrid
          ultrasounds={filteredUltrasounds}
          loading={loading}
          error={error}
          onView={(ultrasound) => handleOpenModal(ultrasound)}
          onEdit={(ultrasound) => handleOpenModal(ultrasound)}
        />
      )}

      <UltrasoundForm
        visitId={visitId}
        ultrasound={selectedUltrasound}
        visible={modalVisible}
        onCancel={handleCloseModal}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default UltraSoundManager;