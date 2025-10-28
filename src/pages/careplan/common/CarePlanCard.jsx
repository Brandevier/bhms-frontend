import React from 'react';
import { Card, Tag, Divider, Modal } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from "@ant-design/icons";
import { useDispatch } from 'react-redux';
import { deleteCarePlan,updateCarePlanStatus } from '../../../redux/slice/carePlanSlice';
import moment from 'moment';



const CarePlanCard = ({ plan, onEdit }) => {
  const dispatch = useDispatch();

  const getStatusTag = (status) => {
    const statusConfig = {
      active: { color: 'blue', icon: <ClockCircleOutlined />, text: 'Active' },
      completed: { color: 'green', icon: <CheckCircleOutlined />, text: 'Completed' },
      discontinued: { color: 'red', text: 'Discontinued' }
    };
    
    const config = statusConfig[status];
    return (
      <Tag color={config.color} icon={config.icon} className="flex items-center">
        {config.text}
      </Tag>
    );
  };

  const getPriorityTag = (priority) => {
    const priorityConfig = {
      High: { color: 'red', text: 'High' },
      Medium: { color: 'orange', text: 'Medium' },
      Low: { color: 'green', text: 'Low' }
    };
    
    return <Tag color={priorityConfig[priority].color}>{priorityConfig[priority].text}</Tag>;
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Delete Care Plan',
      content: 'Are you sure you want to delete this care plan?',
      okText: 'Yes',
      cancelText: 'No',
      onOk: () => {
        dispatch(deleteCarePlan(id));
      }
    });
  };

  const handleStatusUpdate = (id, status) => {
    dispatch(updateCarePlanStatus({ carePlanId: id, status }));
  };

  const actions = [
    <EditOutlined key="edit" onClick={() => onEdit(plan)} />,
    <DeleteOutlined key="delete" onClick={() => handleDelete(plan.id)} />,
    plan.status === 'active' ? (
      <CheckCircleOutlined 
        key="complete" 
        onClick={() => handleStatusUpdate(plan.id, 'completed')} 
      />
    ) : null
  ].filter(Boolean);

  return (
    <Card 
      className="shadow-md rounded-lg border-0 overflow-hidden"
      actions={actions}
    >
      <div className="flex justify-between items-start mb-4">
        {getStatusTag(plan.status)}
        {getPriorityTag(plan.priority)}
      </div>
      
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{plan.care_plan_goal}</h3>
      
      <Divider className="my-3" />
      
      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium text-gray-500">Intervention</p>
          <p className="text-gray-800">{plan.interventions}</p>
        </div>
        
        <div>
          <p className="text-sm font-medium text-gray-500">Start Date</p>
          <p className="text-gray-800">{moment(plan.start_date).format('LLL')}</p>
        </div>
        
        <div>
          <p className="text-sm font-medium text-gray-500">Target Date</p>
          <p className="text-gray-800">{moment(plan.end_date).format('LLL')}</p>
        </div>
        
        <div>
          <p className="text-sm font-medium text-gray-500">Frequency of Reviews</p>
          <p className="text-gray-800">{plan.frequency_of_reviews}</p>
        </div>
        
        <div>
          <p className="text-sm font-medium text-gray-500">Responsible Staff</p>
          <p className="text-gray-800">{plan.staff?.name || 'N/A'}</p>
        </div>
      </div>
    </Card>
  );
};

export default CarePlanCard;