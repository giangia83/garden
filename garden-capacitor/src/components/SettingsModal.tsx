import React, { useState } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newName: string, newGoal: number, newDate: Date, newShape: string, newColor: string) => void;
  currentName: string;
  currentGoal: number;
  currentDate: Date;
  currentShape: string;
  currentColor: string;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentName,
  currentGoal,
  currentDate,
  currentShape,
  currentColor,
}) => {
  const [name, setName] = useState(currentName);
  const [goal, setGoal] = useState(currentGoal);
  const [date, setDate] = useState(currentDate.toISOString().split('T')[0]);
  const [shape, setShape] = useState(currentShape);
  const [color, setColor] = useState(currentColor);

  const handleSave = () => {
    onSave(name, goal, new Date(date), shape, color);
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Settings</h2>
        <label>
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Goal:
          <input type="number" value={goal} onChange={(e) => setGoal(Number(e.target.value))} />
        </label>
        <label>
          Date:
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        <label>
          Shape:
          <select value={shape} onChange={(e) => setShape(e.target.value)}>
            <option value="flower">Flower</option>
            <option value="circle">Circle</option>
            <option value="heart">Heart</option>
          </select>
        </label>
        <label>
          Color:
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        </label>
        <button onClick={handleSave}>Save</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default SettingsModal;