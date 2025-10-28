// SelectionOverlay.js
import React from 'react';
import { Card, Button, Space, Typography, Tag } from 'antd';
import { 
  CloseOutlined, 
  ExportOutlined, 
  FileTextOutlined,
  ManOutlined,
  WomanOutlined 
} from '@ant-design/icons';

const { Text } = Typography;

const SelectionOverlay = ({ selectedCount, selectedRows, onClearSelection }) => {
  if (selectedCount === 0) {
    return null;
  }

  // Calculate statistics for selected rows
  const maleCount = selectedRows.filter(row => row.gender === 'Male').length;
  const femaleCount = selectedRows.filter(row => row.gender === 'Female').length;
  const nonSpecificCount = selectedRows.filter(row => !row.gender).length;

  // Handle export functionality
  const handleExport = () => {
    console.log('Exporting selected diagnoses:', selectedRows);
    // Implement export logic here (CSV, PDF, etc.)
  };

  // Handle bulk actions
  const handleBulkAction = (action) => {
    console.log(`Bulk ${action} for:`, selectedRows);
    // Implement bulk actions here
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card
        title={
          <div className="flex justify-between items-center">
            <Space>
              <FileTextOutlined style={{ color: '#1890ff' }} />
              <Text strong className="text-blue-600">
                {selectedCount} diagnosis(es) selected
              </Text>
            </Space>
            <Button 
              type="text" 
              icon={<CloseOutlined />} 
              onClick={onClearSelection}
              size="small"
            />
          </div>
        }
        size="small"
        className="w-96 shadow-xl border-2 border-blue-300 bg-white"
        bodyStyle={{ padding: '16px' }}
      >
        <div className="space-y-3">
          {/* Gender Breakdown */}
          <div className="flex justify-between items-center">
            <Text type="secondary" className="text-sm">Gender Breakdown:</Text>
            <Space>
              {maleCount > 0 && (
                <Tag color="geekblue" icon={<ManOutlined />}>
                  {maleCount}
                </Tag>
              )}
              {femaleCount > 0 && (
                <Tag color="pink" icon={<WomanOutlined />}>
                  {femaleCount}
                </Tag>
              )}
              {nonSpecificCount > 0 && (
                <Tag color="default">{nonSpecificCount} Non-Specific</Tag>
              )}
            </Space>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-gray-200">
            <Button 
              type="primary" 
              icon={<ExportOutlined />} 
              size="small"
              onClick={handleExport}
              className="bg-green-600 hover:bg-green-700"
            >
              Export Selected
            </Button>
            <Button 
              type="default" 
              size="small" 
              onClick={onClearSelection}
              className="border-gray-300 hover:border-gray-400"
            >
              Clear Selection
            </Button>
          </div>

          {/* Quick Bulk Actions */}
          <div className="flex justify-between mt-2">
            <Button 
              type="link" 
              size="small" 
              onClick={() => handleBulkAction('categorize')}
            >
              Categorize
            </Button>
            <Button 
              type="link" 
              size="small" 
              onClick={() => handleBulkAction('archive')}
            >
              Archive
            </Button>
            <Button 
              type="link" 
              size="small" 
              onClick={() => handleBulkAction('tag')}
            >
              Add Tags
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SelectionOverlay;