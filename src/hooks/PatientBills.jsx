import React, { useState } from "react";
import { Card, Table, Empty, Tooltip, Modal, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import BhmsAvatar from "../heroComponents/BhmsAvatar";

const PatientBills = ({ bills }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Ensure bills have proper keys
  const dataSource = bills?.map((bill, index) => ({
    key: bill.key || index.toString(),
    service: bill.service,
    amount: bill.amount
  })) || [];

  // Table Columns
  const columns = [
    { title: "Service", dataIndex: "service", key: "service" },
    { title: "Amount", dataIndex: "amount", key: "amount" }
  ];

  return (
    <>
      <Card
        title={
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Bills</span>
            <Tooltip title="Add Nurse's Note">
              <BhmsAvatar
                outline
                icon={<PlusOutlined />}
                
              />
            </Tooltip>
          </div>
        }
        bordered={true}
        style={{ marginTop: 20 }}
      >
        {dataSource.length > 0 ? (
          <Table dataSource={dataSource} columns={columns} pagination={false} />
        ) : (
          <Empty description="No Bills Available" />
        )}
      </Card>

      {/* Modal for adding nurse's note */}
      <Modal
        title="Add Nurse's Note"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalOpen(false)}>Cancel</Button>,
          <Button key="submit" type="primary">Submit</Button>
        ]}
      >
        <p>Note input goes here...</p>
      </Modal>
    </>
  );
};

export default PatientBills;
