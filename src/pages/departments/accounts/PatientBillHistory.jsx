import React, { useEffect, useState, useRef } from "react";
import { Table, Button, message, Typography, Tag, Card, Statistic, Divider, Space, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchPatientInvoices, makePatientPayment } from "../../../redux/slice/serviceSlice";
import { useParams } from "react-router-dom";
import { DollarOutlined, FileDoneOutlined, LoadingOutlined, PrinterOutlined } from "@ant-design/icons";

import { useReactToPrint } from "react-to-print";

const { Title, Text } = Typography;

const PatientBillHistory = () => {
  const dispatch = useDispatch();
  const printRef = useRef();
  const { id } = useParams();
  const { invoices, loading } = useSelector((state) => state.service);
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { institution } = useSelector((state) => state.auth);

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


  // Print Invoice Component
  const InvoicePrint = React.forwardRef(({ selectedInvoices, invoices, institution }, ref) => {
    const selectedItems = invoices.filter(i => selectedInvoices.includes(i.id));
    const total = selectedItems.reduce((sum, inv) => sum + inv.service.cost, 0);
    const currentDate = new Date().toLocaleDateString();

    return (
      <div ref={ref} style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h1 style={{ color: "#1a3e72", marginBottom: "5px" }}>{institution?.name || "Medical Institution"}</h1>
          <p style={{ color: "#666", marginBottom: "5px" }}>{institution?.address || "123 Medical Street"}</p>
          <p style={{ color: "#666" }}>Tel: {institution?.phone || "+123 456 7890"}</p>
        </div>

        <Divider style={{ borderColor: "#1a3e72" }} />

        <div style={{ marginBottom: "30px" }}>
          <h2 style={{ color: "#1a3e72" }}>PATIENT INVOICE</h2>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
            <div>
              <p><strong>Invoice Date:</strong> {currentDate}</p>
              <p><strong>Patient ID:</strong> {id}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p><strong>Invoice #:</strong> INV-{new Date().getTime()}</p>
            </div>
          </div>
        </div>

        <Table
          dataSource={selectedItems}
          pagination={false}
          rowKey="id"
          columns={[
            {
              title: "Service",
              dataIndex: ["service", "name"],
              key: "service",
              render: (text) => <strong>{text}</strong>
            },
            {
              title: "Description",
              dataIndex: ["service", "description"],
              key: "description",
              render: (text) => text || "N/A"
            },
            {
              title: "Amount (GHS)",
              dataIndex: ["service", "cost"],
              key: "cost",
              render: (cost) => <Text strong>GHS {cost.toFixed(2)}</Text>,
              align: "right"
            }
          ]}
          bordered
          style={{ marginBottom: "30px" }}
        />

        <div style={{ textAlign: "right", marginBottom: "40px" }}>
          <div style={{ display: "inline-block", textAlign: "left", width: "300px" }}>
            <div style={{ borderTop: "2px solid #1a3e72", paddingTop: "10px" }}>
              <p><strong>Subtotal:</strong> GHS {total.toFixed(2)}</p>
              <p><strong>Tax (0%):</strong> GHS 0.00</p>
              <h3 style={{ color: "#1a3e72" }}>TOTAL: GHS {total.toFixed(2)}</h3>
            </div>
          </div>
        </div>

        <Divider style={{ borderColor: "#1a3e72" }} />

        <div style={{ textAlign: "center", color: "#666", marginTop: "30px" }}>
          <p>Thank you for choosing {institution?.name || "our institution"}</p>
          <p>For inquiries, please contact: {institution?.phone || "+123 456 7890"}</p>
        </div>
      </div>
    );
  });

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    pageStyle: `
      @page { size: A4; margin: 10mm; }
      @media print {
        body { background: white; }
        .print-area { padding: 20px; font-family: Arial, sans-serif; }
      }
    `
  });


  return (
    <div style={{ padding: "24px" }}>
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
            type="default"
            size="large"
            onClick={handlePrint}  // Changed to use the hook
            disabled={selectedInvoices.length === 0}
            icon={<PrinterOutlined />}
            style={{ marginRight: "16px" }}
          >
            Print Invoice
          </Button>

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

      {/* Hidden print component */}
      <div style={{ display: "none" }}>
        <InvoicePrint
          ref={printRef}
          selectedInvoices={selectedInvoices}
          invoices={invoices}
          institution={institution}
        />
      </div>
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
            prefix="GHS"
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