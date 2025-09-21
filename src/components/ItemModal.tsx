import React, { useState } from 'react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { PopularItem, SaleItem, ListingsData } from '../types';
import {getVariationTypePieData, getSalesOverTimeData, anonymizeNumber, anonymizeCurrency, anonymizePercentage } from '../utils';
import '../styles/ItemModal.css';

interface ItemModalProps {
  item: PopularItem | null;
  isOpen: boolean;
  onClose: () => void;
  rawSalesData: SaleItem[];
  dateFilteredSalesData: SaleItem[];
  listingsData: ListingsData;
  isAnonymousMode?: boolean;
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

const ItemModal: React.FC<ItemModalProps> = ({ item, isOpen, onClose, rawSalesData: _, dateFilteredSalesData, listingsData, isAnonymousMode = false }) => {
  const [timeAggregation, setTimeAggregation] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [metricType, setMetricType] = useState<'revenue' | 'quantity'>('revenue');


  console.log('ItemModal: Rendering with props:', { item: item?.itemName, isOpen, hasItem: !!item });

  if (!isOpen || !item) {
    console.log('ItemModal: Not rendering - isOpen:', isOpen, 'hasItem:', !!item);
    return null;
  }

  console.log('ItemModal: About to render modal JSX for item:', item.itemName);

  const variationTypeData = getVariationTypePieData(item);
  const timeSeriesData = getSalesOverTimeData(dateFilteredSalesData, item.itemName, timeAggregation);

  // Handle different variation scenarios
  const variationsToUse = item.multiVariations || item.variations;
  const variationCount = Object.keys(variationsToUse).length;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  console.log('ItemModal: Rendering modal JSX for item:', item.itemName);

  return (
    <div
      className="modal-backdrop"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div className="modal-container">
        <div className="modal-header">
          <div className="modal-title-section">
            <div className="modal-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
              </svg>
            </div>
            <div>
              <h2 id="modal-title" className="modal-title">Sales Analysis</h2>
              <p id="modal-description" className="modal-subtitle">Detailed breakdown of sales performance</p>
            </div>
          </div>
          <button
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className="modal-header product-info-header">
          <div className="modal-title-section">
            <div className="item-info">
              <h2 id="modal-title" className="modal-title">{item.itemName}</h2>
              <p id="modal-description" className="modal-subtitle">ID: {item.listingId}</p>
            </div>
            {/* Listing Image */}
            {(() => {
              const listing = listingsData[item.listingId] || listingsData[item.itemName];
              return listing && listing.IMAGE1 ? (
                <div className="modal-image-container">
                  <img
                    src={listing.IMAGE1}
                    alt={item.itemName}
                    className="modal-listing-image"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              ) : null;
            })()}
          </div>
        </div>

        <div className="modal-body">
          {/* Statistics Cards */}
          <div className="modal-stats">
            <div className="stat-card">
              <div className="stat-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23"/>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
              <div className="stat-content">
                <div className="stat-value">{isAnonymousMode ? anonymizeNumber(item.totalQuantity) : item.totalQuantity.toLocaleString()}</div>
                <div className="stat-label">Total Items Sold</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23"/>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
              <div className="stat-content">
                <div className="stat-value">{isAnonymousMode ? anonymizeCurrency(item.totalRevenue) : `$${item.totalRevenue.toFixed(2)}`}</div>
                <div className="stat-label">Total Revenue</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 3v18h18"/>
                  <path d="M18.7 8a3 3 0 0 0-5.4 0"/>
                  <path d="M16.4 4a5 5 0 0 0-8.8 0"/>
                </svg>
              </div>
              <div className="stat-content">
                <div className="stat-value">{isAnonymousMode ? anonymizeNumber(variationCount) : variationCount}</div>
                <div className="stat-label">Variations</div>
              </div>
            </div>
          </div>

          {/* Chart Controls */}
          <div className="chart-controls">
            <div className="control-group">
              <label className="control-label">Time Period:</label>
              <div className="control-buttons">
                <button
                  className={`control-btn ${timeAggregation === 'daily' ? 'active' : ''}`}
                  onClick={() => setTimeAggregation('daily')}
                >
                  Daily
                </button>
                <button
                  className={`control-btn ${timeAggregation === 'weekly' ? 'active' : ''}`}
                  onClick={() => setTimeAggregation('weekly')}
                >
                  Weekly
                </button>
                <button
                  className={`control-btn ${timeAggregation === 'monthly' ? 'active' : ''}`}
                  onClick={() => setTimeAggregation('monthly')}
                >
                  Monthly
                </button>
              </div>
            </div>
            <div className="control-group">
              <label className="control-label">Metric:</label>
              <div className="control-buttons">
                <button
                  className={`control-btn ${metricType === 'revenue' ? 'active' : ''}`}
                  onClick={() => setMetricType('revenue')}
                >
                  Revenue
                </button>
                <button
                  className={`control-btn ${metricType === 'quantity' ? 'active' : ''}`}
                  onClick={() => setMetricType('quantity')}
                >
                  Items Sold
                </button>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="modal-charts">
            {/* Variations Pie Charts */}
            {variationCount === 0 ? (
              <div className="chart-container">
                <h3 className="chart-title">Sales by Variation</h3>
                <div className="no-data">
                  <p>No variations found for this item.</p>
                </div>
              </div>
            ) : variationCount === 1 ? (
              <div className="chart-container">
                <h3 className="chart-title">Sales by Variation</h3>
                <div className="single-variation">
                  <div className="variation-display">
                    <div className="variation-name">
                      {Object.keys(variationsToUse)[0] === 'No Variation' ? 'Default' : Object.keys(variationsToUse)[0]}
                    </div>
                    <div className="variation-quantity">
                      {isAnonymousMode ? anonymizeNumber(Object.values(variationsToUse)[0]) : Object.values(variationsToUse)[0]} sold (100%)
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Multiple variations - show separate pie charts for each variation type
              variationTypeData.map((variationType) => {
                return (
                  <div key={variationType.type} className="chart-container">
                    <h3 className="chart-title">{variationType.type}</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={variationType.data}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percentage }) => `${name}: ${isAnonymousMode ? anonymizePercentage(Number(percentage)) : `${percentage}%`}`}
                          outerRadius={60}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {variationType.data.map((_, dataIndex) => (
                            <Cell key={`cell-${dataIndex}`} fill={COLORS[dataIndex % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => [isAnonymousMode ? anonymizeNumber(value as number) : `${value} items`, 'Quantity']}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="variation-summary">
                      <p className="variation-total">
                        {isAnonymousMode ? anonymizeNumber(variationType.data.reduce((sum, item) => sum + item.value, 0)) : variationType.data.reduce((sum, item) => sum + item.value, 0)} items sold
                      </p>
                      <p className="variation-percentage">
                        {isAnonymousMode ? anonymizePercentage(Math.round((variationType.data.reduce((sum, item) => sum + item.value, 0) / item.totalQuantity) * 100)) : `${Math.round((variationType.data.reduce((sum, item) => sum + item.value, 0) / item.totalQuantity) * 100)}% of total sales`}
                      </p>
                    </div>
                  </div>
                );
              })
            )}

            {/* Sales Over Time Line Chart */}
            <div className="chart-container">
              <h3 className="chart-title">Sales Over Time</h3>
              {timeSeriesData.length === 0 ? (
                <div className="no-data">
                  <p>No time series data available for this item.</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" opacity={0.3} />
                    <XAxis
                      dataKey="formattedDate"
                      stroke="var(--text-secondary)"
                      fontSize={11}
                    />
                    <YAxis
                      stroke="var(--text-secondary)"
                      fontSize={11}
                      tickFormatter={(value) => isAnonymousMode
                        ? (metricType === 'revenue' ? anonymizeCurrency(Number(value)) : anonymizeNumber(Number(value)))
                        : (metricType === 'revenue' ? `$${Number(value).toFixed(0)}` : value)
                      }
                    />
                    <Tooltip
                      labelFormatter={(label) => `Date: ${label}`}
                      formatter={(value) => [
                        isAnonymousMode
                          ? (metricType === 'revenue' ? anonymizeCurrency(Number(value)) : anonymizeNumber(Number(value)))
                          : (metricType === 'revenue' ? `$${Number(value).toFixed(2)}` : `${value} items`),
                        metricType === 'revenue' ? 'Revenue' : 'Items Sold'
                      ]}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey={metricType === 'revenue' ? "revenue" : "quantity"}
                      stroke={metricType === 'revenue' ? "#6366f1" : "#10b981"}
                      strokeWidth={2}
                      name={metricType === 'revenue' ? "Revenue" : "Items Sold"}
                      dot={{ fill: metricType === 'revenue' ? '#6366f1' : '#10b981', strokeWidth: 2, r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemModal;