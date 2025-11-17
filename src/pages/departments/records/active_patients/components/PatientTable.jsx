import React, { useState } from 'react';
import { Table, Badge, Button, Space, Tooltip, Tag, Avatar, Card, Drawer, Grid } from 'antd';
import { 
  FileSearchOutlined, 
  HistoryOutlined, 
  PlusCircleOutlined,
  UserOutlined,
  IdcardOutlined,
  MenuOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import TonitelButton from '../../../../../components/common/TonitelButton';

const { useBreakpoint } = Grid;

const PatientTable = ({ patients, loading, onInitiateVisit, searchTerm }) => {
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const filteredPatients = patients?.filter(p =>
    `${p.first_name} ${p.last_name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    p.folder_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.phone_number?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Mobile view columns
  const mobileColumns = [
    {
      title: 'Patient',
      key: 'mobile-patient',
      render: (_, record) => (
        <div 
          className="flex items-center space-x-3 p-2 border-b border-gray-100 cursor-pointer"
          onClick={() => {
            setSelectedPatient(record);
            setDrawerVisible(true);
          }}
        >
          <Avatar 
            size="large" 
            src={record.photo} 
            icon={<UserOutlined />}
            className="bg-gradient-to-r from-blue-500 to-purple-500"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-800 text-sm truncate">
                {record.patient?.first_name} {record.patient?.middle_name || ''} {record.patient?.last_name}
              </span>
              <Badge 
                status={record.status?.toLowerCase() === 'active' ? 'success' : 'default'} 
                size="small"
              />
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <Tag 
                color={record.patient?.gender === 'M' ? 'blue' : 'pink'}
                className="text-xs capitalize"
              >
                {record.patient?.gender === 'M' ? 'Male' : 'Female'}
              </Tag>
              <span className="font-mono text-xs text-gray-500 bg-gray-100 px-1 rounded">
                {record.attendance_number}
              </span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-2">
                <IdcardOutlined 
                  className={record.patient?.has_insurance ? "text-green-500 text-xs" : "text-gray-400 text-xs"} 
                />
                <span className={`text-xs ${record.patient?.has_insurance ? 'text-green-600' : 'text-gray-500'}`}>
                  {record.patient?.has_insurance ? 'Insured' : 'Not Insured'}
                </span>
              </div>
              <span className="text-xs text-gray-500">
                {record.createdAt ? dayjs(record.createdAt).format('MMM D') : 'N/A'}
              </span>
            </div>
          </div>
          <MenuOutlined className="text-gray-400" />
        </div>
      )
    }
  ];

  // Desktop view columns
  const desktopColumns = [
    {
      title: 'Patient Information',
      dataIndex: 'first_name',
      key: 'name',
      width: 250,
      sorter: (a, b) => `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`),
      render: (_, record) => (
        <div className="flex items-center space-x-3">
          <Avatar 
            size="large" 
            src={record.photo} 
            icon={<UserOutlined />}
            className="bg-gradient-to-r from-blue-500 to-purple-500"
          />
          <div className="flex flex-col">
            <span className="font-semibold text-gray-800 text-sm">
              {record.patient?.first_name} {record.patient?.middle_name || ''} {record.patient?.last_name}
            </span>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs text-gray-500 capitalize">{record.patient?.gender}</span>
              <span className="text-gray-300">•</span>
              <span className="text-xs text-gray-500">
                {record.patient?.date_of_birth ? dayjs(record.patient?.date_of_birth).format('MMM DD, YYYY') : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Folder Number',
      dataIndex: 'attendance_number',
      key: 'attendance_number',
      width: 120,
      sorter: (a, b) => a.attendance_number?.localeCompare(b.attendance_number),
      responsive: ['md'],
      render: (text) => (
        <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">
          {text}
        </span>
      )
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      width: 100,
      sorter: (a, b) => a.patient?.gender?.localeCompare(b.patient?.gender),
      responsive: ['md'],
      render: (_, record) => {
        const gender = record.patient?.gender;
        return (
          <Tag 
            color={gender === 'M' ? 'blue' : gender === 'F' ? 'pink' : 'default'}
            className="capitalize font-medium text-xs"
          >
            {gender === 'M' ? 'Male' : gender === 'F' ? 'Female' : 'Other'}
          </Tag>
        );
      }
    },
    {
      title: 'Insurance',
      dataIndex: 'has_insurance',
      key: 'insurance',
      width: 120,
      sorter: (a, b) => (a.patient?.has_insurance ? 1 : 0) - (b.patient?.has_insurance ? 1 : 0),
      responsive: ['sm'],
      render: (_, record) => (
        <div className="flex items-center space-x-2">
          <IdcardOutlined className={record.patient?.has_insurance ? "text-green-500 text-sm" : "text-gray-400 text-sm"} />
          <span className={`text-xs font-medium ${record.patient?.has_insurance ? 'text-green-600' : 'text-gray-500'}`}>
            {record.patient?.has_insurance ? 'Insured' : 'Not Insured'}
          </span>
          {record.patient?.has_insurance && record.insurance?.insurance_provider && (
            <Tag color="green" className="text-xs">
              {record.insurance.insurance_provider}
            </Tag>
          )}
        </div>
      )
    },
    {
      title: 'Date Visited',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 140,
      sorter: (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0),
      responsive: ['lg'],
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
      responsive: ['sm'],
      render: (status) => {
        const normalizedStatus = status?.toLowerCase();
        return (
          <Badge
            status={normalizedStatus === 'active' ? 'success' : 'default'}
            text={
              <span className={`text-xs font-medium ${
                normalizedStatus === 'active' ? 'text-green-600' : 'text-gray-500'
              }`}>
                {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
              </span>
            }
          />
        );
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 180,
      fixed: screens.lg ? 'right' : false,
      responsive: ['sm'],
      render: (_, record) => {
        const normalizedStatus = record.status?.toLowerCase();
        
        return (
          <Space size="small">
            <Tooltip title="View Patient Details">
              <Button
                icon={<FileSearchOutlined />}
                size="small"
                className="border-gray-200 text-gray-600 hover:border-blue-500 hover:text-blue-600"
                onClick={() => navigate(`/shared/records/folder/${record.id}`, { id: record.id })}
              />
            </Tooltip>

            {normalizedStatus === 'active' ? (
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
                <TonitelButton
                  size="sm"
                  onClick={() => onInitiateVisit(record)}
                  icon={<PlusCircleOutlined />}
                >
                  Visit
                </TonitelButton>
              </Tooltip>
            )}
          </Space>
        );
      }
    }
  ];

  // Choose columns based on screen size
  const columns = screens.xs ? mobileColumns : desktopColumns;

  // Mobile Patient Detail Drawer
  const PatientDetailDrawer = () => (
    <Drawer
      title="Patient Details"
      placement="right"
      onClose={() => setDrawerVisible(false)}
      open={drawerVisible}
      width={screens.xs ? '100%' : 400}
      extra={
        <Button 
          type="text" 
          icon={<CloseOutlined />} 
          onClick={() => setDrawerVisible(false)}
        />
      }
    >
      {selectedPatient && (
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Avatar 
              size={64} 
              src={selectedPatient.photo} 
              icon={<UserOutlined />}
              className="bg-gradient-to-r from-blue-500 to-purple-500"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 text-lg">
                {selectedPatient.patient?.first_name} {selectedPatient.patient?.middle_name || ''} {selectedPatient.patient?.last_name}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <Badge 
                  status={selectedPatient.status?.toLowerCase() === 'active' ? 'success' : 'default'}
                  text={
                    <span className="text-xs text-gray-600">
                      {selectedPatient.status || 'Unknown'}
                    </span>
                  }
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-xs text-gray-500">Gender</div>
              <div className="font-medium text-sm">
                {selectedPatient.patient?.gender === 'M' ? 'Male' : 'Female'}
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-xs text-gray-500">Folder No.</div>
              <div className="font-mono text-sm">{selectedPatient.attendance_number}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-xs text-gray-500">Insurance</div>
              <div className="font-medium text-sm flex items-center space-x-1">
                <IdcardOutlined className={selectedPatient.patient?.has_insurance ? "text-green-500" : "text-gray-400"} />
                <span className={selectedPatient.patient?.has_insurance ? "text-green-600" : "text-gray-600"}>
                  {selectedPatient.patient?.has_insurance ? 'Insured' : 'Not Insured'}
                </span>
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-xs text-gray-500">Date Visited</div>
              <div className="font-medium text-sm">
                {selectedPatient.createdAt ? dayjs(selectedPatient.createdAt).format('MMM D, YYYY') : 'N/A'}
              </div>
            </div>
          </div>

          {selectedPatient.patient?.date_of_birth && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-xs text-gray-500">Date of Birth</div>
              <div className="font-medium text-sm">
                {dayjs(selectedPatient.patient.date_of_birth).format('MMM D, YYYY')}
              </div>
            </div>
          )}

          <div className="flex space-x-2 pt-4 border-t">
            <Button
              icon={<FileSearchOutlined />}
              className="flex-1"
              onClick={() => {
                navigate(`/shared/records/folder/${selectedPatient.id}`, { id: selectedPatient.id });
                setDrawerVisible(false);
              }}
            >
              View Details
            </Button>
            
            {selectedPatient.status?.toLowerCase() !== 'active' && (
              <TonitelButton
                className="flex-1"
                onClick={() => {
                  onInitiateVisit(selectedPatient);
                  setDrawerVisible(false);
                }}
                icon={<PlusCircleOutlined />}
              >
                Start Visit
              </TonitelButton>
            )}
          </div>
        </div>
      )}
    </Drawer>
  );

  return (
    <>
      <Card className="border-0 shadow-sm rounded-xl bg-white">
        <Table
          columns={columns}
          dataSource={filteredPatients}
          rowKey="id"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} patients`,
            pageSizeOptions: ['10', '20', '50', '100'],
            size: 'small',
            simple: screens.xs,
          }}
          scroll={{ x: screens.xs ? false : 1000 }}
          size="small"
          className="patient-table"
          rowClassName="hover:bg-blue-50 transition-colors duration-150"
          // Mobile-specific props
          {...(screens.xs && {
            showHeader: false,
            bordered: false,
            pagination: {
              ...(screens.xs && { simple: true, size: 'small' })
            }
          })}
        />
      </Card>
      
      <PatientDetailDrawer />
    </>
  );
};

export default PatientTable;