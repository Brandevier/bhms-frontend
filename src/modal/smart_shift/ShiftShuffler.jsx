import React, { useState } from 'react';
import { 
  Modal, 
  Card, 
  Button, 
  Space, 
  Popconfirm, 
  message 
} from 'antd';
import {
  SyncOutlined,
  SaveOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { addBulkShifts } from '../../redux/slice/shiftSlice';


// Import components
import ShiftTable from './ShiftTable';
import ShiftLegend from './ShiftLegend';
import useShiftGenerator from './ShiftGenerator';

const ShiftShuffler = ({ staffList, visible, onCancel }) => {
  const dispatch = useDispatch();
  const [shifts, setShifts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const user = useSelector(state => state.auth.user || state.auth.admin);
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const shiftTypes = ['Morning', 'Afternoon', 'Night', 'Off'];
  
  const { generateShifts } = useShiftGenerator(staffList, daysOfWeek, shiftTypes);

  // AI-powered shuffle algorithm
  const handleGenerateShifts = async () => {
    setLoading(true);
    try {
      const newShifts = await generateShifts();
      setShifts(newShifts);
    } catch (error) {
      message.error('Failed to generate schedule');
    } finally {
      setLoading(false);
    }
  };

  // Start editing a cell
  const handleEdit = (id, field) => {
    setEditingId(id);
    setEditingField(field);
    const currentShift = shifts.find(s => s.id === id);
    setTempValue(currentShift ? currentShift[field] : null);
  };

  // Save edited value
  const handleSave = (id) => {
    const updatedShifts = shifts.map(item => {
      if (item.id === id) {
        return { ...item, [editingField]: tempValue };
      }
      return item;
    });
    
    setShifts(updatedShifts);
    setEditingId(null);
    setEditingField(null);
    setTempValue(null);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingField(null);
    setTempValue(null);
  };

  // Transform data for backend submission - FIXED VERSION
  const transformShiftsForSubmission = (shiftsData) => {
    const bulkData = [];

    shiftsData.forEach(staffShift => {
      daysOfWeek.forEach(day => {
        const shiftValue = staffShift[day];
        
        // Only create entries for actual shifts (not undefined)
        if (shiftValue) {
          bulkData.push({
            staff_id: staffShift.staff_id, // Make sure this field exists
            day: day,
            shift_type: shiftValue,
            institution_id: user.institution.id,
            department_id: localStorage.getItem('department_id')
          });
        }
      });
    });

    return bulkData;
  };

  // Submit shifts to backend - FIXED VERSION
  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // Transform data using the fixed function
      const bulkData = transformShiftsForSubmission(shifts);
      
      console.log("Submitting bulk data:", bulkData);
      
      // Validate data before submission
      if (bulkData.length === 0) {
        message.error('No shift data to submit');
        return;
      }

      // Check if all required fields are present
      const invalidEntries = bulkData.filter(entry => 
        !entry.staff_id || !entry.day || !entry.shift_type
      );
      
      if (invalidEntries.length > 0) {
        message.error('Some shift entries are missing required fields');
        return;
      }

      await dispatch(addBulkShifts(bulkData)).unwrap();
      
      message.success('Shifts saved successfully');
      setShifts([]);
      onCancel();
      
    } catch (error) {
      console.error('Submission error:', error);
      message.error(error.message || 'Failed to save shifts');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center">
          <SyncOutlined className="text-blue-500 mr-2" />
          <span>AI Shift Scheduler</span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      width="90%"
      style={{ maxWidth: 1200 }}
      footer={[
        <Button key="cancel" onClick={onCancel} icon={<CloseOutlined />}>
          Cancel
        </Button>,
        <Button 
          key="generate" 
          icon={<SyncOutlined />} 
          onClick={handleGenerateShifts}
          loading={loading}
        >
          Generate Schedule
        </Button>,
        <Popconfirm
          key="submit"
          title="Are you sure you want to submit this schedule?"
          onConfirm={handleSubmit}
          okText="Yes"
          cancelText="No"
        >
          <Button 
            type="primary" 
            icon={<SaveOutlined />}
            loading={loading}
            disabled={shifts.length === 0}
          >
            Submit Schedule
          </Button>
        </Popconfirm>,
      ]}
      centered
    >
      <Card bordered={false} loading={loading}>
        {shifts.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">
              No schedule generated yet. Click "Generate Schedule" to create one.
            </p>
          </div>
        )}
        
        {shifts.length > 0 && (
          <>
            <ShiftTable
              shifts={shifts}
              daysOfWeek={daysOfWeek}
              editingId={editingId}
              editingField={editingField}
              tempValue={tempValue}
              onEdit={handleEdit}
              onSave={handleSave}
              onCancel={handleCancelEdit}
              onTempValueChange={setTempValue}
            />
            <ShiftLegend />
          </>
        )}
      </Card>
    </Modal>
  );
};

export default ShiftShuffler;