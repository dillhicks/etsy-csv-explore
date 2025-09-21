// Custom tooltip component to show full product names
import React from 'react';
import { anonymizeNumber, anonymizeCurrency } from '../utils';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  isAnonymousMode?: boolean;
}

const CustomTooltip = React.memo(({ active, payload, label, isAnonymousMode = false }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'var(--background)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-md)',
        padding: '1rem'
      }}>
        <p style={{ margin: 0, fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          {label}
        </p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ margin: '0.25rem 0', color: 'var(--text-primary)' }}>
            {entry.name === 'Revenue' ? 'Revenue' : 'Quantity Sold'}: {' '}
            <span style={{ fontWeight: 'bold' }}>
              {isAnonymousMode
                ? (entry.name === 'Revenue' ? anonymizeCurrency(entry.value) : anonymizeNumber(entry.value))
                : (entry.name === 'Revenue' ? `$${entry.value?.toFixed(2)}` : entry.value)
              }
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
});

export default CustomTooltip;