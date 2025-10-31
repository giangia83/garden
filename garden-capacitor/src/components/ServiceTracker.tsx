import React from 'react';
import { Shape } from '../types';

interface ServiceTrackerProps {
  currentHours: number;
  goal: number;
  currentDate: Date;
  onEditClick: () => void;
  onAddHours: (hoursToAdd: number) => void;
  progressShape: Shape;
  themeColor: string;
}

const ServiceTracker: React.FC<ServiceTrackerProps> = ({
  currentHours,
  goal,
  currentDate,
  onEditClick,
  onAddHours,
  progressShape,
  themeColor,
}) => {
  const percentage = (currentHours / goal) * 100;

  return (
    <div className={`service-tracker ${themeColor}`}>
      <h2 className="text-xl font-bold">Service Tracker</h2>
      <div className="progress-container">
        <div className={`progress-shape ${progressShape}`} style={{ width: `${percentage}%` }} />
      </div>
      <p className="text-lg">Current Hours: {currentHours}</p>
      <p className="text-lg">Goal: {goal}</p>
      <p className="text-lg">Date: {currentDate.toLocaleDateString()}</p>
      <button onClick={onEditClick} className="edit-button">Edit</button>
      <button onClick={() => onAddHours(1)} className="add-button">Add Hour</button>
    </div>
  );
};

export default ServiceTracker;