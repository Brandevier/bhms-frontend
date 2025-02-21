export const filterDepartmentsByRole = (user, departments) => {
    if (!user) return [];

    // If user is an admin, return all departments
    if (user.username) {
        return departments;
    }

    // If user is staff, filter departments based on their department type
    if (user.department.departmentType) {
        return departments.filter(dept => dept.departmentType === user.department.departmentType);
    }
 
    // Default: No access
    return [];
};
