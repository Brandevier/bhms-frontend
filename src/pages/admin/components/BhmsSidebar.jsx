import React, { useState } from "react";
import DepartmentSidebar from "../../../config/DepartmentSidebar";

const BhmsSidebar = () => {
  const [collapsed, setCollapsed] = useState(true);

  return <DepartmentSidebar collapsed={collapsed} setCollapsed={setCollapsed} />;
};

export default BhmsSidebar;
