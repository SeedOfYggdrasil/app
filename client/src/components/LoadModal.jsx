import PropTypes from 'prop-types';
import '../css/LoadModal.css';

const LoadModal = ({ isVisible, onClose, documents, onSelectDocument, onDeleteDocument }) => {
  if (!isVisible) return null;

  return (
    <div className="load-modal-backdrop">
      <div className="load-modal">
        <h2>Load Document</h2>
        {documents.length === 0 ? (
          <p>No saved documents found.</p>
        ) : (
          <ul>
            {documents.map((doc) => (
              <li key={doc.id}>
                <span className="doc-title" onClick={() => onSelectDocument(doc.data, doc.id, doc.data.title || "Untitled")}>
                  {doc.data.title || "Untitled Document"}
                  <small className="doc-date">
                     ({doc.data.updatedAt ? new Date(doc.data.updatedAt.seconds * 1000).toLocaleDateString() : 'N/A'})
                  </small>
                </span>
                <button className="delete-doc-btn" onClick={() => onDeleteDocument(doc.id)}>Delete</button>
              </li>
            ))}
          </ul>
        )}
        <button className="btn-close-modal" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

LoadModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  documents: PropTypes.array.isRequired,
  onSelectDocument: PropTypes.func.isRequired,
  onDeleteDocument: PropTypes.func.isRequired,
};

export default LoadModal;