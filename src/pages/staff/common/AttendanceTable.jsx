import React from 'react';
import { Table, Progress } from 'antd';

const AttendanceTable = () => {
  const data = [
    { month: 'January', present: 22, leave: 1, absent: 0 },
    { month: 'February', present: 20, leave: 2, absent: 1 },
    { month: 'March', present: 23, leave: 0, absent: 0 },
    { month: 'April', present: 21, leave: 1, absent: 1 },
    { month: 'May', present: 22, leave: 0, absent: 1 },
    { month: 'June', present: 20, leave: 2, absent: 1 },
    { month: 'July', present: 21, leave: 1, absent: 1 },
  ];

  const columns = [
    { title: 'Month', dataIndex: 'month', key: 'month' },
    { title: 'Present', dataIndex: 'present', key: 'present' },
    { title: 'Leave', dataIndex: 'leave', key: 'leave' },
    { title: 'Absent', dataIndex: 'absent', key: 'absent' },
    { 
      title: 'Percentage', 
      key: 'percentage', 
      render: (_, record) => (
        <Progress 
          percent={Math.round((record.present / (record.present + record.leave + record.absent)) * 100)} 
          status={record.present / (record.present + record.leave + record.absent) > 0.9 ? 'success' : 'normal'}
        />
      )
    }
  ];

  return <Table dataSource={data} columns={columns} rowKey="month" />;
};

export default AttendanceTable;