import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVisitStatistics } from '../../redux/slice/recordSlice';
import { Card, Row, Col, Spin, Alert, Tag, Avatar, Descriptions, Progress, Divider, Empty } from 'antd';
import { 
  UserOutlined, ClockCircleOutlined, MedicineBoxOutlined, 
  ExperimentOutlined, FileTextOutlined, HeartOutlined, 
  CalendarOutlined, TeamOutlined, BankOutlined
} from '@ant-design/icons';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import moment from 'moment';

// COLORS for charts
const CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#f5222d', '#52c41a'];

// Patient Profile Header Component
const PatientProfileHeader = ({ visit }) => {
  const patient = visit?.patient;
  
  if (!patient) return null;

  return (
    <Card className="mb-4 border-0 shadow-sm rounded-xl" bodyStyle={{ padding: 0 }}>
      <div className="flex flex-col md:flex-row">
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-6 flex items-center justify-center md:w-48">
          <div className="text-center">
            <Avatar size={80} icon={<UserOutlined />} className="bg-white text-blue-500" />
            <div className="mt-3 text-white">
              <div className="font-semibold text-lg">
                {patient.first_name} {patient.middle_name} {patient.last_name}
              </div>
              <div className="text-blue-100 text-sm mt-1">
                {patient.folder_number || 'N/A'}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 p-4">
          <Row gutter={[16, 8]}>
            <Col xs={24} sm={12} md={6}>
              <div className="text-gray-500 text-xs uppercase tracking-wide">Gender / Age</div>
              <div className="font-medium">
                {patient.gender === 'M' ? 'Male' : patient.gender === 'F' ? 'Female' : 'N/A'} / 
                {patient.date_of_birth ? ` ${moment().diff(moment(patient.date_of_birth), 'years')} years` : ' N/A'}
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div className="text-gray-500 text-xs uppercase tracking-wide">Phone</div>
              <div className="font-medium">{patient.phone_number || 'N/A'}</div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div className="text-gray-500 text-xs uppercase tracking-wide">Insurance</div>
              <div>
                <Tag color={patient.has_insurance ? 'green' : 'default'}>
                  {patient.has_insurance ? 'Insured' : 'Self Pay'}
                </Tag>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div className="text-gray-500 text-xs uppercase tracking-wide">NHIS Number</div>
              <div className="font-medium">{patient.nhis_number || 'N/A'}</div>
            </Col>
          </Row>
          
          <Divider className="my-3" />
          
          <Row gutter={[16, 8]}>
            <Col xs={24} sm={12} md={6}>
              <div className="text-gray-500 text-xs uppercase tracking-wide">Visit Status</div>
              <Tag color={visit.status === 'Active' ? 'green' : 'blue'} className="mt-1">
                {visit.status || 'N/A'}
              </Tag>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div className="text-gray-500 text-xs uppercase tracking-wide">Admission Status</div>
              <Tag color={visit.admission_status === 'admitted' ? 'purple' : 'cyan'} className="mt-1">
                {visit.admission_status === 'admitted' ? 'Inpatient' : 'Outpatient'}
              </Tag>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div className="text-gray-500 text-xs uppercase tracking-wide">Attendance Type</div>
              <div className="font-medium mt-1">{visit.attendance_type || 'N/A'}</div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div className="text-gray-500 text-xs uppercase tracking-wide">Visit Type</div>
              <div className="font-medium mt-1">{visit.visit_type || 'N/A'}</div>
            </Col>
          </Row>
        </div>
      </div>
    </Card>
  );
};

