import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addBulkItems,
  fetchItems,
  fetchSuppliers,
  clearStoreError,
} from "../../../redux/slice/inventorySlice";
import {
  Table,
  Button,
  Card,
  Row,
  Col,
  Typography,
  Space,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  DatePicker,
  message,
} from "antd";
import {
  PlusOutlined,
  ReloadOutlined,
  ImportOutlined,
} from "@ant-design/icons";
import { useMediaQuery } from "react-responsive";
import moment from "moment";

const { Title } = Typography;
const { Option } = Select;

const InventoryIn = () => {
  const dispatch = useDispatch();
  const { itemsList, suppliers, addStockLoading, loading, error } = useSelector(
    (state) => state.warehouse
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const isMobile = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    dispatch(fetchItems({}));
    dispatch(fetchSuppliers({}));
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      message.error(error.message || "An error occurred");
      dispatch(clearStoreError());
    }
  }, [error, dispatch]);

  const handleRefresh = () => {
    dispatch(fetchItems({}));
  };

  const handleAddStock = () => {
    form.resetFields();
    setModalVisible(true);
  };

  const handleSubmit = (values) => {
    const data = {
      ...values,
      expiry_date: values.expiry_date?.format("YYYY-MM-DD"),
      manufacture_date: values.manufacture_date?.format("YYYY-MM-DD"),
    };

    dispatch(addBulkItems(data))
      .unwrap()
      .then(() => {
        message.success("Stock added successfully");
        setModalVisible(false);
        dispatch(fetchItems({}));
      })
      .catch((err) => {
        message.error(err.message || "Failed to add stock");
      });
  };

  const columns = [
    {
      title: "Item Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Unit",
      dataIndex: "unit",
      key: "unit",
    },
    {
      title: "Reorder Level",
      dataIndex: "reorder_level",
      key: "reorder_level",
    },
    {
      title: "Supplier",
      dataIndex: ["supplier", "name"],
      key: "supplier",
      render: (text) => text || "N/A",
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      render: (active) => (active ? "Active" : "Inactive"),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => moment(date).format("YYYY-MM-DD"),
    },
  ];

  return (
    <div style={{ padding: isMobile ? "8px" : "16px" }}>
      <Card>
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col>
            <Title level={4}>Inventory In (Receive Stock)</Title>
          </Col>
          <Col>
            <Space wrap>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
                loading={loading}
              >
                Refresh
              </Button>
              <Button
                type="primary"
                icon={<ImportOutlined />}
                onClick={handleAddStock}
              >
                Receive Stock
              </Button>
            </Space>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={itemsList}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={isMobile ? { x: true } : undefined}
          size={isMobile ? "small" : "middle"}
        />
      </Card>

      <Modal
        title="Receive Stock"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="item_id"
            label="Select Item"
            rules={[{ required: true, message: "Please select an item" }]}
          >
            <Select placeholder="Select item">
              {itemsList.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="quantity"
                label="Quantity"
                rules={[{ required: true, message: "Enter quantity" }]}
              >
                <InputNumber min={1} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="unit_cost"
                label="Unit Cost"
                rules={[{ required: true, message: "Enter unit cost" }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} prefix="$" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="batch_number" label="Batch Number">
                <Input placeholder="Auto-generated if empty" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="supplier_id" label="Supplier">
                <Select placeholder="Select supplier" allowClear>
                  {suppliers?.map((supplier) => (
                    <Option key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="manufacture_date" label="Manufacture Date">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="expiry_date"
                label="Expiry Date"
                rules={[{ required: true, message: "Select expiry date" }]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="location" label="Storage Location">
            <Input placeholder="e.g., Warehouse A, Shelf 3" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={addStockLoading}>
                Receive Stock
              </Button>
              <Button onClick={() => setModalVisible(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default InventoryIn;

