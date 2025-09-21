import React from 'react';

interface CollapsibleSectionHeaderProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isCollapsed: boolean;
  onToggle: () => void;
}

const CollapsibleSectionHeader: React.FC<CollapsibleSectionHeaderProps> = ({
  icon,
  title,
  description,
  isCollapsed,
  onToggle
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: isCollapsed ? '1.5rem' : '1.5rem',
        cursor: 'pointer'
      }}
      onClick={onToggle}
    >
      <div style={{
        background: 'var(--background-secondary)',
        padding: '0.5rem',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <h3 style={{
          margin: 0,
          color: '#c2410c',
          fontSize: 'var(--font-size-lg)',
          fontWeight: '700'
        }}>
          {title}
        </h3>
        <p style={{
          margin: '0.25rem 0 0 0',
          color: 'var(--text-secondary)',
          fontSize: 'var(--font-size-xs)'
        }}>
          {description}
        </p>
      </div>
      <div style={{
        transition: 'transform 0.3s ease',
        transform: isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)'
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2">
          <polyline points="6,9 12,15 18,9"/>
        </svg>
      </div>
    </div>
  );
};

export default CollapsibleSectionHeader;