import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPurchaseOrders,
  createPurchaseOrder,
  clearStoreError,
} from "../../../redux/slice/inventorySlice";
import {
  Table,
  Button,
  Tag,
  message,
  Card,
  Row,
  Col,
  Typography,
  Space,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Popconfirm,
} from "antd";
import {
  PlusOutlined,
  ReloadOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useMediaQuery } from "react-responsive";
import moment from "moment";

const { Title } = Typography;
const { Option } = Select;

const PurchaseOrders = () => {
  const dispatch = useDispatch();
  const { purchaseOrders, purchaseOrderLoading, error, suppliers } = useSelector(
    (state) => state.warehouse
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const isMobile = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    dispatch(fetchPurchaseOrders({}));
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      message.error(error.message || "An error occurred");
      dispatch(clearStoreError());
    }
  }, [error, dispatch]);

  const handleRefresh = () => {
    dispatch(fetchPurchaseOrders({}));
  };

  const handleAdd = () => {
    form.resetFields();
    setModalVisible(true);
  };

  const handleSubmit = (values) => {
    const data = {
      ...values,
      expected_delivery_date: values.expected_delivery_date?.format("YYYY-MM-DD"),
      items: [],
    };

    dispatch(createPurchaseOrder(data))
      .unwrap()
      .then(() => {
        message.success("Purchase order created successfully");
        setModalVisible(false);
        dispatch(fetchPurchaseOrders({}));
      })
      .catch((err) => {
        message.error(err.message || "Failed to create purchase order");
      });
  };

  const statusColors = {
    pending: "orange",
    approved: "blue",
    received: "green",
    cancelled: "red",
  };

  const columns = [
    {
      title: "Order #",
      dataIndex: "id",
      key: "id",
      render: (text) => <strong>{text?.substring(0, 8)}</strong>,
    },
    {
      title: "Supplier",
      dataIndex: ["supplier", "name"],
      key: "supplier",
      render: (text) => text || "N/A",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={statusColors[status] || "default"}>
          {status?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Expected Delivery",
      dataIndex: "expected_delivery_date",
      key: "expected_delivery_date",
      render: (date) => (date ? moment(date).format("YYYY-MM-DD") : "N/A"),
    },
    {
      title: "Total Items",
      dataIndex: "items",
      key: "items",
      render: (items) => items?.length || 0,
    },
    {
      title: "Created By",
      dataIndex: "ordered_by",
      key: "ordered_by",
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => moment(date).format("YYYY-MM-DD"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            size="small"
          >
            View
          </Button>
          {record.status === "pending" && (
            <>
              <Button
                type="link"
                icon={<CheckOutlined />}
                size="small"
                style={{ color: "green" }}
              >
                Approve
              </Button>
              <Button
                type="link"
                icon={<CloseOutlined />}
                size="small"
                danger
              >
                Cancel
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: isMobile ? "8px" : "16px" }}>
      <Card>
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col>
            <Title level={4}>Purchase Orders</Title>
          </Col>
          <Col>
            <Space wrap>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
                loading={purchaseOrderLoading}
              >
                Refresh
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
              >
                New Order
              </Button>
            </Space>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={purchaseOrders}
          rowKey="id"
          loading={purchaseOrderLoading}
          pagination={{ pageSize: 10 }}
          scroll={isMobile ? { x: true } : undefined}
          size={isMobile ? "small" : "middle"}
        />
      </Card>

      <Modal
        title="Create Purchase Order"
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
            name="supplier_id"
            label="Supplier"
            rules={[{ required: true, message: "Please select a supplier" }]}
          >
            <Select placeholder="Select supplier">
              {suppliers?.map((supplier) => (
                <Option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="expected_delivery_date"
            label="Expected Delivery Date"
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="notes" label="Notes">
            <Input.TextArea placeholder="Enter notes" rows={3} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={purchaseOrderLoading}>
                Create Order
              </Button>
              <Button onClick={() => setModalVisible(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PurchaseOrders;

