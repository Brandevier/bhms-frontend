import React, { useEffect, useState } from 'react';
import {
  Table,
  Input,
  Button,
  Badge,
  Space,
  Card,
  message,
  Tooltip,
  Empty,
} from 'antd';
import {
  FileSearchOutlined,
  HistoryOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchPatients,startNewVisit } from '../../../redux/slice/recordSlice';


const { Search } = Input;

const AllPatientsRecords = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

const patients = useSelector((state) => state.records?.activeVisits ?? []);
const loading = useSelector((state) => state.records?.loading ?? false);
const error = useSelector(state => state.records.error);
  

  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filtered = patients?.filter(p =>
    `${p.first_name} ${p.last_name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    p.folder_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.phone_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    dispatch(fetchPatients())
      .unwrap()
      .catch(() => message.error('Failed to load patient records'));
  }, [dispatch]);

  const handleVisit = (patient_id,) => {
    
    dispatch(startNewVisit( patient_id))
      .unwrap()
      .then(() => {
        message.success('Visit initiated successfully');
        
      })
      .catch(() => message.error('Failed to initiate visit'));

  };

  const columns = [
    {
      title: 'Patient',
      dataIndex: 'first_name',
      key: 'name',
      render: (_, record) => (
        <div>
          <strong>{record.first_name} {record.middle_name || ''} {record.last_name}</strong><br />
          <span className="text-xs text-gray-500">
            {record.gender} • {record.nhis_number}
          </span>
        </div>
      )
    },
    {
      title: 'Folder No.',
      dataIndex: 'folder_number',
      render: text => <span className="font-mono">{text}</span>
    },
    {
      title: 'Ghana Card',
      dataIndex: 'ghana_card_number',
      render: text => <span>{text}</span>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => (
        <Badge
          status={status === 'active' ? 'success' : 'default'}
          text={status?.charAt(0).toUpperCase() + status?.slice(1)}
        />
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              icon={<FileSearchOutlined />}
              size="small"
              onClick={() => navigate(`/patients/${record.id}`)}
            />
          </Tooltip>

          {record.status === 'active' ? (
            <Tooltip title="Visit In Progress">
              <Button
                type="dashed"
                icon={<HistoryOutlined />}
                size="small"
                disabled
              >
                In Progress
              </Button>
            </Tooltip>
          ) : (
            <Tooltip title="Initiate Visit">
              <Button
                type="primary"
                icon={<PlusCircleOutlined />}
                size="small"
                onClick={() => handleVisit(record.id)}
              >
                Initiate Visit
              </Button>
            </Tooltip>
          )}
        </Space>
      )
    }
  ];


//   initiate visit

  return (
    <div className="p-4">
      <Card
        title="All Patients"
        extra={
          <Search
            placeholder="Search patients..."
            allowClear
            enterButton
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 300 }}
          />
        }
      >
        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          loading={loading}
          locale={{ emptyText: <Empty description="No patients found" /> }}
          pagination={{
            current: page,
            pageSize,
            total: filtered?.length || 0,
            showSizeChanger: true,
            onChange: (page, pageSize) => {
              setPage(page);
              setPageSize(pageSize);
            }
          }}
        />
      </Card>
    </div>
  );
};

export default AllPatientsRecords;
