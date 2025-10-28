import React from 'react';
import { Button, Space } from 'antd';
import {
  PrinterOutlined,
  ReloadOutlined,
  TeamOutlined,
  RobotOutlined,
  QrcodeOutlined
} from '@ant-design/icons';

const HeaderActions = ({ 
  loading, 
  onRefresh, 
  onAddShift, 
  onOpenShuffler, 
  onPrint 
}) => {
  return (
    <Space>
      <Button 
        icon={<RobotOutlined />} 
        className="hidden md:inline-flex items-center bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 hover:from-purple-600 hover:to-pink-600"
        onClick={onOpenShuffler}
      >
        AI Shuffler
      </Button>
      <Button 
        icon={<TeamOutlined />} 
        className="hidden md:inline-flex items-center bg-blue-500 text-white border-0 hover:bg-blue-600"
        onClick={onAddShift}
      >
        Add Shift
      </Button>
      <Button
        icon={<ReloadOutlined />}
        onClick={onRefresh}
        loading={loading}
        className="border-gray-300 hover:border-blue-500"
      >
        <span className="hidden md:inline">Refresh</span>
      </Button>
      <Button
        icon={<PrinterOutlined />}
        onClick={onPrint}
        className="hidden md:inline-flex items-center border-gray-300 hover:border-blue-500"
      >
        Print
      </Button>
    </Space>
  );
};

export default HeaderActions;