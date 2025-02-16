import React, { useState } from "react";
import { Layout, Dropdown, Avatar, Badge, Modal } from "antd";
import { SettingOutlined, BellOutlined, SearchOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";

const { Header } = Layout;

const BhmsHeader = () => {
  const { admin } = useSelector((state) => state.auth);
  const [searchVisible, setSearchVisible] = useState(false);

  const userMenu = (
    <div style={{ width: "12rem" }} className="p-4 bg-white shadow-lg rounded-lg">
      <p className="font-semibold text-gray-800">Administrator</p>
      <p className="text-gray-500 text-sm">{admin.username}</p>
      <hr className="my-2" />
      <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md">Profile</button>
      <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md">Settings</button>
      <button className="w-full text-left px-3 py-2 text-red-600 hover:bg-gray-100 rounded-md">Logout</button>
    </div>
  );

  return (
    <>
      <Header
        style={{
          backgroundColor: "white",
          boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
          padding: "0 24px",
          border: "1px solid #E5E7EB",
        }}
        className="flex justify-between items-center w-full"
      >
        {/* Hospital Name */}
        <h1 className="text-lg font-semibold text-gray-800">{admin.institution.name}</h1>

        {/* Search Bar */}
       

        {/* Icons & Profile */}
        <div className="flex items-center gap-4">
          <SettingOutlined
            style={{ color: "#475569" }}
            className="text-xl cursor-pointer hover:text-gray-500"
          />
          <Badge count={3}>
            <BellOutlined
              style={{ color: "#475569" }}
              className="text-xl cursor-pointer hover:text-gray-500"
            />
          </Badge>
          <Dropdown overlay={userMenu} trigger={["click"]}>
            <div className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg">
              <Avatar src="https://justicaanima.com/wp-content/uploads/2022/02/justicaanimablog.jpg" />
              <div>
                <p className="text-sm font-semibold text-gray-800">Administrator</p>
                <p className="text-xs text-gray-500">{admin.username}</p>
              </div>
            </div>
          </Dropdown>
        </div>
      </Header>

      {/* Search Modal */}
      <Modal
        title="Search System"
        visible={searchVisible}
        onCancel={() => setSearchVisible(false)}
        footer={null}
      >
        <p>Search functionality will be implemented here...</p>
      </Modal>
    </>
  );
};

export default BhmsHeader;

