import {
    HeartOutlined,
    DashboardOutlined,
    FireOutlined,
    CloudOutlined,
    LineHeightOutlined,
    ArrowsAltOutlined,
    AlertOutlined,
    RiseOutlined,       // instead of PulseOutlined
    LineOutlined,       
    DropboxOutlined,
} from "@ant-design/icons";

export const vitalConfig = {
    heart_rate: {
        label: "Heart Rate",
        icon: <HeartOutlined />,
        unit: "bpm",
        field: "heart_rate",
        ranges: {
            normal: { min: 60, max: 100, color: "#52c41a" },
            warning: { min: 50, max: 120, color: "#faad14" },
            danger: { min: 0, max: 200, color: "#ff4d4f" }
        }
    },
    pulse: {
        label: "Pulse",
        icon: <RiseOutlined />,
        unit: "bpm",
        field: "pulse",
        ranges: {
            normal: { min: 60, max: 100, color: "#52c41a" },
            warning: { min: 50, max: 120, color: "#faad14" },
            danger: { min: 0, max: 200, color: "#ff4d4f" }
        }
    },
    blood_pressure: {
        label: "Blood Pressure",
        icon: <DashboardOutlined />,
        unit: "mmHg",
        field: ["systole", "diastole"],
        format: (vitals) => {
            if (!vitals || vitals.systole === null || vitals.diastole === null) return "N/A";
            return `${vitals.systole || '--'}/${vitals.diastole || '--'}`;
        },
        ranges: {
            normal: { min: 90, max: 120, color: "#52c41a" },
            warning: { min: 80, max: 140, color: "#faad14" },
            danger: { min: 0, max: 200, color: "#ff4d4f" }
        }
    },
    temperature: {
        label: "Temperature",
        icon: <FireOutlined />,
        unit: "°C",
        field: "temperature",
        ranges: {
            normal: { min: 36.1, max: 37.2, color: "#52c41a" },
            warning: { min: 35, max: 38, color: "#faad14" },
            danger: { min: 0, max: 50, color: "#ff4d4f" }
        }
    },
    SpO2: {
        label: "SpO2",
        icon: <CloudOutlined />,
        unit: "%",
        field: "SpO2",
        ranges: {
            normal: { min: 95, max: 100, color: "#52c41a" },
            warning: { min: 90, max: 94, color: "#faad14" },
            danger: { min: 0, max: 89, color: "#ff4d4f" }
        }
    },
    oxygen: {
        label: "Oxygen",
        icon: <CloudOutlined />,
        unit: "%",
        field: "oxygen",
        ranges: {
            normal: { min: 95, max: 100, color: "#52c41a" },
            warning: { min: 90, max: 94, color: "#faad14" },
            danger: { min: 0, max: 89, color: "#ff4d4f" }
        }
    },
    weight: {
        label: "Weight",
        icon: <LineOutlined />,
        unit: "kg",
        field: "weight",
        ranges: {
            normal: { min: 50, max: 120, color: "#52c41a" },
            warning: { min: 40, max: 150, color: "#faad14" },
            danger: { min: 0, max: 300, color: "#ff4d4f" }
        }
    },
    height: {
        label: "Height",
        icon: <ArrowsAltOutlined />,
        unit: "cm",
        field: "height",
        ranges: {
            normal: { min: 150, max: 200, color: "#52c41a" },
            warning: { min: 140, max: 210, color: "#faad14" },
            danger: { min: 0, max: 300, color: "#ff4d4f" }
        }
    },
    rbs: {
        label: "RBS",
        icon: <DropboxOutlined />,
        unit: "mg/dL",
        field: "rbs",
        ranges: {
            normal: { min: 70, max: 140, color: "#52c41a" },
            warning: { min: 60, max: 180, color: "#faad14" },
            danger: { min: 0, max: 300, color: "#ff4d4f" }
        }
    },
    fbs: {
        label: "FBS",
        icon: <DropboxOutlined />,
        unit: "mg/dL",
        field: "fbs",
        ranges: {
            normal: { min: 70, max: 100, color: "#52c41a" },
            warning: { min: 60, max: 125, color: "#faad14" },
            danger: { min: 0, max: 300, color: "#ff4d4f" }
        }
    },
    ppbs: {
        label: "PPBS",
        icon: <DropboxOutlined />,
        unit: "mg/dL",
        field: "ppbs",
        ranges: {
            normal: { min: 70, max: 140, color: "#52c41a" },
            warning: { min: 60, max: 180, color: "#faad14" },
            danger: { min: 0, max: 300, color: "#ff4d4f" }
        }
    },
    pain: {
        label: "Pain Scale",
        icon: <AlertOutlined />,
        unit: "/10",
        field: "pain",
        ranges: {
            normal: { min: 0, max: 3, color: "#52c41a" },
            warning: { min: 4, max: 6, color: "#faad14" },
            danger: { min: 7, max: 10, color: "#ff4d4f" }
        }
    }
};

export const primaryVitals = ["heart_rate", "blood_pressure", "temperature", "SpO2", "pulse"];
export const secondaryVitals = ["oxygen", "weight", "height", "rbs", "fbs", "ppbs", "pain"];