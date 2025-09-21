import React from 'react';
import '../styles/EmptyState.css';

interface EmptyStateProps {
  onOpenUpload: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onOpenUpload }) => {
  return (
    <div className="empty-state">
      <div className="empty-state-content">
        <div className="empty-state-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14,2 14,8 20,8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10,9 9,9 8,9"/>
          </svg>
        </div>

        <h2 className="empty-state-title">No Data to Display</h2>

        <p className="empty-state-description">
          Upload a CSV file to start exploring your Etsy sales data. You can analyze trends,
          view item performance, and gain insights into your business.
        </p>

        <button
          className="btn btn-primary empty-state-button"
          onClick={onOpenUpload}
          aria-label="Open upload sidebar to upload CSV file"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '0.5rem' }}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7,10 12,15 17,10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Upload CSV File
        </button>

        <div className="empty-state-features">
          <div className="feature-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '0.5rem' }}>
              <polyline points="20,6 9,17 4,12"/>
            </svg>
            <span>Analyze sales trends and patterns</span>
          </div>
          <div className="feature-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '0.5rem' }}>
              <polyline points="20,6 9,17 4,12"/>
            </svg>
            <span>View item performance metrics</span>
          </div>
          <div className="feature-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '0.5rem' }}>
              <polyline points="20,6 9,17 4,12"/>
            </svg>
            <span>Track revenue and quantity data</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;