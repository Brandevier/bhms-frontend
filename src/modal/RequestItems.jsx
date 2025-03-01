import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getStockItems } from '../redux/slice/inventorySlice';
import { Modal, Select, Input, Button, Form, message, Spin, InputNumber } from 'antd';
import BhmsButton from '../heroComponents/BhmsButton';

const { Option } = Select;
const { TextArea } = Input;

const RequestItems = ({ visible, onClose, onSubmit }) => {
    const dispatch = useDispatch();
    const { departments } = useSelector((state) => state.departments);
    const { stockItems, loading,requestItemLoading,error } = useSelector((state) => state.warehouse);

    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [quantityRequested, setQuantityRequested] = useState(1); // Default to 1
    const [additionalMessage, setAdditionalMessage] = useState('');

    useEffect(() => {
        if (selectedDepartment) {
            dispatch(getStockItems({ store_id: selectedDepartment }));
        }
    }, [selectedDepartment, dispatch]);

    // Filter only Store type departments
    const storeDepartments = departments?.filter((dept) => dept.departmentType === 'Store');

    const handleRequestSubmit = () => {
        if (!selectedDepartment || !selectedItem || !quantityRequested) {
            message.error('Please select department, item, and enter a valid quantity.');
            return;
        }

        // Create request payload
        const requestData = {
            store_id: selectedDepartment,
            item_batch_id: selectedItem,
            quantity_requested: quantityRequested,
            description: additionalMessage,
        };

        // Pass data to parent component's onSubmit function
        onSubmit(requestData);
    };

    return (
        <Modal
            title="Request Item"
            open={visible}
            onCancel={onClose}
            footer={[
                <BhmsButton block={false} size="medium" outline key="cancel" onClick={onClose}>
                    Cancel
                </BhmsButton>,
                <BhmsButton block={false} key="submit" size="medium" type="primary" onClick={handleRequestSubmit}>
                    {requestItemLoading? <Spin/> : 'Submit Request'}
                </BhmsButton>,
            ]}
        >
            <Form layout="vertical">
                {/* Select Department */}
                <Form.Item label="Select Department">
                    <Select
                        placeholder="Select a store department"
                        onChange={setSelectedDepartment}
                        value={selectedDepartment}
                    >
                        {storeDepartments.map((dept) => (
                            <Option key={dept.id} value={dept.id}>
                                {dept.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* Select Item (Shows Spinner when loading) */}
                <Form.Item label="Select Item">
                    <Select
                        placeholder={loading ? "Loading items..." : "Select an item"}
                        onChange={setSelectedItem}
                        value={selectedItem}
                        disabled={!selectedDepartment || loading}
                        loading={loading} // Shows Ant Design spinner
                        notFoundContent={loading ? <Spin size="small" /> : "No items found"}
                    >
                        {stockItems?.stockItems?.map((item) => (
                            <Option key={item.id} value={item.id}>
                                {item.item?.name || 'Unnamed Item'}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* Quantity Requested */}
                <Form.Item label="Quantity Requested">
                    <InputNumber
                        min={1}
                        value={quantityRequested}
                        onChange={setQuantityRequested}
                        style={{ width: "100%" }}
                    />
                </Form.Item>

                {/* Additional Message */}
                <Form.Item label="Additional Message">
                    <TextArea
                        rows={3}
                        placeholder="Enter any additional details"
                        value={additionalMessage}
                        onChange={(e) => setAdditionalMessage(e.target.value)}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default RequestItems;
