import React from 'react';
import { Hammer, X } from 'lucide-react';

interface DevelopmentNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DevelopmentNoticeModal: React.FC<DevelopmentNoticeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="dev-notice-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label="Development notice">
      <div className="dev-notice-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn dev-notice-close" onClick={onClose} aria-label="Close notice">
          <X size={18} />
        </button>
        <div className="dev-notice-icon">
          <Hammer size={26} />
        </div>
        <h2 className="dev-notice-title">Gohard is still under development</h2>
        <p className="dev-notice-message">
          Thanks for checking out Gohard! We&apos;re working hard to get things ready. Gohard will be
          available for testing soon.
        </p>
        <button className="dev-notice-btn" onClick={onClose} type="button">
          Got it
        </button>
      </div>
    </div>
  );
};

export default DevelopmentNoticeModal;
