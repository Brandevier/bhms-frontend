import React,{useEffect} from "react";
import { Form, Input, Button, Typography, Spin, message } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import BhmsButton from "../../heroComponents/BhmsButton";
import { verifyAdminToken } from "../../redux/slice/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
const { Title, Text } = Typography;

const EmailVerification = () => {
  const dispatch = useDispatch();
  const { loading, error,emailSent } = useSelector((state) => state.auth);

  const navigate = useNavigate()

  const onFinish = (values) => {
    dispatch(verifyAdminToken({token:values.otp}))
      .unwrap()
      .then((res) => {
        console.log(res);
        message.success("Login successfully!");
        navigate('/admin')
      })
      .catch((err) => {
        message.error(err.error || "OTP verification failed. Please try again.");
      });
  };


  useEffect(()=>{
    if(!emailSent){
      navigate('/hms/login')
    }
  },[])

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        backgroundColor: "#f8f9fa",
      }}
    >
      {/* Left Side - Image & Labels */}
      <div
        style={{
          flex: 1,
          background: "#F2F7FF",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          padding: "20px",
        }}
      >
        <img
          src="/assets/login_image.png" // Replace with the actual doctor image
          alt="Doctor"
          style={{ width: "60%", borderRadius: "10px" }}
        />

        <div
          style={{
            position: "absolute",
            top: "50%",
            right: "20%",
            background: "#fff",
            padding: "10px 20px",
            borderRadius: "10px",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
          }}
        >
          <br />
        </div>
      </div>

      {/* Right Side - OTP Verification Form */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "column",
          padding: "40px",
          background: "#ffffff",
        }}
      >
        <Button type="link" icon={<LeftOutlined />} style={{ alignSelf: "flex-start" }}>
          Back
        </Button>
        <div className="w-full flex flex-col justify-center items-center">
          <Title level={2} style={{ marginBottom: 10 }}>
            Email Verification
          </Title>
          <Text type="secondary">Enter the OTP sent to your email</Text>

          <Form
            onFinish={onFinish}
            layout="vertical"
            style={{ width: "100%", maxWidth: "400px", marginTop: "20px" }}
          >
            <Form.Item
              name="otp"
              rules={[{ required: true, message: "Please enter the OTP" }]}
            >
              <div className="w-full flex justify-center items-center">
                <Input.OTP length={6} />
              </div>
            </Form.Item>

            <Form.Item>
              <BhmsButton type="primary" htmlType="submit" loading={loading}>
                {loading ? <Spin /> : "Verify"}
              </BhmsButton>
            </Form.Item>

            {error && (
              <div style={{ marginTop: "10px" }}>
                <Text type="danger">{error.error}</Text>
              </div>
            )}

            <Text type="secondary">
              Didn't receive the OTP?{" "}
              <Button type="link" onClick={() => console.log("Navigate to SMS verification")}>
                Verify with SMS instead
              </Button>
            </Text>
          </Form>
        </div>
        <div className="text-black text-center text-sm shadow-md">
          {/* &copy; {new Date().getFullYear()} BrandeviaHMS. All rights reserved. */}
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;