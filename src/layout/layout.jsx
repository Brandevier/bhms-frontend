import React from "react";
import { Layout } from "antd";
import BhmsHeader from "../pages/admin/components/BhmsHeader";
import BhmsSidebar from "../pages/admin/components/BhmsSidebar";


const { Content } = Layout;

const AppLayout = ({ children }) => {
  return (
    <Layout style={{ height: "100vh", overflow: "hidden" }}>
      {/* Sidebar (Fixed) */}
      <BhmsSidebar />

      {/* Main Layout */}
      <Layout style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        {/* Top Bar (Fixed) */}
        <BhmsHeader />

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
