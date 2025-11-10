import React, { useEffect, useState } from "react";
import { Card, Row, Col, Badge, Avatar, Skeleton, Empty, Divider, Modal } from "antd";
import { PlusOutlined, PhoneOutlined } from "@ant-design/icons";
import BhmsButton from "../../heroComponents/BhmsButton";
import { getDepartmentsByInstitution, createDepartment } from "../../redux/slice/departmentSlice";
import { useSelector, useDispatch } from "react-redux";
import CreateDepartmentDialog from "./components/CreateDepartmentDialog";
import { useNavigate } from "react-router-dom";
import { filterDepartmentsByRole } from "../../util/permissionsUtil";
import { initializeSocket } from "../../service/socketService";
import DepartmentCallModal from "../../modal/DepartmentCallModal";



const DepartmentsList = () => {
    const dispatch = useDispatch();
    const { loading, departments, error } = useSelector((state) => state.departments);
    const [isModalVisible, setModalVisible] = useState(false);
    const [isCallModalVisible, setCallModalVisible] = useState(false);
    const [currentDepartment, setCurrentDepartment] = useState(null);
    const [callStatus, setCallStatus] = useState('idle'); // 'idle', 'calling', 'in-call'
    const navigate = useNavigate();
    const { admin, user } = useSelector((state) => state.auth);
    const [filteredDepartments, setFilteredDepartments] = useState([]);
    const socket = initializeSocket(user || admin); // Initialize socket

    useEffect(() => {
        dispatch(getDepartmentsByInstitution());
    }, [dispatch]);

    useEffect(() => {
        if (departments.length > 0) {
            setFilteredDepartments(filterDepartmentsByRole(admin || user, departments));
        }
    }, [departments, admin, user]);

    const handleCreate = (values) => {
        console.log("New Department Data:", values);
        dispatch(createDepartment(values)).unwrap().then(() => {
            setModalVisible(false);
            dispatch(getDepartmentsByInstitution());
        });
    };

    const handleCallDepartment = (department) => {
        setCurrentDepartment(department);
        setCallModalVisible(true);

        // Start the call process
        setCallStatus('calling');
        socket.emit('initiate-department-call', {
            departmentId: department.id,
            callerId: (user || admin).id,
            callerName: (user || admin).username
        });

        // Listen for call acceptance
        socket.on('department-call-accepted', () => {
            setCallStatus('in-call');
        });

        // Listen for call rejection
        socket.on('department-call-rejected', () => {
            setCallStatus('idle');
            Modal.info({
                title: 'Call Rejected',
                content: 'The department staff rejected your call',
            });
            setCallModalVisible(false);
        });
    };

    const endCall = () => {
        socket.emit('end-department-call', { departmentId: currentDepartment.id });
        setCallStatus('idle');
        setCallModalVisible(false);
        setCurrentDepartment(null);
    };

    const getDepartmentImage = (departmentType) => {
        switch (departmentType) {
            case "Ward":
                return "/departments/ward.jpg";
            case "Consultation":
                return "/departments/consultation.jpg";
            case "Antenatal Care (ANC)":
                return "/departments/Maternity-Ward.jpg";
            case "Pharmacy":
                return "/departments/pharm.jpg";
            case "Lab":
                return "/departments/lab.jpg";
            case "Records":
                return "/departments/records.jpg";
            case "OPD":
                return "/departments/opd.jpg";
            case "Accounts":
                return "/departments/account.jpeg";
            case "HR":
                return "/departments/hr.jpg";
            case "Store":
                return "/departments/stores.jpg";
            case "Antenatal & Postnatal Ward":
                return "/departments/ANC.jpg";

            case "Surgery":
                return "/assets/surgery.jpg";
            
            case "Clerk":
                return "/assets/clerk.webp";


            case "Claims":
                return "/assets/front.jpg";

            case "Information Manager":
                return "/departments/data_analysis.png";

            default:
                return "/departments/ward.jpg";
        }
    };

    const handleNavigation = ({ departmentType, department_id }) => {
        console.log('departmentid',department_id)
        if (!admin) {
            Modal.warning({
                title: "Access Denied",
                content: "You are not an admin, only admins can view department details.",
            });
            return;
        }

        switch (departmentType) {
            case "Ward":
                navigate(`/shared/department/details/${department_id}`);
                break;
            case "Consultation":
                navigate(`/shared/department/details/${department_id}`);
                break;
            case "Maternity Ward":
                navigate(`/shared/department/details/${department_id}`);
                break;
            case "Lab":
                navigate(`/shared/department/details/${department_id}`);
                break;
            case "Records":
                navigate(`/shared/department/details/${department_id}`);
                break;
            case "OPD":
                navigate(`/shared/department/details/${department_id}`);
                break;
            case "Accounts":
                navigate(`/shared/department/details/${department_id}`);
                break;
            case "HR":
                navigate(`/shared/department/details/${department_id}`);
                break;
            case "Store":
                navigate(`/shared/department/details/${department_id}`);
                break;
            case "Pharmacy":
                navigate(`/departments/${department_id}`);
                break;
            case "Claims":
                navigate(`/departments/${department_id}`);
                break;
            default:
                navigate(`/departments/${department_id}`);
                break;
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            {/* Header Section */}
            <Row justify="space-between" align="middle" style={{ marginBottom: "20px" }}>
                <h2>
                    Departments <Badge count={departments?.length} style={{ backgroundColor: "#52c41a" }} />
                </h2>

                {user ? '' : (
                    <BhmsButton type="primary" icon={<PlusOutlined />} size="medium" block={false} onClick={() => setModalVisible(true)}>
                        Add Department
                    </BhmsButton>
                )}
            </Row>

            {/* Show Skeleton While Loading */}
            {loading ? (
                <Row gutter={[16, 16]}>
                    {Array.from({ length: 3 }).map((_, index) => (
                        <Col xs={24} sm={12} md={8} lg={8} key={index}>
                            <Card>
                                <Skeleton.Image style={{ width: "100%", height: "200px" }} />
                                <Skeleton active paragraph={{ rows: 2 }} />
                            </Card>
                        </Col>
                    ))}
                </Row>
            ) : departments.length === 0 ? (
                /* Show Empty Widget When No Departments */
                <Empty description="No Departments Found" />
            ) : (
                <Row gutter={[16, 16]}>
                    {filteredDepartments?.map((dept, index) => (
                        <Col xs={24} sm={12} md={8} lg={8} key={index}>
                            <Card
                                style={{ height: "100%", display: "flex", flexDirection: "column" }}
                                cover={
                                    <img
                                        alt={dept?.name}
                                        src={getDepartmentImage(dept?.departmentType)}
                                        style={{ height: "180px", objectFit: "cover" }}
                                    />
                                }
                            >
                                <h2 className="font-bold text-xl">{dept?.name}</h2>
                                <Divider />
                                <Row justify="space-between" align="middle" style={{ margin: "2px" }}>
                                    {dept?.staff?.length > 0 ? (
                                        <Avatar.Group maxCount={3} maxStyle={{ color: "#f56a00", backgroundColor: "#fde3cf" }}>
                                            {dept.staff.map((member, i) => (
                                                <Avatar key={i} src={member.profile_pic || '/assets/user.png'} />
                                            ))}
                                        </Avatar.Group>
                                    ) : (
                                        <p style={{ color: "#888", marginBottom: 0 }}>No Staffs</p>
                                    )}

                                    <div className="flex">
                                        <BhmsButton
                                            type="primary"
                                            size="medium"
                                            style={{ marginRight: 8 }}
                                            onClick={() => handleNavigation({ departmentType: dept?.departmentType, department_id: dept?.id })}
                                        >
                                            See Detail
                                        </BhmsButton>
                                        <BhmsButton
                                            icon={<PhoneOutlined />}
                                            size="medium"
                                            onClick={() => handleCallDepartment(dept)}
                                            outline
                                            className="mx-2"
                                            variant="outline"
                                        >
                                            Call
                                        </BhmsButton>
                                    </div>
                                </Row>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            <CreateDepartmentDialog
                visible={isModalVisible}
                onClose={() => setModalVisible(false)}
                onCreate={handleCreate}
                loading={loading}
            />

            <DepartmentCallModal
                department={currentDepartment}
                visible={isCallModalVisible}
                onEndCall={endCall}
                callerInfo={{
                    name: (user || admin)?.username,
                    avatar: (user || admin)?.profile_pic
                }}
                socket={socket}
            />

        </div>
    );
};

export default DepartmentsList;