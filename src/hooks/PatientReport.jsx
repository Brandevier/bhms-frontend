import React, { useEffect } from "react";
import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getPatientReports } from "../redux/slice/recordSlice";
import { Bar, Pie } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, Title, ArcElement, Tooltip, Legend } from "chart.js";

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const PatientReport = () => {
    const dispatch = useDispatch();
    const { patientReports, loading } = useSelector((state) => state.records);

    useEffect(() => {
        dispatch(getPatientReports());
    }, [dispatch]);

    // Define table columns
    const columns = [
        {
            title: "AGE GROUP",
            dataIndex: "group",
            key: "group",
            fixed: "left",
            width: 150,
        },
        {
            title: "INSURED PATIENTS",
            children: [
                {
                    title: "NEW",
                    children: [
                        { title: "MALE", dataIndex: ["insured", "new", "male"], key: "insured_new_male" },
                        { title: "FEMALE", dataIndex: ["insured", "new", "female"], key: "insured_new_female" },
                    ],
                },
                {
                    title: "OLD",
                    children: [
                        { title: "MALE", dataIndex: ["insured", "old", "male"], key: "insured_old_male" },
                        { title: "FEMALE", dataIndex: ["insured", "old", "female"], key: "insured_old_female" },
                    ],
                },
            ],
        },
        {
            title: "NON-INSURED PATIENTS",
            children: [
                {
                    title: "NEW",
                    children: [
                        { title: "MALE", dataIndex: ["nonInsured", "new", "male"], key: "nonInsured_new_male" },
                        { title: "FEMALE", dataIndex: ["nonInsured", "new", "female"], key: "nonInsured_new_female" },
                    ],
                },
                {
                    title: "OLD",
                    children: [
                        { title: "MALE", dataIndex: ["nonInsured", "old", "male"], key: "nonInsured_old_male" },
                        { title: "FEMALE", dataIndex: ["nonInsured", "old", "female"], key: "nonInsured_old_female" },
                    ],
                },
            ],
        },
        {
            title: "TOTAL",
            children: [
                { title: "MALE", dataIndex: ["total", "male"], key: "total_male" },
                { title: "FEMALE", dataIndex: ["total", "female"], key: "total_female" },
            ],
        },
    ];

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
            { label: "Insured Male", data: insuredMale, backgroundColor: "rgba(54, 162, 235, 0.6)" },
            { label: "Insured Female", data: insuredFemale, backgroundColor: "rgba(255, 99, 132, 0.6)" },
            { label: "Non-Insured Male", data: nonInsuredMale, backgroundColor: "rgba(75, 192, 192, 0.6)" },
            { label: "Non-Insured Female", data: nonInsuredFemale, backgroundColor: "rgba(255, 206, 86, 0.6)" },
        ],
    };

    // Pie Chart Data
    const totalInsured = insuredMale.reduce((a, b) => a + b, 0) + insuredFemale.reduce((a, b) => a + b, 0);
    const totalNonInsured = nonInsuredMale.reduce((a, b) => a + b, 0) + nonInsuredFemale.reduce((a, b) => a + b, 0);

    const pieData = {
        labels: ["Total Insured", "Total Non-Insured"],
        datasets: [
            {
                data: [totalInsured, totalNonInsured],
                backgroundColor: ["#36A2EB", "#FF6384"],
            },
        ],
    };

    return (
        <div>
            <h2 style={{ textAlign: "center", marginBottom: "16px" }}>Statement of Outpatients</h2>
            <Table
                columns={columns}
                dataSource={patientReports}
                rowKey="group"
                loading={loading}
                bordered
                pagination={false}
                scroll={{ x: "max-content" }}
            />

            {/* Charts Section */}
            <div style={{ marginTop: "30px", textAlign: "center" }}>
                <h3>Statistical Overview</h3>
                <div style={{ display: "flex", justifyContent: "center", gap: "50px", flexWrap: "wrap" }}>
                    <div style={{ width: "600px" }}>
                        <h4>Patient Distribution by Age Group</h4>
                        <Bar data={barData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
                    </div>
                    <div style={{ width: "300px" }}>
                        <h4>Overall Insured vs Non-Insured</h4>
                        <Pie data={pieData} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientReport;
