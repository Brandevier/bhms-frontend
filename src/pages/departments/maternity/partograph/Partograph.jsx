// components/maternity/PartographManager.js
import React, { useEffect, useState } from "react";
import { Button, Spin, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import PartographChart from "./PartographChart";
import PartographModal from "./PartographModal";
import PartographLegend from "./PartographLegend";
import FetalHeartRateChart from "./FetalHeartRateChart";
import ContractionsChart from "./ContractionsChart";

import {
  usePartographActions,
  usePartographRecords,
  usePartographLoading,
  usePartographError,
} from "../../../../redux/hooks/usePartograph";

const PartographManager = ({ visitId }) => {
  const { fetchRecordsByVisit, addRecord, clearPartographError } =
    usePartographActions();
  const records = usePartographRecords();
  const loading = usePartographLoading();
  const error = usePartographError();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (visitId) {
      fetchRecordsByVisit(visitId);
    }
  }, [visitId, fetchRecordsByVisit]);

  useEffect(() => {
    if (error) {
      message.error(error);
      clearPartographError();
    }
  }, [error, clearPartographError]);

  const handleAddRecord = () => setModalVisible(true);
  const handleModalClose = () => setModalVisible(false);

  const handleSaveRecord = async (values) => {
    await addRecord({ ...values, visit_id: visitId });
    fetchRecordsByVisit(visitId);
    message.success("Partograph record saved successfully");
    setModalVisible(false);
  };

  if (loading) {
    return <Spin tip="Loading partograph records..." />;
  }

  return (
    <div className="p-4 bg-gray-50 rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Partograph Records</h3>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddRecord}
        >
          Add Record
        </Button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-6">
          <PartographChart records={records} />
          <FetalHeartRateChart data={records} />
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <ContractionsChart data={records} />
          <PartographLegend />
        </div>
      </div>

      <PartographModal
        visible={modalVisible}
        onClose={handleModalClose}
        onSubmit={handleSaveRecord}
      />
    </div>
  );
};

export default PartographManager;
