import React from "react";
import { Card, Empty } from "antd";
import { TeamOutlined } from "@ant-design/icons";
import ProcedureCard from "./ProcedureCard";

const ProcedureList = ({ procedures, onStatusChange, onStaffChange }) => {
  if (!procedures || procedures.length === 0) {
    return (
      <Card
        title={
          <span>
            <TeamOutlined /> Patient Procedures
          </span>
        }
      >
        <Empty description="No procedures recorded yet" />
      </Card>
    );
  }

  // Sort procedures by date (newest first)
  const sortedProcedures = [...procedures].sort(
    (a, b) => new Date(b.procedure_datetime) - new Date(a.procedure_datetime)
  );

  return (
    <Card
      title={
        <span>
          <TeamOutlined /> Patient Procedures
        </span>
      }
    >
      {sortedProcedures.map(procedure => (
        <ProcedureCard
          key={procedure.id}
          procedure={procedure}
          onStatusChange={onStatusChange}
          onStaffChange={onStaffChange}
          
        />
      ))}
    </Card>
  );
};

export default ProcedureList;