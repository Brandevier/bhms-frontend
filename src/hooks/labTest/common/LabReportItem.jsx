import React, { useState, useRef } from "react";
import {
  List,
  Button,
  Popconfirm,
  Tag,
  Space,
  Typography,
  Tooltip,
  Badge,
  Divider,
  Table
} from "antd";
import {
  FileTextOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  PlayCircleOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
  CaretDownOutlined,
  CaretRightOutlined
} from "@ant-design/icons";
import moment from "moment";
import LabReportPDF from "./LabReportPDF";

const { Text, Paragraph } = Typography;

const LabReportItem = ({ result, onDelete, onViewResult, onUpdate, loadingStates = {}  }) => {
  const [showResults, setShowResults] = useState(false);
  const [printing, setPrinting] = useState(false);
  
  const testDescription = result?.template?.description || result?.template?.lab_tarrif?.test_description || "Unknown Test";
  const status = result?.status || 'pending';
  const testId = result?.id;
  const createdAt = result?.createdAt ? moment(result.createdAt).format("MMM DD, YYYY") : '';
  const updatedAt = result?.updatedAt ? moment(result.updatedAt).format("MMM DD, YYYY HH:mm") : '';
  const patient = result?.patient || result?.visit?.patient;
  const institution = result?.institution || result?.visit?.institution;

  const statusConfig = {
    pending: {
      color: "orange",
      icon: <ClockCircleOutlined />,
      text: "Pending",
      badge: "processing"
    },
    completed: {
      color: "green",
      icon: <CheckCircleOutlined />,
      text: "Completed",
      badge: "success"
    },
    in_progress: {
      color: "blue",
      icon: <PlayCircleOutlined />,
      text: "In Progress",
      badge: "processing"
    },
    cancelled: {
      color: "red",
      icon: <ClockCircleOutlined />,
      text: "Cancelled",
      badge: "error"
    }
  };

  const currentStatus = statusConfig[status] || statusConfig.pending;

  const handleDelete = () => {
    if (typeof onDelete === 'function') {
      onDelete(result.id);
    }
  };

  const handleUpdate = () => {
    if (typeof onUpdate === 'function') {
      onUpdate(result);
    }
  };

  const handleViewResult = () => {
    if (typeof onViewResult === 'function') {
      onViewResult(result);
    }
  };

  // const handleUpdate = () => {
  //   if (typeof onUpdate === 'function') {
  //     onUpdate(result);
  //   }
  // };

  const handlePrint = () => {
    setPrinting(true);
    // This will be handled by the PDF component's own print functionality
    setTimeout(() => {
      setPrinting(false);
    }, 1000);
  };

  const renderResultsTable = () => {
    if (!result.values || Object.keys(result.values).length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
          No test results available
        </div>
      );
    }

    // Check if values is an array of test items with units
    if (Array.isArray(result.values)) {
      const tableData = result.values.map((item, index) => ({
        key: index,
        parameter: item.parameter || item.test_name || `Parameter ${index + 1}`,
        value: item.value || item.result || 'N/A',
        unit: item.unit || '-',
        reference_range: item.reference_range || item.normal_range || 'See reference'
      }));

      const columns = [
        {
          title: 'Parameter',
          dataIndex: 'parameter',
          key: 'parameter',
          width: '35%',
          render: (text) => <Text strong>{text}</Text>
        },
        {
          title: 'Value',
          dataIndex: 'value',
          key: 'value',
          width: '20%',
          render: (value) => <Tag color="blue">{value}</Tag>
        },
        {
          title: 'Unit',
          dataIndex: 'unit',
          key: 'unit',
          width: '20%',
          render: (unit) => <Text type="secondary">{unit}</Text>
        },
        {
          title: 'Reference Range',
          dataIndex: 'reference_range',
          key: 'reference_range',
          width: '25%',
          render: (range) => <Text type="secondary" style={{ fontSize: '12px' }}>{range}</Text>
        }
      ];

      return (
        <div style={{ marginTop: '16px' }}>
          <Table
            dataSource={tableData}
            columns={columns}
            pagination={false}
            size="small"
            bordered
          />
        </div>
      );
    } 
    // Handle object format values
    else if (typeof result.values === 'object') {
      const tableData = Object.entries(result.values).map(([key, value], index) => {
        // Check if value is an object with unit information
        const valueObj = typeof value === 'object' ? value : { value, unit: '-' };
        
        return {
          key: index,
          parameter: key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
          value: valueObj.value || value,
          unit: valueObj.unit || '-',
          reference_range: valueObj.reference_range || valueObj.normal_range || 'See reference'
        };
      });

      const columns = [
        {
          title: 'Parameter',
          dataIndex: 'parameter',
          key: 'parameter',
          width: '35%',
          render: (text) => <Text strong>{text}</Text>
        },
        {
          title: 'Value',
          dataIndex: 'value',
          key: 'value',
          width: '20%',
          render: (value) => <Tag color="blue">{value}</Tag>
        },
        {
          title: 'Unit',
          dataIndex: 'unit',
          key: 'unit',
          width: '20%',
          render: (unit) => <Text type="secondary">{unit}</Text>
        },
        {
          title: 'Reference Range',
          dataIndex: 'reference_range',
          key: 'reference_range',
          width: '25%',
          render: (range) => <Text type="secondary" style={{ fontSize: '12px' }}>{range}</Text>
        }
      ];

      return (
        <div style={{ marginTop: '16px' }}>
          <Table
            dataSource={tableData}
            columns={columns}
            pagination={false}
            size="small"
            bordered
          />
        </div>
      );
    }

    return (
      <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
        Unable to display test results
      </div>
    );
  };
  const actions = [
    <Space>
      {/* Toggle Results Button */}
      {status === 'completed' && (
        <Tooltip title={showResults ? "Hide Results" : "Show Results"}>
          <Button
            type="default"
            icon={showResults ? <CaretDownOutlined /> : <CaretRightOutlined />}
            onClick={() => setShowResults(!showResults)}
            size="small"
            className={showResults ? "active-toggle" : ""}
            disabled={loadingStates.updating === result.id || loadingStates.deleting === result.id}
          >
            {showResults ? "Hide" : "Show"} Results
          </Button>
        </Tooltip>
      )}

      {/* View Detailed Results */}
      {status === 'completed' && (
        <Tooltip title="View Detailed Results">
          <Button
            icon={<EyeOutlined />}
            onClick={handleViewResult}
            size="small"
            disabled={loadingStates.updating === result.id || loadingStates.deleting === result.id}
          >
            View
          </Button>
        </Tooltip>
      )}

      {/* Update Button */}
      {status === 'pending' && (
        <Tooltip title="Edit Test">
          <Button
            icon={<EditOutlined />}
            onClick={handleUpdate}
            size="small"
            loading={loadingStates.updating === result.id}
            disabled={loadingStates.deleting === result.id}
          >
            Edit
          </Button>
        </Tooltip>
      )}

      {/* Delete Button */}
      {status === 'pending' && (
        <Tooltip title="Delete Test">
          <Button
            icon={<DeleteOutlined />}
            onClick={handleDelete}
            danger
            size="small"
            loading={loadingStates.deleting === result.id}
            disabled={loadingStates.updating === result.id}
          >
            Delete
          </Button>
        </Tooltip>
      )}

      {/* Download PDF Button */}
      {status === 'completed' && (
        <LabReportPDF 
          result={result}
          patient={patient}
          institution={institution}
          testDescription={testDescription}
          printing={printing}
          onPrint={handlePrint}
        >
          <Tooltip title="Download PDF Report">
            <Button
              icon={<DownloadOutlined />}
              size="small"
              type="primary"
              loading={printing}
            >
              PDF
            </Button>
          </Tooltip>
        </LabReportPDF>
      )}
    </Space>
  ];
  return (
    <div className="lab-report-item-container">
      <List.Item
        className="lab-report-item"
        actions={actions}
      >
        <List.Item.Meta
          avatar={
            <div className="lab-report-avatar">
              <FileTextOutlined style={{ fontSize: '20px', color: currentStatus.color }} />
            </div>
          }
          title={
            <Space>
              <Text strong style={{ fontSize: '15px' }}>
                {testDescription}
              </Text>
              <Badge
                status={currentStatus.badge}
                text={currentStatus.text}
              />
            </Space>
          }
          description={
            <Space direction="vertical" size={0}>
              <Paragraph type="secondary" style={{ margin: 0, fontSize: '13px' }}>
                Requested: {createdAt}
                {status === 'completed' && ` • Completed: ${updatedAt}`}
              </Paragraph>
              
              {result?.notes && (
                <Text type="secondary" italic style={{ fontSize: '12px' }}>
                  Notes: {result.notes}
                </Text>
              )}

              {/* Quick result preview for completed tests */}
              {status === 'completed' && result.values && !showResults && (
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {Object.keys(result.values).length} parameter(s) tested • Click "Show Results" to view
                </Text>
              )}
            </Space>
          }
        />
      </List.Item>

      {/* Results Dropdown Section */}
      {status === 'completed' && showResults && (
        <div className="results-dropdown">
          <Divider style={{ margin: '16px 0' }} />
          <div style={{ padding: '0 16px 16px 56px' }}>
            <Text strong style={{ fontSize: '14px', marginBottom: '12px', display: 'block' }}>
              Laboratory Test Results:
            </Text>
            {renderResultsTable()}
            
            {result.notes && (
              <div style={{ marginTop: '16px', padding: '12px', background: '#f5f5f5', borderRadius: '6px' }}>
                <Text strong>Technician Notes: </Text>
                <Text type="secondary">{result.notes}</Text>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .lab-report-item-container {
          border-bottom: 1px solid #f0f0f0;
          transition: all 0.3s ease;
        }
        
        .lab-report-item-container:hover {
          background-color: #fafafa;
        }
        
        .results-dropdown {
          background: #f8f9fa;
          border-radius: 0 0 8px 8px;
          margin-top: -8px;
          border: 1px solid #e8e8e8;
          border-top: none;
        }
        
        .active-toggle {
          background-color: #1890ff;
          color: white;
          border-color: #1890ff;
        }
      `}</style>
    </div>
  );
};

export default LabReportItem;