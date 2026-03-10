import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, List, Progress, Tag, Button, Empty, Spin } from 'antd';
import { 
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ShoppingCartOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { 
  getAllCaseCarts, 
  getCaseCartStatistics,
  confirmCaseCart 
} from '../../../../../redux/slice/theatreSlice';

const CaseCartStatus = () => {
  const dispatch = useDispatch();
  const { caseCarts, caseCartStatistics, loading } = useSelector((state) => state.theatre);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Fetch case carts and statistics on component mount
    dispatch(getAllCaseCarts());
    dispatch(getCaseCartStatistics());
  }, [dispatch]);

  const getStatusIcon = (status) => {
    switch(status) {
      case 'ready':
      case 'confirmed':
        return <CheckCircleOutlined className="text-green-500" />;
      case 'in-progress':
        return <ClockCircleOutlined className="text-orange-500" />;
      case 'not-started':
      case 'cancelled':
        return <CloseCircleOutlined className="text-red-500" />;
      case 'used':
        return <CheckCircleOutlined className="text-blue-500" />;
      default:
        return <ClockCircleOutlined className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'ready':
      case 'confirmed':
        return 'green';
      case 'in-progress':
        return 'orange';
      case 'not-started':
      case 'cancelled':
        return 'red';
      case 'used':
        return 'blue';
      default:
        return 'default';
    }
  };

  const handleConfirm = (cartId) => {
    dispatch(confirmCaseCart({ 
      id: cartId, 
      confirmed_by: user?.id 
    })).then(() => {
      dispatch(getAllCaseCarts());
      dispatch(getCaseCartStatistics());
    });
  };

  const getProgressStatus = (completion, status) => {
    if (status === 'used') return 'success';
    if (completion === 100) return 'success';
    if (completion > 50) return 'active';
    if (completion > 0) return 'normal';
    return 'exception';
  };

  if (loading && caseCarts.length === 0) {
    return (
      <Card 
        title={
          <div className="flex items-center">
            <ShoppingCartOutlined className="mr-2" />
            <span>Case Cart Status</span>
          </div>
        } 
        bordered={false} 
        className="shadow-sm h-full"
      >
        <div className="flex justify-center items-center h-32">
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  return (
    <Card 
      title={
        <div className="flex items-center">
          <ShoppingCartOutlined className="mr-2" />
          <span>Case Cart Status</span>
          {caseCartStatistics && (
            <Tag color="blue" className="ml-2">
              {caseCartStatistics.todayCases || 0} Today
            </Tag>
          )}
        </div>
      } 
      bordered={false} 
      className="shadow-sm h-full"
      extra={
        caseCartStatistics && (
          <div className="flex gap-2">
            <Tag color="red">{caseCartStatistics.urgent || 0} Urgent</Tag>
            <Tag color="orange">{caseCartStatistics.ready || 0} Ready</Tag>
          </div>
        )
      }
    >
      {caseCarts.length === 0 ? (
        <Empty 
          description="No case carts found" 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button type="primary">Create Case Cart</Button>
        </Empty>
      ) : (
        <List
          itemLayout="vertical"
          dataSource={caseCarts}
          renderItem={cart => (
            <List.Item>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-medium">{cart.procedure || 'Unknown Procedure'}</div>
                  <div className="text-gray-500 text-sm">
                    Cart #{cart.cart_number}
                    {cart.surgeon_name && ` • ${cart.surgeon_name}`}
                  </div>
                  {cart.scheduled_date && (
                    <div className="text-gray-400 text-xs">
                      Scheduled: {new Date(cart.scheduled_date).toLocaleDateString()}
                      {cart.scheduled_time && ` at ${cart.scheduled_time}`}
                    </div>
                  )}
                </div>
                <Tag 
                  icon={getStatusIcon(cart.status)} 
                  color={getStatusColor(cart.status)}
                  className="capitalize"
                >
                  {cart.status?.replace('-', ' ') || 'unknown'}
                </Tag>
              </div>
              
              <Progress 
                percent={cart.completion_percentage || 0} 
                status={getProgressStatus(cart.completion_percentage, cart.status)}
                size="small" 
              />
              
              <div className="mt-2">
                <div className="text-gray-600 text-sm mb-1">
                  Items: {cart.items?.length || 0}
                  {cart.items?.length > 0 && (
                    <span className="text-green-500 ml-1">
                      ({cart.items.filter(i => i.status === 'ready').length} ready)
                    </span>
                  )}
                </div>
                {cart.items && cart.items.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {cart.items.slice(0, 5).map((item, index) => (
                      <Tag 
                        key={index} 
                        color={item.status === 'ready' ? 'green' : item.status === 'used' ? 'blue' : 'orange'}
                        className="text-xs"
                      >
                        {item.name}
                      </Tag>
                    ))}
                    {cart.items.length > 5 && (
                      <Tag className="text-xs">+{cart.items.length - 5} more</Tag>
                    )}
                  </div>
                )}
              </div>
              
              <div className="mt-3 flex justify-end gap-2">
                <Button size="small">Details</Button>
                {cart.status === 'ready' && (
                  <Button 
                    size="small" 
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    onClick={() => handleConfirm(cart.id)}
                  >
                    Confirm
                  </Button>
                )}
                {cart.status === 'confirmed' && (
                  <Button size="small" type="primary" disabled>
                    <CheckCircleOutlined /> Confirmed
                  </Button>
                )}
              </div>
              
              {cart.priority === 'urgent' && (
                <div className="mt-2">
                  <Tag color="red" icon={<ExclamationCircleOutlined />}>
                    URGENT
                  </Tag>
                </div>
              )}
            </List.Item>
          )}
        />
      )}
    </Card>
  );
};

export default CaseCartStatus;

