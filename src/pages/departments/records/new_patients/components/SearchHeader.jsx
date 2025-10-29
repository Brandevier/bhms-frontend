import React from 'react';
import { Input, Button, Space, Tooltip, Popover, Badge } from 'antd';
import { 
  AudioOutlined, 
  StopOutlined, 
  UserAddOutlined,
  SearchOutlined 
} from '@ant-design/icons';
import TonitelButton from '../../../../../components/common/TonitelButton';


const { Search } = Input;

const SearchHeader = ({ 
  searchTerm, 
  onSearchChange, 
  isListening, 
  onStartVoiceSearch, 
  onStopVoiceSearch, 
  browserSupport, 
  onRegisterPatient,
  patientCount 
}) => {
  const voiceSearchButton = (
    <Popover content={isListening ? "Click to stop listening" : "Start voice search"}>
      <Button
        type="text"
        icon={isListening ? <StopOutlined /> : <AudioOutlined />}
        onClick={isListening ? onStopVoiceSearch : onStartVoiceSearch}
        className={isListening ? 'text-red-500' : 'text-blue-500'}
        size="small"
      />
    </Popover>
  );

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
      <div className="flex items-center space-x-4">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl">
          <SearchOutlined className="text-white text-2xl" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 m-0">
            Patient Records
          </h1>
          <p className="text-gray-600 m-0">
            Manage and search all patient information
          </p>
        </div>
        <Badge 
          count={patientCount} 
          showZero 
          style={{ backgroundColor: '#1890ff' }}
          className="ml-2"
        />
      </div>

      <Space size="middle">
        <Search
          placeholder="Search patients by name, folder number, or phone..."
          allowClear
          enterButton={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          addonAfter={browserSupport ? voiceSearchButton : null}
          size="large"
          className="w-80"
        />
        
        {!browserSupport && (
          <Tooltip title="Voice search not supported in your browser">
            <AudioOutlined className="text-gray-400 text-lg" />
          </Tooltip>
        )}

        <TonitelButton
          icon={<UserAddOutlined />}
          size="lg"
          onClick={onRegisterPatient}
        >
          Register Patient
        </TonitelButton>
      </Space>
    </div>
  );
};

export default SearchHeader;