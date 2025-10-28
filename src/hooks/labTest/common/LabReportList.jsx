import React from "react";
import { List } from "antd";
import LabReportItem from "./LabReportItem";

const LabReportList = ({ results, onDeleteTest, onViewResult, onUpdateTest }) => {
  // Sort by date (newest first)
  const sortedResults = [...results].sort((a, b) => {
    return new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0);
  });

  return (
    <List
      dataSource={sortedResults}
      renderItem={(result) => (
        <LabReportItem
          result={result}
          onDelete={onDeleteTest}
          onViewResult={onViewResult}
          onUpdate={onUpdateTest}
        />
      )}
      className="lab-report-list"
    />
  );
};

export default LabReportList;