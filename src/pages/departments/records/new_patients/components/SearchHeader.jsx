import React from 'react';
import { Input, Button, Space, Tooltip, Popover, Badge, Grid, Dropdown } from 'antd';
import { 
  AudioOutlined, 
  StopOutlined, 
  UserAddOutlined,
  SearchOutlined,
  PlusOutlined,
  MenuOutlined
} from '@ant-design/icons';
import TonitelButton from '../../../../../components/common/TonitelButton';

const { Search } = Input;
const { useBreakpoint } = Grid;

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
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const isTablet = !screens.lg;

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

  const MobileSearchBar = () => (
    <div className="w-full">
      <Search
        placeholder="Search patients..."
        allowClear
        enterButton={<SearchOutlined />}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        size="large"
        className="w-full"
      />
      {browserSupport && (
        <div className="flex justify-center mt-2">
          <Button
            type={isListening ? "primary" : "default"}
            danger={isListening}
            icon={isListening ? <StopOutlined /> : <AudioOutlined />}
            onClick={isListening ? onStopVoiceSearch : onStartVoiceSearch}
            size="small"
          >
            {isListening ? "Stop Listening" : "Voice Search"}
          </Button>
        </div>
      )}
    </div>
  );

  const DesktopSearchBar = () => (
    <Search
      placeholder="Search patients by name, folder number, or phone..."
      allowClear
      enterButton={<SearchOutlined />}
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
      addonAfter={browserSupport ? voiceSearchButton : null}
      size="large"
      className="min-w-60 lg:w-80"
    />
  );

  const RegisterButton = () => (
    <TonitelButton
      icon={<UserAddOutlined />}
      size={isMobile ? "sm" : "lg"}
      onClick={onRegisterPatient}
      block={isMobile}
    >
      {isMobile ? "Register" : "Register Patient"}
    </TonitelButton>
  );

  const MobileActionsMenu = () => {
    const menuItems = [
      {
        key: 'voice-search',
        icon: isListening ? <StopOutlined /> : <AudioOutlined />,
        label: isListening ? 'Stop Voice Search' : 'Voice Search',
        onClick: isListening ? onStopVoiceSearch : onStartVoiceSearch,
        disabled: !browserSupport,
      },
      {
        key: 'register',
        icon: <UserAddOutlined />,
        label: 'Register Patient',
        onClick: onRegisterPatient,
      },
    ];

    return (
      <Dropdown
        menu={{ items: menuItems }}
        trigger={['click']}
        placement="bottomRight"
      >
        <Button 
          type="text" 
          icon={<MenuOutlined />}
          size="large"
          className="text-gray-600"
        />
      </Dropdown>
    );
  };

  return (
    <div className="bg-white p-4 lg:p-6 rounded-xl ">
      {/* Main Header Section */}
      <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between">
        {/* Title Section */}
        <div className="flex items-center space-x-3 lg:space-x-4">
          <div className={`bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl ${
            isMobile ? 'p-2' : 'p-3'
          }`}>
            <SearchOutlined className="text-white" style={{ fontSize: isMobile ? '16px' : '24px' }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h1 className={`font-bold text-gray-800 m-0 ${
                isMobile ? 'text-xl' : 'text-2xl'
              }`}>
                Patient Records
              </h1>
              <Badge 
                count={patientCount} 
                showZero 
                style={{ 
                  backgroundColor: '#1890ff',
                  fontSize: isMobile ? '10px' : '12px',
                  height: isMobile ? '18px' : '20px',
                  minWidth: isMobile ? '18px' : '20px',
                  lineHeight: isMobile ? '18px' : '20px'
                }}
              />
            </div>
            <p className={`text-gray-600 m-0 ${
              isMobile ? 'text-xs' : 'text-sm'
            } ${isMobile ? 'mt-1' : 'mt-0'}`}>
              {isMobile ? 'Manage patient information' : 'Manage and search all patient information'}
            </p>
          </div>
        </div>

        {/* Actions Section */}
        <div className="flex items-center space-x-2 lg:space-x-4">
          {/* Search Bar - Different layouts for mobile/desktop */}
          {isMobile ? <MobileSearchBar /> : <DesktopSearchBar />}
          
          {/* Browser Support Warning */}
          {!browserSupport && !isMobile && (
            <Tooltip title="Voice search not supported in your browser">
              <AudioOutlined className="text-gray-400 text-lg" />
            </Tooltip>
          )}

          {/* Register Button / Mobile Menu */}
          <div className="flex items-center space-x-2">
            {isMobile ? (
              <MobileActionsMenu />
            ) : isTablet ? (
              <TonitelButton
                icon={<PlusOutlined />}
                size="md"
                onClick={onRegisterPatient}
              >
                Register
              </TonitelButton>
            ) : (
              <RegisterButton />
            )}
          </div>
        </div>
      </div>

      {/* Additional Mobile Info */}
      {isMobile && (
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            <span className="font-medium">{patientCount}</span> patients total
          </div>
          {!browserSupport && (
            <Tooltip title="Voice search not supported in your browser">
              <span className="text-xs text-gray-400">No voice search</span>
            </Tooltip>
          )}
        </div>
      )}
    </div>
    );
};

export default SearchHeader;