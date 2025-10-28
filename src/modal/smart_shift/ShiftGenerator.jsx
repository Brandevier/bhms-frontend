import React from 'react';
import { notification } from 'antd';

const useShiftGenerator = (staffList, daysOfWeek, shiftTypes) => {
  const generateShifts = () => {
    return new Promise((resolve) => {
      // Simulate AI processing delay
      setTimeout(() => {
        const newShifts = staffList.map(staff => {
          const staffShifts = {};
          const availableDays = [...daysOfWeek];
          
          // Randomly select one day off
          const dayOff = availableDays.splice(Math.floor(Math.random() * availableDays.length), 1)[0];
          
          // Assign shifts to remaining days
          availableDays.forEach(day => {
            // Ensure fair distribution of shift types
            const randomShift = shiftTypes[Math.floor(Math.random() * (shiftTypes.length - 1))]; // Exclude 'Off'
            staffShifts[day] = randomShift;
          });
          
          // Add the day off
          staffShifts[dayOff] = 'Off';
          
          return {
            id: staff.id,
            staff_id: staff.id, // Make sure staff_id is included
            name: `${staff.firstName} ${staff.lastName}`,
            position: staff.position,
            ...staffShifts
          };
        });
        
        resolve(newShifts);
        
        notification.success({
          message: 'Schedule Generated',
          description: 'AI has generated a fair weekly schedule with one day off for each staff member.'
        });
      }, 1000);
    });
  };

  return { generateShifts };
};

export default useShiftGenerator;