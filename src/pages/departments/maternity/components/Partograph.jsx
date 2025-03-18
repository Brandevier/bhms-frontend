import React, { useState, useEffect } from "react";
import { Button, Modal, Form, InputNumber, message } from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Partograph = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [chartData, setChartData] = useState([{ time: 1, dilation: 4 }]); // Default start point at 4cm

  // Function to check alert conditions
  useEffect(() => {
    if (chartData.length > 0) {
      const latestPoint = chartData[chartData.length - 1];

      if (latestPoint.dilation >= 6.5 && latestPoint.dilation < 8.5) {
        message.warning("⚠️ Caution: Patient is entering the slow progress zone (Yellow)!");
      } else if (latestPoint.dilation >= 8.5) {
        message.error("🚨 Alert: Patient is in the critical zone (Red)!");
      }
    }
  }, [chartData]); // Run this effect whenever chartData changes

  // Handle adding new data
  const handleAddData = () => {
    form.validateFields().then((values) => {
      setChartData([...chartData, values]); // Add new data point
      form.resetFields();
      setModalOpen(false);
      message.success("✅ Partograph data added successfully!");
    });
  };

  return (
    <div className="p-4 bg-white">
      <h2 className="text-xl font-bold mb-4">Partograph</h2>

      {/* Add Data & Interpret Results Buttons */}
      <div className="mb-4 space-x-2">
        <Button type="primary" onClick={() => setModalOpen(true)}>Add Partograph Data</Button>
        <Button type="default">Interpret Results</Button>
      </div>

      {/* Chart Container */}
      <div className="relative bg-gray-100 p-4">
        <svg
          width="100%"
          height="100%"
          style={{
            position: "absolute",
            top: 0,
            left: 35,
            bottom: 0,
            pointerEvents: "none",
          }}
        >
          <polygon points="83,435 525,37 80,35" fill="green" opacity="0.1" />
          <polygon points="78,435 382,435 855,30 540,35" fill="yellow" opacity="0.1" />
          <polygon points="385,435 850,435 850,20 855,29" fill="red" opacity="0.1" />
        </svg>

        <ResponsiveContainer width={900} height={500}>
          <LineChart data={chartData} margin={{ top: 20, right: 30, bottom: 30, left: 40 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="time"
              domain={[1, 12]}
              ticks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
              label={{
                value: "Time (Hrs)",
                position: "insideBottomRight",
                offset: -5,
              }}
            />
            <YAxis
              type="number"
              domain={[4, 10]} // Ensure min is 4
              ticks={[4, 5, 6, 7, 8, 9, 10]}
              label={{
                value: "Dilation (cm)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="dilation" stroke="#8884d8" label={{ position: "top" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Modal for Adding Partograph Data */}
      <Modal
        title="Add Partograph Data"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleAddData}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="time" label="Time (Hrs)" rules={[{ required: true, message: "Please enter time" }]}>
            <InputNumber min={1} max={12} className="w-full" />
          </Form.Item>
          <Form.Item name="dilation" label="Dilation (cm)" rules={[{ required: true, message: "Please enter dilation" }]}>
            <InputNumber min={4} max={10} className="w-full" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Partograph;
