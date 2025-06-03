import PropTypes from 'prop-types'
import { useEffect, useRef } from 'react'
import BtnClose from './BtnClose'
import '../css/Login.css'
import '../css/BtnClose.css'
import '../css/LandingPage.css'
import '../css/fonts.css'

const ModalWrapper = ({ children, isVisible, toggleModal }) => {
  const modalRef = useRef(null);
  const lastActiveElementRef = useRef(null);

  useEffect(() => {
    if (isVisible) {
      lastActiveElementRef.current = document.activeElement;
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
      if (event.key === 'Escape' && isVisible) {
        toggleModal();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isVisible, toggleModal]);

  if (!isVisible) return null

  return (
    <div className='modal-backdrop'>
      <div
        className='modal'
        role='dialog'
        aria-modal='true'
        aria-labelledby='modal-title' 
        tabIndex='-1'
        ref={modalRef}
      >
        {children}
        <BtnClose onClick={toggleModal} />
      </div>
    </div>
  )
}

ModalWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  isVisible: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
}

export default ModalWrapper
