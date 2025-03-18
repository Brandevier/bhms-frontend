import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Space, message, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecordsByInstitution, createRecord, deleteRecord } from '../../../../redux/slice/recordSlice';
import BhmsButton from '../../../../heroComponents/BhmsButton';
import { useNavigate, useParams } from 'react-router-dom';
import PatientRegistrationModal from '../../../../modal/PatientRegistrationModal';
import { requestConsultation } from '../../../../redux/slice/consultationSlice';

const { Search } = Input;

const MaternityRegistration = () => {
    const dispatch = useDispatch();
    const { records, loading, totalPages, status } = useSelector((state) => state.records);
    const { consultationLoading } = useSelector((state) => ({
        consultationLoading: state.consultation?.loading ?? loading
    }));

    const [modalVisible, setModalVisible] = useState(false);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate()
    const { id } = useParams(); // Institution ID
    const limit = 10; // Items per page

    useEffect(() => {
        dispatch(fetchRecordsByInstitution({ page, limit }));
    }, [dispatch, page]);

    // Filter patients based on search term
    const filteredRecords = records?.patients?.filter((record) =>
        record.patient.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.patient.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.folder_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.serial_number?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];


    // MOVE PATIENT TO CONSULTATION DEPARTMENT
    const handleConsultation = (record_id) => {
        dispatch(requestConsultation(record_id))
            .unwrap()
            .then(() => {
                message.success("Consultation requested successfully");
                dispatch(fetchRecordsByInstitution());
                // navigate(`/shared/patient/details/${record_id}`)
            })
            .catch(() => message.error("Failed to request consultation"));

    }

    // Ant Design Table Columns
    const columns = [
        {
            title: 'Full Name',
            dataIndex: 'fullname',
            key: 'fullname',
            render: (_, record) => `${record.patient.first_name} ${record.patient.middle_name || ''} ${record.patient.last_name}`
        },
        {
            title: 'Folder Number',
            dataIndex: 'folder_number',
            key: 'folder_number'
        },
        {
            title: 'Serial Number',
            dataIndex: 'serial_number',
            key: 'serial_number',
            render: (serial_number) => serial_number || 'N/A'
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
            render: (_, record) => record.patient.gender
        },
        {
            title: 'Region',
            dataIndex: 'region',
            key: 'region',
            render: (_, record) => record.patient.city // Assuming city as region
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <div className='flex'>
                    <BhmsButton outline block={false} size='medium' onClick={() => navigate(`/shared/patient/details/${record?.id}`)}>View</BhmsButton>
                    <BhmsButton block={false} size='medium' className='mx-2' onClick={() => handleConsultation(record?.id)}>
                        {consultationLoading ? <Spin /> : 'Request Consultation'}
                    </BhmsButton>
                </div>
            )
        }
    ];



    const handleRegister = (patientData) => {
        const data = { ...patientData, department_id: id };
        dispatch(createRecord({ recordData: data, is_antenatal_patient: true }))
            .unwrap()
            .then(() => {
                message.success("Patient created successfully");
                dispatch(fetchRecordsByInstitution());
                setModalVisible(false);
            })
            .catch(() => message.error("Failed to create patient"));
    };

    // Handle Delete
    const handleDelete = (id) => {
        dispatch(deleteRecord(id))
            .unwrap()
            .then(() => {
                message.success("Record deleted successfully");
                dispatch(fetchRecordsByInstitution());
            })
            .catch(() => message.error("Failed to delete record"));
    };

    return (
        <div style={{ padding: 20 }}>
            {/* Search & Register Button */}
            <Space style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                <Search
                    placeholder="Search by name, folder number, or serial number"
                    allowClear

                    size="medium"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <BhmsButton block={false} size="medium" onClick={() => setModalVisible(true)}>Register Patient</BhmsButton>
            </Space>

            {/* Patient Table */}
            <Table
                columns={columns}
                dataSource={filteredRecords}
                rowKey="id"
                loading={loading}
                pagination={{
                    current: page,
                    total: totalPages * limit,
                    pageSize: limit,
                    onChange: (page) => setPage(page),
                }}
            />
            <PatientRegistrationModal visible={modalVisible} onClose={() => setModalVisible(false)} onSubmit={handleRegister} status={status} />

        </div>
    );
};

export default MaternityRegistration;