// Visit Timeline Card
const VisitTimelineCard = ({ statistics }) => {
  const admissionDate = statistics.admissionDate ? moment(statistics.admissionDate) : null;
  const dischargeDate = statistics.dischargeDate ? moment(statistics.dischargeDate) : null;
  const now = moment();
  const totalStay = admissionDate ? now.diff(admissionDate, 'days') : 0;
  const maxExpectedStay = 30;
  const progressPercent = Math.min((totalStay / maxExpectedStay) * 100, 100);

  return (
    <Card 
      title={<><ClockCircleOutlined className="mr-2" />Visit Timeline</>} 
      className="border-0 shadow-sm rounded-xl h-full"
    >
      <div className="space-y-4">
        {statistics.admissionStatus === 'admitted' && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Length of Stay</span>
              <span className="text-sm font-medium">{totalStay} days</span>
            </div>
            <Progress 
              percent={Math.round(progressPercent)} 
              showInfo={false}
              strokeColor={progressPercent > 80 ? '#f5222d' : '#1890ff'}
              trailColor="#f0f0f0"
            />
          </div>
        )}
        <Descriptions column={1} size="small" className="mt-4">
          <Descriptions.Item label="Visit Status">
            <Tag color={statistics.visitStatus === 'Active' ? 'green' : 'blue'}>
              {statistics.visitStatus || 'N/A'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Admission Status">
            <Tag color={statistics.admissionStatus === 'admitted' ? 'purple' : 'cyan'}>
              {statistics.admissionStatus === 'admitted' ? 'Admitted' : 'Not Admitted'}
            </Tag>
          </Descriptions.Item>
          {admissionDate && (
            <Descriptions.Item label="Admission Date">
              <CalendarOutlined className="mr-1 text-blue-500" />
              {admissionDate.format('MMM DD, YYYY')}
            </Descriptions.Item>
          )}
          {dischargeDate && (
            <Descriptions.Item label="Discharge Date">
              <CalendarOutlined className="mr-1 text-green-500" />
              {dischargeDate.format('MMM DD, YYYY')}
            </Descriptions.Item>
          )}
          {statistics.dischargeType && (
            <Descriptions.Item label="Discharge Type">
              {statistics.dischargeType}
            </Descriptions.Item>
          )}
          {statistics.lengthOfStay && (
            <Descriptions.Item label="Total Stay">
              {statistics.lengthOfStay} days
            </Descriptions.Item>
          )}
        </Descriptions>
      </div>
    </Card>
  );
};

