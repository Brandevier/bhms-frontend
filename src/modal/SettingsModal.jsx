import React, { useState } from "react";
import { Modal, Tabs } from "antd";
import {
  SettingOutlined,
  BellOutlined,
  FileTextOutlined,
  DatabaseOutlined,
  CreditCardOutlined,
  FileSearchOutlined,
  LockOutlined,
} from "@ant-design/icons";
import General from "../pages/admin/constant/General";
import NotificationSetting from "../pages/admin/constant/NotificationSetting";
import PaymentIntegration from "../pages/admin/constant/PaymentIntegration";




const { TabPane } = Tabs;

const SettingsModal = ({ visible, onClose }) => {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <Modal 
      title="Settings" 
      open={visible} 
      onCancel={onClose} 
      footer={null}
      width={700} // Adjust width if needed
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab} tabPosition="left">
        <TabPane 
          tab={<><SettingOutlined /> General</>} 
          key="general"
        >
          <General/>
        </TabPane>

        <TabPane 
          tab={<><BellOutlined /> Notifications & Alerts</>} 
          key="notifications"
        >
         <NotificationSetting/>
        </TabPane>

        <TabPane 
          tab={<><FileTextOutlined /> Claims & Insurance</>} 
          key="claims"
        >
          <p>Manage NHIA claims and insurance settings.</p>
        </TabPane>

        <TabPane 
          tab={<><DatabaseOutlined /> Data Controls</>} 
          key="data_controls"
        >
          <p>Manage data storage and access policies.</p>
        </TabPane>

        <TabPane 
          tab={<><CreditCardOutlined /> Payment Integration</>} 
          key="payment"
        >
          <PaymentIntegration/>
        </TabPane>

        <TabPane 
          tab={<><FileSearchOutlined /> System Logs</>} 
          key="system_logs"
        >
          <p>View system logs and audit trails.</p>
        </TabPane>

        <TabPane 
          tab={<><LockOutlined /> Security</>} 
          key="security"
        >
          <p>Manage security settings and access controls.</p>
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default SettingsModal;
