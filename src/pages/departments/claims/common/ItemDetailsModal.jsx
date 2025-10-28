// components/ItemDetailsModal.jsx
import React from 'react';
import { Modal, Typography } from 'antd';
import GeneralInfo from './itemDetails/GeneralInfo';
import MedicationDetails from './itemDetails/MedicationDetails';
import DiagnosisDetails from './itemDetails/DiagnosisDetails';
import ProcedureDetails from './itemDetails/ProcedureDetails';
import LabTestDetails from './itemDetails/LabTestDetails';
import NHIAInformation from './itemDetails/NHIAInformation';

const { Title } = Typography;

const ItemDetailsModal = ({ visible, onCancel, item }) => {
  if (!item) return null;

  const getItemIcon = () => {
    switch (item.item_type) {
      case 'Medication':
        return <MedicineBoxOutlined className="text-blue-500" />;
      case 'LabTest':
        return <ExperimentOutlined className="text-green-500" />;
      case 'Diagnosis':
        return <DashboardOutlined className="text-red-500" />;
      case 'Procedure':
        return <FileTextOutlined className="text-purple-500" />;
      default:
        return <FileTextOutlined />;
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          {getItemIcon()}
          <span>{item.item_type} Details</span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={700}
      centered
      className="item-details-modal"
    >
      <div className="max-h-96 overflow-y-auto">
        <GeneralInfo item={item} />
        <MedicationDetails item={item} />
        <DiagnosisDetails item={item} />
        <ProcedureDetails item={item} />
        <LabTestDetails item={item} />
        <NHIAInformation item={item} />
      </div>
    </Modal>
  );
};

export default ItemDetailsModal;