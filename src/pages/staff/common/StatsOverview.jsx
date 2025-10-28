import React from 'react';
import { Card, Progress, Statistic, Row, Col } from 'antd';

const StatsOverview = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <Statistic 
          title="Total Leave Days (Annual)" 
          value={21} 
          suffix="/ 25 days" 
        />
        <Progress percent={84} status="active" />
      </Card>
      <Card>
        <Statistic 
          title="Sick Leave Balance" 
          value={12} 
          suffix="/ 15 days" 
        />
        <Progress percent={80} status="active" />
      </Card>
      <Card>
        <Statistic 
          title="Attendance This Month" 
          value={18} 
          suffix="/ 20 days" 
        />
        <Progress percent={90} status="active" />
      </Card>
    </div>
  );
};

export default StatsOverview;