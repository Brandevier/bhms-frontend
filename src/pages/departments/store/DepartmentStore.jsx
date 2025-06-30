import React, { useEffect, useState } from 'react';
import { 
  Table, 
  Input, 
  Card, 
  Space, 
  Button, 
  Tag, 
  Statistic, 
  Select, 
  DatePicker, 
  Popconfirm, 
  message,
  Badge,
  Divider
} from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  SyncOutlined, 
  FileExcelOutlined, 
  FilterOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDepartmentItems, requestItems } from '../../../redux/slice/inventorySlice';
// import RequestItemsModal from './RequestItemsModal';
// import ItemHistoryModal from './ItemHistoryModal';
import dayjs from 'dayjs';
import RequestItems from '../../../modal/RequestItems';

const { Search } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;

// Dummy data for demonstration
const dummyItems = [
  {
    id: '1',
    batch: {
      id: 'batch-1',
      batch_number: 'BATCH-2023-001',
      expiry_date: '2024-06-30',
      item: {
        id: 'item-1',
        name: 'Paracetamol 500mg',
        quantity: 150,
        unit: 'Tablets',
        category: 'Medication',
        min_stock_level: 50
      }
    },
    quantity_issued: 30,
    staff: {
      id: 'staff-1',
      firstName: 'Dr. Kwame',
      lastName: 'Amponsah'
    },
    date: '2023-06-15T10:30:00',
    status: 'active'
  },
  {
    id: '2',
    batch: {
      id: 'batch-2',
      batch_number: 'BATCH-2023-002',
      expiry_date: '2023-12-31',
      item: {
        id: 'item-2',
        name: 'Ibuprofen 400mg',
        quantity: 80,
        unit: 'Tablets',
        category: 'Medication',
        min_stock_level: 30
      }
    },
    quantity_issued: 15,
    staff: {
      id: 'staff-2',
      firstName: 'Nurse',
      lastName: 'Ama'
    },
    date: '2023-06-18T14:45:00',
    status: 'low_stock'
  },
  {
    id: '3',
    batch: {
      id: 'batch-3',
      batch_number: 'BATCH-2023-003',
      expiry_date: '2025-01-15',
      item: {
        id: 'item-3',
        name: 'Bandages',
        quantity: 200,
        unit: 'Pieces',
        category: 'Medical Supplies',
        min_stock_level: 100
      }
    },
    quantity_issued: 50,
    staff: {
      id: 'staff-3',
      firstName: 'Dr. Yaw',
      lastName: 'Boateng'
    },
    date: '2023-06-20T09:15:00',
    status: 'active'
  },
];

const statusColors = {
  active: 'green',
  low_stock: 'orange',
  expired: 'red',
  finished: 'gray'
};

