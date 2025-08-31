import React from 'react';
import './WorkTimeOverlay.css';

const formatTime = (isoTime) => {
  if (!isoTime) return '';
  
  // Create date object from ISO string - it will automatically convert to local timezone
  const date = new Date(isoTime);
  
  return date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

export const WorkTimeOverlay = ({ partner }) => {
  const startTime = formatTime(partner?.work_time?.from);
  const endTime = formatTime(partner?.work_time?.to);

  return (
    <div className="work-time-overlay">
      <div className="work-time-message">
        <div className="clock-icon">🕐</div>
        <h4>Заведение сейчас закрыто</h4>
        <p>
          Время работы: {startTime} - {endTime}
        </p>
      </div>
    </div>
  );
};
