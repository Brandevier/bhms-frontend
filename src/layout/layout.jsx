import React from "react";
import { Layout } from "antd";
import BhmsHeader from "../pages/admin/components/BhmsHeader";
import BhmsSidebar from "../pages/admin/components/BhmsSidebar";
import { useSelector } from "react-redux";
import StaffSideBar from "../pages/staff/component/StaffSideBar";
import StaffHeader from "../pages/staff/component/StaffHeader";


const { Content } = Layout;

const AppLayout = ({ children }) => {
  const { user,admin } = useSelector((state)=>state.auth)
  return (
    <Layout style={{ height: "100vh", overflow: "hidden" }}>
      {/* Sidebar (Fixed) */}
     { admin ? ( <BhmsSidebar />) :  <StaffSideBar/>}

      {/* Main Layout */}
      <Layout style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        {/* Top Bar (Fixed) */}
       {admin ? ( <BhmsHeader />) : <StaffHeader/>}

        {/* Main Content (Scrollable) */}
        <Content
          style={{
            flex: 1, // This makes content take up remaining space
            overflowY: "auto", // Only this area is scrollable
            padding: "16px",
            background: "#fff",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
