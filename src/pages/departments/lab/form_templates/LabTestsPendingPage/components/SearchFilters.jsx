import React from 'react';
import { Input, DatePicker, Button, Space, Card } from 'antd';
import { SearchOutlined, ReloadOutlined, FilterOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;

const SearchFilters = ({ searchParams, onSearch, onReset }) => {
    const handleInputChange = (field, value) => {
        onSearch({
            ...searchParams,
            [field]: value
        });
    };

    return (
        <Card 
            size="small" 
            className="mb-4 border-0 bg-gray-50"
            title={
                <div className="flex items-center">
                    <FilterOutlined className="mr-2 text-blue-500" />
                    <span className="font-medium">Search & Filter</span>
                </div>
            }
        >
            <Space size="middle" wrap className="w-full">
                <div className="flex flex-col">
                    <label className="text-xs font-medium text-gray-600 mb-1">Patient Name</label>
                    <Input
                        placeholder="Search by patient name..."
                        value={searchParams.patientName}
                        onChange={(e) => handleInputChange('patientName', e.target.value)}
                        style={{ width: 200 }}
                        allowClear
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-xs font-medium text-gray-600 mb-1">Folder Number</label>
                    <Input
                        placeholder="Enter folder number"
                        value={searchParams.folderNumber}
                        onChange={(e) => handleInputChange('folderNumber', e.target.value)}
                        style={{ width: 180 }}
                        allowClear
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-xs font-medium text-gray-600 mb-1">Test Name</label>
                    <Input
                        placeholder="Search test name..."
                        value={searchParams.testName}
                        onChange={(e) => handleInputChange('testName', e.target.value)}
                        style={{ width: 220 }}
                        allowClear
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-xs font-medium text-gray-600 mb-1">Date Range</label>
                    <RangePicker
                        value={searchParams.dateRange}
                        onChange={(dates) => handleInputChange('dateRange', dates)}
                        style={{ width: 250 }}
                        format="DD/MM/YYYY"
                    />
                </div>

                <div className="flex items-end space-x-2">
                    <Button 
                        type="primary" 
                        icon={<SearchOutlined />} 
                        onClick={() => onSearch(searchParams)}
                        className="bg-blue-500 hover:bg-blue-600"
                    >
                        Search
                    </Button>
                    <Button 
                        icon={<ReloadOutlined />} 
                        onClick={onReset}
                    >
                        Reset
                    </Button>
                </div>
            </Space>
        </Card>
    );
};

export default SearchFilters;