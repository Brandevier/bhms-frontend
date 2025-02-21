import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyPuzzleAnswer } from "../../redux/slice/authSlice";
import { Card, Typography, Radio, message } from "antd";
import BhmsButton from "../../heroComponents/BhmsButton";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const PuzzleAuthentication = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { pendingUser, loading, error } = useSelector((state) => state.auth);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // Redirect to login if pendingUser is null
    useEffect(() => {
        if (!pendingUser) {
            navigate("/login");
        }
    }, [pendingUser, navigate]);

    // Prevent errors by checking if pendingUser exists before rendering
    if (!pendingUser) {
        return null; // Return nothing until redirect happens
    }

    // Handle answer selection
    const handleAnswerChange = (e) => {
        setSelectedAnswer(e.target.value);
    };

    // Handle form submission
    const handleSubmit = () => {
        if (!selectedAnswer) {
            message.warning("Please select an answer before proceeding.");
            return;
        }

        setSubmitting(true);
        dispatch(verifyPuzzleAnswer({ staffID: pendingUser.staffID, selectedAnswer: selectedAnswer }))
            .unwrap()
            .then(() => {
                message.success("Authentication successful!");
                navigate('/staff')
            })
            .catch((err) => {
                message.error(err || "Incorrect answer. Please try again.");
                setSubmitting(false);
            });
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f0f2f5" }}>
            <Card style={{ width: 500, padding: "20px", borderRadius: "10px", textAlign: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
                {/* Security Instructions */}
                <Title level={4} style={{ color: "#19417D" }}>🔒 Security Verification</Title>
                <Text type="secondary">
                    To ensure your identity, please answer the security question below. Select the correct answer to proceed.
                </Text>

                {/* Puzzle Question */}
                <div style={{ marginTop: "20px", textAlign: "left" }}>
                    <Title level={5} style={{ marginBottom: "10px" }}>{pendingUser.logic_question}</Title>

                    {/* Answer Options */}
                    <Radio.Group onChange={handleAnswerChange} value={selectedAnswer} style={{ width: "100%" }}>
                        {pendingUser.options.map((option, index) => (
                            <Radio key={index} value={option} style={{ display: "block", padding: "8px", fontSize: "16px" }}>
                                {option}
                            </Radio>
                        ))}
                    </Radio.Group>
                </div>

                {/* Submit Button */}
                <BhmsButton
                    type="primary"
                    block
                    onClick={handleSubmit}
                    loading={submitting}
                    disabled={loading}
                    className="mt-5"
                >
                    Submit Answer
                </BhmsButton>

                {/* Error Message */}
                {error && <Text type="danger" style={{ display: "block", marginTop: "10px" }}>{error}</Text>}
            </Card>
        </div>
    );
};

export default PuzzleAuthentication;
