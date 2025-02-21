import React, { useState } from "react";
import { Card, Switch, Select, Button, Space, message } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { logout } from "../../../redux/slice/authSlice";
import { useDispatch } from "react-redux";
const { Option } = Select;

const General = () => {
  const [theme, setTheme] = useState(false);
  const [language, setLanguage] = useState("english");
  const [archive, setArchive] = useState(false);
  const [backup, setBackup] = useState(false);
  const dispatch = useDispatch()

  const handleLogout = ()=>{
    dispatch(logout()).unwrap().then((res)=>{
      message.success('Logout successful')
    })
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {/* Theme */}
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>Theme</span>
          <Switch checked={theme} onChange={() => setTheme(!theme)} />
        </div>
      </Card>

      {/* Language */}
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>Language</span>
          <Select value={language} onChange={setLanguage} style={{ width: "120px" }}>
            <Option value="english">English</Option>
            <Option value="french">French</Option>
          </Select>
        </div>
      </Card>

      {/* Backup */}
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>Enable Automatic Backup</span>
          <Switch checked={backup} onChange={() => setBackup(!backup)} />
        </div>
      </Card>

      {/* Archive All Records */}
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>Archive All Records</span>
          <Switch checked={archive} onChange={() => setArchive(!archive)} />
        </div>
      </Card>

      {/* Logout */}
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>Log out of this device</span>
          <Button type="primary" danger icon={<LogoutOutlined />} onClick={handleLogout}>
            Log Out
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default General;
