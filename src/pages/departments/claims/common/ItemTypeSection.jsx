// components/ItemTypeSection.jsx
import React, { useState } from 'react';
import { Table, Tag, Typography, Button, Space, Popconfirm, message } from 'antd';
import { EditOutlined, EyeOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { baseColumns, typeSpecificColumns } from './tableColumns';
import ItemDetailsModal from './ItemDetailsModal';

const { Title } = Typography;

const ItemTypeSection = ({
    type,
    items,
    onEditItem,
    onAddItem,
    onDeleteItem, // Add this prop for delete functionality
    diagnoses = [],
    loading = false,
    deleteLoading = false // Add loading state for delete operations
}) => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const handleViewDetails = (record) => {
        setSelectedItem(record);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedItem(null);
    };

    const handleDelete = async (record) => {
        setDeletingId(record.id);
        try {
            await onDeleteItem(record);
            message.success(`${type} item deleted successfully`);
        } catch (error) {
            console.log(error)
            message.error(`Failed to delete ${type.toLowerCase()} item: ${error.message}`);
        } finally {
            setDeletingId(null);
        }
    };

    const columns = [
        {
            title: 'Type',
            dataIndex: 'item_type',
            key: 'item_type',
            width: 100,
            render: () => (
                <Tag
                    color={
                        type === 'LabTest'
                            ? 'blue'
                            : type === 'Diagnosis'
                            ? 'red'
                            : type === 'Medication'
                            ? 'orange'
                            : 'green'
                    }
                >
                    {type.toUpperCase()}
                </Tag>
            ),
        },
        ...baseColumns(),
        ...(typeSpecificColumns(diagnoses)[type] || []),
        {
            title: 'Actions',
            key: 'actions',
            width: 160,
            fixed: 'right',
            render: (_, record) => (
                <Space size="small">
                    {/* View Details Button */}
                    <Button
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewDetails(record)}
                        size="small"
                        title="View Details"
                        style={{ color: '#52c41a' }}
                    />
                    
                    {/* Edit Button */}
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => onEditItem(record)}
                        size="small"
                        title="Edit"
                        style={{ color: '#1890ff' }}
                        disabled={loading || (deleteLoading && deletingId === record.id)}
                    />
                    
                    {/* Delete Button with Confirmation */}
                    <Popconfirm
                        title={`Delete ${type} Item`}
                        description={`Are you sure you want to delete this ${type.toLowerCase()} item? This action cannot be undone.`}
                        onConfirm={() => handleDelete(record)}
                        okText="Yes, Delete"
                        cancelText="Cancel"
                        okButtonProps={{ 
                            danger: true,
                            loading: deleteLoading && deletingId === record.id
                        }}
                        disabled={deleteLoading && deletingId === record.id}
                    >
                        <Button
                            type="text"
                            icon={<DeleteOutlined />}
                            size="small"
                            title="Delete"
                            style={{ color: '#ff4d4f' }}
                            loading={deleteLoading && deletingId === record.id}
                            disabled={deleteLoading && deletingId === record.id}
                        />
                    </Popconfirm>
                </Space>
            ),
        }
    ];

    return (
        <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
                <Title level={5} style={{ margin: 0 }}>
                    {type} Items ({items.length})
                </Title>
                
                {/* Add Button */}
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    size="small"
                    onClick={() => onAddItem(type)}
                    disabled={loading || deleteLoading}
                >
                    Add {type}
                </Button>
            </div>
            
            <Table
                columns={columns}
                dataSource={items}
                rowKey="id"
                pagination={false}
                bordered
                size="small"
                scroll={{ x: true }}
                loading={loading}
                footer={() => (
                    items.length === 0 ? (
                        <div className="text-center text-gray-400 py-2">
                            No {type.toLowerCase()} items added yet
                        </div>
                    ) : null
                )}
            />

            {/* Item Details Modal */}
            <ItemDetailsModal
                visible={modalVisible}
                onCancel={handleCloseModal}
                item={selectedItem}
            />

            {/* Global loading overlay for delete operations */}
            {deleteLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-lg shadow-lg">
                        <div className="flex items-center">
                            <DeleteOutlined className="text-red-500 mr-2" />
                            <span>Deleting item...</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ItemTypeSection;