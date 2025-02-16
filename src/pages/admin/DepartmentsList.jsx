import React, { useEffect, useState } from "react";
import { Card, Row, Col, Badge, Avatar, Skeleton, Empty, Divider, } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import BhmsButton from "../../heroComponents/BhmsButton";
import { getDepartmentsByInstitution, createDepartment } from "../../redux/slice/departmentSlice";
import { useSelector, useDispatch } from "react-redux";
import CreateDepartmentDialog from "./components/CreateDepartmentDialog";
import { useNavigate } from "react-router-dom";





const DepartmentsList = () => {
    const dispatch = useDispatch();
    const { loading, departments, error } = useSelector((state) => state.departments);
    const [isModalVisible, setModalVisible] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        dispatch(getDepartmentsByInstitution());
    }, [dispatch]);

    const handleCreate = (values) => {
        console.log("New Department Data:", values);
        dispatch(createDepartment(values)).unwrap().then((res) => {
            setModalVisible(false);
            dispatch(getDepartmentsByInstitution());

        });
    };


    // Function to get department image based on departmentType
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
        default:
            return "/departments/ward.jpg"; // Default image for unknown departments
    }
};


const handleNavigation = ({departmentType,department_id}) => {
    switch (departmentType) {
        case "Ward":
            navigate("/departments/ward");
            break;
        case "Consultation":
            navigate("/departments/consultation");
            break;
        case "Maternity Ward":
            navigate("/departments/maternity");
            break;
        case "Pharmacy":
            navigate("/departments/pharmacy");
            break;
        case "Lab":
            navigate("/departments/lab");
            break;
        case "Records":
            navigate(`/admin/records/${department_id}`);
            break;
        case "OPD":
            navigate("/admin/departments/opd");
            break;
        case "Accounts":
            navigate("/departments/accounts");
            break;
        case "HR":
            navigate("/departments/hr");
            break;
        default:
            navigate("/departments/general"); // Default page
            break;
    }
};



    return (
        <div style={{ padding: "20px"}}>
            {/* Header Section */}
            <Row justify="space-between" align="middle" style={{ marginBottom: "20px" }}>
                <h2>
                    Departments <Badge count={departments?.length} style={{ backgroundColor: "#52c41a" }} />
                </h2>
                <BhmsButton type="primary" icon={<PlusOutlined />} size="medium" block={false} onClick={() => setModalVisible(true)}>
                    Add Department
                </BhmsButton>
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
                    {departments?.map((dept, index) => (
                        <Col xs={24} sm={12} md={8} lg={8} key={index}>
                            <Card
                                hoverable
                                style={{ height: "100%", display: "flex", flexDirection: "column" }} 
                                cover={
                                    <img
                                        alt={dept?.name}
                                        src={getDepartmentImage(dept?.departmentType)}
                                        style={{ height: "180px", objectFit: "cover" }}
                                    />
                                }
                                // actions={[
                                    
                                  

                                // ]}
                            >
                                <h2 className="font-bold text-xl">{dept?.name}</h2>
                                {/* <p>{dept?.description}</p> */}

                                <Divider/>
                                <Row justify="space-between" align="middle" style={{
                                        margin: "2px"
                                    }}>
                                        {dept?.staff?.length > 0 ? (
                                            <Avatar.Group maxCount={3} maxStyle={{ color: "#f56a00", backgroundColor: "#fde3cf" }}>
                                                {dept.staff.map((member, i) => (
                                                    <Avatar key={i} src={member.profile_pic || '/assets/user.png'} />
                                                ))}
                                            </Avatar.Group>
                                        ) : (
                                            <p style={{ color: "#888", marginBottom: 0 }}>No Staffs</p>
                                        )}

                                        <BhmsButton type="primary" size="medium" block={false} onClick={() => handleNavigation({departmentType:dept?.departmentType,department_id:dept?.id})}>
                                            See Detail
                                        </BhmsButton>
                                    </Row>
                               

                                {/* Staffs Section */}

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
        </div>
    );
};

export default DepartmentsList;
