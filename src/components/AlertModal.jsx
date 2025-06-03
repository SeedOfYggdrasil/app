import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';
import '../css/AlertModal.css';

const AlertModal = ({ isVisible, title, message, type = 'info', onClose, onConfirm, confirmText }) => {
  const modalRef = useRef(null);
  const lastActiveElementRef = useRef(null);

  useEffect(() => {
    if (isVisible) {
      lastActiveElementRef.current = document.activeElement;
      // Timeout to ensure modal is rendered before focusing
      setTimeout(() => {
        if (modalRef.current) {
          modalRef.current.focus();
        }
      }, 0);
    } else {
      if (lastActiveElementRef.current && lastActiveElementRef.current.focus) {
        lastActiveElementRef.current.focus();
      }
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape' && isVisible && onClose) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="alert-modal-backdrop">
      <div
        className={`alert-modal alert-modal-${type}`}
        role={onConfirm ? "alertdialog" : "dialog"}
        aria-modal="true"
        aria-labelledby={title ? `alert-modal-title-${type}` : undefined}
        tabIndex="-1"
        ref={modalRef}
      >
        {title && <h2 id={`alert-modal-title-${type}`}>{title}</h2>}
        <p>{message}</p>
        <div className="alert-modal-actions">
          {onConfirm && confirmText && (
            <button className="btn-confirm" onClick={onConfirm}>
              {confirmText}
            </button>
          )}
          <button className="btn-close-alert" onClick={onClose}>
            {onConfirm ? 'Cancel' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};

AlertModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  title: PropTypes.string,
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['info', 'success', 'error', 'warning', 'loading']),
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func,
  confirmText: PropTypes.string,
};

export default AlertModal;
