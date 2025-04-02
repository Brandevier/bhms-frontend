import React, { useEffect, useState } from 'react';
import { fetchLabResultsByStatus } from '../../../redux/slice/labSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Input, Tooltip, Badge, message, Spin, Modal, Typography, Button } from 'antd';
import { SearchOutlined, MessageOutlined, EyeOutlined, DownloadOutlined, ThunderboltOutlined } from '@ant-design/icons';
import BhmsButton from '../../../heroComponents/BhmsButton';

const { Text } = Typography;

const CompleteLabComponent = () => {
    const dispatch = useDispatch();
    const { labResults, loading } = useSelector((state) => state.lab);
    const [searchText, setSearchText] = useState('');
    const [selectedResult, setSelectedResult] = useState(null);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiResponse, setAiResponse] = useState(null);
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        dispatch(fetchLabResultsByStatus({ status: 'completed' }));
        
        // Check internet connection
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [dispatch]);

    const filteredData = labResults.filter((item) =>
        item.patient?.first_name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.patient?.middle_name?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.patient?.last_name.toLowerCase().includes(searchText.toLowerCase())
    );

    const handleView = (result) => {
        setSelectedResult(result);
        setAiResponse(null); // Reset AI response when viewing new result
    };

    const handleDownload = (result) => {
        if (!result.test) {
            message.error("No lab result file available.");
            return;
        }
        const link = document.createElement("a");
        link.href = `http://localhost:7000${result.test}`;
        link.setAttribute("download", `Lab_Result_${result.patient?.first_name}_${result.id}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleAiAnalysis = async () => {
        if (!isOnline) {
            message.error("AI analysis requires internet connection");
            return;
        }

        if (!selectedResult?.test) {
            message.warning("No lab result available for analysis");
            return;
        }

        setAiLoading(true);
        try {
            // Simulate API call - replace with actual AI service integration
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Mock AI response - replace with real API response
            const mockAiResponse = {
                interpretation: "The results indicate slightly elevated levels of white blood cells, which could suggest a mild infection or inflammatory process. The red blood cell count and hemoglobin levels are within normal ranges.",
                recommendations: [
                    "Consider retesting in 2 weeks if symptoms persist",
                    "Monitor for fever or other signs of infection",
                    "Maintain hydration and rest"
                ],
                confidence: "85%"
            };
            
            setAiResponse(mockAiResponse);
            message.success("AI analysis completed");
        } catch (error) {
            message.error("Failed to analyze results");
        } finally {
            setAiLoading(false);
        }
    };

    const columns = [
        {
            title: 'Full Name',
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
            title: 'Staff',
            key: 'staff',
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
            key: 'comment',
            render: (_, record) => (
                <Tooltip title={record.comment || 'No comments'}>
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
                rowKey="id"
            />

            {/* Lab Result Modal */}
            <Modal
                title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Lab Result Preview</span>
                        <Button 
                            icon={<ThunderboltOutlined />} 
                            onClick={handleAiAnalysis}
                            loading={aiLoading}
                            disabled={!isOnline || !selectedResult?.test}
                            type="primary"
                            size="small"
                        >
                            AI Analysis
                        </Button>
                    </div>
                }
                open={!!selectedResult}
                onCancel={() => setSelectedResult(null)}
                width={800}
                footer={[
                    <BhmsButton key="close" onClick={() => setSelectedResult(null)}>
                        Close
                    </BhmsButton>,
                ]}
            >
                {selectedResult?.test ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div style={{ border: '1px solid #f0f0f0', padding: 8, textAlign: 'center' }}>
                            <img 
                                src={`http://localhost:7000${selectedResult.test}`} 
                                alt="Lab Result" 
                                style={{ 
                                    maxWidth: '100%', 
                                    maxHeight: '400px',
                                    objectFit: 'contain'
                                }}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/path/to/placeholder-image.png';
                                    message.error('Failed to load lab result image');
                                }}
                            />
                        </div>

                        {aiResponse && (
                            <div style={{ marginTop: 16, padding: 16, backgroundColor: '#f9f9f9', borderRadius: 8 }}>
                                <Text strong style={{ display: 'block', marginBottom: 8 }}>AI Interpretation (Confidence: {aiResponse.confidence})</Text>
                                <Text>{aiResponse.interpretation}</Text>
                                
                                {aiResponse.recommendations?.length > 0 && (
                                    <>
                                        <Text strong style={{ display: 'block', marginTop: 12, marginBottom: 4 }}>Recommendations:</Text>
                                        <ul style={{ margin: 0, paddingLeft: 20 }}>
                                            {aiResponse.recommendations.map((rec, i) => (
                                                <li key={i}><Text>{rec}</Text></li>
                                            ))}
                                        </ul>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <Text>No lab result available for this test.</Text>
                )}
            </Modal>
        </div>
    );
};

export default CompleteLabComponent;