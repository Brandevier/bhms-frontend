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
            callerName:(user || admin).username
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
            case "Maternity Ward":
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

            
            case "Claims":
                return "/assets/front.jpg";

            default:
                return "/departments/ward.jpg";
        }
    };

    const handleNavigation = ({ departmentType, department_id }) => {
        switch (departmentType) {
            case "Ward":
                navigate("/departments/ward");
                break;
            case "Consultation":
                navigate(`/shared/consultation/${department_id}`);
                break;
            case "Maternity Ward":
                navigate("/departments/maternity");
                break;
            case "Lab":
                navigate(`/shared/lab/${department_id}`);
                break;
            case "Records":
                navigate(`/shared/records/${department_id}`);
                break;
            case "OPD":
                navigate(`/shared/opd/${department_id}`);
                break;
            case "Accounts":
                navigate("/departments/accounts");
                break;
            case "HR":
                navigate("/departments/hr");
                break;
            case "Store":
                navigate(`/shared/store/${department_id}`);
                break;
            case "Pharmacy":
                navigate(`/shared/departments/pharmacy`);
                break;
            case "Claims":
                navigate(`/shared/departments/claims`);
                break;
            default:
                navigate("/departments/general");
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

            {/* Call Modal */}
            <Modal
                title={`Calling ${currentDepartment?.name}`}
                visible={isCallModalVisible}
                onCancel={endCall}
                footer={[
                    <BhmsButton key="end" type="danger" onClick={endCall}>
                        End Call
                    </BhmsButton>
                ]}
                centered
            >
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    {callStatus === 'calling' && (
                        <>
                            <Avatar size={64} src={getDepartmentImage(currentDepartment?.departmentType)} />
                            <p style={{ marginTop: 16 }}>Calling {currentDepartment?.name} department...</p>
                            <p>Waiting for response</p>
                        </>
                    )}
                    {callStatus === 'in-call' && (
                        <>
                            <Avatar size={64} src={getDepartmentImage(currentDepartment?.departmentType)} />
                            <p style={{ marginTop: 16 }}>In call with {currentDepartment?.name}</p>
                            <audio controls autoPlay style={{ width: '100%', marginTop: 16 }} />
                        </>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default DepartmentsList;