// src/components/SessionManager.jsx
import React, { useEffect, useRef } from "react";
import { Modal, Typography, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  updateActivity,
  setIdle,
  decrementCountdown,
  resetSession,
} from "../../redux/slice/sessionSlice";

import { logout } from "../../redux/slice/authSlice";

const { Text } = Typography;

const SessionManager = () => {
  const dispatch = useDispatch();
//   const navigate = useNavigate();

  const { showWarning, warningCountdown, lastActivity } = useSelector(
    (state) => state.sessionManager
  );

  const idleTimeoutRef = useRef(null);
  const warningIntervalRef = useRef(null);

  // Setup activity listeners
  useEffect(() => {
    const resetTimer = () => dispatch(updateActivity());

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);

    return () => {
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
    };
  }, [dispatch]);

  // Idle detection (5 mins = 300000 ms)
  useEffect(() => {
    idleTimeoutRef.current = setInterval(() => {
      const now = Date.now();
      if (now - lastActivity > 300000) {
        dispatch(setIdle());
      }
    }, 1000);

    return () => clearInterval(idleTimeoutRef.current);
  }, [dispatch, lastActivity]);

  // Countdown when warning is shown
  useEffect(() => {
    if (showWarning) {
      warningIntervalRef.current = setInterval(() => {
        dispatch(decrementCountdown());
      }, 1000);
    } else {
      clearInterval(warningIntervalRef.current);
    }
    return () => clearInterval(warningIntervalRef.current);
  }, [showWarning, dispatch]);

  // Logout when countdown reaches 0
  useEffect(() => {
    if (warningCountdown === 0) {
      dispatch(logout());
      window.location.href="/hms/login";
    }
  }, [warningCountdown, dispatch]);

  // Handle "Stay Logged In" click
  const handleStayLoggedIn = () => {
    dispatch(resetSession()); // resets countdown & updates activity
  };

  return (
    <Modal open={showWarning} closable={false} footer={null} centered>
      <div className="text-center space-y-4">
        <Text strong className="text-lg">
          You have been inactive for a while
        </Text>
        <p className="text-gray-600">
          You will be logged out automatically in{" "}
          <Text type="danger" strong>
            {warningCountdown}s
          </Text>
        </p>
        <p className="text-gray-500 text-sm">
          Move your mouse, press a key, or click below to stay logged in.
        </p>

        <Button type="primary" onClick={handleStayLoggedIn}>
          Stay Logged In
        </Button>
      </div>
    </Modal>
  );
};

export default SessionManager;
