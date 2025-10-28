import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Button, 
  Card, 
  Pagination, 
  message, 
  Form
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { 
  fetchAllGDRGCodes,
  createGDRGCode,
  deleteGDRGCode,
  updateGDRGCode 
} from '../../../redux/slice/claims_dgrg';
import GDRGTable from './GDRGCodes/GDRGTable';
import GDRGModal from './GDRGCodes/GDRGModal';
import GDRGSearch from './GDRGCodes/GDRGSearch';

const GDRGCodes = () => {
  const dispatch = useDispatch();
  const { codes, loading, error } = useSelector(state => state.dgrgCodes);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCode, setEditingCode] = useState(null);

  useEffect(() => {
    dispatch(fetchAllGDRGCodes());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  const filteredCodes = codes.filter(code => 
    code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    code.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    code.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
    code.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedCodes = filteredCodes.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const showModal = (code = null) => {
    setEditingCode(code);
    if (code) {
      form.setFieldsValue({
        ...code,
        coverage_percentage: code.coverage_percentage * 100
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const processedValues = {
        ...values,
        coverage_percentage: values.coverage_percentage / 100
      };

      if (editingCode) {
        await dispatch(updateGDRGCode({ 
          id: editingCode.id, 
          updateData: processedValues 
        }));
        message.success('GDRG code updated successfully');
        
      } else {
        await dispatch(createGDRGCode(processedValues));
        message.success('GDRG code created successfully');
      }
      
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error(error.response?.data?.error || 'Operation failed');
    }
  };

  const handleDelete = async (code) => {
    try {
      await dispatch(deleteGDRGCode(code));
      message.success('GDRG code deleted successfully');
    } catch (error) {
      message.error(error.response?.data?.error || 'Delete failed');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card 
        title="GDRG Codes Management" 
        bordered={false}
        className="shadow-md"
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => showModal()}
            className="bg-blue-600"
          >
            Add New Code
          </Button>
        }
      >
        <div className="mb-4 flex justify-between">
          <GDRGSearch 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <GDRGTable 
          data={paginatedCodes}
          loading={loading}
          onEdit={showModal}
          onDelete={handleDelete}
        />

        <div className="flex justify-end">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredCodes.length}
            onChange={(page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            }}
            showSizeChanger
            showQuickJumper
            showTotal={(total) => `Total ${total} items`}
            className="mt-4"
          />
        </div>
      </Card>

      <GDRGModal
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        onOk={handleOk}
        confirmLoading={loading}
        form={form}
        editingCode={editingCode}
      />
    </div>
  );
};

export default GDRGCodes;