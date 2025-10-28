// components/maternity/ANCTable.js
import React, { useState } from 'react';
import { Table, Button, Tag, Space, Spin } from 'antd';
import { UserAddOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ANCRegistrationModal from './ANCRegistrationModal';

const ANCTable = ({ data, loading,onSave }) => {
    const navigate = useNavigate();
    const [selectedVisitId, setSelectedVisitId] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const handleNavigate = (id) => {
        navigate(`/shared/patient/details/${id}`, { id: id });
    };

    const handleRegisterANC = (visitId) => {
        setSelectedVisitId(visitId);
        setModalVisible(true);
    };

    const handleModalClose = () => {
        setModalVisible(false);
        setSelectedVisitId(null);
    };

    const handleSuccess = () => {
        onSave?.();
        setModalVisible(false);
        setSelectedVisitId(null);
        // You might want to refresh the data here or use a callback prop
    };

    const columns = [
        {
            title: 'Attendance No.',
            dataIndex: 'attendance_number',
            key: 'attendance_number',
            sorter: (a, b) => a.attendance_number.localeCompare(b.attendance_number),
        },
        {
            title: 'Folder No.',
            dataIndex: 'patient',
            key: 'folder_number',
            render: (patient) => patient?.folder_number,
        },
        {
            title: 'Patient Name',
            dataIndex: 'patient',
            key: 'patient_name',
            render: (patient) => `${patient?.first_name} ${patient?.middle_name || ''} ${patient?.last_name}`,
            sorter: (a, b) => {
                const nameA = `${a.patient?.first_name} ${a.patient?.last_name}`;
                const nameB = `${b.patient?.first_name} ${b.patient?.last_name}`;
                return nameA.localeCompare(nameB);
            },
        },
        {
            title: 'Age',
            dataIndex: 'patient',
            key: 'age',
            render: (patient) => {
                if (!patient?.date_of_birth) return 'N/A';
                const birthDate = new Date(patient.date_of_birth);
                const today = new Date();
                return today.getFullYear() - birthDate.getFullYear();
            },
        },
        {
            title: 'Gender',
            dataIndex: 'patient',
            key: 'gender',
            render: (patient) => patient?.gender || 'N/A',
        },
        {
            title: 'Visit Type',
            dataIndex: 'visit_type',
            key: 'visit_type',
            render: (value) => <Tag color="blue">{value}</Tag>,
            filters: [
                { text: 'Maternity', value: 'Maternity' },
                { text: 'General OPD', value: 'General OPD' },
            ],
            onFilter: (value, record) => record.visit_type.includes(value),
        },
        {
            title: 'Attendance Type',
            dataIndex: 'attendance_type',
            key: 'attendance_type',
            render: (value) => (
                <Tag color={
                    value === 'New' ? 'green' :
                        value === 'Follow-up' ? 'orange' :
                            value === 'Emergency' ? 'red' :
                                value === 'Referral' ? 'purple' : 'blue'
                }>
                    {value}
                </Tag>
            ),
            filters: [
                { text: 'New', value: 'New' },
                { text: 'Follow-up', value: 'Follow-up' },
                { text: 'Emergency', value: 'Emergency' },
                { text: 'Referral', value: 'Referral' },
                { text: 'Transfer', value: 'Transfer' },
            ],
            onFilter: (value, record) => record.attendance_type.includes(value),
        },
        {
            title: 'ANC Status',
            dataIndex: 'anc_record',
            key: 'anc_status',
            render: (anc_record) => (
                <Tag color={anc_record ? 'green' : 'orange'}>
                    {anc_record ? 'Registered' : 'Not Registered'}
                </Tag>
            ),
            filters: [
                { text: 'Registered', value: true },
                { text: 'Not Registered', value: false },
            ],
            onFilter: (value, record) => !!record.anc_record === value,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (value) => (
                <Tag color={value === 'Active' ? 'green' : 'red'}>
                    {value}
                </Tag>
            ),
            filters: [
                { text: 'Active', value: 'Active' },
                { text: 'Inactive', value: 'Inactive' },
            ],
            onFilter: (value, record) => record.status.includes(value),
        },
        {
            title: 'Visit Date',
            dataIndex: 'visit_date',
            key: 'visit_date',
            render: (date) => date ? new Date(date).toLocaleDateString() : 'N/A',
            sorter: (a, b) => new Date(a.visit_date) - new Date(b.visit_date),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    {!record.anc_record && (
                        <Button 
                            type="primary" 
                            icon={<UserAddOutlined />} 
                            size="small"
                            onClick={() => handleRegisterANC(record.id)}
                        >
                            Register ANC
                        </Button>
                    )}
                    <Button 
                        type="default" 
                        icon={<EyeOutlined />} 
                        size="small" 
                        onClick={() => handleNavigate(record.id)}
                    >
                        View Details
                    </Button>
                </Space>
            ),
        },
    ];

    if (loading) {
        return (
            <div className="flex justify-center items-center h-40">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <>
            <Table
                dataSource={data}
                columns={columns}
                rowKey="id"
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} of ${total} patients`
                }}
                scroll={{ x: 1000 }}
            />
            
            <ANCRegistrationModal
                visitId={selectedVisitId}
                visible={modalVisible}
                onCancel={handleModalClose}
                onSuccess={handleSuccess}
            />
        </>
    );
};

export default ANCTable;