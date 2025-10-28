import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Card, 
  Button, 
  Space, 
  Typography, 
  Tag, 
  Popconfirm, 
  message,
  Input,
  Badge,
  Divider,
  Dropdown,
  Menu
} from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  MoreOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import CreateTemplatePage from './CreateTemplatePage';
import { fetchTemplates,deleteTemplate } from '../../../../redux/slice/labSlice';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

const { Title, Text } = Typography;
const { Column } = Table;

const TemplateManagementPage = () => {
  const { templates, loading } = useSelector((state) => state.lab);
  const [searchText, setSearchText] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTemplates());
  }, [dispatch]);

  const handleSearch = (e) => {
    setSearchText(e.target.value.toLowerCase());
  };

  const filteredTemplates = templates?.filter(template => 
    template?.lab_tarrif?.test_description.toLowerCase().includes(searchText) || 
    template?.description.toLowerCase().includes(searchText)
  );

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteTemplate(id)).unwrap();
      message.success('Template deleted successfully');
      dispatch(fetchTemplates());
    } catch (error) {
      message.error('Failed to delete template');
    }
  };

  const getFieldTypeTag = (type) => {
    const typeMap = {
      text: { color: 'blue', label: 'Text' },
      number: { color: 'cyan', label: 'Number' },
      select: { color: 'purple', label: 'Dropdown' },
      checkbox: { color: 'orange', label: 'Checkbox' },
      radio: { color: 'green', label: 'Radio' },
      date: { color: 'red', label: 'Date' },
      textarea: { color: 'geekblue', label: 'Long Text' }
    };
    const info = typeMap[type] || { color: 'default', label: type };
    return <Tag color={info.color}>{info.label}</Tag>;
  };

  const actionMenu = (template) => (
    <Menu>
      <Menu.Item 
        key="duplicate" 
        icon={<FileTextOutlined />}
        onClick={() => message.info('Duplicate functionality would go here')}
      >
        Duplicate
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="delete" danger icon={<DeleteOutlined />}>
        <Popconfirm
          title="Are you sure you want to delete this template?"
          onConfirm={() => handleDelete(template.id)}
          okText="Yes"
          cancelText="No"
        >
          Delete
        </Popconfirm>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="template-management">
      <Card>
        <div className="header-section">
          <Title level={4} style={{ marginBottom: 0 }}>Test Templates</Title>
          <Space>
            <Input
              placeholder="Search templates..."
              prefix={<SearchOutlined />}
              onChange={handleSearch}
              style={{ width: 250 }}
              allowClear
            />
          </Space>
        </div>

        <Divider style={{ margin: '16px 0' }} />

        <Table
          dataSource={filteredTemplates}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          expandable={{
            expandedRowRender: template => (
              <div style={{ margin: 0 }}>
                <Text strong style={{ display: 'block', marginBottom: 8 }}>Fields:</Text>
                <div className="field-list">
                  {template.fields?.map((field, index) => (
                    <div key={index} className="field-item">
                      <Space size="middle">
                        <Badge count={field.required ? 'R' : null} style={{ backgroundColor: field.required ? '#52c41a' : '#d9d9d9' }} />
                        <Text strong>{field.label}</Text>
                        {getFieldTypeTag(field.fieldType)}
                        {field.options && (
                          <Text type="secondary">
                            Options: {field.options.map(opt => opt.label).join(', ')}
                          </Text>
                        )}
                      </Space>
                    </div>
                  ))}
                </div>
              </div>
            ),
            rowExpandable: template => template.fields?.length > 0
          }}
        >
          <Column 
            title="Test Name" 
            key="test_description" 
            render={(_, record) => (
              <Link to={`/templates/${record.id}`}>
                <Text strong>{record.lab_tarrif?.test_description}</Text>
              </Link>
            )}
          />
          <Column 
            title="Description" 
            dataIndex="description" 
            key="description" 
            ellipsis
          />
          <Column 
            title="NHIA Price (GHC)" 
            key="tariff_ghc"
            render={(_, record) => (
              <Text>{record.lab_tarrif?.tariff_ghc}</Text>
            )}
          />
          <Column 
            title="Market Price (GHC)" 
            key="market_price"
            render={(_, record) => (
              <Text>{record.lab_tarrif?.market_price}</Text>
            )}
          />
          <Column 
            title="Fields" 
            key="fields" 
            render={(_, record) => (
              <Text>{record.fields?.length || 0} fields</Text>
            )}
          />
          <Column 
            title="Last Updated" 
            dataIndex="updatedAt" 
            key="updatedAt" 
            render={date => moment(date).format('LL')}
          />
          <Column
            title="Actions"
            key="actions"
            align="right"
            render={(_, record) => (
              <Dropdown overlay={actionMenu(record)} trigger={['click']}>
                <Button type="text" icon={<MoreOutlined />} />
              </Dropdown>
            )}
          />
        </Table>
      </Card>

      <style jsx>{`
        .template-management {
          margin: 0 auto;
          padding: 24px;
        }
        .header-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .field-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 8px;
        }
        .field-item {
          background: #fafafa;
          padding: 8px 12px;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default TemplateManagementPage;