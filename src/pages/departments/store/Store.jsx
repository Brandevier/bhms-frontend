import React, { useState } from "react";
import { Card, Tabs } from "antd";
import { BarChartOutlined, DatabaseOutlined, HourglassOutlined, WarningOutlined, StopOutlined } from "@ant-design/icons";
import StoreStatistics from "./StoreStatistics"; // Import statistics component
import StockItems from "./StockItems"; // Import stock items component
import PendingRequests from "./PendingRequests"; // Import pending requests component
import OutOfStock from "./OutOfStock"; // Import out-of-stock component
import ExpiredItems from "./ExpiredItems"; // Import expired items component

const { TabPane } = Tabs;

const Store = () => {
  const [activeTab, setActiveTab] = useState("statistics");

  return (
    <Card title="Store Management" bordered={false} style={{ margin: 20 }}>
      <Tabs activeKey={activeTab} onChange={setActiveTab} tabPosition="top">
        {/* Statistics Tab */}
        <TabPane
          tab={
            <span>
              <BarChartOutlined /> Statistics
            </span>
          }
          key="statistics"
        >
          <StoreStatistics />
        </TabPane>

        {/* Stock Items Tab */}
        <TabPane
          tab={
            <span>
              <DatabaseOutlined /> Stock Items
            </span>
          }
          key="stock"
        >
          <StockItems />
        </TabPane>

        {/* Pending Requests Tab */}
        <TabPane
          tab={
            <span>
              <HourglassOutlined /> Pending Requests
            </span>
          }
          key="pending"
        >
          <PendingRequests />
        </TabPane>

        {/* Out of Stock Items Tab */}
        <TabPane
          tab={
            <span>
              <StopOutlined /> Out of Stock
            </span>
          }
          key="out_of_stock"
        >
          <OutOfStock />
        </TabPane>

        {/* Expired Items Tab */}
        <TabPane
          tab={
            <span>
              <WarningOutlined /> Expired Items
            </span>
          }
          key="expired"
        >
          <ExpiredItems />
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default Store;
