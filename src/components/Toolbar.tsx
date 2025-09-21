import React from 'react';
import '../styles/Toolbar.css';

interface ToolbarProps {
  onMenuClick: () => void;
  isMenuOpen: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({ onMenuClick, isMenuOpen }) => {
  return (
    <div className="toolbar">
      <div className="toolbar-content">
        <button
          className={`hamburger-button ${isMenuOpen ? 'active' : ''}`}
          onClick={onMenuClick}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
        <div className="toolbar-title">
          <h1 className="animate-fade-in">Etsy CSV Data Explorer</h1>
          <p className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;