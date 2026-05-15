import React from 'react';

const PipedriveModal = ({ onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        <iframe 
          src="https://kaman.pipedrive.com/scheduler/Lz08pKC2/kaman-poznajmy-sie-lepiej"
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="Pipedrive Scheduler"
        ></iframe>
      </div>
    </div>
  );
};

export default PipedriveModal;
