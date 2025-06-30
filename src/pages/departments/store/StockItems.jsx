import React, { useEffect, useState } from "react";
import { 
  Table, 
  Button, 
  Tooltip, 
  Badge, 
  Skeleton, 
  Input, 
  message, 
  Card, 
  Space, 
  Tag,
  Statistic,
  Row,
  Col,
  Popconfirm
} from "antd";
import { 
  SearchOutlined, 
  PlusOutlined,
  ExportOutlined,
  ImportOutlined,
  SyncOutlined,
  InfoCircleOutlined,
  WarningOutlined
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getStockItems, addBulkItems, issueItems } from "../../../redux/slice/inventorySlice";
import DistributeStocks from "../../../modal/DistributeStocks";
import AddStockModal from "../../../modal/AddStockModal";
import StockLevelIndicator from "../../../heroComponents/StockLevelIndicator";
import BhmsButton from "../../../heroComponents/BhmsButton";


const StockItems = () => {
  const dispatch = useDispatch();
  const { stockItems, loading, addStockLoading, issueItemLoading } = useSelector((state) => state.warehouse);
  const { user } = useSelector((state) => state.auth);
  const [openDistributeStock, setDistributeStock] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  // Dummy data for demonstration
  const dummyCategories = [
    { id: 1, name: "Medication" },
    { id: 2, name: "Medical Supplies" },
    { id: 3, name: "Equipment" },
    { id: 4, name: "Consumables" },
  ];

  const dummySuppliers = [
    "MediCorp", "PharmaPlus", "Global Health", "BioTech Supplies"
  ];

  useEffect(() => {
    dispatch(getStockItems({ store_id: user.department.id }));
  }, [dispatch, user]);

  useEffect(() => {
    if (stockItems?.stockItems) {
      // Enhance stock items with dummy data for demonstration
      const enhancedItems = stockItems.stockItems.map(item => ({
        ...item,
        category: item.category || dummyCategories[Math.floor(Math.random() * dummyCategories.length)].name,
        supplier_name: item.supplier_name || dummySuppliers[Math.floor(Math.random() * dummySuppliers.length)],
        expiry_date: item.expiry_date || new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        threshold: Math.floor(Math.random() * 50) + 10,
        last_restocked: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }));
      setFilteredData(enhancedItems);
    }
  }, [stockItems]);

  const handleAddStock = (data) => {
    const newStock = {
      ...data,
      department_id: user.department.id
    };
    dispatch(addBulkItems(newStock)).unwrap().then((res) => {
      message.success('Stock added successfully');
      dispatch(getStockItems({ store_id: user.department.id }));
      setIsModalVisible(false);
    });
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (!value) {
      setFilteredData(stockItems.stockItems);
      return;
    }

    const filtered = stockItems?.stockItems?.filter((item) =>
      [item.batch_number, item.item?.name, item.supplier_name]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(value.toLowerCase()))
    );
    setFilteredData(filtered);
  };

  const handleDistribute = (record) => {
    dispatch(issueItems(record)).unwrap().then((res) => {
      message.success('Items distributed successfully');
      dispatch(getStockItems({ store_id: user.department.id }));
      setDistributeStock(false);
    });
  };

  const handleRestock = (record) => {
    setSelectedItem(record);
    setIsModalVisible(true);
  };

  const handleQuickRestock = (itemId) => {
    message.success(`Quick restock initiated for item ${itemId}`);
    // Implement actual restock logic here
  };

  const handleExport = () => {
    message.info('Export functionality will be implemented soon');
  };

  const handleImport = () => {
    message.info('Import functionality will be implemented soon');
  };

  const handleRefresh = () => {
    dispatch(getStockItems({ store_id: user.department.id }));
    message.success('Stock data refreshed');
  };

  const columns = [
    {
      title: "Item Details",
      dataIndex: "item",
      key: "item",
      width: 250,
      render: (item, record) => (
        <div className="item-details">
          <div className="item-name">{item?.name || "Unknown Item"}</div>
          <div className="item-meta">
            <Tag color="blue">{record.category}</Tag>
            <span>Batch: {record.batch_number}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Stock Level",
      dataIndex: "quantity",
      key: "quantity",
      width: 200,
      render: (quantity, record) => (
        <StockLevelIndicator 
          current={quantity} 
          threshold={record.threshold} 
        />
      ),
    },
    {
      title: "Supplier Info",
      dataIndex: "supplier_name",
      key: "supplier",
      width: 180,
      render: (supplier) => (
        <div className="supplier-info">
          <Tag color="geekblue">{supplier || "N/A"}</Tag>
        </div>
      ),
    },
    {
      title: "Expiry",
      dataIndex: "expiry_date",
      key: "expiry",
      width: 120,
      render: (date) => (
        <Tooltip title={`Expires on ${date}`}>
          <Tag color={new Date(date) < new Date() ? "red" : "green"}>
            {date}
          </Tag>
        </Tooltip>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 250,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            size="small"
            onClick={() => {
              setSelectedItem(record);
              setDistributeStock(true);
            }}
          >
            Distribute
          </Button>
          <Button 
            size="small"
            onClick={() => handleRestock(record)}
          >
            Re-stock
          </Button>
          <Popconfirm
            title="Quick restock this item?"
            onConfirm={() => handleQuickRestock(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              type="dashed" 
              size="small"
              icon={<SyncOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const expandedRowRender = (record) => {
    return (
      <div className="stock-details-expanded">
        <Row gutter={16}>
          <Col span={8}>
            <Card size="small" title="Stock Information">
              <Statistic title="Current Quantity" value={record.quantity} />
              <Statistic title="Threshold" value={record.threshold} />
              <Statistic title="Last Restocked" value={record.last_restocked} />
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small" title="Item Details">
              <p><strong>Category:</strong> {record.category}</p>
              <p><strong>Batch Number:</strong> {record.batch_number}</p>
              <p><strong>Supplier:</strong> {record.supplier_name}</p>
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small" title="Actions">
              <Space direction="vertical">
                <Button 
                  type="primary" 
                  block
                  onClick={() => {
                    setSelectedItem(record);
                    setDistributeStock(true);
                  }}
                >
                  Distribute Items
                </Button>
                <Button 
                  block
                  onClick={() => handleRestock(record)}
                >
                  Full Re-stock
                </Button>
                <Button 
                  type="dashed" 
                  block
                  icon={<InfoCircleOutlined />}
                >
                  View History
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>
    );
  };

  return (
    <div className="stock-management-container">
      <Card
        title={
          <div className="card-header">
            <h2>Hospital Inventory Management</h2>
            <p className="subtitle">Manage all medical supplies and equipment</p>
          </div>
        }
        extra={
          <Space>
            <Button icon={<ExportOutlined />} onClick={handleExport}>
              Export
            </Button>
            <Button icon={<ImportOutlined />} onClick={handleImport}>
              Import
            </Button>
            <Button icon={<SyncOutlined />} onClick={handleRefresh}>
              Refresh
            </Button>
          </Space>
        }
        bordered={false}
      >
        <div className="stock-controls">
          <Input
            placeholder="Search items by name, batch or supplier"
            prefix={<SearchOutlined />}
            allowClear
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 400 }}
          />
          <BhmsButton 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
            size="medium"
            variant="solid"
          >
            Add New Stock
          </BhmsButton>
        </div>

        {loading ? (
          <Skeleton active paragraph={{ rows: 10 }} />
        ) : (
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="id"
            bordered
            expandable={{
              expandedRowRender,
              rowExpandable: (record) => true,
              expandedRowKeys,
              onExpand: (expanded, record) => {
                if (expanded) {
                  setExpandedRowKeys([record.id]);
                } else {
                  setExpandedRowKeys([]);
                }
              }
            }}
            scroll={{ x: 1200 }}
          />
        )}
      </Card>

      {/* Modals */}
      <DistributeStocks 
        onClose={() => setDistributeStock(false)} 
        visible={openDistributeStock} 
        onSubmit={handleDistribute} 
        loading={issueItemLoading}
        item={selectedItem}
      />
      
      <AddStockModal 
        visible={isModalVisible} 
        onClose={() => setIsModalVisible(false)} 
        onSubmit={handleAddStock} 
        loading={addStockLoading}
        item={selectedItem}
      />

      <style jsx global>{`
        .stock-management-container {
          padding: 20px;
        }
        .card-header h2 {
          margin: 0;
          font-size: 24px;
        }
        .card-header .subtitle {
          margin: 0;
          color: #666;
          font-size: 14px;
        }
        .stock-controls {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .item-details .item-name {
          font-weight: 500;
          margin-bottom: 4px;
        }
        .item-details .item-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #666;
        }
        .stock-details-expanded {
          background: #fafafa;
          padding: 16px;
          margin: -12px -8px;
        }
        .ant-table-expanded-row .stock-details-expanded {
          margin: 0 -16px -16px;
        }
        .ant-statistic-content {
          font-size: 16px;
        }
      `}</style>
    </div>
  );
};

export default StockItems;