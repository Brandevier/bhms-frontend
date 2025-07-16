import React, { useState, useEffect } from "react";
import { Modal, Form, Select, Input, Spin, Button, message } from "antd";
import { AudioOutlined, PauseOutlined, StopOutlined } from "@ant-design/icons";
import BhmsButton from "../heroComponents/BhmsButton";

const { Option } = Select;
const { TextArea } = Input;

const RequestLabDialog = ({ visible, tests, onClose, onSubmit, loading }) => {
  const [form] = Form.useForm();
  const [selectedTest, setSelectedTest] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recognition, setRecognition] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Check internet connection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognizer = new SpeechRecognition();
        recognizer.continuous = true;
        recognizer.interimResults = true;
        recognizer.lang = 'en-US';

        recognizer.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');

          form.setFieldsValue({
            comment: transcript
          });
        };

        recognizer.onerror = (event) => {
          console.error('Speech recognition error', event.error);
          message.error(`Speech recognition error: ${event.error}`);
          stopRecording();
        };

        setRecognition(recognizer);
      }
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  // Timer effect
  useEffect(() => {
    let timer;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const handleFinish = (values) => {
    onSubmit(values);
    form.resetFields();
    setRecordingTime(0);
  };

  const startRecording = () => {
    if (!isOnline) {
      message.warning("Speech-to-text requires an internet connection");
      return;
    }

    if (!recognition) {
      message.error("Speech recognition not supported in this browser");
      return;
    }

    try {
      recognition.start();
      setIsRecording(true);
      setRecordingTime(0);
      message.info("Recording started. Speak now...");
    } catch (err) {
      console.error("Recording error:", err);
      message.error("Failed to start recording");
    }
  };

  const pauseRecording = () => {
    if (recognition) {
      recognition.stop();
      setIsRecording(false);
      message.info("Recording paused");
    }
  };

  const stopRecording = () => {
    if (recognition) {
      recognition.stop();
      setIsRecording(false);
      message.info("Recording stopped");
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Modal
      title="Request Lab Test"
      open={visible}
      onCancel={() => {
        onClose();
        stopRecording();
      }}
      footer={[
        <BhmsButton key="cancel" block={false} outline onClick={() => {
          onClose();
          stopRecording();
        }}>
          Cancel
        </BhmsButton>,
        <BhmsButton 
          key="submit" 
          block={false} 
          type="primary" 
          onClick={() => form.submit()}
          disabled={isRecording}
        >
          {loading ? <Spin /> : "Request"}
        </BhmsButton>,
      ]}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        {/* Lab Test Selection */}
        <Form.Item
          name="test_id"
          label="Search & Select Lab Test"
          rules={[{ required: true, message: "Please select a lab test" }]}
        >
          <Select
            showSearch
            placeholder="Type to search lab tests"
            onChange={setSelectedTest}
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {tests?.map((test) => (
              <Option key={test.id} value={test.id}>
                {test.test_name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Additional Comments with Speech-to-Text */}
        <Form.Item name="comment" label="Additional Comments">
          <div style={{ position: 'relative' }}>
            <TextArea 
              rows={4} 
              placeholder="Enter any additional details or use microphone..." 
              disabled={isRecording}
            />
            <div style={{ 
              position: 'absolute', 
              right: 8, 
              bottom: 8, 
              display: 'flex', 
              alignItems: 'center',
              gap: 8
            }}>
              {isRecording && (
                <span style={{ 
                  color: '#ff4d4f', 
                  fontWeight: 'bold',
                  marginRight: 8
                }}>
                  {formatTime(recordingTime)}
                </span>
              )}
              
              {!isRecording ? (
                <Button
                  type="text"
                  icon={<AudioOutlined />}
                  onClick={startRecording}
                  title="Start speech-to-text"
                  style={{ color: isOnline ? '#1890ff' : '#ccc' }}
                />
              ) : (
                <>
                  <Button
                    type="text"
                    icon={<PauseOutlined />}
                    onClick={pauseRecording}
                    title="Pause recording"
                    style={{ color: '#ff4d4f' }}
                  />
                  <Button
                    type="text"
                    icon={<StopOutlined />}
                    onClick={stopRecording}
                    title="Stop recording"
                    style={{ color: '#ff4d4f' }}
                  />
                </>
              )}
            </div>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RequestLabDialog;