export const transformShiftsToTableData = (shifts = []) => {
  if (!shifts || shifts.length === 0) return [];

  const staffMap = {};

  shifts.forEach(shift => {
    const staffId = shift.staff_id;
    
    if (!staffMap[staffId]) {
      const staffInfo = shift.rotation || shift.staff || {};
      staffMap[staffId] = {
        id: staffId,
        name: `${staffInfo.firstName || 'Unknown'} ${staffInfo.lastName || 'Staff'}`,
        employeeId: `EMP${(staffInfo.id || staffId).toString().slice(-4).toUpperCase()}`,
        position: staffInfo.role?.name || staffInfo.position || 'Staff Member',
        photo: staffInfo.photo || null,
        schedule: {
          monday: '',
          tuesday: '',
          wednesday: '',
          thursday: '',
          friday: '',
          saturday: '',
          sunday: ''
        }
      };
    }

    // Safely assign shift to the correct day - FIXED THE ERROR HERE
    const day = shift.day?.toLowerCase();
    if (day && staffMap[staffId].schedule.hasOwnProperty(day)) {
      staffMap[staffId].schedule[day] = shift.shift || '';
    }
  });

  return Object.values(staffMap);
};