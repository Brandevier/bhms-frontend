import {
  AppstoreOutlined,
  FileSyncOutlined,
  FileDoneOutlined,
  StopOutlined,
  WechatOutlined,
  UserSwitchOutlined,
  ShoppingCartOutlined,
  BarChartOutlined,
  TeamOutlined,
  SettingOutlined,
  ExportOutlined,
  ImportOutlined,
  WarningOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";

const storeMenu = [
  { key: "store-1", label: "Dashboard", icon: <BarChartOutlined />, path: "/shared/store/dashboard" },
  { key: "store-2", label: "Stock Items", icon: <AppstoreOutlined />, path: "/shared/store/stock/items" },
  { key: "store-3", label: "Pending Requests", icon: <FileSyncOutlined />, path: "/shared/store/pending-requests" },
  { key: "store-4", label: "Approved Requests", icon: <FileDoneOutlined />, path: "/shared/store/approved-requests" },
  { key: "store-5", label: "Expired Items", icon: <StopOutlined />, path: "/shared/store/expired-items" },
  { key: "store-6", label: "Issued Items", icon: <FileDoneOutlined />, path: "/shared/store/issued-items" },
  { key: "store-7", label: "Low Stock Alert", icon: <WarningOutlined />, path: "/shared/store/low-stock" },
  { key: "store-8", label: "Suppliers", icon: <TeamOutlined />, path: "/shared/store/suppliers" },
  { key: "store-9", label: "Purchase Orders", icon: <ShoppingCartOutlined />, path: "/shared/store/purchase-orders" },
  { key: "store-10", label: "Inventory In", icon: <ImportOutlined />, path: "/shared/store/inventory-in" },
  { key: "store-11", label: "Inventory Out", icon: <ExportOutlined />, path: "/shared/store/inventory-out" },
  { key: "store-12", label: "Stock Transfer", icon: <DatabaseOutlined />, path: "/shared/store/stock-transfer" },
  { key: "consult-4", label: "Message", icon: <WechatOutlined />, path: "/shared/chat" },
  { key: "record-9", label: "Attendance", icon: <UserSwitchOutlined />, path: "/shared/attendance" },
  { key: "store-13", label: "Settings", icon: <SettingOutlined />, path: "/shared/store/settings" },
];

export default storeMenu;