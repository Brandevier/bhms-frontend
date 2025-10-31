// components/diagnosis/TopDiseasesChart.js
import React from 'react';
import { Card, Typography, List, Tag } from 'antd';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const { Title: AntTitle, Text } = Typography;

const TopDiseasesChart = ({ topDiseases, interpretation }) => {
  // Add safety checks
  const safeData = topDiseases?.data || [];
  const safeInterpretation = interpretation || [];

  // Fix: Access the correct property names from your API
  const chartData = {
    labels: safeData.map(disease => disease.disease || 'Unknown'), // Changed from 'name' to 'disease'
    datasets: [
      {
        label: 'Number of Cases',
        data: safeData.map(disease => parseInt(disease.count) || 0), // Ensure count is a number
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Top Diseases by Case Count',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Cases',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Diseases',
        },
      },
    },
  };

  return (
    <Card className="w-full">
      <div className="flex justify-between items-center mb-4">
        <AntTitle level={4}>Top Diseases</AntTitle>
        <Tag color="blue">{safeData.length} Diseases</Tag>
      </div>

      {safeData.length > 0 ? (
        <>
          <div className="h-64 mb-6">
            <Bar data={chartData} options={chartOptions} />
          </div>

          <List
            className="mt-4"
            dataSource={safeData.slice(0, 5)}
            renderItem={(disease, index) => (
              <List.Item>
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center">
                    <Tag color={index < 3 ? 'red' : 'blue'}>{index + 1}</Tag>
                    <Text className="ml-2">{disease.disease || 'Unknown'}</Text> {/* Fixed: disease.disease */}
                  </div>
                  <Tag color="geekblue">{disease.count} cases</Tag>
                </div>
              </List.Item>
            )}
          />
        </>
      ) : (
        <Text type="secondary">No disease data available</Text>
      )}

      {/* FIXED: Properly render interpretation objects */}
      {safeInterpretation.length > 0 && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <Text strong>Insights:</Text>
          <List
            size="small"
            dataSource={safeInterpretation}
            renderItem={(item, index) => (
              <List.Item>
                {/* Access the insight property from the object */}
                <Text>{item.insight || 'No insight available'}</Text>
              </List.Item>
            )}
          />
        </div>
      )}
    </Card>
  );
};

export default TopDiseasesChart;