import React from 'react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: Record<string, number>;
  currentDate: Date;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, history, currentDate }) => {
  if (!isOpen) return null;

  const formatDateKey = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const dateKey = formatDateKey(currentDate);
  const hoursWorked = history[dateKey] || 0;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>History</h2>
        <p>Date: {dateKey}</p>
        <p>Hours Worked: {hoursWorked}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default HistoryModal;