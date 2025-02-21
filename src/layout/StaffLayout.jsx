import React from "react";
import { Layout } from "antd";
import { useSelector } from "react-redux";



const { Content } = Layout;

const StaffLayout = ({ children }) => {
  return (
    <Layout style={{ height: "100vh", overflow: "hidden" }}>
      {/* Sidebar (Fixed) */}
      <h1>SIDEBAR HERE</h1>

      {/* Main Layout */}
      <Layout style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        {/* Top Bar (Fixed) */}
        <h1>TOP BAR</h1>

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

export default StaffLayout;
