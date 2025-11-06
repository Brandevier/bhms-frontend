
import { ScheduleOutlined,DashboardOutlined,MessageOutlined,DeploymentUnitOutlined,FileDoneOutlined,EditOutlined,TeamOutlined,FileSyncOutlined,ControlOutlined,BarChartOutlined,ShopOutlined,SafetyOutlined } from '@ant-design/icons'



const surgeryMenu = [
      {
        key: "surgery-1",
        label: "OR Scheduling",
        icon: <ScheduleOutlined />,
        path: "/shared/surgery/scheduling"
      },
      {
        key: "surgery-2",
        label: "Room Status",
        icon: <DashboardOutlined />,
        path: "/shared/surgery/room-status"
      },
      {
        key: "surgery-3",
        label: "Resource Allocation",
        icon: <DeploymentUnitOutlined />,
        path: "/shared/surgery/resource-allocation"
      },
      {
        key: "surgery-4",
        label: "Pre-Op Management",
        icon: <FileDoneOutlined />,
        path: "/shared/surgery/pre-op"
      },
      {
        key: "surgery-5",
        label: "Intra-Op Documentation",
        icon: <EditOutlined />,
        path: "/shared/surgery/intra-op"
      },
      {
        key: "surgery-6",
        label: "Post-Op Tracking",
        icon: <FileSyncOutlined />,
        path: "/shared/surgery/post-op"
      },
      // {
      //   key: "surgery-7",
      //   label: "Surgical Team",
      //   icon: <TeamOutlined />,
      //   path: "/surgery/team"
      // },
      // {
      //   key: "surgery-8",
      //   label: "Instrument Tracking",
      //   icon: <ControlOutlined />,
      //   path: "/surgery/instruments"
      // },
      // {
      //   key: "surgery-9",
      //   label: "Safety Systems",
      //   icon: <SafetyOutlined />,
      //   path: "/surgery/safety"
      // },
      // {
      //   key: "surgery-10",
      //   label: "Surgical Reports",
      //   icon: <BarChartOutlined />,
      //   path: "/surgery/reports"
      // },
      {
        key: "surgery-11",
        label: "Message",
        icon: <MessageOutlined />,
        path: `/shared/surgery/chat`
      },
      {
        key: "surgery-12",
        label: "Stores",
        icon: <ShopOutlined />,
        path: "/shared/departments/store"
      },
    ]



export default surgeryMenu