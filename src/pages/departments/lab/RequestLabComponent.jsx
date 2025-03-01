import React, { useEffect, useState } from 'react';
import { fetchLabResultsByStatus, acceptLabRequest } from '../../../redux/slice/labSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Input, Tooltip, Badge, message, Spin } from 'antd';
import { SearchOutlined, MessageOutlined } from '@ant-design/icons';
import BhmsButton from '../../../heroComponents/BhmsButton';

const RequestLabComponent = () => {
    const dispatch = useDispatch();
    const { labResults, loading, currentPage, totalPages, totalItems } = useSelector((state) => state.lab);
    const [searchText, setSearchText] = useState('');
    const [loadingRow, setLoadingRow] = useState(null); // Track loading per row
    const [currentPageState, setCurrentPageState] = useState(1); // Local state for current page

    useEffect(() => {
        // Fetch lab results for the current page
        dispatch(fetchLabResultsByStatus({ status: 'requested', page: currentPageState }));
    }, [dispatch, currentPageState]);

    // Handle pagination change
    const handlePageChange = (page) => {
        setCurrentPageState(page); // Update the current page
    };

    // Filter data based on search text
    const filteredData = labResults.filter((item) =>
        item.patient?.first_name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.patient?.middle_name?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.patient?.last_name.toLowerCase().includes(searchText.toLowerCase())
    );

    // Approve lab request
    const approveLabRequest = (test) => {
        setLoadingRow(test.id); // Set loading state for this row
        dispatch(acceptLabRequest({ labResultId: test.id }))
            .unwrap()
            .then(() => {
                message.success('Lab results approved successfully');
                dispatch(fetchLabResultsByStatus({ status: 'requested', page: currentPageState })); // Refetch current page
            })
            .catch(() => message.error('Failed to approve'))
            .finally(() => setLoadingRow(null)); // Reset loading after request completes
    };

    // Table columns
    const columns = [
        {
            title: 'Full Name',
            dataIndex: 'fullName',
            key: 'fullName',
            render: (_, record) => `${record.patient?.first_name} ${record.patient?.middle_name || ''} ${record.patient?.last_name}`,
        },
        {
            title: 'Test Name',
            dataIndex: 'test_name',
            key: 'test_name',
            render: (_, record) => record.test_name?.test_name || 'N/A',
        },
        {
            title: 'Staff ID',
            dataIndex: 'staff_id',
            key: 'staff_id',
            render: (_, record) => `${record.staff?.firstName} ${record.staff?.lastName}` || 'N/A',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => <span style={{ color: 'blue', fontWeight: 'bold' }}>{status}</span>,
        },
        {
            title: 'Comment',
            dataIndex: 'comment',
            key: 'comment',
            render: (_, record) => (
                <Tooltip title={record.comment ? record.comment : 'No comments'}>
                    <Badge dot={!!record.comment}>
                        <MessageOutlined style={{ fontSize: 16, cursor: 'pointer' }} />
                    </Badge>
                </Tooltip>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <div>
                    <BhmsButton
                        block={false}
                        size="medium"
                        className='mx-2'
                        onClick={() => approveLabRequest(record)}
                        disabled={loadingRow === record.id} // Disable only the clicked button
                    >
                        {loadingRow === record.id ? <Spin /> : 'Approve'}
                    </BhmsButton>
                    <BhmsButton outline block={false} type="danger" size="medium">Cancel</BhmsButton>
                </div>
            ),
        },
    ];

    return (
        <div style={{ padding: 20 }}>
            <Input
                placeholder="Search by Patient Name"
                prefix={<SearchOutlined />}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ marginBottom: 20, width: 300 }}
            />
            <Table
                columns={columns}
                dataSource={filteredData}
                loading={loading}
                pagination={{
                    current: currentPageState, // Current page
                    total: totalItems, // Total number of items
                    pageSize: 10, // Items per page
                    onChange: handlePageChange, // Handle page change
                    showSizeChanger: false, // Disable page size changer
                }}
                rowKey={(record) => record.id}
            />
        </div>
    );
};

export default RequestLabComponent;