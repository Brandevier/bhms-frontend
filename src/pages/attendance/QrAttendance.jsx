import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generateQrCode, getAllAttendance, getLatestQrCode } from "../../redux/slice/qrAttendanceSlice";
import { Card, Button, Table, Alert, Space, Typography, Row, Col, Divider, Statistic, message,Tag } from "antd";
import QRCode from "react-qr-code"; // Simpler QR code library
import { PrinterOutlined, ReloadOutlined, DownloadOutlined, ClockCircleOutlined, UserOutlined } from "@ant-design/icons";
import html2canvas from "html2canvas";
import moment from "moment";

const { Title, Text } = Typography;

const QrAttendance = () => {
    const dispatch = useDispatch();
    const { attendanceRecords, qrCodeImage, qrCodeId, loading, error } = useSelector((state) => state.attendance);
    const [qrSize, setQrSize] = useState(200);
    const qrCodeRef = useRef(null);

    // Generate a minimal payload that will definitely work
    const generatePayload = () => {
        return JSON.stringify({
            event: "attendance",
            time: Date.now(),
            id: Math.random().toString(36).substring(2, 10) // Short random ID
        });
    };

    useEffect(() => {
        dispatch(getAllAttendance());
        dispatch(getLatestQrCode());
        // Generate initial QR code with safe payload
        dispatch(generateQrCode(generatePayload()));
    }, [dispatch]);

    const handleGenerateNew = () => {
        const payload = generatePayload();
        dispatch(generateQrCode(payload));
    };

    const handlePrint = async () => {
        try {
            if (!qrCodeRef.current) {
                message.warning("QR Code not available for printing");
                return;
            }

            const canvas = await html2canvas(qrCodeRef.current, {
                backgroundColor: '#ffffff',
                scale: 3,
                logging: false,
                useCORS: true,
            });

            const printWindow = window.open("", "_blank");
            printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head><title>Attendance QR</title></head>
          <body style="margin:0;padding:0;display:flex;justify-content:center;align-items:center;height:100vh;">
            <img src="${canvas.toDataURL('image/png')}" style="max-width:90%;max-height:90%;" />
          </body>
        </html>
      `);
            printWindow.document.close();
            setTimeout(() => printWindow.print(), 500);
        } catch (err) {
            console.error("Print error:", err);
            message.error("Failed to print QR code");
        }
    };

    const handleDownload = async () => {
        try {
            if (!qrCodeRef.current) {
                message.warning("QR Code not available for download");
                return;
            }

            const canvas = await html2canvas(qrCodeRef.current, {
                backgroundColor: '#ffffff',
                scale: 3,
                logging: false,
                useCORS: true,
            });

            const link = document.createElement('a');
            link.download = `attendance-qr-${moment().format('YYYYMMDD-HHmmss')}.png`;
            link.href = canvas.toDataURL('image/png');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error("Download error:", err);
            message.error("Failed to download QR code");
        }
    };

    const columns = [
        {
            title: "Staff ID",
            dataIndex: ["staff", "staffID"],
            key: "staffId",
            render: (text) => <Text strong>{text}</Text>
        },
        {
            title: "Full Name",
            key: "fullName",
            render: (_, record) => (
                <Text>{`${record.staff?.firstName || ''} ${record.staff?.lastName || ''}`}</Text>
            )
        },
        {
            title: "Department",
            dataIndex: ["staff", "department", "name"],
            key: "department",
            render: (text) => <Text>{text}</Text>
        },
        {
            title: "Time of Day",
            key: "timeOfDay",
            render: (_, record) => {
                const hour = moment(record.scannedAt).hour();
                let timeOfDay = '';
                let color = '';

                if (hour >= 5 && hour < 12) {
                    timeOfDay = 'Morning';
                    color = 'geekblue';
                } else if (hour >= 12 && hour < 17) {
                    timeOfDay = 'Afternoon';
                    color = 'orange';
                } else {
                    timeOfDay = 'Night';
                    color = 'purple';
                }

                return <Tag color={color}>{timeOfDay}</Tag>;
            }
        },
        {
            title: "Scan Time",
            dataIndex: "scannedAt",
            key: "scannedAt",
            render: (text) => (
                <>
                    <div>{moment(text).format("MMMM Do YYYY")}</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>
                        {moment(text).format("h:mm:ss a")}
                    </div>
                </>
            ),
            sorter: (a, b) => new Date(a.scannedAt) - new Date(b.scannedAt),
            defaultSortOrder: 'descend'
        },
    ];

    const todayScans = attendanceRecords?.filter(record =>
        moment(record.scannedAt).isSame(moment(), 'day')
    ).length;

    return (
        <div style={{ padding: 24 }}>
            <Title level={3} style={{ marginBottom: 24 }}>QR Attendance System</Title>

            <Row gutter={[24, 24]}>
                <Col xs={24} md={12}>
                    <Card
                        title={<Space><ClockCircleOutlined /><Text strong>Attendance QR Code</Text></Space>}
                        extra={
                            <Button
                                type="primary"
                                icon={<ReloadOutlined />}
                                onClick={handleGenerateNew}
                                loading={loading}
                            >
                                Generate New
                            </Button>
                        }
                    >
                        <div
                            ref={qrCodeRef}
                            style={{
                                textAlign: 'center',
                                padding: 16,
                                backgroundColor: 'white',
                                borderRadius: 8,
                                border: '1px solid #f0f0f0'
                            }}
                        >
                            {qrCodeImage ? (
                                <>
                                    <div style={{
                                        padding: '8px',
                                        backgroundColor: 'white',
                                        display: 'inline-block',
                                        margin: '0 auto'
                                    }}>

                                        {qrCodeImage ? (
                                            <>
                                                {/* Option 1: If you want to display the received image directly */}


                                                {/* Option 2: If you want to generate a new QR code from the ID */}
                                                <QRCode
                                                    value={qrCodeId} // Use the ID instead of image data
                                                    size={qrSize - 16}
                                                    level="Q"
                                                />
                                            </>
                                        ) : (
                                            <Alert message="No QR Code Generated" type="info" />
                                        )}
                                    </div>
                                    <Divider style={{ margin: '16px 0' }} />
                                    <Text type="secondary" style={{ fontSize: 16 }}>
                                        Scan this code to mark attendance
                                    </Text>
                                    <Text strong style={{ display: 'block', fontSize: 18, marginTop: 8 }}>
                                        {moment().format("MMMM Do YYYY")}
                                    </Text>
                                </>
                            ) : (
                                <Alert
                                    message="No QR Code Generated"
                                    description="Click the button to create an attendance QR code."
                                    type="info"
                                    showIcon
                                />
                            )}
                        </div>

                        <Divider />

                        <Space style={{ width: '100%', justifyContent: 'center' }}>
                            <Button
                                type="primary"
                                icon={<PrinterOutlined />}
                                onClick={handlePrint}
                                disabled={!qrCodeImage}
                            >
                                Print
                            </Button>
                            <Button
                                icon={<DownloadOutlined />}
                                onClick={handleDownload}
                                disabled={!qrCodeImage}
                            >
                                Download
                            </Button>
                            <Button.Group>
                                <Button onClick={() => setQrSize(prev => Math.max(prev - 20, 100))}>
                                    Zoom -
                                </Button>
                                <Button onClick={() => setQrSize(prev => Math.min(prev + 20, 300))}>
                                    Zoom +
                                </Button>
                            </Button.Group>
                        </Space>
                    </Card>
                </Col>

                <Col xs={24} md={12}>
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <Card>
                                <Statistic
                                    title="Total Scans"
                                    value={attendanceRecords?.length || 0}
                                    prefix={<UserOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card>
                                <Statistic
                                    title="Today's Scans"
                                    value={todayScans || 0}
                                    prefix={<ClockCircleOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col span={24}>
                            <Card title="Recent Activity" bodyStyle={{ padding: 0 }}>
                                <Table
                                    dataSource={attendanceRecords?.slice(0, 5) || []}
                                    columns={columns}
                                    rowKey="id"
                                    pagination={false}
                                    size="small"
                                    loading={loading}
                                />
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>

            <Card
                title="Attendance Records"
                style={{ marginTop: 24 }}
                extra={
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={() => dispatch(getAllAttendance())}
                        loading={loading}
                    >
                        Refresh
                    </Button>
                }
            >
                {error ? (
                    <Alert message="Error" description={error} type="error" showIcon />
                ) : (
                    <Table
                        dataSource={attendanceRecords || []}
                        columns={columns}
                        rowKey="id"
                        bordered
                        loading={loading}
                        pagination={{ pageSize: 10 }}
                    />
                )}
            </Card>
        </div>
    );
};

export default QrAttendance; 