// KPI Statistics Cards
const KPICards = ({ statistics }) => {
  const kpis = [
    { title: 'Total Claims', value: statistics.totalClaims || 0, icon: <FileTextOutlined />, color: '#1890ff' },
    { title: 'Claim Items', value: statistics.totalClaimItems || 0, icon: <BankOutlined />, color: '#52c41a' },
    { title: 'Prescriptions', value: statistics.totalPrescriptions || 0, icon: <MedicineBoxOutlined />, color: '#faad14' },
    { title: 'Lab Tests', value: statistics.totalLabTests || 0, icon: <ExperimentOutlined />, color: '#f5222d' },
    { title: 'Diagnoses', value: statistics.totalDiagnoses || 0, icon: <HeartOutlined />, color: '#722ed1' },
    { title: 'Procedures', value: statistics.totalProcedures || 0, icon: <TeamOutlined />, color: '#13c2c2' }
  ];

  return (
    <Row gutter={[16, 16]} className="mb-4">
      {kpis.map((kpi, index) => (
        <Col xs={12} sm={8} md={4} key={index}>
          <Card size="small" className="border-0 shadow-sm rounded-xl hover:shadow-md transition-shadow">
            <div className="text-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2" style={{ backgroundColor: `${kpi.color}15`, color: kpi.color }}>
                {kpi.icon}
              </div>
              <div className="text-2xl font-bold" style={{ color: kpi.color }}>{kpi.value}</div>
              <div className="text-xs text-gray-500">{kpi.title}</div>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

// Status Donut Charts
const StatusDonuts = ({ statistics }) => {
  const renderDonut = (title, data, colors) => {
    if (!data || data.length === 0) {
      return (
        <div className="flex items-center justify-center h-48 text-gray-400">
          <Empty description="No data" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </div>
      );
    }
    return (
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
            {data.map((entry, index) => (<Cell key={`cell-${index}`} fill={colors[index % colors.length]} />))}
          </Pie>
          <RechartsTooltip />
          <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: '11px' }} />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  const claimData = Object.entries(statistics.claimStatusCounts || {}).map(([status, count]) => ({ name: status === 'undefined' ? 'Uncategorized' : status, value: count }));
  const prescriptionData = Object.entries(statistics.prescriptionStatusCounts || {}).map(([status, count]) => ({ name: status || 'Unknown', value: count }));
  const labTestData = Object.entries(statistics.labTestStatusCounts || {}).map(([status, count]) => ({ name: status || 'Unknown', value: count }));
  const procedureData = Object.entries(statistics.procedureStatusCounts || {}).map(([status, count]) => ({ name: status || 'Unknown', value: count }));

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} md={12}><Card title={<><FileTextOutlined className="mr-2" />Claims Status</>} size="small" className="border-0 shadow-sm rounded-xl h-full">{renderDonut('Claims', claimData, CHART_COLORS)}</Card></Col>
      <Col xs={24} md={12}><Card title={<><MedicineBoxOutlined className="mr-2" />Prescriptions Status</>} size="small" className="border-0 shadow-sm rounded-xl h-full">{renderDonut('Prescriptions', prescriptionData, CHART_COLORS)}</Card></Col>
      <Col xs={24} md={12}><Card title={<><ExperimentOutlined className="mr-2" />Lab Tests Status</>} size="small" className="border-0 shadow-sm rounded-xl h-full">{renderDonut('Lab Tests', labTestData, CHART_COLORS)}</Card></Col>
      <Col xs={24} md={12}><Card title={<><TeamOutlined className="mr-2" />Procedures Status</>} size="small" className="border-0 shadow-sm rounded-xl h-full">{renderDonut('Procedures', procedureData, CHART_COLORS)}</Card></Col>
    </Row>
  );
};

// Procedures & Diagnoses Overview
const ProceduresDiagnoses = ({ statistics }) => {
  const procedureData = Object.entries(statistics.procedureStatusCounts || {}).map(([status, count]) => ({ status, count }));

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} md={12}>
        <Card title={<><TeamOutlined className="mr-2" />Procedures Distribution</>} size="small" className="border-0 shadow-sm rounded-xl h-72">
          {procedureData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={procedureData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="status" type="category" width={80} tick={{ fontSize: 11 }} />
                <RechartsTooltip />
                <Bar dataKey="count" fill="#722ed1" name="Procedures" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400"><Empty description="No procedure data" image={Empty.PRESENTED_IMAGE_SIMPLE} /></div>
          )}
        </Card>
      </Col>
      <Col xs={24} md={12}>
        <Card title={<><HeartOutlined className="mr-2" />Diagnoses Overview</>} size="small" className="border-0 shadow-sm rounded-xl h-72">
          <div className="flex flex-col justify-center h-full space-y-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-4xl font-bold text-purple-600">{statistics.totalDiagnoses || 0}</div>
              <div className="text-gray-500 mt-2">Total Diagnoses</div>
            </div>
            {Object.entries(statistics.claimStatusCounts || {}).length > 0 && (
              <div>
                <div className="text-sm font-medium mb-2">Claims by Status</div>
                <div className="space-y-2">
                  {Object.entries(statistics.claimStatusCounts || {}).map(([status, count], index) => (
                    <div key={status} className="flex items-center justify-between">
                      <Tag color={CHART_COLORS[index % CHART_COLORS.length]}>{status || 'Unknown'}</Tag>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      </Col>
    </Row>
  );
};

// Claim Items Breakdown
const ClaimItemsBreakdown = ({ statistics }) => {
  const claimItemsData = [
    { category: 'Claims', value: statistics.totalClaims || 0 },
    { category: 'Claim Items', value: statistics.totalClaimItems || 0 },
    { category: 'Prescriptions', value: statistics.totalPrescriptions || 0 },
    { category: 'Lab Tests', value: statistics.totalLabTests || 0 },
  ];

  return (
    <Card title={<><BankOutlined className="mr-2" />Service Summary</>} size="small" className="border-0 shadow-sm rounded-xl h-72">
      {claimItemsData.some(d => d.value > 0) ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={claimItemsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <RechartsTooltip />
            <Bar dataKey="value" fill="#1890ff" name="Count" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-400"><Empty description="No claim data" image={Empty.PRESENTED_IMAGE_SIMPLE} /></div>
      )}
    </Card>
  );
};

// Main Overview Component
const Overview = ({ visit_id }) => {
  const dispatch = useDispatch();
  const { visit_statistics, currentVisit, statsLoading, error } = useSelector((state) => state.records);

  useEffect(() => {
    if (visit_id) {
      dispatch(fetchVisitStatistics(visit_id));
    }
  }, [dispatch, visit_id]);

  if (statsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert message="Error" description={error.message || 'Failed to load visit statistics'} type="error" showIcon />
    );
  }

  if (!visit_statistics) {
    return (
      <Alert message="No Data" description="No statistics available for this visit" type="info" showIcon />
    );
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <PatientProfileHeader visit={currentVisit} />
      <KPICards statistics={visit_statistics} />
      <Row gutter={[16, 16]} className="mb-4">
        <Col xs={24} lg={8}><VisitTimelineCard statistics={visit_statistics} /></Col>
        <Col xs={24} lg={16}><ClaimItemsBreakdown statistics={visit_statistics} /></Col>
      </Row>
      <div className="mb-4"><StatusDonuts statistics={visit_statistics} /></div>
      <ProceduresDiagnoses statistics={visit_statistics} />
    </div>
  );
};

export default Overview;

