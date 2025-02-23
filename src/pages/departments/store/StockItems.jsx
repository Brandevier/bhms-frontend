import React, { useEffect, useState } from "react";
import { Table, Button, Tooltip, Badge, Skeleton, Input } from "antd";
import { MessageOutlined, SearchOutlined } from "@ant-design/icons";
import { getStockItems } from "../../../redux/slice/inventorySlice";
import { useDispatch, useSelector } from "react-redux";
import DistributeStocks from "../../../modal/DistributeStocks";
import BhmsButton from "../../../heroComponents/BhmsButton";


const StockItems = ({ store_id }) => {
  const dispatch = useDispatch();
  const { stockItems, loading } = useSelector((state) => state.warehouse);
  const [openDistributeStock,setDistributeStock] = useState(false)
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");



  useEffect(() => {
    dispatch(getStockItems({ store_id }));
  }, [dispatch, store_id]);

  useEffect(() => {
    if (stockItems?.stockItems) {
      setFilteredData(stockItems.stockItems);
    }
  }, [stockItems]);

  // Search function
  const handleSearch = (value) => {
    setSearchTerm(value);
    if (!value) {
      setFilteredData(stockItems.stockItems);
      return;
    }

    const filtered = stockItems?.stockItems?.filter((item) =>
      [item.batch_number, item.item.name, item.supplier_name]
        .filter(Boolean) // Remove null values
        .some((field) => field.toLowerCase().includes(value.toLowerCase()))
    );

    setFilteredData(filtered);
  };

  const columns = [
    {
      title: "Batch Number",
      dataIndex: "batch_number",
      key: "batch_number",
    },
    {
      title: "Name",
      dataIndex: ["item", "name"],
      key: "name",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Supplier",
      dataIndex: "supplier_name",
      key: "supplier_name",
      render: (text) => text || "N/A",
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
      render: (text) =>
        text ? (
          <Tooltip title={text}>
            <Badge count={1}>
              <MessageOutlined style={{ fontSize: "16px", color: "#1890ff" }} />
            </Badge>
          </Tooltip>
        ) : (
          "--"
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <BhmsButton block={false} size="medium" type="primary" onClick={() => setDistributeStock(true)}>
            Distribute
          </BhmsButton>
          <BhmsButton block={false} size="medium" outline type="default" onClick={() => handleRestock(record)}>
            Re-stock
          </BhmsButton>
        </div>
      ),
    },
  ];

  const handleDistribute = (record) => {
    console.log("Distribute", record);
  };

  const handleRestock = (record) => {
    console.log("Re-stock", record);
  };

  return (
    <div>
      <Input
        placeholder="Search by Batch Number, Name, or Supplier"
        prefix={<SearchOutlined />}
        allowClear
        onChange={(e) => handleSearch(e.target.value)}
        style={{ marginBottom: 16, width: 300 }}
      />

      {loading ? (
        <Skeleton active paragraph={{ rows: 5 }} />
      ) : (
        <Table columns={columns} dataSource={filteredData} rowKey="id" bordered />
      )}
      <DistributeStocks onClose={()=>setDistributeStock(false)} visible={openDistributeStock} onSubmit={handleDistribute} />
    </div>
  );
};

export default StockItems;
