import React, { useEffect, useState } from "react";
import { Card, Row, Col, Badge, Avatar, Skeleton, Empty, } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import BhmsButton from "../../heroComponents/BhmsButton";
import { getDepartmentsByInstitution, createDepartment } from "../../redux/slice/departmentSlice";
import { useSelector, useDispatch } from "react-redux";
import CreateDepartmentDialog from "./components/CreateDepartmentDialog";

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

const DepartmentsList = () => {
    const dispatch = useDispatch();
    const { loading, departments, error } = useSelector((state) => state.departments);
    const [isModalVisible, setModalVisible] = useState(false);


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
                                actions={[
                                    <Row justify="space-between" align="middle" style={{
                                        margin: "2px"
                                    }}>
                                        {dept?.staff?.length > 0 ? (
                                            <Avatar.Group maxCount={3} maxStyle={{ color: "#f56a00", backgroundColor: "#fde3cf" }}>
                                                {dept.staff.map((member, i) => (
                                                    <Avatar key={i} src={member} />
                                                ))}
                                            </Avatar.Group>
                                        ) : (
                                            <p style={{ color: "#888", marginBottom: 0 }}>No Staffs</p>
                                        )}

                                        <BhmsButton type="primary" size="medium" block={false}>
                                            See Detail
                                        </BhmsButton>
                                    </Row>

                                ]}
                            >
                                <h2 className="text-bold">{dept?.name}</h2>
                                <p>{dept?.description}</p>

                                {/* <Divider/> */}

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
