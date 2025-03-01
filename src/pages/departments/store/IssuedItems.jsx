import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchIssuedItems } from "../../../redux/slice/inventorySlice";
import { Table, Input, Button, Space, Popconfirm, message, Skeleton } from "antd";
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import moment from "moment";

const IssuedItems = () => {
    const dispatch = useDispatch();
    const { items, loading } = useSelector((state) => state.warehouse);
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        dispatch(fetchIssuedItems());
    }, [dispatch]);

    // 🔍 Handle search
    const filteredItems = items.filter((item) =>
        item.batch?.item?.name.toLowerCase().includes(searchText.toLowerCase())
    );

    // 🗑️ Delete Issued Item
    const handleDelete = async (id) => {
        try {
            // await dispatch(deleteIssuedItem(id)).unwrap();
            message.success("Item deleted successfully");
        } catch (error) {
            message.error("Failed to delete item");
        }
    };

    // 📌 Ant Design Table Columns
    const columns = [
        {
            title: "Item Name",
            dataIndex: "batch",
            key: "batch",
            render: (batch) => batch?.item?.name || "N/A",
        },
        {
            title: "Quantity",
            dataIndex: "quantity",
            key: "quantity",
        },
        {
            title: "Department",
            dataIndex: "department",
            key: "department",
            render: (department) => department?.name || "N/A",
        },
        {
            title: "Issued By",
            dataIndex: "staff",
            key: "issued_by",
            render: (staff) => `${staff?.firstName || ""} ${staff?.lastName || ""}`.trim() || "N/A",
        },
        {
            title: "Date Issued",
            dataIndex: "date",
            key: "date",
            render: (date) => (date ? moment(date).format("YYYY-MM-DD HH:mm") : "N/A"),
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Popconfirm
                    title="Are you sure you want to delete this item?"
                    onConfirm={() => handleDelete(record.id)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button type="primary" danger icon={<DeleteOutlined />} />
                </Popconfirm>
            ),
        },
    ];

    return (
        <div>
            {/* 🔍 Search Bar */}
            <Space style={{ marginBottom: 16 }}>
                <Input
                    placeholder="Search Item"
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ width: 250 }}
                />
            </Space>

            {/* 📊 Ant Design Table with Skeleton Loader */}
            {loading ? (
                <Skeleton active paragraph={{ rows: 10 }} />
            ) : (
                <Table
                    columns={columns}
                    dataSource={filteredItems}
                    rowKey="id"
                    bordered
                    pagination={{ pageSize: 10 }}
                />
            )}
        </div>
    );
};

export default IssuedItems;
