import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  clearStoreError,
} from "../../../redux/slice/inventorySlice";
import {
  Table,
  Button,
  Tag,
  message,
  Popconfirm,
  Space,
  Modal,
  Form,
  Input,
  InputNumber,
  Switch,
  Card,
  Row,
  Col,
  Typography,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useMediaQuery } from "react-responsive";

const { Title, Text } = Typography;
const { Option } = Input;

const Suppliers = () => {
  const dispatch = useDispatch();
  const { suppliers, supplierLoading, error } = useSelector(
    (state) => state.warehouse
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();
  const isMobile = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    dispatch(fetchSuppliers({}));
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      message.error(error.message || "An error occurred");
      dispatch(clearStoreError());
    }
  }, [error, dispatch]);

  const handleRefresh = () => {
    dispatch(fetchSuppliers({}));
  };

  const handleSearch = (value) => {
    setSearchText(value);
    dispatch(fetchSuppliers({ search: value }));
  };

  const handleAdd = () => {
    setEditingSupplier(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingSupplier(record);
    form.setFieldsValue({
      name: record.name,
      contact_person: record.contact_person,
      email: record.email,
      phone: record.phone,
      address: record.address,
      notes: record.notes,
      is_active: record.is_active,
    });
    setModalVisible(true);
  };

  const handleDelete = (id) => {
    dispatch(deleteSupplier(id))
      .unwrap()
      .then(() => {
        message.success("Supplier deleted successfully");
        dispatch(fetchSuppliers({}));
      })
      .catch((err) => {
        message.error(err.message || "Failed to delete supplier");
      });
  };

  const handleSubmit = (values) => {
    if (editingSupplier) {
      dispatch(
        updateSupplier({
          id: editingSupplier.id,
          data: values,
        })
      )
        .unwrap()
        .then(() => {
          message.success("Supplier updated successfully");
          setModalVisible(false);
          dispatch(fetchSuppliers({}));
        })
        .catch((err) => {
          message.error(err.message || "Failed to update supplier");
        });
    } else {
      dispatch(createSupplier(values))
        .unwrap()
        .then(() => {
          message.success("Supplier created successfully");
          setModalVisible(false);
          dispatch(fetchSuppliers({}));
        })
        .catch((err) => {
          message.error(err.message || "Failed to create supplier");
        });
    }
  };

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.name?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Contact Person",
      dataIndex: "contact_person",
      key: "contact_person",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      render: (active) => (
        <Tag color={active ? "green" : "red"}>
          {active ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this supplier?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: isMobile ? "8px" : "16px" }}>
      <Card>
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col>
            <Title level={4}>Suppliers</Title>
          </Col>
          <Col>
            <Space wrap>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
                loading={supplierLoading}
              >
                Refresh
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
              >
                Add Supplier
              </Button>
            </Space>
          </Col>
        </Row>

        <div style={{ marginBottom: 16, marginTop: 16 }}>
          <Input
            placeholder="Search suppliers..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            allowClear
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredSuppliers}
          rowKey="id"
          loading={supplierLoading}
          pagination={{ pageSize: 10 }}
          scroll={isMobile ? { x: true } : undefined}
          size={isMobile ? "small" : "middle"}
        />
      </Card>

      <Modal
        title={editingSupplier ? "Edit Supplier" : "Add Supplier"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            is_active: true,
          }}
        >
          <Form.Item
            name="name"
            label="Supplier Name"
            rules={[{ required: true, message: "Please enter supplier name" }]}
          >
            <Input placeholder="Enter supplier name" />
          </Form.Item>

          <Form.Item name="contact_person" label="Contact Person">
            <Input placeholder="Enter contact person name" />
          </Form.Item>

          <Form.Item name="email" label="Email">
            <Input placeholder="Enter email address" type="email" />
          </Form.Item>

          <Form.Item name="phone" label="Phone">
            <Input placeholder="Enter phone number" />
          </Form.Item>

          <Form.Item name="address" label="Address">
            <Input.TextArea placeholder="Enter address" rows={2} />
          </Form.Item>

          <Form.Item name="notes" label="Notes">
            <Input.TextArea placeholder="Enter notes" rows={2} />
          </Form.Item>

          <Form.Item name="is_active" label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={supplierLoading}>
                {editingSupplier ? "Update" : "Create"}
              </Button>
              <Button onClick={() => setModalVisible(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Suppliers;

