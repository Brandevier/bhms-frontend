import React, { useEffect } from "react";
import { Table, Card, Row, Col, Button, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchPatientReports } from "../redux/slice/recordSlice";
import { Bar, Pie } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, Title, ArcElement, Tooltip, Legend } from "chart.js";
import * as XLSX from "xlsx";
import { DownloadOutlined } from "@ant-design/icons";

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const { Title: AntTitle, Text } = Typography;

const PatientReport = () => {
    const dispatch = useDispatch();
    const { patientReports, loading } = useSelector((state) => state.records);

    useEffect(() => {
        dispatch(fetchPatientReports());
    }, [dispatch]);

    // Define table columns
    const columns = [
        {
            title: "Age Group",
            dataIndex: "group",
            key: "group",
            fixed: "left",
            width: 120,
            render: (text) => <Text strong>{text}</Text>,
        },
        {
            title: "Insured Patients",
            children: [
                {
                    title: "New",
                    children: [
                        { 
                            title: "Male", 
                            dataIndex: ["insured", "new", "male"], 
                            key: "insured_new_male",
                            align: "center",
                            render: (val) => val || "-"
                        },
                        { 
                            title: "Female", 
                            dataIndex: ["insured", "new", "female"], 
                            key: "insured_new_female",
                            align: "center",
                            render: (val) => val || "-"
                        },
                    ],
                },
                {
                    title: "Old",
                    children: [
                        { 
                            title: "Male", 
                            dataIndex: ["insured", "old", "male"], 
                            key: "insured_old_male",
                            align: "center",
                            render: (val) => val || "-"
                        },
                        { 
                            title: "Female", 
                            dataIndex: ["insured", "old", "female"], 
                            key: "insured_old_female",
                            align: "center",
                            render: (val) => val || "-"
                        },
                    ],
                },
                {
                    title: "Subtotal",
                    children: [
                        { 
                            title: "Total", 
                            key: "insured_total",
                            align: "center",
                            render: (_, record) => (
                                <Text strong>
                                    {(record.insured?.new?.male || 0) + 
                                     (record.insured?.old?.male || 0) + 
                                     (record.insured?.new?.female || 0) + 
                                     (record.insured?.old?.female || 0)}
                                </Text>
                            )
                        },
                    ],
                },
            ],
        },
        {
            title: "Non-Insured Patients",
            children: [
                {
                    title: "New",
                    children: [
                        { 
                            title: "Male", 
                            dataIndex: ["nonInsured", "new", "male"], 
                            key: "nonInsured_new_male",
                            align: "center",
                            render: (val) => val || "-"
                        },
                        { 
                            title: "Female", 
                            dataIndex: ["nonInsured", "new", "female"], 
                            key: "nonInsured_new_female",
                            align: "center",
                            render: (val) => val || "-"
                        },
                    ],
                },
                {
                    title: "Old",
                    children: [
                        { 
                            title: "Male", 
                            dataIndex: ["nonInsured", "old", "male"], 
                            key: "nonInsured_old_male",
                            align: "center",
                            render: (val) => val || "-"
                        },
                        { 
                            title: "Female", 
                            dataIndex: ["nonInsured", "old", "female"], 
                            key: "nonInsured_old_female",
                            align: "center",
                            render: (val) => val || "-"
                        },
                    ],
                },
                {
                    title: "Subtotal",
                    children: [
                        { 
                            title: "Total", 
                            key: "nonInsured_total",
                            align: "center",
                            render: (_, record) => (
                                <Text strong>
                                    {(record.nonInsured?.new?.male || 0) + 
                                     (record.nonInsured?.old?.male || 0) + 
                                     (record.nonInsured?.new?.female || 0) + 
                                     (record.nonInsured?.old?.female || 0)}
                                </Text>
                            )
                        },
                    ],
                },
            ],
        },
        {
            title: "Grand Total",
            children: [
                { 
                    title: "Male", 
                    key: "total_male",
                    align: "center",
                    render: (_, record) => <Text strong>{record.total?.male || 0}</Text>
                },
                { 
                    title: "Female", 
                    key: "total_female",
                    align: "center",
                    render: (_, record) => <Text strong>{record.total?.female || 0}</Text>
                },
                {
                    title: "Total",
                    key: "grand_total",
                    align: "center",
                    render: (_, record) => (
                        <Text strong style={{ color: "#1890ff" }}>
                            {(record.total?.male || 0) + (record.total?.female || 0)}
                        </Text>
                    )
                }
            ],
        },
    ];

    // Prepare data for export
    const exportToExcel = () => {
        const worksheetData = patientReports.map(report => ({
            "Age Group": report.group,
            "Insured New Male": report.insured?.new?.male || 0,
            "Insured New Female": report.insured?.new?.female || 0,
            "Insured Old Male": report.insured?.old?.male || 0,
            "Insured Old Female": report.insured?.old?.female || 0,
            "Insured Total": (report.insured?.new?.male || 0) + (report.insured?.new?.female || 0) + 
                            (report.insured?.old?.male || 0) + (report.insured?.old?.female || 0),
            "Non-Insured New Male": report.nonInsured?.new?.male || 0,
            "Non-Insured New Female": report.nonInsured?.new?.female || 0,
            "Non-Insured Old Male": report.nonInsured?.old?.male || 0,
            "Non-Insured Old Female": report.nonInsured?.old?.female || 0,
            "Non-Insured Total": (report.nonInsured?.new?.male || 0) + (report.nonInsured?.new?.female || 0) + 
                                (report.nonInsured?.old?.male || 0) + (report.nonInsured?.old?.female || 0),
            "Total Male": report.total?.male || 0,
            "Total Female": report.total?.female || 0,
            "Grand Total": (report.total?.male || 0) + (report.total?.female || 0)
        }));

        // Add summary row
        const summaryRow = {
            "Age Group": "TOTAL",
            "Insured New Male": worksheetData.reduce((sum, row) => sum + row["Insured New Male"], 0),
            "Insured New Female": worksheetData.reduce((sum, row) => sum + row["Insured New Female"], 0),
            "Insured Old Male": worksheetData.reduce((sum, row) => sum + row["Insured Old Male"], 0),
            "Insured Old Female": worksheetData.reduce((sum, row) => sum + row["Insured Old Female"], 0),
            "Insured Total": worksheetData.reduce((sum, row) => sum + row["Insured Total"], 0),
            "Non-Insured New Male": worksheetData.reduce((sum, row) => sum + row["Non-Insured New Male"], 0),
            "Non-Insured New Female": worksheetData.reduce((sum, row) => sum + row["Non-Insured New Female"], 0),
            "Non-Insured Old Male": worksheetData.reduce((sum, row) => sum + row["Non-Insured Old Male"], 0),
            "Non-Insured Old Female": worksheetData.reduce((sum, row) => sum + row["Non-Insured Old Female"], 0),
            "Non-Insured Total": worksheetData.reduce((sum, row) => sum + row["Non-Insured Total"], 0),
            "Total Male": worksheetData.reduce((sum, row) => sum + row["Total Male"], 0),
            "Total Female": worksheetData.reduce((sum, row) => sum + row["Total Female"], 0),
            "Grand Total": worksheetData.reduce((sum, row) => sum + row["Grand Total"], 0)
        };

        const worksheet = XLSX.utils.json_to_sheet([...worksheetData, summaryRow]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Patient Report");
        
        // Add some styling
        const wscols = [
            {wch: 15}, {wch: 12}, {wch: 12}, {wch: 12}, {wch: 12}, {wch: 12},
            {wch: 12}, {wch: 12}, {wch: 12}, {wch: 12}, {wch: 12}, {wch: 12},
            {wch: 12}, {wch: 12}
        ];
        worksheet["!cols"] = wscols;

        XLSX.writeFile(workbook, "Patient_Report.xlsx", { compression: true });
    };

    // Extract data for charts
    const labels = patientReports.map((report) => report.group);
    const insuredMale = patientReports.map((report) => report.insured?.new?.male + report.insured?.old?.male || 0);
    const insuredFemale = patientReports.map((report) => report.insured?.new?.female + report.insured?.old?.female || 0);
    const nonInsuredMale = patientReports.map((report) => report.nonInsured?.new?.male + report.nonInsured?.old?.male || 0);
    const nonInsuredFemale = patientReports.map((report) => report.nonInsured?.new?.female + report.nonInsured?.old?.female || 0);

    // Bar Chart Data
    const barData = {
        labels,
        datasets: [
            { 
                label: "Insured Male", 
                data: insuredMale, 
                backgroundColor: "rgba(54, 162, 235, 0.8)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1 
            },
            { 
                label: "Insured Female", 
                data: insuredFemale, 
                backgroundColor: "rgba(255, 99, 132, 0.8)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 1 
            },
            { 
                label: "Non-Insured Male", 
                data: nonInsuredMale, 
                backgroundColor: "rgba(75, 192, 192, 0.8)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1 
            },
            { 
                label: "Non-Insured Female", 
                data: nonInsuredFemale, 
                backgroundColor: "rgba(255, 206, 86, 0.8)",
                borderColor: "rgba(255, 206, 86, 1)",
                borderWidth: 1 
            },
        ],
    };

    // Pie Chart Data
    const totalInsured = insuredMale.reduce((a, b) => a + b, 0) + insuredFemale.reduce((a, b) => a + b, 0);
    const totalNonInsured = nonInsuredMale.reduce((a, b) => a + b, 0) + nonInsuredFemale.reduce((a, b) => a + b, 0);

    const pieData = {
        labels: ["Insured Patients", "Non-Insured Patients"],
        datasets: [
            {
                data: [totalInsured, totalNonInsured],
                backgroundColor: ["#36A2EB", "#FF6384"],
                borderColor: ["#2980B9", "#E74C3C"],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div style={{ padding: "24px" }}>
            <Card 
                title={<AntTitle level={4} style={{ margin: 0 }}>Statement of Outpatients</AntTitle>}
                extra={
                    <Button 
                        type="primary" 
                        icon={<DownloadOutlined />} 
                        onClick={exportToExcel}
                        disabled={patientReports.length === 0}
                    >
                        Export to Excel
                    </Button>
                }
                bordered={false}
                style={{ marginBottom: 24 }}
            >
                <Table
                    columns={columns}
                    dataSource={patientReports}
                    rowKey="group"
                    loading={loading}
                    bordered
                    pagination={false}
                    scroll={{ x: "max-content" }}
                    size="middle"
                    style={{ marginTop: 16 }}
                />
            </Card>

            {/* Charts Section */}
            <Card title="Statistical Overview" bordered={false}>
                <Row gutter={[24, 24]}>
                    <Col xs={24} md={16}>
                        <Card title="Patient Distribution by Age Group" bordered={false}>
                            <Bar 
                                data={barData} 
                                options={{ 
                                    responsive: true, 
                                    plugins: { 
                                        legend: { 
                                            position: "top",
                                            labels: {
                                                boxWidth: 12,
                                                padding: 20
                                            }
                                        },
                                        tooltip: {
                                            mode: 'index',
                                            intersect: false
                                        }
                                    },
                                    scales: {
                                        x: {
                                            stacked: false,
                                        },
                                        y: {
                                            stacked: false,
                                            beginAtZero: true
                                        }
                                    }
                                }} 
                                height={100}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card title="Insurance Coverage" bordered={false}>
                            <div style={{ height: 300 }}>
                                <Pie 
                                    data={pieData} 
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                position: "bottom",
                                            },
                                            tooltip: {
                                                callbacks: {
                                                    label: function(context) {
                                                        const label = context.label || '';
                                                        const value = context.raw || 0;
                                                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                                        const percentage = Math.round((value / total) * 100);
                                                        return `${label}: ${value} (${percentage}%)`;
                                                    }
                                                }
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default PatientReport;