import React from 'react';
import '../styles/ChartControls.css';

interface ChartControlsProps {
  chartMetric: 'revenue' | 'quantity';
  setChartMetric: (metric: 'revenue' | 'quantity') => void;
  sortDirection: 'asc' | 'desc';
  setSortDirection: (direction: 'asc' | 'desc') => void;
  topItemsCount: number;
  setTopItemsCount: (count: number) => void;
}

const ChartControls = React.memo(({
  chartMetric,
  setChartMetric,
  sortDirection,
  setSortDirection,
  topItemsCount,
  setTopItemsCount
}: ChartControlsProps) => {
  return (
    <div className="animate-fade-in" style={{ marginBottom: '1rem', animationDelay: '0.4s' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', background: 'var(--background-secondary)', padding: '1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', fontSize: 'var(--font-size-sm)' }}>
            <input
              type="radio"
              name="chartMetric"
              value="revenue"
              checked={chartMetric === 'revenue'}
              onChange={(e) => setChartMetric(e.target.value as 'revenue' | 'quantity')}
              style={{ margin: 0 }}
            />
            Revenue
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', fontSize: 'var(--font-size-sm)' }}>
            <input
              type="radio"
              name="chartMetric"
              value="quantity"
              checked={chartMetric === 'quantity'}
              onChange={(e) => setChartMetric(e.target.value as 'revenue' | 'quantity')}
              style={{ margin: 0 }}
            />
            Sales
          </label>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>Sort:</label>
            <select
              value={sortDirection}
              onChange={(e) => setSortDirection(e.target.value as 'asc' | 'desc')}
              style={{
                padding: '0.5rem',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--background)',
                color: 'var(--text-primary)',
                fontSize: 'var(--font-size-sm)'
              }}
            >
              <option value="desc">High to Low</option>
              <option value="asc">Low to High</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>Show top:</label>
            <select
              value={topItemsCount}
              onChange={(e) => setTopItemsCount(parseInt(e.target.value, 10))}
              style={{
                padding: '0.5rem',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--background)',
                color: 'var(--text-primary)',
                fontSize: 'var(--font-size-sm)'
              }}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ChartControls;