import React from "react";
import { 
  Card, 
  Avatar, 
  Tag, 
  Space, 
  Badge, 
  Popconfirm, 
  message 
} from "antd";
import { 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  MailOutlined,
  PhoneOutlined,
  BankOutlined as DepartmentOutlined,
  ClockCircleOutlined,
  UserOutlined,
  ExclamationCircleOutlined
} from "@ant-design/icons";
import { deleteStaff } from "../../../../redux/slice/staff_admin_managment_slice";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";

const StaffCard = ({ staff, onEdit, onView }) => {
  const dispatch = useDispatch();

  // FIXED: Get all departments including staff_departments
  const getAllDepartments = () => {
    const departments = [];
    const deptIds = new Set();
    
    // Add primary department if exists (from department_id)
    if (staff.department_id && staff.department) {
      departments.push({ 
        id: staff.department.id, 
        name: staff.department.name, 
        isPrimary: true 
      });
      deptIds.add(staff.department.id);
    }
    
    // Add from staff_departments array
    if (staff.staff_departments && Array.isArray(staff.staff_departments)) {
      staff.staff_departments.forEach(deptItem => {
        // Check if department object exists in the relation
        if (deptItem.department && deptItem.department.id && !deptIds.has(deptItem.department.id)) {
          departments.push({ 
            id: deptItem.department.id, 
            name: deptItem.department.name, 
            isPrimary: false,
            accessType: deptItem.access_type
          });
          deptIds.add(deptItem.department.id);
        } 
        // Fallback: if only department_id exists
        else if (deptItem.department_id && !deptIds.has(deptItem.department_id)) {
          departments.push({ 
            id: deptItem.department_id,
            name: `Department ${deptItem.department_id}`, // You might want to fetch the actual name
            isPrimary: false,
            accessType: deptItem.access_type
          });
          deptIds.add(deptItem.department_id);
        }
      });
    }

    return departments;
  };

  const allDepartments = getAllDepartments();
  
  // Get primary department (either from department relation or first in staff_departments)
  const getPrimaryDepartment = () => {
    // If there's a department relation, use that as primary
    if (staff.department && staff.department.id) {
      return { 
        id: staff.department.id, 
        name: staff.department.name, 
        isPrimary: true 
      };
    }
    
    // Otherwise, check if any staff_department is marked as primary
    if (staff.staff_departments && Array.isArray(staff.staff_departments)) {
      const primaryDept = staff.staff_departments.find(dept => dept.is_primary === true);
      if (primaryDept && primaryDept.department) {
        return { 
          id: primaryDept.department.id, 
          name: primaryDept.department.name, 
          isPrimary: true 
        };
      }
      
      // If no primary marked, use the first one
      const firstDept = staff.staff_departments[0];
      if (firstDept && firstDept.department) {
        return { 
          id: firstDept.department.id, 
          name: firstDept.department.name, 
          isPrimary: false 
        };
      }
    }
    
    return null;
  };

  const primaryDepartment = getPrimaryDepartment();

  const handleDeleteStaff = async (staffId, staffName) => {
    try {
      await dispatch(deleteStaff(staffId)).unwrap();
      message.success(`Staff member ${staffName} deleted successfully`);
    } catch (error) {
      message.error(`Failed to delete staff: ${error.message}`);
    }
  };

  return (
    <Card 
      className="staff-card"
      style={{ 
        marginBottom: 16,
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
        cursor: 'pointer'
      }}
      hoverable
      onClick={() => onView(staff.id)}
      actions={[
        <EyeOutlined 
          key="view" 
          onClick={(e) => {
            e.stopPropagation();
            onView(staff.id);
          }}
        />,
        <EditOutlined 
          key="edit" 
          onClick={(e) => {
            e.stopPropagation();
            onEdit(staff);
          }}
        />,
        <Popconfirm
          key="delete"
          title="Delete Staff Member"
          description={`Are you sure you want to delete ${staff.firstName} ${staff.lastName}?`}
          onConfirm={(e) => {
            e?.stopPropagation();
            handleDeleteStaff(staff.id, `${staff.firstName} ${staff.lastName}`);
          }}
          okText="Yes"
          cancelText="No"
          okType="danger"
        >
          <DeleteOutlined 
            onClick={(e) => e.stopPropagation()}
          />
        </Popconfirm>
      ]}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
        {/* Avatar Section */}
        <Badge 
          dot 
          color={staff.last_login ? '#52c41a' : '#faad14'}
          offset={[-5, 5]}
        >
          <Avatar 
            size={64} 
            src={staff.profile_pic || "/assets/user.png"} 
            icon={<UserOutlined />}
            style={{ border: '2px solid #f0f0f0' }}
          />
        </Badge>

        {/* Staff Info Section */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>
                {staff.firstName} {staff.middleName || ''} {staff.lastName}
              </h3>
              <p style={{ margin: 0, color: '#666', fontSize: '12px' }}>
                {staff.staffID} • {staff.role?.name || 'No Role'}
              </p>
            </div>
            <Tag color={staff.last_login ? 'green' : 'orange'}>
              {staff.last_login ? 'Active' : 'Inactive'}
            </Tag>
          </div>

          {/* Contact Info */}
          <Space size={[8, 8]} wrap style={{ marginBottom: 12 }}>
            {staff.email && staff.email !== 'undefined' && (
              <Tag icon={<MailOutlined />} color="blue" style={{ fontSize: '11px', margin: 0 }}>
                {staff.email}
              </Tag>
            )}
            {staff.phone_number && (
              <Tag icon={<PhoneOutlined />} color="cyan" style={{ fontSize: '11px', margin: 0 }}>
                {staff.phone_number}
              </Tag>
            )}
          </Space>

          {/* Primary Department */}
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
              <DepartmentOutlined style={{ marginRight: 6, color: '#666' }} />
              <span style={{ fontSize: '12px', fontWeight: 500, color: '#666' }}>
                Primary Department
              </span>
            </div>
            {primaryDepartment ? (
              <Tag color="blue" style={{ fontSize: '10px', margin: 0 }}>
                {primaryDepartment.name}
                {primaryDepartment.isPrimary && " (Primary)"}
              </Tag>
            ) : (
              <Tag icon={<ExclamationCircleOutlined />} color="orange" style={{ fontSize: '10px', margin: 0 }}>
                No Primary Department Assigned
              </Tag>
            )}
          </div>

          {/* All Departments Section */}
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
              <DepartmentOutlined style={{ marginRight: 6, color: '#666' }} />
              <span style={{ fontSize: '12px', fontWeight: 500, color: '#666' }}>
                All Departments ({allDepartments.length})
              </span>
            </div>
            {/* <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {allDepartments.length > 0 ? (
                <>
                  {allDepartments.slice(0, 3).map((dept, index) => (
                    <Tag 
                      key={dept.id} 
                      color={dept.isPrimary ? 'blue' : 'default'}
                      style={{ fontSize: '10px', margin: 0 }}
                    >
                      {dept.name}
                      {dept.accessType && ` (${dept.accessType})`}
                    </Tag>
                  ))}
                  {allDepartments.length > 3 && (
                    <Tag style={{ fontSize: '10px', margin: 0 }}>
                      +{allDepartments.length - 3} more
                    </Tag>
                  )}
                </>
              ) : (
                <Tag color="red" style={{ fontSize: '10px', margin: 0 }}>
                  No Departments Assigned
                </Tag>
              )}
            </div> */}
          </div>

          {/* Last Login */}
          <div style={{ display: 'flex', alignItems: 'center', fontSize: '11px', color: '#999' }}>
            <ClockCircleOutlined style={{ marginRight: 4 }} />
            {staff.last_login 
              ? `Last login: ${dayjs(staff.last_login).format("MMM D, YYYY h:mm A")}`
              : 'Never logged in'
            }
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StaffCard;