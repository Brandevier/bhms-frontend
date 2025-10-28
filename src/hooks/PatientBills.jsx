import React, { useState, useMemo } from "react";
import { Card, Table, Empty, Tooltip, Modal, Select, Spin, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import BhmsAvatar from "../heroComponents/BhmsAvatar";
import BhmsButton from "../heroComponents/BhmsButton";
import { useSelector } from "react-redux";

const { Option } = Select;
const { Text } = Typography;

const PatientBills = ({ bills, services, onSubmit, onMakePayment }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [isPaid, setIsPaid] = useState(null);
  const { loading } = useSelector((state) => state.service);

  // Prepare table data
  const dataSource = useMemo(() => {
    return (
      bills?.map((bill, index) => ({
        key: bill.id || index.toString(),
        service: bill.service?.name,
        amount: bill.has_paid ? <del>GHC {bill.service?.cost}</del> : `GHC ${bill.service?.cost}`,
        rawAmount: bill.has_paid ? 0 : bill.service?.cost, // Track unpaid amount
      })) || []
    );
  }, [bills]);

  // Calculate total amount (sum of unpaid services)
  const totalAmount = useMemo(() => {
    return dataSource.reduce((sum, bill) => sum + (bill.rawAmount || 0), 0);
  }, [dataSource]);

  // Table Columns
  const columns = [
    { title: "Service", dataIndex: "service", key: "service" },
    { title: "Amount", dataIndex: "amount", key: "amount", align: "right" },
  ];

  const handleSubmit = () => {
    const data = { service_id: selectedService, has_paid: isPaid };
    onSubmit(data);
  };

  return (
    <>
      <Card
        title={
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Bills</span>
            <Tooltip title="Add Services">
              <BhmsAvatar outline icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)} />
            </Tooltip>
          </div>
        }
        bordered={true}
        style={{ marginTop: 20 }}
      >
        {dataSource.length > 0 ? (
          <>
            <Table dataSource={dataSource} columns={columns} pagination={false} />
            
            {/* Footer - Total and Payment Button */}
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center", 
              marginTop: 16, 
              paddingTop: 16, 
              borderTop: "1px solid #f0f0f0" 
            }}>
              <Text strong>Total: GHC {totalAmount}</Text>
              <BhmsButton 
                type="primary" 
                size="medium" 
                block={false}
                onClick={onMakePayment} 
                disabled={totalAmount === 0}
                outline
              >
                Make Payment
              </BhmsButton>
            </div>
          </>
        ) : (
          <Empty description="No Bills Available" />
        )}
      </Card>
      <Modal
        title="Add Services to Bill"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <BhmsButton key="cancel" block={false} outline size="medium" onClick={() => setIsModalOpen(false)}>Cancel</BhmsButton>,
          <BhmsButton key="submit" type="primary" size="medium" block={false} onClick={handleSubmit}>
            {loading ? <Spin /> : 'Submit'}
          </BhmsButton>
        ]}
      >
        <Select
          showSearch
          style={{ width: "100%", marginBottom: 10 }}
          placeholder="Select a service"
          optionFilterProp="children"
          onChange={setSelectedService}
        >
          {services.map((service) => (
            <Option key={service.id} value={service.id}>
              {service.name} - GHC {service.cost}
            </Option>
          ))}
        </Select>

        <Select
          style={{ width: "100%" }}
          placeholder="Has the patient paid?"
          onChange={setIsPaid}
        >
          <Option value={true}>Yes</Option>
          <Option value={false}>No</Option>
        </Select>
      </Modal>
    </>
  );
};

export default PatientBills;
