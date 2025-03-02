import React, { useEffect } from "react";
import { Card, Col, Row, Tooltip, Table } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchStoreStatistics } from "../../../redux/slice/inventorySlice";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";
import moment from "moment";

const StoreStatistics = () => {
  const dispatch = useDispatch();
  const { statistics, loading } = useSelector((state) => state.warehouse);

  useEffect(() => {
    dispatch(fetchStoreStatistics());
  }, [dispatch]);

  const totalStock = statistics?.totalStock || {};
  const departmentStock = statistics?.departmentStock || [];
  const nearExpiry = statistics?.nearExpiry || [];
  const requestStats = statistics?.requestStats || [];
  const mostRequested = statistics?.mostRequested || [];

  const departmentStockChart = {
    labels: departmentStock.map((dept) => dept.department_id),
    datasets: [
      {
        label: "Stock Quantity",
        data: departmentStock.map((dept) => dept.total_quantity),
        backgroundColor: "#1890ff",
      },
    ],
  };

  const requestStatsChart = {
    labels: requestStats.map((stat) => stat.status),
    datasets: [
      {
        data: requestStats.map((stat) => stat.count),
        backgroundColor: ["#f5222d", "#faad14", "#52c41a"],
      },
    ],
  };

  const nearExpiryColumns = [
    { title: "Batch Number", dataIndex: "batch_number", key: "batch_number" },
    { title: "Expiry Date", dataIndex: "expiry_date", key: "expiry_date", render: (date) => moment(date).fromNow() },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
  ];

  return (
    <Row gutter={[16, 16]}>
      <Col span={12}>
        <Card title="Total Stock" extra={<Tooltip title="Total quantity and value of stock."><InfoCircleOutlined /></Tooltip>}>
          <p>Quantity: {totalStock.total_quantity}</p>
          <p>Value: {totalStock.total_value}</p>
        </Card>
      </Col>

      <Col span={12}>
        <Card title="Most Requested Items" extra={<Tooltip title="Frequently requested items."><InfoCircleOutlined /></Tooltip>}>
          {mostRequested.length ? mostRequested.map(item => <p key={item.id}>{item.name}: {item.count}</p>) : <p>No data</p>}
        </Card>
      </Col>

      <Col span={12}>
        <Card title="Stock by Department">
          <Bar data={departmentStockChart} />
        </Card>
      </Col>

      <Col span={12}>
        <Card title="Request Status Overview">
          <Pie data={requestStatsChart} />
        </Card>
      </Col>

      <Col span={24}>
        <Card title="Near Expiry Items">
          <Table dataSource={nearExpiry} columns={nearExpiryColumns} rowKey="batch_number" pagination={false} />
        </Card>
      </Col>
    </Row>
  );
};

export default StoreStatistics;
