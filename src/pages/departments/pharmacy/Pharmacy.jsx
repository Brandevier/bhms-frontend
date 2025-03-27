import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Space, Tag } from 'antd';
import { fetchPrescriptionsByInstitution, approvePrescription, deletePrescription } from '../../../redux/slice/prescriptionSlice';
import BhmsButton from '../../../heroComponents/BhmsButton';

const Pharmacy = () => {
    const dispatch = useDispatch();
    const { prescriptions, status: loading } = useSelector((state) => state.prescription);
    const [loadingState, setLoadingState] = useState({});

    useEffect(() => {
        dispatch(fetchPrescriptionsByInstitution());
    }, [dispatch]);

    const handleApprove = async (id,patientId) => {
        setLoadingState((prev) => ({ ...prev, [id]: true }));
        try {
            await dispatch(approvePrescription({  prescriptionId:id, patientId })).unwrap();
            dispatch(fetchPrescriptionsByInstitution());
        } finally {
            setLoadingState((prev) => ({ ...prev, [id]: false }));
        }
    };

    const handleReject = async (id) => {
        setLoadingState((prev) => ({ ...prev, [id]: true }));
        try {
            await dispatch(deletePrescription(id)).unwrap();
            dispatch(fetchPrescriptionsByInstitution());
        } finally {
            setLoadingState((prev) => ({ ...prev, [id]: false }));
        }
    };

    const columns = [
        {
            title: 'Patient',
            dataIndex: 'patient',
            key: 'patient',
            render: (patient) => `${patient?.first_name} ${patient?.last_name}`,
        },
        {
            title: 'Prescription',
            dataIndex: 'prescriptions',
            key: 'prescriptions',
        },
        {
            title: 'Dosage',
            dataIndex: 'dosage',
            key: 'dosage',
        },
        {
            title: 'Frequency',
            dataIndex: 'frequency',
            key: 'frequency',
        },
        {
            title: 'Refills Left',
            dataIndex: 'refills_left',
            key: 'refills_left',
        },
        {
            title: 'Priority',
            dataIndex: 'priority',
            key: 'priority',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'approved' ? 'green' : status === 'pending' ? 'orange' : 'red'}>
                    {status.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    {record.status === 'pending' ? (
                        <>
                            <BhmsButton
                                type="primary"
                                loading={loadingState[record.id]}
                                onClick={() => handleApprove(record.id,record?.patient?.id)}
                            >
                                Approve
                            </BhmsButton>
                            <BhmsButton
                                type="danger"
                                outline
                                loading={loadingState[record.id]}
                                onClick={() => handleReject(record.id)}
                            >
                                Reject
                            </BhmsButton>
                        </>
                    ) : record.status === 'approved' ? (
                        <BhmsButton type="default" onClick={() => console.log(`Viewing prescription ${record.id}`)}>
                            Completed
                        </BhmsButton>
                    ) : null}
                </Space>
            ),
        },
    ];

    return (
        <div>
            <h2>Pharmacy Prescriptions</h2>
            <Table columns={columns} dataSource={prescriptions} rowKey="id" loading={loading} />
        </div>
    );
};

export default Pharmacy;