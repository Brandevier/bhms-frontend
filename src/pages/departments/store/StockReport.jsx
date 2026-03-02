import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getStockItems,
  fetchItems,
  fetchStockAdjustments,
  fetchIssuedItems,
  clearStoreError,
} from "../../../redux/slice/inventorySlice";
import {
  Table,
  Button,
  Card,
  Row,
  Col,
  Typography,
  Space,
  DatePicker,
  Tag,
  message,
  Statistic,
} from "antd";
import {
  ReloadOutlined,
  FileTextOutlined,
  DownloadOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { useMediaQuery } from "react-responsive";
import moment from "moment";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const StockReport = () => {
  const dispatch = useDispatch();
  const { stockItems, itemsList, stockAdjustments, items, loading, error } = useSelector(
    (state) => state.warehouse
  );
  const [dateRange, setDateRange] = useState([]);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    dispatch(getStockItems({}));
    dispatch(fetchItems({}));
    dispatch(fetchStockAdjustments());
    dispatch(fetchIssuedItems());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      message.error(error.message || "An error occurred");
      dispatch(clearStoreError());
    }
  }, [error, dispatch]);

  const handleRefresh = () => {
    dispatch(getStockItems({}));
    dispatch(fetchItems({}));
    dispatch(fetchStockAdjustments());
    dispatch(fetchIssuedItems());
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates || []);
  };

  const handleExport = () => {
    message.info("Export functionality will be implemented");
  };

  const totalItems = itemsList.length || 0;
  const totalStockValue = stockItems.reduce(
    (sum, item) => sum + (parseFloat(item.current_quantity || 0) * parseFloat(item.unit_cost || 0)),
    0
  );
  const totalQuantity = stockItems.reduce(
    (sum, item) => sum + parseFloat(item.current_quantity || 0),
    0
  );
  const lowStockCount = stockItems.filter(
    (item) => item.item && item.item.isLowStock
  ).length;

  const stockColumns = [
    { title: "Item", dataIndex: ["item", "name"], key: "item" },
    { title: "Category", dataIndex: ["item", "category"], key: "category" },
    { title: "Batch #", dataIndex: "batch_number", key: "batch_number" },
    { title: "Quantity", dataIndex: "current_quantity", key: "current_quantity" },
    { title: "Unit Cost", dataIndex: "unit_cost", key: "unit_cost", render: (v) => "$" + parseFloat(v || 0).toFixed(2) },
    { title: "Expiry", dataIndex: "expiry_date", key: "expiry_date" },
    { title: "Status", key: "status", render: (_, r) => {
      if (r.item && r.item.isCritical) return <Tag color="red">CRITICAL</Tag>;
      if (r.item && r.item.isLowStock) return <Tag color="orange">LOW STOCK</Tag>;
      return <Tag color="green">IN STOCK</Tag>;
    }},
  ];

  const adjustmentColumns = [
    { title: "Item", dataIndex: ["item", "name"], key: "item" },
    { title: "Type", dataIndex: "adjustment_type", key: "type", render: (t) => {
      let c = "blue";
      if (t === "addition") c = "green";
      else if (t === "reduction") c = "red";
      return <Tag color={c}>{t ? t.toUpperCase() : ""}</Tag>;
    }},
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    { title: "Reason", dataIndex: "reason", key: "reason" },
    { title: "Date", dataIndex: "createdAt", key: "date", render: (d) => moment(d).format("YYYY-MM-DD") },
  ];

  const issuedColumns = [
    { title: "Item", dataIndex: ["item", "name"], key: "item" },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    { title: "Department", dataIndex: ["department", "name"], key: "department" },
    { title: "Issued By", dataIndex: "issued_by", key: "issued_by" },
    { title: "Date", dataIndex: "createdAt", key: "date", render: (d) => moment(d).format("YYYY-MM-DD") },
  ];

  return (
    <div style={{ padding: isMobile ? "8px" : "16px" }}>
      <Card>
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col><Title level={4}>Stock Reports</Title></Col>
          <Col>
            <Space wrap>
              <RangePicker onChange={handleDateRangeChange} />
              <Button icon={<DownloadOutlined />} onClick={handleExport}>Export</Button>
              <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={loading}>Refresh</Button>
            </Space>
          </Col>
        </Row>

        <Row gutter={16} style={{ marginTop: 16, marginBottom: 16 }}>
          <Col xs={12} sm={6}><Card><Statistic title="Total Items" value={totalItems} prefix={<FileTextOutlined />} /></Card></Col>
          <Col xs={12} sm={6}><Card><Statistic title="Total Stock Value" value={totalStockValue} prefix="$" precision={2} /></Card></Col>
          <Col xs={12} sm={6}><Card><Statistic title="Total Quantity" value={totalQuantity} valueStyle={{ color: "#3f8600" }} /></Card></Col>
          <Col xs={12} sm={6}><Card><Statistic title="Low Stock Alerts" value={lowStockCount} valueStyle={{ color: lowStockCount > 0 ? "#faad14" : undefined }} prefix={<WarningOutlined />} /></Card></Col>
        </Row>

        <Title level={5}>Current Stock Summary</Title>
        <Table columns={stockColumns} dataSource={stockItems} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} scroll={isMobile ? { x: true } : undefined} size={isMobile ? "small" : "middle"} />

        <Title level={5} style={{ marginTop: 24 }}>Stock Adjustments</Title>
        <Table columns={adjustmentColumns} dataSource={stockAdjustments} rowKey="id" loading={loading} pagination={{ pageSize: 5 }} size="small" scroll={isMobile ? { x: true } : undefined} />

        <Title level={5} style={{ marginTop: 24 }}>Issued Items</Title>
        <Table columns={issuedColumns} dataSource={items} rowKey="id" loading={loading} pagination={{ pageSize: 5 }} size="small" scroll={isMobile ? { x: true } : undefined} />
      </Card>
    </div>
  );
};

export default StockReport;
