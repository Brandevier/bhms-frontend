import React from 'react';
import PrescriptionEditModal from '../../../../modal/claims_common/PrescriptionEditModal';

const PrescriptionEditModalWrapper = ({ visible, onCancel, onSave, currentPrescription }) => (
    <PrescriptionEditModal
        visible={visible}
        onCancel={onCancel}
        onSave={onSave}
        currentPrescription={currentPrescription}
    />
);

export default PrescriptionEditModalWrapper;