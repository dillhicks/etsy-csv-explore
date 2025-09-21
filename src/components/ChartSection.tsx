import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import CollapsibleSectionHeader from './CollapsibleSectionHeader';
import ChartControls from './ChartControls';
import CustomTooltip from './CustomTooltip';
import { anonymizeNumber, anonymizeCurrency } from '../utils';
import type { PopularItem } from '../types';

interface ChartSectionProps {
  isCollapsed: boolean;
  onToggle: () => void;
  chartMetric: 'revenue' | 'quantity';
  setChartMetric: (metric: 'revenue' | 'quantity') => void;
  sortDirection: 'asc' | 'desc';
  setSortDirection: (direction: 'asc' | 'desc') => void;
  topItemsCount: number;
  setTopItemsCount: (count: number) => void;
  topItemsChartData: Array<{
    name: string;
    fullName: string;
    revenue: number;
    quantity: number;
  }>;
  isAnonymousMode?: boolean;
  onItemClick: (item: PopularItem) => void;
  popularItems: PopularItem[];
}

const ChartSection: React.FC<ChartSectionProps> = ({
  isCollapsed,
  onToggle,
  chartMetric,
  setChartMetric,
  sortDirection,
  setSortDirection,
  topItemsCount,
  setTopItemsCount,
  topItemsChartData,
  isAnonymousMode = false,
  onItemClick,
  popularItems
}) => {
  const chartIcon = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
      <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
    </svg>
  );

  // Y-axis tick formatter for anonymization
  const yAxisTickFormatter = (value: number) => {
    if (isAnonymousMode) {
      if (chartMetric === 'revenue') {
        return anonymizeCurrency(value);
      } else {
        const anonymized = anonymizeNumber(value);
        return typeof anonymized === 'string' ? anonymized : anonymized.toString();
      }
    }
    return chartMetric === 'revenue' ? `$${value.toFixed(2)}` : value.toString();
  };

  return (
    <div className="animate-fade-in" style={{
      background: 'linear-gradient(145deg, var(--background), var(--background-secondary))',
      padding: '1.5rem',
      borderRadius: 'var(--radius-xl)',
      border: '1px solid var(--border-light)',
      animationDelay: '0.5s',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: 'var(--border-color)'
      }} />

      <CollapsibleSectionHeader
        icon={chartIcon}
        title={`Top Items by ${chartMetric === 'revenue' ? 'Revenue' : 'Sales'}`}
        description={`Performance analysis sorted ${sortDirection === 'desc' ? 'high to low' : 'low to high'}`}
        isCollapsed={isCollapsed}
        onToggle={onToggle}
      />

      {!isCollapsed && (
        <>
          <ChartControls
            chartMetric={chartMetric}
            setChartMetric={setChartMetric}
            sortDirection={sortDirection}
            setSortDirection={setSortDirection}
            topItemsCount={topItemsCount}
            setTopItemsCount={setTopItemsCount}
          />

          <div style={{
            background: 'var(--background-tertiary)',
            borderRadius: 'var(--radius-lg)',
            padding: '1rem',
            border: '1px solid var(--border-light)',
            boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease'
          }}>
            <ResponsiveContainer width="100%" height={420}>
              <BarChart data={topItemsChartData} margin={{ top: 20, right: 120, left: 80, bottom: 100 }}>
                <defs>
                  <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.1)"/>
                  </filter>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" opacity={0.3} />
                <XAxis
                  dataKey="name"
                  stroke="var(--text-secondary)"
                  fontSize={11}
                  angle={-45}
                  textAnchor="end"
                  height={120}
                  interval={0}
                />
                <YAxis
                  stroke="var(--text-secondary)"
                  fontSize={12}
                  tickFormatter={yAxisTickFormatter}
                  label={{
                    value: chartMetric === 'revenue' ? 'Amount ($)' : 'Quantity',
                    angle: -90,
                    position: 'insideLeft',
                    offset: -30
                  }}
                />
                <Tooltip
                  content={<CustomTooltip isAnonymousMode={isAnonymousMode} />}
                  cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                />
                <Legend
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                  wrapperStyle={{
                    paddingLeft: '40px',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: '600'
                  }}
                  formatter={(value) => (
                    <span style={{ color: 'var(--text-primary)' }}>{value}</span>
                  )}
                />
                <Bar
                  dataKey={chartMetric}
                  fill="#c2410c"
                  name={chartMetric === 'revenue' ? 'Revenue' : 'Sales'}
                  radius={[4, 4, 0, 0]}
                  onClick={(data: any) => {
                    if (data && data.fullName) {
                      // Find the full item data from popularItems
                      const fullItem = popularItems.find(item =>
                        item.itemName === data.fullName ||
                        item.itemName === data.name
                      );
                      if (fullItem) {
                        onItemClick(fullItem);
                      }
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default ChartSection;