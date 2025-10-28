import React, { useEffect, useState } from 'react';
import { Table, Button, Tag, Space, Card, DatePicker, Select, Spin, Alert } from 'antd';
import { 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  ClockCircleOutlined,
  LoginOutlined,
  LogoutOutlined
} from '@ant-design/icons'; 
import {useDepartmentAttendance} from '../../../redux/hooks/useFaceRecognition'


import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

const AttendanceTable = ({ user }) => {
  const [dateRange, setDateRange] = useState([dayjs(), dayjs()]);
  const [statusFilter, setStatusFilter] = useState('');
  const { 
    attendanceData, 
    statistics, 
    loading, 
    error, 
    fetchAttendance,
    filters 
  } = useDepartmentAttendance();

  useEffect(() => {
    if (user) {
      fetchAttendance({
        department_id: user.department.id,
        start_date: dateRange[0].format('YYYY-MM-DD'),
        end_date: dateRange[1].format('YYYY-MM-DD'),
        status: statusFilter
      });
    }
  }, [user, dateRange, statusFilter, fetchAttendance]);

  const handleSignIn = (staffId) => {
    console.log('Sign in for staff:', staffId);
    // Implement sign in logic
  };

  const handleSignOut = (staffId) => {
    console.log('Sign out for staff:', staffId);
    // Implement sign out logic
  };

  const columns = [
    {
      title: 'Staff Name',
      dataIndex: 'Staff',
      key: 'staff_name',
      render: (staff) => `${staff?.first_name} ${staff?.last_name}`,
    },
    {
      title: 'Staff ID',
      dataIndex: 'Staff',
      key: 'staff_id',
      render: (staff) => staff?.staff_id,
    },
    {
      title: 'Date',
      dataIndex: 'attendance_date',
      key: 'date',
      render: (date) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: 'Sign In Time',
      dataIndex: 'sign_in_time',
      key: 'sign_in',
      render: (time) => time ? dayjs(time).format('HH:mm:ss') : '-',
    },
    {
      title: 'Sign Out Time',
      dataIndex: 'sign_out_time',
      key: 'sign_out',
      render: (time) => time ? dayjs(time).format('HH:mm:ss') : '-',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusConfig = {
          present: { color: 'green', icon: <CheckCircleOutlined />, text: 'Present' },
          absent: { color: 'red', icon: <CloseCircleOutlined />, text: 'Absent' },
          late: { color: 'orange', icon: <ClockCircleOutlined />, text: 'Late' },
          half_day: { color: 'blue', icon: <ClockCircleOutlined />, text: 'Half Day' }
        };
        const config = statusConfig[status] || { color: 'default', text: status };
        return <Tag color={config.color} icon={config.icon}>{config.text}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => {
        const isCurrentUser = record.Staff?.id === user?.id;
        const today = dayjs().format('YYYY-MM-DD');
        const isToday = dayjs(record.attendance_date).format('YYYY-MM-DD') === today;
        
        return (
          <Space>
            <Button 
              type="primary" 
              icon={<LoginOutlined />} 
              size="small"
              disabled={!isCurrentUser || !isToday || record.sign_in_time}
              onClick={() => handleSignIn(record.Staff?.id)}
            >
              Sign In
            </Button>
            <Button 
              type="default" 
              icon={<LogoutOutlined />} 
              size="small"
              disabled={!isCurrentUser || !isToday || !record.sign_in_time || record.sign_out_time}
              onClick={() => handleSignOut(record.Staff?.id)}
            >
              Sign Out
            </Button>
          </Space>
        );
      },
    },
  ];

  if (loading) return <Spin size="large" />;
  if (error) return <Alert message="Error" description={error.message} type="error" />;

  return (
    <Card title="Department Attendance" extra={
      <Space>
        <RangePicker
          value={dateRange}
          onChange={setDateRange}
          format="YYYY-MM-DD"
        />
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          placeholder="Filter by status"
          allowClear
          style={{ width: 150 }}
        >
          <Option value="present">Present</Option>
          <Option value="absent">Absent</Option>
          <Option value="late">Late</Option>
          <Option value="half_day">Half Day</Option>
        </Select>
      </Space>
    }>
      <div className="mb-4">
        <Space>
          <Tag color="blue">Total: {statistics.total}</Tag>
          <Tag color="green">Present: {statistics.present}</Tag>
          <Tag color="red">Absent: {statistics.absent}</Tag>
          <Tag color="orange">Late: {statistics.late}</Tag>
          <Tag color="geekblue">Rate: {statistics.attendance_rate}%</Tag>
        </Space>
      </div>
      
      <Table
        columns={columns}
        dataSource={attendanceData}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: true }}
      />
    </Card>
  );
};

export default AttendanceTable;