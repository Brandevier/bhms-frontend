import React, { useState, useEffect } from "react";
import { Layout, Dropdown, Avatar, Badge, Modal, List, Button } from "antd";
import { SettingOutlined, BellOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../redux/slice/authSlice";

const { Header } = Layout;

const StaffHeader = () => {
  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.notification);
  const [searchVisible, setSearchVisible] = useState(false);
  const dispatch = useDispatch();

  const unreadCount = items?.filter((item) => !item.is_read).length || 0;

  const handleLogout = () => {
    dispatch(logout());
  };


  const userMenu = (
    <div style={{ width: "12rem" }} className="p-4 bg-white shadow-lg rounded-lg">
      <p className="font-semibold text-gray-800"></p>
      <p className="text-gray-500 text-sm">{user.firstName} {user.middleName || ''} {user.lastName}</p>
      <hr className="my-2" />
      <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md">Profile</button>
      <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md">Settings</button>
      <button className="w-full text-left px-3 py-2 text-red-600 hover:bg-gray-100 rounded-md" onClick={()=>handleLogout()}>Logout</button>
    </div>
  );

  const notificationMenu = (
    <div className="w-80 bg-white shadow-lg rounded-lg p-4">
      <List
        dataSource={items.slice(0, 3)}
        renderItem={(item) => (
          <List.Item
            key={item.id}
            className={`p-2 rounded-md cursor-pointer ${!item.is_read ? "bg-gray-100" : ""}`}
          >
            <List.Item.Meta
              avatar={<Avatar style={{ backgroundColor: "#f56a00" }}>🔔</Avatar>}
              title={<span className="font-semibold text-gray-800">{item.title}</span>}
              description={<span className="text-gray-600 text-sm">{item.description}</span>}
            />
          </List.Item>
        )}
      />
      <Button type="link" className="w-full text-center text-blue-500">View All</Button>
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
        <h1 className="text-lg font-semibold text-gray-800">{user.institution.name}</h1>

        <div className="flex items-center gap-4">
          <Dropdown overlay={notificationMenu} trigger={["click"]} placement="bottomRight">
            <Badge count={unreadCount} overflowCount={9}>
              <BellOutlined className="text-xl cursor-pointer text-gray-700 hover:text-gray-500" />
            </Badge>
          </Dropdown>
          <Dropdown overlay={userMenu} trigger={["click"]}>
            <div className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg">
              <Avatar src="https://justicaanima.com/wp-content/uploads/2022/02/justicaanimablog.jpg" />
              <div>
                <p className="text-sm font-semibold text-gray-800">{user.department.name}</p>
                <p className="text-xs text-gray-500">{user.firstName} {user.middleName || ""} {user.lastName}</p>
              </div>
            </div>
          </Dropdown>
        </div>
      </Header>
    </>
  );
};

export default StaffHeader;
