import React, { useEffect, useState } from 'react';
import { 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  DatePicker, 
  Space, 
  Tag, 
  message,
  Card,
  Popconfirm,
  InputNumber
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined 
} from '@ant-design/icons';
import { fetchInsuranceProviders, 
         patchInsuranceInfo, 
} from '../../../redux/slice/recordSlice';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';

const { Column } = Table;

const InsuranceProviders = () => {
  const dispatch = useDispatch();
  const { insuranceProviders, loading } = useSelector((state) => state.records);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 50,
    total: 0,
  });

  useEffect(() => {
    fetchData();
  }, [pagination.current, searchText]);

  const fetchData = () => {
    dispatch(fetchInsuranceProviders({
      page: pagination.current,
      pageSize: pagination.pageSize,
      search: searchText
    }))
    .unwrap()
    .then((response) => {
      setPagination({
        ...pagination,
        total: response.meta?.total || 0,
      });
    })
    .catch(() => message.error('Failed to fetch insurance providers'));
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    setPagination({ ...pagination, current: 1 });
  };

  const showModal = (record = null) => {
    setCurrentRecord(record);
    form.setFieldsValue({
      ...record,
      insurance_expiry_date: record?.insurance_expiry_date ? dayjs(record.insurance_expiry_date) : null
    });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
    setCurrentRecord(null);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formattedValues = {
        ...values,
        insurance_expiry_date: values.insurance_expiry_date?.toISOString()
      };

      if (currentRecord) {
        await dispatch(patchInsuranceInfo({
          id: currentRecord.id,
          data: formattedValues
        })).unwrap();
        message.success('Insurance provider updated successfully');
      } else {
        // await dispatch(createInsuranceProvider(formattedValues)).unwrap();
        message.success('Insurance provider created successfully');
      }

      fetchData();
      handleCancel();
    } catch (error) {
      message.error(error.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    try {
    //   await dispatch(deleteInsuranceProvider(id)).unwrap();
      message.success('Insurance provider deleted successfully');
      fetchData();
    } catch (error) {
      message.error('Failed to delete insurance provider');
    }
  };

  const filteredData = insuranceProviders.filter(item => 
    item.insurance_number?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="p-4">
      <Card 
        title="Insurance Providers" 
        bordered={false}
        className="shadow-sm"
        extra={
          <Space>
            <Input.Search
              placeholder="Search by NHIS number"
              allowClear
              enterButton={<SearchOutlined />}
              onSearch={handleSearch}
              className="w-64"
            />
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => showModal()}
            >
              Add Provider
            </Button>
          </Space>
        }
      >
        <Table
          dataSource={filteredData}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            pageSizeOptions: ['50', '100', '200'],
            showTotal: (total) => `Total ${total} items`,
          }}
          onChange={handleTableChange}
          scroll={{ x: true }}
        >
          <Column
            title="NHIS Number"
            dataIndex="insurance_number"
            key="insurance_number"
            sorter={(a, b) => a.insurance_number.localeCompare(b.insurance_number)}
          />
          <Column
            title="Provider"
            dataIndex="insurance_provider"
            key="insurance_provider"
            render={(provider) => <Tag color="blue">{provider}</Tag>}
            sorter={(a, b) => a.insurance_provider.localeCompare(b.insurance_provider)}
          />
          <Column
            title="Expiry Date"
            dataIndex="insurance_expiry_date"
            key="insurance_expiry_date"
            render={(date) => dayjs(date).format('DD/MM/YYYY')}
            sorter={(a, b) => new Date(a.insurance_expiry_date) - new Date(b.insurance_expiry_date)}
          />
          <Column
            title="Action"
            key="action"
            fixed="right"
            width={120}
            render={(_, record) => (
              <Space size="middle">
                <Button 
                  type="link" 
                  icon={<EditOutlined />} 
                  onClick={() => showModal(record)}
                />
                <Popconfirm
                  title="Are you sure to delete this provider?"
                  onConfirm={() => handleDelete(record.id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button 
                    type="link" 
                    danger 
                    icon={<DeleteOutlined />} 
                  />
                </Popconfirm>
              </Space>
            )}
          />
        </Table>
      </Card>

      <Modal
        title={currentRecord ? "Edit Insurance Provider" : "Add Insurance Provider"}
        visible={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        confirmLoading={loading}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="insurance_number"
            label="NHIS Number"
            rules={[
              { required: true, message: 'Please input NHIS number!' },
              { min: 6, message: 'NHIS number must be at least 6 characters' }
            ]}
          >
            <Input placeholder="Enter NHIS number" />
          </Form.Item>

          <Form.Item
            name="insurance_provider"
            label="Insurance Provider"
            rules={[{ required: true, message: 'Please select insurance provider!' }]}
          >
            <Input placeholder="Enter provider name" />
          </Form.Item>

          <Form.Item
            name="insurance_expiry_date"
            label="Expiry Date"
            rules={[{ required: true, message: 'Please select expiry date!' }]}
          >
            <DatePicker 
              style={{ width: '100%' }} 
              format="DD/MM/YYYY"
              disabledDate={(current) => current && current < dayjs().startOf('day')}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default InsuranceProviders;