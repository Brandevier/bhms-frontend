// LabInvestigationTarrifs.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Divider, message } from 'antd';
import { 
  fetchLabInvestigations,
} from '../../../../redux/slice/labInvestigationSlice';
import SearchBar from './components/SearchBar';
import InvestigationTable from './components/InvestigationTable';
import ActionOverlay from './components/ActionOverlay';
import InvestigationModal from './components/InvestigationModal';

const LabInvestigationTarrifs = () => {
  const dispatch = useDispatch();
  const { 
    investigations, 
    loading, 
    error,
    pagination 
  } = useSelector(state => state.labInvestigations);
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    dispatch(fetchLabInvestigations({ page: 1, limit: 20 }));
  }, [dispatch]);

  const handleSearch = (value) => {
    setSearchText(value);
    setSelectedRowKeys([]);
    setSelectedRows([]);
    dispatch(fetchLabInvestigations({ 
      page: 1, 
      limit: 10, 
      search: value 
    }));
  };

  const handleTableChange = (pagination) => {
    dispatch(fetchLabInvestigations({ 
      page: pagination.current, 
      limit: pagination.pageSize,
      search: searchText
    }));
  };

  const showModal = () => {
    setIsModalVisible(true);
    setEditingId(null);
  };

  const handleEdit = (record) => {
    setIsModalVisible(true);
    setEditingId(record.id);
  };

  const handleRowSelection = (selectedKeys, selectedRows) => {
    setSelectedRowKeys(selectedKeys);
    setSelectedRows(selectedRows);
  };

  const clearSelection = () => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <Card 
        title="Lab Investigation Tariffs" 
        bordered={false}
        className="shadow-md relative"
      >
        <SearchBar 
          onSearch={handleSearch}
          onAddNew={showModal}
        />

        <Divider className="my-4" />

        <InvestigationTable
          data={investigations}
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
          onEdit={handleEdit}
          selectedRowKeys={selectedRowKeys}
          onRowSelection={handleRowSelection}
        />

        <ActionOverlay 
          selectedCount={selectedRowKeys.length}
          selectedRows={selectedRows}
          onClearSelection={clearSelection}
        />

        <InvestigationModal
          visible={isModalVisible}
          editingId={editingId}
          onCancel={() => setIsModalVisible(false)}
          initialData={editingId ? investigations.find(item => item.id === editingId) : null}
        />
      </Card>
    </div>
  );
};

export default LabInvestigationTarrifs;