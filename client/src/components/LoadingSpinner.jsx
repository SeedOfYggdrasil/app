import PropTypes from 'prop-types';
import '../css/LoadingSpinner.css';

const LoadingSpinner = ({ message }) => {
  return (
    <div className="loading-spinner-overlay">
      <div className="loading-spinner-container">
        <div className="spinner"></div>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

LoadingSpinner.propTypes = {
  message: PropTypes.string,
};

export default LoadingSpinner;
