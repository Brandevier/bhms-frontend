import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Button, Modal, Form, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import CarePlanCard from './common/CarePlanCard';
import CarePlanForm from './common/CarePlanForm';
import { getAllStaff } from "../../redux/slice/staff_admin_managment_slice";

import {
    fetchCarePlans,
    createCarePlan,
    updateCarePlan,
    clearError,
    clearSuccess
} from "../../redux/slice/carePlanSlice";




const CarePlan = ({ visit_id,institution_id }) => {
    const dispatch = useDispatch();
    const { carePlans, loading, error, success } = useSelector(state => state.carePlan);
    const { user } = useSelector((state)=>state.auth)
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);
    const [form] = Form.useForm();
    const { allStaffs,loading:staffLoading } = useSelector((state)=>state.adminStaffManagement)



    useEffect(() => {
        dispatch(fetchCarePlans({ visit_id, institution_id }));
        dispatch(getAllStaff())
    }, [dispatch, visit_id, institution_id]);

    useEffect(() => {
        if (error) {
            message.error(error);
            dispatch(clearError());
        }
    }, [error, dispatch]);

    useEffect(() => {
        if (success) {
            message.success('Operation completed successfully!');
            dispatch(clearSuccess());
        }
    }, [success, dispatch]);

    const showModal = (plan = null) => {
        setEditingPlan(plan);
        if (plan) {
            form.setFieldsValue(plan);
        } else {
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    const handleOk = () => {
        form.validateFields().then(values => {
            if (editingPlan) {
                dispatch(updateCarePlan({
                    carePlanId: editingPlan.id,
                    carePlanData: values
                }));
            } else {
                dispatch(createCarePlan({
                    ...values,
                    visit_id,
                    institution_id,
                    staff_id: user.id // Replace with actual staff ID
                }));
            }
            setIsModalVisible(false);
            form.resetFields();
            setEditingPlan(null);
        });
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
        setEditingPlan(null);
    };

    if (loading) {
        return <div className="p-6">Loading care plans...</div>;
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Patient Care Plan</h2>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    size="large"
                    onClick={() => showModal()}
                    className="bg-blue-600 hover:bg-blue-700 border-blue-600"
                    loading={loading}
                >
                    Add Care Plan
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {carePlans.map((plan) => (
                    <CarePlanCard
                        key={plan.id}
                        plan={plan}
                        onEdit={showModal}
                    />
                ))}

                {carePlans.length === 0 && (
                    <div className="col-span-2 text-center py-12">
                        <p className="text-gray-500 text-lg">No care plans found</p>
                        <Button
                            type="primary"
                            onClick={() => showModal()}
                            className="mt-4"
                        >
                            Create First Care Plan
                        </Button>
                    </div>
                )}
            </div>

            <Modal
                title={editingPlan ? "Edit Care Plan" : "Add New Care Plan"}
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                confirmLoading={loading}
                footer={[
                    <Button key="cancel" onClick={handleCancel} disabled={loading}>
                        Cancel
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={handleOk}
                        loading={loading}
                        className="bg-blue-600 hover:bg-blue-700 border-blue-600"
                    >
                        {editingPlan ? "Update" : "Add"} Care Plan
                    </Button>,
                ]}
                width={700}
            >
                <CarePlanForm form={form} staffs={allStaffs}/>
            </Modal>
        </div>
    );
};

export default CarePlan;