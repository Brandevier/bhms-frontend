import React, { useEffect, useState } from "react";
import { Table, Button, message, Typography, Tag } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchPatientInvoices, makePatientPayment } from "../../../redux/slice/serviceSlice";
import { useParams } from "react-router-dom";

const { Title, Text } = Typography;

const PatientBillHistory = () => {
  const dispatch = useDispatch();
  const { id } = useParams(); // Patient ID
  const { invoices, loading } = useSelector((state) => state.service); // Get invoices from Redux

  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    dispatch(fetchPatientInvoices({ patient_id: id }));
  }, [dispatch, id]);

  useEffect(() => {
    if (invoices?.length) {
      const unpaidTotal = invoices
        .filter((invoice) => !invoice.has_paid) // Only unpaid bills
        .reduce((sum, invoice) => sum + invoice.service.cost, 0);
      setTotalAmount(unpaidTotal);
    }
  }, [invoices]);

  const handlePayment = () => {
    dispatch(makePatientPayment({ patient_id: id }))
      .unwrap()
      .then(() => {
        message.success("Payment successful");
        dispatch(fetchPatientInvoices({ patient_id: id })); // Refresh invoices after payment
      })
      .catch(() => message.error("Payment failed"));
  };

  const columns = [
    {
      title: "Service",
      dataIndex: ["service", "name"],
      key: "service",
    },
    // {
    //   title: "Description",
    //   dataIndex: ["service", "description"],
    //   key: "description",
    // },
    {
      title: "Amount (GHS)",
      dataIndex: ["service", "cost"],
      key: "cost",
      render: (cost) => `GHS ${cost.toFixed(2)}`,
    },
    {
      title: "Status",
      dataIndex: "has_paid",
      key: "status",
      render: (has_paid) =>
        has_paid ? <Tag color="green">Paid</Tag> : <Tag color="red">Pending</Tag>,
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Title level={3}>Patient Billing History</Title>

      <Table
        columns={columns}
        dataSource={invoices}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 5 }}
      />

      <div style={{ marginTop: "20px", textAlign: "right" }}>
        <Text strong>Total Amount Due: GHS {totalAmount.toFixed(2)}</Text>
        <br />
        <Button
          type="primary"
          onClick={handlePayment}
          disabled={totalAmount === 0}
          style={{ marginTop: "10px" }}
        >
          Pay Now
        </Button>
      </div>
    </div>
  );
};

export default PatientBillHistory;
