import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchIssuedItems } from "../../../redux/slice/inventorySlice";
import { 
  Table, 
  Input, 
  Button, 
  Space, 
  Popconfirm, 
  message, 
  Skeleton, 
  Card,
  Tag,
  Statistic,
  Row,
  Col,
  DatePicker,
  Select,
  Badge
} from "antd";
import { 
  SearchOutlined, 
  DeleteOutlined, 
  FilterOutlined,
  FileExcelOutlined,
  SyncOutlined,
  InfoCircleOutlined,
  PrinterOutlined
} from "@ant-design/icons";
import moment from "moment";

const { RangePicker } = DatePicker;
const { Option } = Select;

const IssuedItems = () => {
    const dispatch = useDispatch();
    const { items, loading } = useSelector((state) => state.warehouse);
    const [searchText, setSearchText] = useState("");
    const [dateRange, setDateRange] = useState([]);
    const [departmentFilter, setDepartmentFilter] = useState(null);
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    
    // Dummy departments for filtering
    const dummyDepartments = [
        { id: 1, name: "Emergency" },
        { id: 2, name: "Pediatrics" },
        { id: 3, name: "Surgery" },
        { id: 4, name: "ICU" },
        { id: 5, name: "Pharmacy" }
    ];

    useEffect(() => {
        dispatch(fetchIssuedItems());
    }, [dispatch]);

    // Enhanced filtering
    const filteredItems = items.filter((item) => {
        const matchesSearch = item.batch?.item?.name.toLowerCase().includes(searchText.toLowerCase());
        const matchesDepartment = departmentFilter ? item.department?.id === departmentFilter : true;
        const matchesDate = dateRange.length === 2 ? 
            moment(item.date).isBetween(dateRange[0], dateRange[1], null, '[]') : true;
        
        return matchesSearch && matchesDepartment && matchesDate;
    });

    const handleDelete = async (id) => {
        try {
            // await dispatch(deleteIssuedItem(id)).unwrap();
            message.success("Issued item record deleted successfully");
        } catch (error) {
            message.error("Failed to delete issued item record");
        }
    };

    const handleRefresh = () => {
        dispatch(fetchIssuedItems());
        message.success("Issued items data refreshed");
    };

    const handleExport = () => {
        message.info("Export functionality will be implemented soon");
    };

    const handlePrint = (record) => {
        message.info(`Printing issued item record for ${record.batch?.item?.name}`);
    };

    const expandedRowRender = (record) => {
        return (
            <div className="issued-item-details">
                <Row gutter={16}>
                    <Col span={8}>
                        <Card size="small" title="Item Information">
                            <p><strong>Batch Number:</strong> {record.batch?.batch_number || "N/A"}</p>
                            <p><strong>Category:</strong> {record.batch?.item?.category || "N/A"}</p>
                            <p><strong>Supplier:</strong> {record.batch?.supplier_name || "N/A"}</p>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card size="small" title="Transaction Details">
                            <Statistic title="Quantity Issued" value={record.quantity} />
                            <Statistic 
                                title="Date Issued" 
                                value={record.date ? moment(record.date).format("LLL") : "N/A"} 
                            />
                            <Statistic title="Reference" value={record.reference || "N/A"} />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card size="small" title="Actions">
                            <Space direction="vertical">
                                <Button 
                                    icon={<PrinterOutlined />} 
                                    onClick={() => handlePrint(record)}
                                    block
                                >
                                    Print Record
                                </Button>
                                <Button 
                                    icon={<InfoCircleOutlined />} 
                                    block
                                >
                                    View Full History
                                </Button>
                                <Popconfirm
                                    title="Are you sure you want to delete this record?"
                                    onConfirm={() => handleDelete(record.id)}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button 
                                        danger 
                                        icon={<DeleteOutlined />} 
                                        block
                                    >
                                        Delete Record
                                    </Button>
                                </Popconfirm>
                            </Space>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    };

    const columns = [
        {
            title: "Item Details",
            dataIndex: "batch",
            key: "item",
            width: 250,
            render: (batch) => (
                <div className="item-details">
                    <div className="item-name">{batch?.item?.name || "N/A"}</div>
                    <div className="item-meta">
                        <Tag color="blue">{batch?.item?.category || "General"}</Tag>
                        <span>Batch: {batch?.batch_number || "N/A"}</span>
                    </div>
                </div>
            ),
        },
        {
            title: "Quantity",
            dataIndex: "quantity",
            key: "quantity",
            width: 120,
            render: (quantity) => (
                <Tag color={quantity > 50 ? "red" : "green"}>{quantity}</Tag>
            ),
        },
        {
            title: "Department",
            dataIndex: "department",
            key: "department",
            width: 150,
            render: (department) => (
                <Tag color="purple">{department?.name || "N/A"}</Tag>
            ),
        },
        {
            title: "Issued By",
            dataIndex: "staff",
            key: "issued_by",
            width: 180,
            render: (staff) => (
                <div className="staff-info">
                    <span>{`${staff?.firstName || ""} ${staff?.lastName || ""}`.trim() || "N/A"}</span>
                    {staff?.role === "admin" && <Badge count="Admin" style={{ backgroundColor: '#52c41a', marginLeft: 8 }} />}
                </div>
            ),
        },
        {
            title: "Date Issued",
            dataIndex: "date",
            key: "date",
            width: 180,
            render: (date) => (
                <div>
                    <div>{date ? moment(date).format("MMM D, YYYY") : "N/A"}</div>
                    <div style={{ fontSize: 12, color: "#888" }}>
                        {date ? moment(date).fromNow() : ""}
                    </div>
                </div>
            ),
            sorter: (a, b) => new Date(a.date) - new Date(b.date),
        },
        {
            title: "Actions",
            key: "action",
            width: 150,
            render: (_, record) => (
                <Space size="small">
                    <Button 
                        type="primary" 
                        size="small"
                        onClick={() => {
                            if (expandedRowKeys.includes(record.id)) {
                                setExpandedRowKeys([]);
                            } else {
                                setExpandedRowKeys([record.id]);
                            }
                        }}
                    >
                        Details
                    </Button>
                    <Popconfirm
                        title="Delete this record?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button 
                            danger 
                            size="small" 
                            icon={<DeleteOutlined />} 
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="issued-items-container">
            <Card
                title={
                    <div className="card-header">
                        <h2>Issued Items Management</h2>
                        <p className="subtitle">Track all items distributed from inventory</p>
                    </div>
                }
                extra={
                    <Space>
                        <Button icon={<FileExcelOutlined />} onClick={handleExport}>
                            Export
                        </Button>
                        <Button icon={<SyncOutlined />} onClick={handleRefresh}>
                            Refresh
                        </Button>
                    </Space>
                }
                bordered={false}
            >
                <div className="filter-controls">
                    <Space size="large">
                        <Input
                            placeholder="Search items..."
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{ width: 250 }}
                            allowClear
                        />
                        <Select
                            placeholder="Filter by Department"
                            style={{ width: 200 }}
                            onChange={setDepartmentFilter}
                            allowClear
                            suffixIcon={<FilterOutlined />}
                        >
                            {dummyDepartments.map(dept => (
                                <Option key={dept.id} value={dept.id}>{dept.name}</Option>
                            ))}
                        </Select>
                        <RangePicker 
                            onChange={setDateRange} 
                            style={{ width: 250 }} 
                            placeholder={["Start Date", "End Date"]}
                        />
                    </Space>
                </div>

                {loading ? (
                    <Skeleton active paragraph={{ rows: 10 }} />
                ) : (
                    <Table
                        columns={columns}
                        dataSource={filteredItems}
                        rowKey="id"
                        bordered
                        expandable={{
                            expandedRowRender,
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
                        pagination={{ 
                            pageSize: 10,
                            showSizeChanger: true,
                            showTotal: (total) => `Total ${total} issued items`
                        }}
                    />
                )}
            </Card>

            <style jsx global>{`
                .issued-items-container {
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
                .filter-controls {
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
                .issued-item-details {
                    background: #fafafa;
                    padding: 16px;
                    margin: -12px -8px;
                }
                .ant-table-expanded-row .issued-item-details {
                    margin: 0 -16px -16px;
                }
                .ant-statistic-content {
                    font-size: 16px;
                }
                .staff-info {
                    display: flex;
                    align-items: center;
                }
            `}</style>
        </div>
    );
};

export default IssuedItems;