const DepartmentStore = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.warehouse);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState([]);
  const [requestModalVisible, setRequestModalVisible] = useState(false);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    dispatch(fetchDepartmentItems());
  }, [dispatch]);

  const handleFinish = (itemId) => {
    message.success('Item marked as finished.');
    // Dispatch action to update item status
  };

  const handleRequestSubmit = (data) => {
    dispatch(requestItems(data))
      .unwrap()
      .then(() => {
        message.success('Items requested successfully');
        setRequestModalVisible(false);
        dispatch(fetchDepartmentItems());
      })
      .catch((error) => {
        message.error(error || 'Failed to request items');
      });
  };

  const handleViewHistory = (item) => {
    setSelectedItem(item);
    setHistoryModalVisible(true);
  };

  // Combine real data with dummy data for demonstration
  const allItems = [...(items || []), ...dummyItems];

  // Filter items based on search and filters
  const filteredItems = allItems.filter(item => {
    const matchesSearch = item?.batch?.item?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item?.batch?.item?.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item?.status === statusFilter;
    const matchesDate = dateRange.length === 0 || (
      dayjs(item.date).isAfter(dateRange[0]) && 
      dayjs(item.date).isBefore(dateRange[1])
    );
    
    return matchesSearch && matchesCategory && matchesStatus && matchesDate;
  });

  const categories = [...new Set(allItems.map(item => item?.batch?.item?.category).filter(Boolean))];

  const columns = [
    {
      title: 'Item',
      dataIndex: 'item',
      key: 'item',
      render: (_, record) => (
        <div>
          <div className="font-medium">{record?.batch?.item?.name}</div>
          <div className="text-gray-500 text-xs">{record?.batch?.item?.category}</div>
        </div>
      ),
      sorter: (a, b) => a.batch.item.name.localeCompare(b.batch.item.name),
    },
    {
      title: 'Batch',
      dataIndex: 'batch',
      key: 'batch',
      render: (_, record) => (
        <div>
          <div className="font-mono">{record?.batch?.batch_number}</div>
          <div className="text-gray-500 text-xs">
            Exp: {dayjs(record?.batch?.expiry_date).format('MMM YYYY')}
          </div>
        </div>
      ),
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      render: (_, record) => (
        <div>
          <div>
            {record?.batch?.item?.quantity} {record?.batch?.item?.unit}
          </div>
          {record?.batch?.item?.quantity <= record?.batch?.item?.min_stock_level && (
            <div className="text-xs text-orange-500">
              (Min: {record?.batch?.item?.min_stock_level})
            </div>
          )}
        </div>
      ),
      sorter: (a, b) => a.batch.item.quantity - b.batch.item.quantity,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={statusColors[status] || 'blue'}>
          {status?.split('_').join(' ').toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Low Stock', value: 'low_stock' },
        { text: 'Expired', value: 'expired' },
        { text: 'Finished', value: 'finished' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Last Issued',
      dataIndex: 'date',
      key: 'date',
      render: (date) => dayjs(date).format('DD MMM YYYY'),
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button 
            size="small" 
            onClick={() => handleViewHistory(record)}
          >
            History
          </Button>
          <Popconfirm
            title="Mark this item as finished?"
            onConfirm={() => handleFinish(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button size="small" danger>
              Finish
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <Statistic 
            title="Total Items" 
            value={allItems.length} 
            prefix={<FileExcelOutlined />}
          />
        </Card>
        <Card>
          <Statistic 
            title="Active Items" 
            value={allItems.filter(i => i.status === 'active').length} 
            prefix={<CheckCircleOutlined />}
          />
        </Card>
        <Card>
          <Statistic 
            title="Low Stock" 
            value={allItems.filter(i => i.status === 'low_stock').length} 
            prefix={<ClockCircleOutlined />}
          />
        </Card>
        <Card>
          <Statistic 
            title="Categories" 
            value={categories.length} 
            prefix={<FilterOutlined />}
          />
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <Search
            placeholder="Search items..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64"
          />
          
          <Select
            placeholder="Filter by category"
            size="large"
            className="w-full md:w-48"
            onChange={setCategoryFilter}
          >
            <Option value="all">All Categories</Option>
            {categories.map(category => (
              <Option key={category} value={category}>{category}</Option>
            ))}
          </Select>
          
          <Select
            placeholder="Filter by status"
            size="large"
            className="w-full md:w-48"
            onChange={setStatusFilter}
          >
            <Option value="all">All Statuses</Option>
            <Option value="active">Active</Option>
            <Option value="low_stock">Low Stock</Option>
            <Option value="expired">Expired</Option>
          </Select>
          
          <RangePicker 
            size="large"
            className="w-full md:w-64"
            onChange={setDateRange}
          />
          
          <div className="flex gap-2">
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              size="large"
              onClick={() => setRequestModalVisible(true)}
            >
              Request Items
            </Button>
          </div>
        </div>
      </Card>

      {/* Items Table */}
      <Card
        title="Department Inventory"
        extra={
          <Button icon={<SyncOutlined />} onClick={() => dispatch(fetchDepartmentItems())}>
            Refresh
          </Button>
        }
        loading={loading}
      >
        <Table
          columns={columns}
          dataSource={filteredItems}
          rowKey="id"
          scroll={{ x: true }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} items`
          }}
        />
      </Card>

      {/* Modals */}
      <RequestItems
        visible={requestModalVisible}
        onCancel={() => setRequestModalVisible(false)}
        onSubmit={handleRequestSubmit}
        items={allItems}
      />
      
      {/* <ItemHistoryModal
        visible={historyModalVisible}
        onCancel={() => setHistoryModalVisible(false)}
        item={selectedItem}
      /> */}
    </div>
  );
};

export default DepartmentStore;