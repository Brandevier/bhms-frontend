import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchExpiredItems } from "../../../redux/slice/inventorySlice";
import { Table, Skeleton, Empty } from "antd";
import moment from "moment";

const ExpiredItems = () => {
    const dispatch = useDispatch();
    const { expiredItems, loading } = useSelector((state) => state.warehouse);

    useEffect(() => {
        dispatch(fetchExpiredItems());
    }, [dispatch]);

    // 📌 Table Columns
    const columns = [
        {
            title: "Item Name",
            dataIndex: "item",
            key: "item_name",
            render: (item) => item?.name || "N/A",
        },
        {
            title: "Batch Number",
            dataIndex: "batch_number",
            key: "batch_number",
        },
        {
            title: "Quantity",
            dataIndex: "quantity",
            key: "quantity",
        },
        {
            title: "Expiration Date",
            dataIndex: "expiry_date",
            key: "expiration_date",
            render: (expiry_date) =>
                expiry_date ? moment(expiry_date).format("YYYY-MM-DD") : "N/A",
        },
    ];

    return (
        <div>
            {/* 📊 Table with Skeleton & Empty State */}
            {loading ? (
                <Skeleton active paragraph={{ rows: 10 }} />
            ) : expiredItems.length > 0 ? (
                <Table
                    columns={columns}
                    dataSource={expiredItems}
                    rowKey="id"
                    bordered
                    pagination={{ pageSize: 10 }}
                />
            ) : (
                <Empty description="No expired items" />
            )}
        </div>
    );
};

export default ExpiredItems;
