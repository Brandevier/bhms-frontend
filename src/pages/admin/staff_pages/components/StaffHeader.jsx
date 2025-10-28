import React from "react";
import BhmsButton from "../../../../heroComponents/BhmsButton";
import { PlusOutlined } from "@ant-design/icons";

const StaffHeader = ({ onAddStaff }) => {
  return (
    <div style={styles.header}>
      <div>
        <h1 style={styles.title}>Staff Management</h1>
        <p style={styles.subtitle}>Manage hospital staff members and their department access</p>
      </div>
      <BhmsButton 
        type="primary" 
        size="medium" 
        icon={<PlusOutlined />} 
        onClick={onAddStaff}
      >
        Add Staff Member
      </BhmsButton>
    </div>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
    flexWrap: 'wrap',
    gap: 16
  },
  title: {
    margin: 0,
    fontSize: '28px',
    fontWeight: 700,
    color: '#262626'
  },
  subtitle: {
    margin: '4px 0 0 0',
    fontSize: '14px',
    color: '#666'
  }
};

export default StaffHeader;