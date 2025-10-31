import React, { useState } from 'react';
import Modal from 'react-modal';

interface AddHoursModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddHours: (hoursToAdd: number) => void;
  onSetHours: (totalHours: number) => void;
  mode: 'add' | 'edit';
  currentHours: number;
  themeColor: string;
}

const AddHoursModal: React.FC<AddHoursModalProps> = ({
  isOpen,
  onClose,
  onAddHours,
  onSetHours,
  mode,
  currentHours,
  themeColor,
}) => {
  const [hours, setHours] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'add') {
      onAddHours(hours);
    } else {
      onSetHours(hours);
    }
    setHours(0);
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} style={{ overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)' }, content: { color: themeColor } }}>
      <h2>{mode === 'add' ? 'Add Hours' : 'Set Total Hours'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={hours}
          onChange={(e) => setHours(Number(e.target.value))}
          placeholder="Enter hours"
          required
        />
        <button type="submit">{mode === 'add' ? 'Add' : 'Set'}</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </Modal>
  );
};

export default AddHoursModal;