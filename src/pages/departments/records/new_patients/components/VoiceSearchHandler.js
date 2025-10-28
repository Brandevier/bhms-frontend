import { useRef, useEffect } from 'react';
import { message } from 'antd';

export const useVoiceSearch = (onTranscript) => {
  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      message.warning('Voice search is not supported in your browser');
      return false;
    }

    if (isListeningRef.current) return false;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onstart = () => {
      isListeningRef.current = true;
      message.info('Listening... Speak now');
    };

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
      isListeningRef.current = false;
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      message.error(`Error: ${event.error}`);
      isListeningRef.current = false;
    };

    recognitionRef.current.onend = () => {
      isListeningRef.current = false;
    };

    try {
      recognitionRef.current.start();
      return true;
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      message.error('Failed to start voice search');
      return false;
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListeningRef.current) {
      recognitionRef.current.stop();
      isListeningRef.current = false;
    }
  };

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);

  return {
    startListening,
    stopListening,
    isListening: isListeningRef.current
  };
};