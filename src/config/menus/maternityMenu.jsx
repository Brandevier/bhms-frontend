import {
  UserAddOutlined,
  FileTextOutlined,
  ProfileOutlined,
  ShopOutlined,
  WechatOutlined
} from "@ant-design/icons";

const maternityMenu = [
  {
    key: "ANC-0",
    label: "Maternity Registration",
    icon: <UserAddOutlined />,
    path: "/shared/anc/registration"
  },
  {
    key: "ANC-1",
    label: "Pregnancy Records",
    icon: <FileTextOutlined />,
    path: "/maternity/pregnancy-records"
  },
  {
    key: "ANC-2",
    label: "Birth Reports",
    icon: <ProfileOutlined />,
    path: "/maternity/birth-reports"
  },
  {
    key: "ANC-3",
    label: "Stores",
    icon: <ShopOutlined />,
    path: "/shared/departments/store"
  },
  { key: "opd-3", label: "Message", icon: <WechatOutlined />, path: "/shared/chat" },

];

export default maternityMenu;