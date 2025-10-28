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
  const chartData = {
    labels: topDiseases.data.map(disease => disease.name),
    datasets: [
      {
        label: 'Number of Cases',
        data: topDiseases.data.map(disease => disease.count),
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
        <Tag color="blue">{topDiseases.data.length} Diseases</Tag>
      </div>

      <div className="h-64 mb-6">
        <Bar data={chartData} options={chartOptions} />
      </div>

      {interpretation && interpretation.length > 0 && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <Text strong>Interpretation:</Text>
          <List
            size="small"
            dataSource={interpretation}
            renderItem={(item, index) => (
              <List.Item>
                <Text>{item}</Text>
              </List.Item>
            )}
          />
        </div>
      )}

      <List
        className="mt-4"
        dataSource={topDiseases.data.slice(0, 5)}
        renderItem={(disease, index) => (
          <List.Item>
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center">
                <Tag color={index < 3 ? 'red' : 'blue'}>{index + 1}</Tag>
                <Text className="ml-2">{disease.name}</Text>
              </div>
              <Tag color="geekblue">{disease.count} cases</Tag>
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default TopDiseasesChart;