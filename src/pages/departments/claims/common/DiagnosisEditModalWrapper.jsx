import React from 'react';
import DiagnosisEditModal from '../../../../modal/claims_common/DiagnosisEditModal';

const DiagnosisEditModalWrapper = ({ visible, onCancel, onSave, currentDiagnosis }) => (
    <DiagnosisEditModal
        visible={visible}
        onCancel={onCancel}
        onSave={onSave}
        currentDiagnosis={currentDiagnosis}
    />
);



export default DiagnosisEditModalWrapper;