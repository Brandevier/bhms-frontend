import React, { useEffect } from 'react';
import { Card, Row, Col, Statistic, Progress } from 'antd';
import { 
  ArrowUpOutlined,
  ArrowDownOutlined,
  DashboardOutlined,
  BarChartOutlined  
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { getORStatistics, getEquipmentStatistics } from '../../../../../redux/slice/theatreSlice';

const AnalyticsPanel = () => {
  const dispatch = useDispatch();
  const { orStatistics, equipmentStatistics, loading } = useSelector(state => state.theatre);

  useEffect(() => {
    dispatch(getORStatistics());
    dispatch(getEquipmentStatistics());
  }, [dispatch]);

  const stats = [
    { 
      title: 'OR Utilization', 
      value: `${orStatistics?.occupied ? Math.round((orStatistics.occupied / orStatistics.total) * 100) : 0}%`, 
      trend: 'up', 
      change: '5%',
      current: orStatistics?.occupied || 0,
      total: orStatistics?.total || 0
    },
    { 
      title: 'Equipment Available', 
      value: `${equipmentStatistics?.available || 0}`, 
      trend: 'up', 
      change: `${equipmentStatistics?.total || 0} total`,
      current: equipmentStatistics?.available || 0,
      total: equipmentStatistics?.total || 0
    },
    { 
      title: 'Today\'s Surgeries', 
      value: `${orStatistics?.today_surgeries || 0}`, 
      trend: orStatistics?.today_surgeries > 0 ? 'up' : 'down', 
      change: 'scheduled',
      current: orStatistics?.today_surgeries || 0,
      total: orStatistics?.total || 0
    },
    { 
      title: 'Rooms Available', 
      value: `${orStatistics?.available || 0}`, 
      trend: 'down', 
      change: `${orStatistics?.occupied || 0} in use`,
      current: orStatistics?.available || 0,
      total: orStatistics?.total || 0
    },
  ];

  const upcomingMaintenance = equipmentStatistics?.upcoming_maintenance ? [
    { equipment: 'Equipment needing service', daysLeft: equipmentStatistics.upcoming_maintenance },
  ] : [];

  return (
    <Card 
      title={
        <div className="flex items-center">
          <BarChartOutlined className="mr-2" />
          <span>Resource Analytics</span>
        </div>
      } 
      bordered={false} 
      className="shadow-sm h-full"
      loading={loading}
    >
      <Row gutter={[16, 16]}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} key={index}>
            <Card size="small">
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={
                  stat.trend === 'up' ? 
                    <ArrowUpOutlined className="text-green-500" /> : 
                    <ArrowDownOutlined className="text-red-500" />
                }
                suffix={
                  <span className={stat.trend === 'up' ? 'text-green-500 text-sm' : 'text-red-500 text-sm'}>
                    {stat.change}
                  </span>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
      
      {upcomingMaintenance.length > 0 && (
        <div className="mt-4">
          <div className="text-gray-600 mb-2">Upcoming Maintenance</div>
          {upcomingMaintenance.map((item, index) => (
            <div key={index} className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span>{item.equipment}</span>
                <span>{item.daysLeft} items</span>
              </div>
              <Progress 
                percent={100 - (item.daysLeft / 90 * 100)} 
                showInfo={false} 
                strokeColor={item.daysLeft < 30 ? '#ff4d4f' : '#faad14'}
              />
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default AnalyticsPanel;
