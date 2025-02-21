import React, { useEffect, useState } from 'react';
import { fetchLabResultsByStatus } from '../../../redux/slice/labSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Input, Tooltip, Badge, message, Spin, Modal } from 'antd';
import { SearchOutlined, MessageOutlined, EyeOutlined, DownloadOutlined } from '@ant-design/icons';
import BhmsButton from '../../../heroComponents/BhmsButton';

const CompleteLabComponent = () => {
    const dispatch = useDispatch();
    const { labResults, loading } = useSelector((state) => state.lab);
    const [searchText, setSearchText] = useState('');
    const [selectedResult, setSelectedResult] = useState(null); // For modal preview

    useEffect(() => {
        dispatch(fetchLabResultsByStatus({ status: 'completed' }));
    }, [dispatch]);

    const filteredData = labResults.filter((item) =>
        item.patient?.first_name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.patient?.middle_name?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.patient?.last_name.toLowerCase().includes(searchText.toLowerCase())
    );

    const handleView = (result) => {
        setSelectedResult(result);
    };

    const handleDownload = (result) => {
        if (!result.test) {
            message.error("No lab result file available.");
            return;
        }
        const link = document.createElement("a");
        link.href = result.test; // Assuming test contains a URL
        link.setAttribute("download", `Lab_Result_${result.patient?.first_name}.pdf`); // Modify for different file types
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

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
            render: (status) => <span style={{ color: 'green', fontWeight: 'bold' }}>{status}</span>,
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
                <div style={{ display: "flex", gap: "10px" }}>
                    <Tooltip title="View">
                        <BhmsButton block={false} size="medium" outline onClick={() => handleView(record)}>
                            <EyeOutlined />
                        </BhmsButton>
                    </Tooltip>

                    <Tooltip title="Download">
                        <BhmsButton block={false} size="medium" onClick={() => handleDownload(record)}>
                            <DownloadOutlined />
                        </BhmsButton>
                    </Tooltip>
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
                pagination={{ pageSize: 10 }}
                rowKey={(record) => record.id}
            />

            {/* Lab Result Modal */}
            <Modal
                title="Lab Result Preview"
                open={!!selectedResult}
                onCancel={() => setSelectedResult(null)}
                footer={[
                    <BhmsButton key="close" onClick={() => setSelectedResult(null)}>
                        Close
                    </BhmsButton>,
                ]}
            >
                {selectedResult?.test ? (
                    <iframe
                        src={selectedResult.test}
                        title="Lab Result"
                        style={{ width: "100%", height: "500px", border: "none" }}
                    />
                ) : (
                    <p>No lab result available for this test.</p>
                )}
            </Modal>
        </div>
    );
};

export default CompleteLabComponent;
