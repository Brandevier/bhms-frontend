import React from "react";
import { Card, Statistic } from "antd";
import {
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

const AdmissionStats = ({ admissions }) => {
  const stats = {
    total: admissions?.length || 0,
    active: admissions?.filter((a) => a.admission_status === "accepted").length || 0,
    pending: admissions?.filter((a) => a.admission_status === "pending").length || 0,
    discharged: admissions?.filter((a) => a.admission_status === "discharged").length || 0,
  };

  const cardStyle =
    "flex flex-col items-center justify-center rounded-2xl shadow-md p-6 w-full h-40";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
      <Card className={cardStyle}>
        <Statistic
          title={<span className="text-lg font-semibold text-gray-600">Total Admissions</span>}
          value={stats.total}
          valueStyle={{ color: "#3f8600", fontSize: "28px", fontWeight: "bold" }}
          prefix={<UserOutlined className="text-xl text-gray-700 mr-2" />}
        />
      </Card>

      <Card className={cardStyle}>
        <Statistic
          title={<span className="text-lg font-semibold text-gray-600">Active</span>}
          value={stats.active}
          valueStyle={{ color: "#1890ff", fontSize: "28px", fontWeight: "bold" }}
          prefix={<CheckCircleOutlined className="text-xl text-blue-500 mr-2" />}
        />
      </Card>

      <Card className={cardStyle}>
        <Statistic
          title={<span className="text-lg font-semibold text-gray-600">Pending</span>}
          value={stats.pending}
          valueStyle={{ color: "#faad14", fontSize: "28px", fontWeight: "bold" }}
          prefix={<ClockCircleOutlined className="text-xl text-yellow-500 mr-2" />}
        />
      </Card>

      <Card className={cardStyle}>
        <Statistic
          title={<span className="text-lg font-semibold text-gray-600">Discharged</span>}
          value={stats.discharged}
          valueStyle={{ color: "#cf1322", fontSize: "28px", fontWeight: "bold" }}
          prefix={<CloseCircleOutlined className="text-xl text-red-500 mr-2" />}
        />
      </Card>
    </div>
  );
};

export default AdmissionStats;
