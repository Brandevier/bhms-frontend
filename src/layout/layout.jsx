import React from "react";
import { Layout } from "antd";

const { Header, Sider, Content } = Layout;

const AppLayout = ({ children }) => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar - 30% of the screen width */}
      <Sider
        width="30%"
        style={{
          background: "#fff",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
        }}
      >
        <h1 style={{ padding: "16px" }}>Sidebar</h1>
      </Sider>

      {/* Main Content - 70% of the screen width */}
      <Layout>
        {/* Top Bar */}
        <Header
          style={{
            background: "#fff",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
            padding: "0 16px",
          }}
        >
          <span>Topbar</span>
        </Header>

        {/* Main Area */}
        <Content
          style={{
            margin: "16px",
            padding: "16px",
            background: "#fff",
            overflowY: "auto",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;