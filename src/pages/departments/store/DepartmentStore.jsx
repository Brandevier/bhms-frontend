import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { fetchDepartmentItems } from '../../../redux/slice/inventorySlice';
import { Table, Input, Skeleton, Space, Popconfirm, message } from 'antd';
import BhmsButton from '../../../heroComponents/BhmsButton';
import RequestItems from '../../../modal/RequestItems';
import { requestItems } from '../../../redux/slice/inventorySlice';


const { Search } = Input;

const DepartmentStore = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.warehouse);
  const [searchTerm, setSearchTerm] = useState('');
  const [visible,setVisible] = useState(false)

  useEffect(() => {
    dispatch(fetchDepartmentItems());
  }, [dispatch]);

  // Handle item finishing
  const handleFinish = (itemId) => {
    message.success('Item marked as finished.');
    // Here, you can dispatch an action to update the item status
  };

  const handleSubmit = (data) => {
    console.log(data)
    dispatch(requestItems(data))
        .unwrap()
        .then(() => {
            message.success('Item requested successfully');
            setVisible(false);
        })
        .catch((error) => {
            console.error('Request failed:', error);
            message.error(error || 'Failed to request item. Please try again.');
        });
};


  // Filter items based on search
  const filteredItems = items?.filter((item) =>
    item?.batch?.item?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      title: 'Item Name',
      key: 'name',
      render: (_, record) => record?.batch?.item?.name || 'N/A',
    },
    {
      title: 'Batch Number',
      key: 'batch_number',
      render: (_, record) => record?.batch?.batch_number || 'N/A',
    },
    {
      title: 'Quantity',
      key: 'quantity',
      render: (_, record) => record?.batch?.item?.quantity || 'N/A',
    },
    {
      title: 'Issued By',
      key: 'issued_by',
      render: (_, record) =>
        record?.staff
          ? `${record?.staff?.firstName || ''} ${record?.staff?.lastName || ''}`.trim()
          : 'N/A',
    },
    {
      title: 'Date',
      key: 'date',
      render: (_, record) =>
        record?.date ? moment(record?.date).format('DD MMM YYYY, h:mm A') : 'N/A',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="Mark as finished?"
            onConfirm={() => handleFinish(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <BhmsButton type="danger" size='medium' outline>Finished</BhmsButton>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Search and Request Buttons */}
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Search
          placeholder="Search items..."
          allowClear
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 300 }}
        />
        <BhmsButton block={false} size='medium' onClick={()=>setVisible(true)}>Request Item</BhmsButton>
      </div>

      {/* Loading State */}
      {loading ? (
        <Skeleton active />
      ) : (
        <Table
          dataSource={filteredItems}
          columns={columns}
          rowKey="id"
        />
      )}
      <RequestItems visible={visible} onClose={()=>setVisible(false)} onSubmit={handleSubmit}/>
    </div>
  );
};

export default DepartmentStore;
