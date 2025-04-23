import React, { useState, useRef } from "react";
import { Layout, Dropdown, Avatar, Badge, List, Button, Modal, message } from "antd";
import { BellOutlined, CameraOutlined, UserOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { logout } from "../../../redux/slice/authSlice";
import QrScanner from "qr-scanner";
import { scanQrCode } from "../../../redux/slice/qrAttendanceSlice";
import { useMediaQuery } from "react-responsive";

const { Header } = Layout;

const StaffHeader = () => {
  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.notification);
  const dispatch = useDispatch();
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const [scanQrModalVisible, setScanQrModalVisible] = useState(false);
  const [scanResult, setScanResult] = useState("");
  const videoRef = useRef(null);
  const qrScannerRef = useRef(null);

  const unreadCount = items?.filter((item) => !item.is_read).length || 0;

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleScanModalOpen = () => {
    setScanQrModalVisible(true);
    setScanResult("");

    setTimeout(() => {
      if (videoRef.current && !qrScannerRef.current) {
        qrScannerRef.current = new QrScanner(
          videoRef.current,
          result => {
            setScanResult(result.data);
            dispatch(scanQrCode({ token: result.data, staffId: user.id }))
              .unwrap()
              .then(() => message.success("QR Code scanned successfully!"))
              .catch(err => message.error(err.message || "Scan failed"));
            stopScanner();
            setScanQrModalVisible(false);
          },
          {
            preferredCamera: 'environment',
            highlightScanRegion: true,
            highlightCodeOutline: true,
          }
        );
        startScanner();
      }
    }, 100);
  };

  const startScanner = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.start();
    }
  };

  const stopScanner = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
    }
  };

  const handleScanModalClose = () => {
    stopScanner();
    qrScannerRef.current = null;
    setScanQrModalVisible(false);
  };

  const toggleCamera = async () => {
    if (qrScannerRef.current) {
      await qrScannerRef.current.toggleCamera();
    }
  };

  const userMenu = (
    <div style={{ width: "12rem" }} className="p-4 bg-white shadow-lg rounded-lg">
      <p className="text-gray-500 text-sm">{user.firstName} {user.middleName || ''} {user.lastName}</p>
      <hr className="my-2" />
      <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md">Profile</button>
      <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md">Settings</button>
      <button className="w-full text-left px-3 py-2 text-red-600 hover:bg-gray-100 rounded-md" onClick={handleLogout}>Logout</button>
    </div>
  );

  const notificationMenu = (
    <div className="w-80 md:w-96 bg-white shadow-lg rounded-lg p-4">
      <h3 className="font-semibold text-gray-800 mb-2">Notifications</h3>
      <List
        dataSource={items.slice(0, 5)}
        renderItem={(item) => (
          <List.Item
            key={item.id}
            className={`p-2 rounded-md cursor-pointer flex justify-between items-center ${!item.is_read ? "bg-gray-100" : ""}`}
          >
            <List.Item.Meta
              avatar={<Avatar style={{ backgroundColor: "#f56a00" }}>🔔</Avatar>}
              title={<span className="font-semibold text-gray-800">{item.title}</span>}
              description={<span className="text-gray-600 text-sm">{item.description}</span>}
            />
            <span className="text-xs text-gray-500">{moment(item.createdAt).fromNow()}</span>
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
          padding: "0 16px",
          border: "1px solid #E5E7EB",
        }}
        className="flex justify-between items-center w-full"
      >
        <h1 className="hidden md:block text-lg font-semibold text-gray-800">
          {user.institution.name}
        </h1>

        <div className="flex-1 flex justify-end">
          <div className="flex items-center gap-2 md:gap-4">
            <Button
              type="text"
              icon={<CameraOutlined className="text-xl" />}
              onClick={handleScanModalOpen}
              className="flex items-center justify-center"
            />

            <Dropdown overlay={notificationMenu} trigger={["click"]} placement="bottomRight">
              <Badge count={unreadCount} overflowCount={9}>
                <BellOutlined className="text-xl cursor-pointer text-gray-700 hover:text-gray-500" />
              </Badge>
            </Dropdown>

            <Dropdown overlay={userMenu} trigger={["click"]} placement="bottomRight">
              {isMobile ? (
                <Avatar 
                  src="https://justicaanima.com/wp-content/uploads/2022/02/justicaanimablog.jpg"
                  icon={<UserOutlined />}
                  className="cursor-pointer"
                />
              ) : (
                <div className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg">
                  <Avatar src="https://justicaanima.com/wp-content/uploads/2022/02/justicaanimablog.jpg" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{user.department.name}</p>
                    <p className="text-xs text-gray-500">{user.firstName} {user.middleName || ""} {user.lastName}</p>
                  </div>
                </div>
              )}
            </Dropdown>
          </div>
        </div>
      </Header>

      <Modal
        title="Scan QR Code"
        open={scanQrModalVisible}
        onCancel={handleScanModalClose}
        footer={[
          <Button key="toggle" onClick={toggleCamera}>
            Switch Camera
          </Button>,
          <Button key="cancel" onClick={handleScanModalClose}>
            Close
          </Button>,
        ]}
        width={400}
        destroyOnClose
      >
        <div style={{ width: "100%", height: "300px", position: "relative" }}>
          <video
            ref={videoRef}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "8px",
              border: "1px solid #e8e8e8"
            }}
          />
        </div>
        {scanResult && (
          <div className="mt-4 p-2 bg-gray-100 rounded">
            <p className="font-semibold">Scanned Result:</p>
            <p>{scanResult}</p>
          </div>
        )}
      </Modal>
    </>
  );
};

export default StaffHeader;