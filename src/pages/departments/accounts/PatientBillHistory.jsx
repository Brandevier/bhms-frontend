import React, { useEffect, useState } from "react";
import { Table, Button, message, Typography, Tag, Card, Statistic, Divider, Space, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchPatientInvoices, makePatientPayment } from "../../../redux/slice/serviceSlice";
import { useParams } from "react-router-dom";
import { DollarOutlined, FileDoneOutlined, LoadingOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const PatientBillHistory = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { invoices, loading } = useSelector((state) => state.service);
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchPatientInvoices({ patient_id: id }));
  }, [dispatch, id]);

  useEffect(() => {
    if (invoices?.length) {
      const unpaidTotal = invoices
        .filter((invoice) => !invoice.has_paid)
        .reduce((sum, invoice) => sum + invoice.service.cost, 0);
      setTotalAmount(unpaidTotal);
    }
  }, [invoices]);

  const handlePayment = () => {
    setIsModalVisible(true);
  };

  const confirmPayment = () => {
    dispatch(makePatientPayment({ patient_id: id, invoice_ids: selectedInvoices }))
      .unwrap()
      .then(() => {
        message.success("Payment processed successfully");
        dispatch(fetchPatientInvoices({ patient_id: id }));
        setIsModalVisible(false);
        setSelectedInvoices([]);
      })
      .catch(() => message.error("Payment processing failed"));
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedInvoices(selectedRows.filter(row => !row.has_paid).map(row => row.id));
    },
    getCheckboxProps: (record) => ({
      disabled: record.has_paid,
    }),
  };

  const columns = [
    {
      title: "Service",
      dataIndex: ["service", "name"],
      key: "service",
      render: (text, record) => (
        <Space>
          <FileDoneOutlined style={{ color: "#1890ff" }} />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: "Amount (GHS)",
      dataIndex: ["service", "cost"],
      key: "cost",
      render: (cost) => (
        <Text strong style={{ color: "#52c41a" }}>
          GHS {cost.toFixed(2)}
        </Text>
      ),
      align: "right",
    },
    {
      title: "Status",
      dataIndex: "has_paid",
      key: "status",
      render: (has_paid) =>
        has_paid ? (
          <Tag color="green" icon={<FileDoneOutlined />}>
            Paid
          </Tag>
        ) : (
          <Tag color="orange" icon={<LoadingOutlined />}>
            Pending
          </Tag>
        ),
      align: "center",
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Title level={3} style={{ color: "#1a3e72", marginBottom: "24px" }}>
        Patient Billing Statement
      </Title>

      <Card
        title="Invoice Summary"
        bordered={false}
        headStyle={{ backgroundColor: "#f0f5ff", borderBottom: 0 }}
        style={{ marginBottom: "24px", borderRadius: "8px" }}
      >
        <Space size="large">
          <Statistic
            title="Total Invoices"
            value={invoices?.length || 0}
            prefix={<FileDoneOutlined />}
          />
          <Statistic
            title="Pending Payment"
            value={totalAmount}
            precision={2}
            valueStyle={{ color: "#cf1322" }}
            prefix={<DollarOutlined />}
            suffix="GHS"
          />
          <Statistic
            title="Paid Invoices"
            value={invoices?.filter(i => i.has_paid).length || 0}
            valueStyle={{ color: "#52c41a" }}
          />
        </Space>
      </Card>

      <Card
        title="Invoice Details"
        bordered={false}
        style={{ borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.09)" }}
      >
        <Table
          columns={columns}
          dataSource={invoices}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 5 }}
          rowSelection={{
            type: "checkbox",
            ...rowSelection,
          }}
          scroll={{ x: true }}
        />
      </Card>

      <Divider />

      <div style={{ textAlign: "right", marginTop: "24px" }}>
        <Space size="large" align="center">
          <Text strong style={{ fontSize: "16px" }}>
            Total Selected: GHS {selectedInvoices.length > 0 ? 
              invoices
                .filter(i => selectedInvoices.includes(i.id))
                .reduce((sum, inv) => sum + inv.service.cost, 0)
                .toFixed(2) : "0.00"}
          </Text>
          <Button
            type="primary"
            size="large"
            onClick={handlePayment}
            disabled={selectedInvoices.length === 0}
            icon={<DollarOutlined />}
            style={{ width: "200px", height: "40px" }}
          >
            Process Payment
          </Button>
        </Space>
      </div>

      <Modal
        title="Confirm Payment"
        visible={isModalVisible}
        onOk={confirmPayment}
        onCancel={() => setIsModalVisible(false)}
        okText="Confirm Payment"
        cancelText="Cancel"
        width={600}
      >
        <div style={{ padding: "20px" }}>
          <Text strong>You are about to process payment for:</Text>
          <ul style={{ marginTop: "16px" }}>
            {invoices
              .filter(i => selectedInvoices.includes(i.id))
              .map(invoice => (
                <li key={invoice.id}>
                  {invoice.service.name} - GHS {invoice.service.cost.toFixed(2)}
                </li>
              ))}
          </ul>
          <Divider />
          <Text strong style={{ fontSize: "16px" }}>
            Total Amount: GHS{" "}
            {invoices
              .filter(i => selectedInvoices.includes(i.id))
              .reduce((sum, inv) => sum + inv.service.cost, 0)
              .toFixed(2)}
          </Text>
        </div>
      </Modal>
    </div>
  );
};

export default PatientBillHistory;