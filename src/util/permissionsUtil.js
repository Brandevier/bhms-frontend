export const filterDepartmentsByRole = (user, departments) => {
    if (!user) return [];  // Return empty for non-authenticated users
    
    // For any authenticated user (admin or staff), return all departments
    return departments;
};