import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Tabs, Button, Space, Statistic, Tag, message, Modal } from 'antd';
import {
  DollarOutlined,
  FileTextOutlined,
  PlusOutlined,
  SearchOutlined,
  DownloadOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import InvoiceTable from './InvoiceTable';
import BillingStats from './BillingStats';
import QuickActions from './QuickActions';
import RecentTransactions from './RecentTransactions';
import CreateInvoiceModal from './CreateInvoiceModal';
// import { useInvoices } from '../../hooks/useInvoices';
// import { useBilling } from '../../hooks/useBilling';

import { useInvoices } from '../../../../redux/hooks/useInvoices';
import { useBilling } from '../../../../redux/hooks/useBilling';
import { useSelector } from 'react-redux';


const { TabPane } = Tabs;

const BillingInvoicing = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const { user } = useSelector(state => state.auth);
  // if (!user || !user.permissions.includes('view_billing')) {
  //   return (
  //     <div className="p-6 bg-gray-50 min-h-screen">
  //       <Card>
  //         <Statistic
  //           title="Access Denied"
  //           value="You do not have permission to view this page."
  //           valueStyle={{ color: '#cf1322' }}
  //         />
  //       </Card>
  //     </div>
  //   );
  // }
  
  const { getBillingStats, getRecentTransactions, resetError } = useBilling();

  useEffect(() => {
    // Load initial data when component mounts
    getBillingStats({institution_id:user.institution.id});
    getRecentTransactions({ limit: 5,institution_id:user.institution.id });
  }, [getBillingStats, getRecentTransactions]);

  const handleTabChange = (key) => {
    setActiveTab(key);
    resetError(); // Clear any errors when switching tabs
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Billing & Invoicing</h1>
        <p className="text-gray-600">Manage patient invoices, payments, and billing records</p>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        type="card"
        size="large"
      >
        <TabPane
          tab={
            <span>
              <DollarOutlined />
              Overview
            </span>
          }
          key="overview"
        >
          <BillingOverview />
        </TabPane>
        
        <TabPane
          tab={
            <span>
              <FileTextOutlined />
              Invoices
            </span>
          }
          key="invoices"
        >
          <InvoiceManagement 
            onCreateInvoice={() => setCreateModalVisible(true)} 
          />
        </TabPane>
        
        <TabPane
          tab={
            <span>
              <FileTextOutlined />
              Bills
            </span>
          }
          key="bills"
        >
          <BillsManagement />
        </TabPane>
      </Tabs>

      <CreateInvoiceModal
        visible={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        onOk={(invoiceData) => {
          setCreateModalVisible(false);
          // The invoice creation will be handled by the InvoiceManagement component
        }}
      />
    </div>
  );
};

const BillingOverview = () => {
  const { stats, recentTransactions, loading, error } = useBilling();

  useEffect(() => {
    if (error) {
      message.error(error.message || 'Failed to load billing data');
    }
  }, [error]);

  return (
    <div>
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} lg={8}>
          <BillingStats stats={stats} loading={loading} />
        </Col>
        <Col xs={24} lg={16}>
          <QuickActions />
        </Col>
      </Row>
      
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <RecentTransactions 
            transactions={recentTransactions} 
            loading={loading} 
          />
        </Col>
      </Row>
    </div>
  );
};

const InvoiceManagement = ({ onCreateInvoice }) => {
  const { 
    invoices, 
    loading, 
    error, 
    pagination, 
    getInvoices, 
    addInvoice,
    resetError 
  } = useInvoices();
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: '',
    search: ''
  });

  useEffect(() => {
    getInvoices(filters);
  }, [filters, getInvoices]);

  useEffect(() => {
    if (error) {
      message.error(error.message || 'Failed to load invoices');
      resetError();
    }
  }, [error, resetError]);

  const handleCreateInvoice = async (invoiceData) => {
    try {
      await addInvoice(invoiceData);
      message.success('Invoice created successfully');
      getInvoices(filters); // Refresh the list
    } catch (err) {
      message.error('Failed to create invoice');
    }
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setFilters(prev => ({
      ...prev,
      page: pagination.current,
      limit: pagination.pageSize,
      status: filters.status?.[0],
    }));
  };

  const handleSearch = (value) => {
    setFilters(prev => ({ ...prev, search: value, page: 1 }));
  };

  const handleExport = () => {
    // Export functionality would be implemented here
    message.info('Export feature coming soon');
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Invoice Management</h2>
        <Space>
          <Button icon={<SearchOutlined />} onClick={() => {
            const searchValue = prompt('Enter search term:');
            if (searchValue !== null) handleSearch(searchValue);
          }}>
            Search
          </Button>
          <Button icon={<DownloadOutlined />} onClick={handleExport}>
            Export
          </Button>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={onCreateInvoice}
            loading={loading}
          >
            Create Invoice
          </Button>
        </Space>
      </div>
      
      <InvoiceTable 
        data={invoices}
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        onRefresh={() => getInvoices(filters)}
      />
    </Card>
  );
};

const BillsManagement = () => {
  return (
    <Card>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Bills Management</h2>
        <Space>
          <Button icon={<ReloadOutlined />}>Refresh</Button>
          <Button type="primary" icon={<PlusOutlined />}>
            Add Bill
          </Button>
        </Space>
      </div>
      
      <div className="text-center py-10">
        <p className="text-gray-500">Bill management features coming soon...</p>
      </div>
    </Card>
  );
};

export default BillingInvoicing;