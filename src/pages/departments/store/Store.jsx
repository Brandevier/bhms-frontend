import React, { useState } from "react";
import { Card, message, Tabs } from "antd";
import { BarChartOutlined, DatabaseOutlined, HourglassOutlined, WarningOutlined, StopOutlined, PlusOutlined } from "@ant-design/icons";
import StoreStatistics from "./StoreStatistics"; // Import statistics component
import StockItems from "./StockItems"; // Import stock items component
import PendingRequests from "./PendingRequests"; // Import pending requests component
import OutOfStock from "./OutOfStock"; // Import out-of-stock component
import ExpiredItems from "./ExpiredItems"; // Import expired items component
import { useParams } from "react-router-dom";
import BhmsButton from "../../../heroComponents/BhmsButton";
import AddStockModal from "../../../modal/AddStockModal";
import { addBulkItems } from "../../../redux/slice/inventorySlice";
import { useDispatch,useSelector } from "react-redux";





const { TabPane } = Tabs;

const Store = () => {
  const [activeTab, setActiveTab] = useState("statistics");
  const { id } = useParams();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const dispatch = useDispatch()

  const handleAddStock = (data) => {
    const newStock = {
      ...data,
      department_id:id
    }
    console.log(newStock)
    dispatch(addBulkItems(newStock)).unwrap().then((res)=>{
      message.success('Stock added successfully');
      setIsModalVisible(false)
    })
    // Implement your logic to add stock items here
  };

  return (
    <Card
      title={
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>Store Management</span>
          <BhmsButton block={false} size="medium" type="primary" icon={<PlusOutlined />} onClick={()=>setIsModalVisible(true)}>
            Add Stock Item
          </BhmsButton>
        </div>
      }
      bordered={false}
      style={{ margin: 20 }}
    >
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
          <StockItems store_id={id} />
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

      <AddStockModal visible={isModalVisible} onClose={()=>setIsModalVisible(false)} onSubmit={handleAddStock}/>
    </Card>
  );
};

export default Store;
