import React from 'react';
import '../styles/StatisticsCards.css';
import { anonymizeNumber, anonymizeCurrency } from '../utils';

interface StatisticsCardsProps {
  totalItems: number;
  totalRevenue: number;
  avgRevenuePerItem: number;
  totalVariations: number;
  isAnonymousMode?: boolean;
}

const StatisticsCards = React.memo(({
  totalItems,
  totalRevenue,
  avgRevenuePerItem,
  totalVariations,
  isAnonymousMode = false
}: StatisticsCardsProps) => {
  return (
    <div className="stats-grid animate-fade-in" style={{ animationDelay: '0.3s' }}>
      <div className="stat-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--text-secondary)' }}>
            <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7v10"/>
            <polyline points="12,3 12,12 12,21"/>
          </svg>
        </div>
        <div className="stat-number enhanced-visibility">
          {isAnonymousMode ? anonymizeNumber(totalItems) : totalItems}
        </div>
        <div className="stat-label">Total Items</div>
      </div>
      <div className="stat-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--text-secondary)' }}>
            <line x1="12" y1="1" x2="12" y2="23"/>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
        </div>
        <div className="stat-number enhanced-visibility">
          {isAnonymousMode ? anonymizeCurrency(totalRevenue) : `$${totalRevenue.toFixed(2)}`}
        </div>
        <div className="stat-label">Total Revenue</div>
      </div>
      <div className="stat-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--text-secondary)' }}>
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
            <line x1="8" y1="21" x2="16" y2="21"/>
            <line x1="12" y1="17" x2="12" y2="21"/>
            <path d="M7 8h10"/>
            <path d="M7 12h10"/>
          </svg>
        </div>
        <div className="stat-number enhanced-visibility">
          {isAnonymousMode ? anonymizeCurrency(avgRevenuePerItem) : `$${avgRevenuePerItem.toFixed(2)}`}
        </div>
        <div className="stat-label">Avg Revenue per Item</div>
      </div>
      <div className="stat-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--text-secondary)' }}>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
        <div className="stat-number enhanced-visibility">
          {isAnonymousMode ? anonymizeNumber(totalVariations) : totalVariations}
        </div>
        <div className="stat-label">Variations</div>
      </div>
    </div>
  );
});

export default StatisticsCards;