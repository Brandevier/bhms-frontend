import React from "react";
import { Card, Button, Empty } from "antd";
import dayjs from "dayjs";
import AdmissionCard from "./AdmissionCard";

const AdmissionList = ({
  admissions,
  searchTerm,
  statusFilter,
  dateRange,
  onViewDetails,
  user,
}) => {
  const filteredAdmissions = admissions?.filter((admission) => {
    const matchesSearch = searchTerm
      ? `${admission.patient?.first_name} ${admission.patient?.last_name}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        admission.attendance_number
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
      : true;

    const matchesStatus =
      statusFilter !== "all"
        ? admission.admission_status === statusFilter
        : true;

    const matchesDate =
      dateRange.length === 2
        ? dayjs(admission.admission_date).isAfter(dateRange[0]) &&
          dayjs(admission.admission_date).isBefore(dateRange[1])
        : true;

    return matchesSearch && matchesStatus && matchesDate;
  });

  if (filteredAdmissions?.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center py-12 shadow-md rounded-xl">
        <Empty description={null} className="mb-4" />
        <Button
          type="primary"
          onClick={() => window.location.reload()}
          className="px-6 py-2 rounded-lg"
        >
          Clear Filters
        </Button>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 p-4">
      {filteredAdmissions?.map((admission) => (
        <AdmissionCard
          key={admission.id}
          admission={admission}
          onViewDetails={onViewDetails}
          user={user}
        />
      ))}
    </div>
  );
};

export default AdmissionList;
