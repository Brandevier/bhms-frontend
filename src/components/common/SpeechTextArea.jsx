// src/components/common/SpeechTextArea.js
import React, { useState, useEffect } from 'react';
import { Mentions, Button, message } from 'antd';
import { AudioOutlined, PauseOutlined, StopOutlined } from '@ant-design/icons';

const { Option } = Mentions;

const SpeechTextArea = ({
  value = '',
  onChange,
  mentionOptions = [],
  disabled = false,
  placeholder = 'Start typing or use microphone...',
  showMentions = true,
  recordingControlsPosition = 'inside' // 'inside' or 'below'
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recognition, setRecognition] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Check internet connection status
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
            .map(result => result?.[0])
            .map(result => result.transcript)
            .join('');

          onChange(transcript);
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

  const renderRecordingControls = () => (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center',
      gap: 8,
      marginTop: recordingControlsPosition === 'below' ? 8 : 0
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
          disabled={disabled}
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
  );

  return (
    <div>
      <div style={{ position: 'relative' }}>
        {showMentions ? (
          <Mentions
            autoSize={{ minRows: 4 }}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            style={{
              padding: "8px",
              fontSize: "16px",
              width: "100%",
              border: "none",
              outline: "none",
              boxShadow: "none",
            }}
            disabled={disabled || isRecording}
          >
            {mentionOptions.map(option => (
              <Option key={option.id} value={option.name}>
                {option.name}
              </Option>
            ))}
          </Mentions>
        ) : (
          <textarea
            style={{
              padding: "8px",
              fontSize: "16px",
              width: "100%",
              minHeight: "100px",
              border: "1px solid #d9d9d9",
              borderRadius: "4px",
            }}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled || isRecording}
          />
        )}

        {recordingControlsPosition === 'inside' && (
          <div style={{ 
            position: 'absolute', 
            right: 8, 
            bottom: 8, 
            display: 'flex', 
            alignItems: 'center',
            gap: 8
          }}>
            {renderRecordingControls()}
          </div>
        )}
      </div>

      {recordingControlsPosition === 'below' && renderRecordingControls()}
    </div>
  );
};

export default SpeechTextArea;