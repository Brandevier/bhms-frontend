import React from 'react';
import { Table, Badge, Button, Space, Tooltip, Tag, Checkbox } from 'antd';
import { 
  FileSearchOutlined, 
  HistoryOutlined, 
  PlusCircleOutlined,
  InsuranceOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const PatientTable = ({ 
  patients, 
  loading, 
  onInitiateVisit, 
  searchTerm, 
  selectedRows = [], // Default to empty array
  onSelectedRowsChange = () => {} // Default empty function
}) => {
  const navigate = useNavigate();

  const filteredPatients = patients?.filter(p =>
    `${p.first_name} ${p.last_name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    p.folder_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.phone_number?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Safe selected rows array
  const safeSelectedRows = Array.isArray(selectedRows) ? selectedRows : [];

  // Row selection configuration
  const rowSelection = {
    selectedRowKeys: safeSelectedRows,
    onChange: onSelectedRowsChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
    ],
  };

  const columns = [
    {
      title: '',
      key: 'selection',
      width: 60,
      render: (_, record) => (
        <Checkbox 
          checked={safeSelectedRows.includes(record.id)}
          onChange={(e) => {
            if (e.target.checked) {
              onSelectedRowsChange([...safeSelectedRows, record.id]);
            } else {
              onSelectedRowsChange(safeSelectedRows.filter(id => id !== record.id));
            }
          }}
        />
      )
    },
    {
      title: 'Patient Name',
      dataIndex: 'first_name',
      key: 'name',
      width: 200,
      sorter: (a, b) => `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`),
      render: (_, record) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800 text-sm">
            {record.first_name} {record.middle_name || ''} {record.last_name}
          </span>
          <span className="text-xs text-gray-500 mt-1">
            ID: {record.folder_number}
          </span>
        </div>
      )
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      width: 100,
      sorter: (a, b) => (a.gender || '').localeCompare(b.gender || ''),
      render: (gender) => (
        <Tag 
          color={gender === 'M' ? 'blue' : gender === 'F' ? 'pink' : 'default'}
          className="capitalize font-medium text-xs"
        >
          {gender === 'M' ? 'Male' : gender === 'F' ? 'Female' : 'Other'}
        </Tag>
      )
    },
    {
      title: 'Insurance',
      dataIndex: 'has_insurance',
      key: 'insurance',
      width: 120,
      sorter: (a, b) => (a.has_insurance ? 1 : 0) - (b.has_insurance ? 1 : 0),
      render: (hasInsurance, record) => (
        <div className="flex items-center space-x-2">
          {hasInsurance ? (
            <>
              <InsuranceOutlined className="text-green-500 text-sm" />
              <span className="text-xs text-green-600 font-medium">Insured</span>
              {record.insurance?.insurance_provider && (
                <Tag color="green" className="text-xs">
                  {record.insurance.insurance_provider}
                </Tag>
              )}
            </>
          ) : (
            <>
              <InsuranceOutlined className="text-gray-400 text-sm" />
              <span className="text-xs text-gray-500">Not Insured</span>
            </>
          )}
        </div>
      )
    },
    {
      title: 'Date Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 140,
      sorter: (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0),
      render: (date) => (
        <div className="text-xs text-gray-600">
          {date ? dayjs(date).format('MMM D, YYYY') : 'N/A'}
        </div>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      sorter: (a, b) => (a.status || '').localeCompare(b.status || ''),
      render: (status) => (
        <Badge
          status={status === 'active' ? 'success' : 'default'}
          text={
            <span className={`text-xs font-medium ${
              status === 'active' ? 'text-green-600' : 'text-gray-500'
            }`}>
              {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
            </span>
          }
        />
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 180,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Patient Details">
            <Button
              icon={<FileSearchOutlined />}
              size="small"
              className="border-gray-200 text-gray-600 hover:border-blue-500 hover:text-blue-600"
              onClick={() => navigate(`/shared/records/folder/${record.id}`, { id: record.id })}
            />
          </Tooltip>

          {record.status === 'active' ? (
            <Tooltip title="Visit In Progress">
              <Button
                type="dashed"
                size="small"
                disabled
                className="text-orange-500 border-orange-200 text-xs"
              >
                <HistoryOutlined className="mr-1" />
                In Visit
              </Button>
            </Tooltip>
          ) : (
            <Tooltip title="Initiate New Visit">
              <Button
                type="primary"
                size="small"
                onClick={() => onInitiateVisit(record)}
                className="bg-blue-500 border-blue-500 hover:bg-blue-600 text-xs h-7"
              >
                <PlusCircleOutlined className="mr-1" />
                Visit
              </Button>
            </Tooltip>
          )}
        </Space>
      )
    }
  ];

  return (
    <Table
      columns={columns}
      dataSource={filteredPatients}
      rowKey="id"
      loading={loading}
      rowSelection={rowSelection}
      pagination={{
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => 
          `${range[0]}-${range[1]} of ${total} patients`,
        pageSizeOptions: ['10', '20', '50', '100'],
        size: 'small'
      }}
      scroll={{ x: 1000 }}
      size="small"
      className="patient-table"
      rowClassName="hover:bg-blue-50 transition-colors duration-150"
    />
  );
};

export default PatientTable;