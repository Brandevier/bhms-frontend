import React, { useState, useEffect } from 'react';
import { Statistic } from 'antd';

const TimerDisplay = ({ timeElapsed }) => {
  const [time, setTime] = useState(timeElapsed);

  useEffect(() => {
    if (!timeElapsed) return;
    
    const [minutes, seconds] = timeElapsed.split(':').map(Number);
    let totalSeconds = minutes * 60 + seconds;
    
    const interval = setInterval(() => {
      totalSeconds++;
      const mins = Math.floor(totalSeconds / 60);
      const secs = totalSeconds % 60;
      setTime(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [timeElapsed]);

  return (
    <Statistic 
      value={time} 
      valueStyle={{ fontSize: '24px' }} 
      className="text-center"
    />
  );
};

export default TimerDisplay;