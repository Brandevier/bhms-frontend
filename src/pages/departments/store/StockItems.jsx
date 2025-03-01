import React, { useEffect, useState } from "react";
import { Table, Button, Tooltip, Badge, Skeleton, Input, message } from "antd";
import { MessageOutlined, SearchOutlined } from "@ant-design/icons";
import { getStockItems,addBulkItems,issueItems } from "../../../redux/slice/inventorySlice";
import { useDispatch, useSelector } from "react-redux";
import DistributeStocks from "../../../modal/DistributeStocks";
import BhmsButton from "../../../heroComponents/BhmsButton";
import AddStockModal from "../../../modal/AddStockModal";


const StockItems = () => {
  const dispatch = useDispatch();
  const { stockItems, loading,addStockLoading,issueItemLoading } = useSelector((state) => state.warehouse);
  const [openDistributeStock,setDistributeStock] = useState(false)
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useSelector((state)=>state.auth)
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleAddStock = (data) => {
    const newStock = {
      ...data,
      department_id:user.department.id
    }
    console.log(newStock)
    dispatch(addBulkItems(newStock)).unwrap().then((res)=>{
      message.success('Stock added successfully');
      dispatch(getStockItems({ store_id:user.department.id }));
      setIsModalVisible(false)
    })
    // Implement your logic to add stock items here
  };


  useEffect(() => {
    dispatch(getStockItems({ store_id:user.department.id }));
  }, [dispatch, user]);

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
      title: "Category",
      dataIndex: "category",
      key: "category",
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
    dispatch(issueItems(record)).unwrap().then((res)=>{
      message.success('Stock added successfully');
      dispatch(getStockItems({ store_id:user.department.id }));
      setDistributeStock(false)
    })
  };

  const handleRestock = (record) => {
    console.log("Re-stock", record);
  };

  return (
    <div className="mt-5">
      <div className="flex justify-between">
      <Input
        placeholder="Search by Batch Number, Name, or Supplier"
        prefix={<SearchOutlined />}
        allowClear
        onChange={(e) => handleSearch(e.target.value)}
        style={{ marginBottom: 16, width: 300 }}
      />

      <BhmsButton block={false} size="medium" type="primary" onClick={() => setIsModalVisible(true)}>
        Stock Item
      </BhmsButton>
      </div>



      {loading ? (
        <Skeleton active paragraph={{ rows: 5 }} />
      ) : (
        <Table columns={columns} dataSource={filteredData} rowKey="id" bordered />
      )}
      <DistributeStocks onClose={()=>setDistributeStock(false)} visible={openDistributeStock} onSubmit={handleDistribute} loading={issueItemLoading}/>
      <AddStockModal visible={isModalVisible} onClose={()=>setIsModalVisible(false)} onSubmit={handleAddStock} loading={addStockLoading}/>
    </div>
  );
};

export default StockItems;
