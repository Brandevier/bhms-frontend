import React, { useState } from "react";
import { Modal, Form, Select, InputNumber, Button, message, Spin, Tabs, Divider, Card } from "antd";
import { useSelector } from "react-redux";
import BhmsButton from "../heroComponents/BhmsButton";
import { SwapOutlined, AppstoreOutlined, UnorderedListOutlined } from "@ant-design/icons";

const { Option } = Select;
const { TabPane } = Tabs;

const DistributeStocks = ({ visible, onClose, onSubmit, loading }) => {
  const { departments } = useSelector((state) => state.departments);
  const { stockItems } = useSelector((state) => state.warehouse);

  const [selectedItem, setSelectedItem] = useState(null);
  const [remainingQuantity, setRemainingQuantity] = useState(0);
  const [activeTab, setActiveTab] = useState("single");
  const [selectedItems, setSelectedItems] = useState([]);
  const [form] = Form.useForm();

  // Handle item selection for single distribution
  const handleItemSelect = (value) => {
    const item = stockItems.stockItems.find((item) => item.id === value);
    if (item) {
      setSelectedItem(item);
      setRemainingQuantity(item.quantity);
    }
  };

  // Handle item selection for bulk distribution
  const handleBulkItemSelect = (values) => {
    const items = stockItems.stockItems.filter(item => values.includes(item.id));
    setSelectedItems(items);
  };

  // Handle form submission for single distribution
  const handleSingleSubmit = (values) => {
    if (values.quantity > remainingQuantity) {
      message.error("Entered quantity exceeds available stock!");
      return;
    }
    onSubmit(values);
    form.resetFields();
    setSelectedItem(null);
    setRemainingQuantity(0);
  };

  // Handle form submission for bulk distribution
  const handleBulkSubmit = (values) => {
    // Validate quantities
    for (const item of selectedItems) {
      const quantity = values[`quantity_${item.id}`];
      if (quantity > item.quantity) {
        message.error(`Quantity for ${item.item.name} exceeds available stock!`);
        return;
      }
    }
    
    // Prepare bulk data
    const bulkData = selectedItems.map(item => ({
      department_id: values.department_id,
      batch_id: item.id,
      quantity: values[`quantity_${item.id}`]
    }));
    
    onSubmit(bulkData);
    form.resetFields();
    setSelectedItems([]);
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <SwapOutlined style={{ marginRight: 10, fontSize: 20 }} />
          <span>Stock Distribution</span>
        </div>
      }
      visible={visible}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      width={700}
    >
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        centered
        style={{ marginBottom: 24 }}
      >
        <TabPane
          tab={
            <span>
              <UnorderedListOutlined />
              Single Item
            </span>
          }
          key="single"
        />
        <TabPane
          tab={
            <span>
              <AppstoreOutlined />
              Bulk Items
            </span>
          }
          key="bulk"
        />
      </Tabs>

      <Form 
        layout="vertical" 
        form={form} 
        onFinish={activeTab === "single" ? handleSingleSubmit : handleBulkSubmit}
      >
        {/* Department Selection (common for both modes) */}
        <Form.Item
          name="department_id"
          label="Destination Department"
          rules={[{ required: true, message: "Please select a department" }]}
        >
          <Select placeholder="Select department">
            {departments.map((dept) => (
              <Option key={dept.id} value={dept.id}>
                {dept.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Divider />

        {activeTab === "single" ? (
          <>
            {/* Single Item Distribution */}
            <Form.Item
              name="batch_id"
              label="Select Item"
              rules={[{ required: true, message: "Please select an item" }]}
            >
              <Select
                showSearch
                placeholder="Search and select item"
                onChange={handleItemSelect}
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {stockItems?.stockItems?.map((item) => (
                  <Option key={item.id} value={item.id}>
                    {item.item.name} (Batch: {item.batch_number}, Available: {item.quantity})
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {/* Show Remaining Quantity */}
            {selectedItem && (
              <Card size="small" style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <strong>Selected Item:</strong> {selectedItem.item.name}
                  </div>
                  <div>
                    <strong>Available:</strong> {remainingQuantity}
                  </div>
                </div>
              </Card>
            )}

            {/* Enter Quantity */}
            <Form.Item
              name="quantity"
              label="Quantity to Distribute"
              rules={[{ required: true, message: "Please enter quantity" }]}
            >
              <InputNumber
                min={1}
                max={remainingQuantity}
                style={{ width: "100%" }}
                placeholder="Enter quantity"
              />
            </Form.Item>
          </>
        ) : (
          <>
            {/* Bulk Items Distribution */}
            <Form.Item
              name="batch_ids"
              label="Select Multiple Items"
              rules={[{ required: true, message: "Please select at least one item" }]}
            >
              <Select
                mode="multiple"
                placeholder="Select multiple items"
                onChange={handleBulkItemSelect}
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {stockItems?.stockItems?.map((item) => (
                  <Option key={item.id} value={item.id}>
                    {item.item.name} (Batch: {item.batch_number}, Available: {item.quantity})
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {/* Quantity inputs for each selected item */}
            {selectedItems.length > 0 && (
              <Card title="Specify Quantities" size="small" style={{ marginBottom: 16 }}>
                {selectedItems.map(item => (
                  <Form.Item
                    key={item.id}
                    name={`quantity_${item.id}`}
                    label={`${item.item.name} (Available: ${item.quantity})`}
                    rules={[{ required: true, message: "Please enter quantity" }]}
                    style={{ marginBottom: 12 }}
                  >
                    <InputNumber
                      min={1}
                      max={item.quantity}
                      style={{ width: "100%" }}
                      placeholder={`Enter quantity for ${item.item.name}`}
                    />
                  </Form.Item>
                ))}
              </Card>
            )}
          </>
        )}

        <Divider />

        {/* Submit Button */}
        <Form.Item>
          <BhmsButton 
            type="primary" 
            htmlType="submit" 
            block 
            disabled={loading}
            style={{ height: 40 }}
          >
            {loading ? <Spin /> : `Distribute ${activeTab === "single" ? "Item" : "Items"}`}
          </BhmsButton>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DistributeStocks;