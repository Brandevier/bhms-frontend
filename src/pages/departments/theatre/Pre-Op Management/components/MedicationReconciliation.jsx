import React, { useState } from 'react';
import { Table, Card, Button, Form, Input, Select, Space, Tag, Popconfirm } from 'antd';
import { 
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined
} from '@ant-design/icons';

const { Option } = Select;

const MedicationReconciliation = ({ patient }) => {
  const [form] = Form.useForm();
  const [medications, setMedications] = useState([
    {
      key: '1',
      name: 'Lisinopril',
      dose: '10 mg',
      frequency: 'Daily',
      route: 'PO',
      indication: 'Hypertension',
      status: 'continue'
    },
    {
      key: '2',
      name: 'Metformin',
      dose: '500 mg',
      frequency: 'BID',
      route: 'PO',
      indication: 'Type 2 Diabetes',
      status: 'hold'
    },
    {
      key: '3',
      name: 'Ibuprofen',
      dose: '400 mg',
      frequency: 'PRN',
      route: 'PO',
      indication: 'Pain',
      status: 'discontinue'
    },
  ]);
  const [editingKey, setEditingKey] = useState('');

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      name: '',
      dose: '',
      frequency: '',
      route: '',
      indication: '',
      status: '',
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...medications];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setMedications(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setMedications(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const handleAdd = () => {
    const newKey = `new-${Date.now()}`;
    setMedications([
      ...medications,
      {
        key: newKey,
        name: '',
        dose: '',
        frequency: '',
        route: '',
        indication: '',
        status: 'continue'
      }
    ]);
    edit({ key: newKey });
  };

  const handleDelete = (key) => {
    setMedications(medications.filter(item => item.key !== key));
  };

  const getStatusTag = (status) => {
    switch(status) {
      case 'continue':
        return <Tag icon={<CheckOutlined />} color="green">Continue</Tag>;
      case 'hold':
        return <Tag icon={<CloseOutlined />} color="orange">Hold</Tag>;
      case 'discontinue':
        return <Tag color="red">Discontinue</Tag>;
      default:
        return <Tag>Unknown</Tag>;
    }
  };

  const columns = [
    {
      title: 'Medication',
      dataIndex: 'name',
      key: 'name',
      editable: true,
      render: (text, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Medication is required' }]}
          >
            <Input placeholder="Medication name" />
          </Form.Item> 

        ) : (
          <span className="font-medium">{text}</span>
        );
      },
    },
    {
      title: 'Dose',
      dataIndex: 'dose',
      key: 'dose',
      editable: true,
      render: (text, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Form.Item
            name="dose"
            rules={[{ required: true, message: 'Dose is required' }]}
          >
            <Input placeholder="Dose" />
          </Form.Item>
        ) : (
          text
        );
      },
    },
    {
      title: 'Frequency',
      dataIndex: 'frequency',
      key: 'frequency',
      editable: true,
      render: (text, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Form.Item
            name="frequency"
            rules={[{ required: true, message: 'Frequency is required' }]}
          >
            <Select placeholder="Select frequency">
              <Option value="Daily">Daily</Option>
              <Option value="BID">BID</Option>
              <Option value="TID">TID</Option>
              <Option value="QID">QID</Option>
              <Option value="PRN">PRN</Option>
            </Select>
          </Form.Item>
        ) : (
          text
        );
      },
    },
    {
      title: 'Route',
      dataIndex: 'route',
      key: 'route',
      editable: true,
      render: (text, record) => {
        const editable = isEditing(record); 
        return editable ? ( 
          <Form.Item
            name="route"
            rules={[{ required: true, message: 'Route is required' }]}
          >
            <Select placeholder="Select route">
              <Option value="PO">PO</Option>
              <Option value="IV">IV</Option>
              <Option value="IM">IM</Option>
              <Option value="SC">SC</Option>
              <Option value="Topical">Topical</Option>
            </Select>
          </Form.Item>
        ) : (
          text
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      editable: true,
      render: (text, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Form.Item
            name="status"
            rules={[{ required: true, message: 'Status is required' }]}
          >
            <Select placeholder="Select status">
              <Option value="continue">Continue</Option>
              <Option value="hold">Hold</Option>
              <Option value="discontinue">Discontinue</Option>
            </Select>
          </Form.Item>
        ) : (
          getStatusTag(text)
        );
      },
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Space>
            <Button
              type="link"
              onClick={() => save(record.key)}
              size="small"
            >
              Save
            </Button>
            <Button
              type="text"
              onClick={cancel}
              size="small"
            >
              Cancel
            </Button>
          </Space>
        ) : (
          <Space>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => edit(record)}
              size="small"
            />
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => handleDelete(record.key)}
            >
              <Button
                type="text"
                icon={<DeleteOutlined />}
                size="small"
              />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">
          Medication Reconciliation for {patient.name}
        </h2>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Add Medication
        </Button>
      </div>
      
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={medications}
          columns={columns}
          rowClassName="editable-row"
          pagination={false}
          size="middle"
        />
      </Form>
      
      <Card title="Reconciliation Summary" className="mt-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-gray-600">Medications to Continue</div>
            <div className="text-2xl font-bold text-green-600">
              {medications.filter(m => m.status === 'continue').length}
            </div>
          </div>
          <div>
            <div className="text-gray-600">Medications to Hold</div>
            <div className="text-2xl font-bold text-orange-600">
              {medications.filter(m => m.status === 'hold').length}
            </div>
          </div>
          <div>
            <div className="text-gray-600">Medications to Discontinue</div>
            <div className="text-2xl font-bold text-red-600">
              {medications.filter(m => m.status === 'discontinue').length}
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="text-gray-600 mb-2">Reconciliation Verified By:</div>
          <div className="flex items-center">
            <Input placeholder="Provider name" style={{ width: 200 }} className="mr-2" />
            <Button type="primary">Sign</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

// EditableCell component for the table
const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
        >
          {children}
        </Form.Item> 
      ) : (
        children
      )}
    </td>
  );
};

export default MedicationReconciliation;