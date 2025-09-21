import React, { useState, useRef, useEffect } from 'react';
import { parseCSV, aggregatePopularItems, parseListingsCSV, createListingsLookup } from '../utils';
import type { SaleItem, PopularItem, FilterState, FilterSummary, ListingItem } from '../types';
import '../styles/SidebarModal.css';

interface SidebarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataProcessed: (salesData?: SaleItem[], aggregated?: PopularItem[], listingsData?: any) => void;
  onPageReset: () => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  filterSummary: FilterSummary;
  isAnonymousMode: boolean;
  onAnonymousModeToggle: () => void;
}

const SidebarModal: React.FC<SidebarModalProps> = ({
  isOpen,
  onClose,
  onDataProcessed,
  onPageReset,
  filters,
  onFiltersChange,
  filterSummary,
  isAnonymousMode,
  onAnonymousModeToggle
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({
    soldOrders: { uploaded: false, fileName: '' },
    listings: { uploaded: false, fileName: '' }
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log('📦 SidebarModal component mounted');
  }, []);

  const processFile = async (file: File) => {
    console.log('🚀 Starting to process file:', file.name, 'size:', file.size);
    setLoading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 100);

      // Read first few lines to detect CSV type
      const text = await file.text();
      console.log(`📄 File: ${file.name} - Raw text length: ${text.length}`);
      console.log(`📄 File: ${file.name} - First 200 chars:`, text.substring(0, 200));

      // Remove BOM if present
      const cleanText = text.replace(/^\uFEFF/, '');
      const lines = cleanText.split(/\r?\n/).slice(0, 2); // Get header and first data row
      console.log(`📄 File: ${file.name} - Lines:`, lines);

      const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim().toLowerCase());
      console.log(`📄 File: ${file.name} - Processed headers:`, headers);

      // Simple type detection for logging
      const headerSet = new Set(headers);
      const hasSoldOrdersColumns = ['sale date', 'item name', 'quantity', 'item total', 'listing id'].every(col => headerSet.has(col));
      const hasListingsColumns = ['title', 'description', 'price', 'image1', 'sku'].every(col => headerSet.has(col));

      let csvType = 'unknown';
      if (hasSoldOrdersColumns) {
        csvType = 'sold_orders';
      } else if (hasListingsColumns) {
        csvType = 'listings';
      }

      console.log(`📄 File: ${file.name} - Detected CSV Type: ${csvType.toUpperCase()}`);

      if (csvType === 'listings') {
        const listingsData: ListingItem[] = await parseListingsCSV(file);
        const listingsLookup = createListingsLookup(listingsData);
        setUploadProgress(100);
        onDataProcessed(undefined, undefined, listingsLookup);
        onPageReset();

        // Update upload status
        setUploadStatus(prev => ({
          ...prev,
          listings: { uploaded: true, fileName: file.name }
        }));
      } else {
        const salesData: SaleItem[] = await parseCSV(file);
        setUploadProgress(100);
        const aggregated = aggregatePopularItems(salesData);
        onDataProcessed(salesData, aggregated);
        onPageReset();

        // Update upload status
        setUploadStatus(prev => ({
          ...prev,
          soldOrders: { uploaded: true, fileName: file.name }
        }));
      }

      // Add file to uploaded files list
      setUploadedFiles(prev => [...prev, file.name]);

      clearInterval(progressInterval);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while processing the file');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('🔥 File upload event triggered');
    const file = event.target.files?.[0];
    console.log('📂 File selected:', file?.name, 'size:', file?.size);
    if (!file) return;
    await processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    console.log('🎯 Drag drop event triggered');
    e.preventDefault();
    const files = e.dataTransfer.files;
    console.log('📂 Dropped files:', files.length);
    if (files.length > 0) {
      const file = files[0];
      console.log('📄 Processing dropped file:', file.name, 'type:', file.type);
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        processFile(file);
      } else {
        setError('Please upload a valid CSV file');
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Filter handlers
  const handleDateRangeChange = (type: FilterState['dateRange']['type']) => {
    if (type === 'custom') {
      setShowCustomDate(true);
    } else {
      setShowCustomDate(false);
    }

    onFiltersChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        type
      }
    });
  };

  const handleCustomDateChange = (field: 'start' | 'end', value: string) => {
    const date = value ? new Date(value) : null;
    onFiltersChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        customRange: {
          ...filters.dateRange.customRange,
          [field]: date
        }
      }
    });
  };

  const handleQuantityChange = (field: 'min' | 'max', value: string) => {
    const numValue = value === '' ? null : parseInt(value, 10);
    onFiltersChange({
      ...filters,
      quantityRange: {
        ...filters.quantityRange,
        [field]: numValue
      }
    });
  };

  const handleRevenueChange = (field: 'min' | 'max', value: string) => {
    const numValue = value === '' ? null : parseFloat(value);
    onFiltersChange({
      ...filters,
      revenueRange: {
        ...filters.revenueRange,
        [field]: numValue
      }
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      dateRange: {
        type: 'fullRange',
        customRange: { start: null, end: null }
      },
      quantityRange: {
        min: null,
        max: null
      },
      revenueRange: {
        min: null,
        max: null
      }
    });
    setShowCustomDate(false);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Modal Overlay */}
      <div className="sidebar-modal-overlay" onClick={onClose} />

      {/* Sidebar Modal */}
      <div className="sidebar-modal">
        <div className="sidebar-modal-header">
          <h2>Upload & Filter</h2>
          <button
            className="sidebar-modal-close"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="sidebar-modal-content">
          {/* File Upload Section */}
          <div className="sidebar-section">
            <h3>Upload Files</h3>
            <div
              className="upload-area"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="upload-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10,9 9,9 8,9"/>
                </svg>
              </div>
              <h4>Upload Your CSV File</h4>
              <p>Drag & drop your CSV file here or click to browse</p>

              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                disabled={loading}
                style={{ display: 'none' }}
              />

              <button
                type="button"
                className={`btn btn-primary ${loading ? 'btn-loading' : ''}`}
                onClick={handleUploadClick}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Choose CSV File'}
              </button>

              {loading && (
                <div className="loading-container">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p>Processing file... {uploadProgress}%</p>
                </div>
              )}

              {error && <p className="error">{error}</p>}
            </div>

            {/* File Upload Status */}
            <div className="upload-status">
              <h4>File Upload Status</h4>
              <div className="status-items">
                <div className={`status-item ${uploadStatus.soldOrders.uploaded ? 'status-uploaded' : 'status-missing'}`}>
                  <div className="status-icon">
                    {uploadStatus.soldOrders.uploaded ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20,6 9,17 4,12"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    )}
                  </div>
                  <div className="status-content">
                    <span className="status-label">Sold Order Items CSV</span>
                    {uploadStatus.soldOrders.uploaded ? (
                      <span className="status-file-name">{uploadStatus.soldOrders.fileName}</span>
                    ) : (
                      <span className="status-not-uploaded">Not uploaded</span>
                    )}
                  </div>
                </div>

                <div className={`status-item ${uploadStatus.listings.uploaded ? 'status-uploaded' : 'status-missing'}`}>
                  <div className="status-icon">
                    {uploadStatus.listings.uploaded ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20,6 9,17 4,12"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    )}
                  </div>
                  <div className="status-content">
                    <span className="status-label">Etsy Listings CSV</span>
                    {uploadStatus.listings.uploaded ? (
                      <span className="status-file-name">{uploadStatus.listings.fileName}</span>
                    ) : (
                      <span className="status-not-uploaded">Not uploaded</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="uploaded-files">
                <h4>Uploaded Files</h4>
                <ul>
                  {uploadedFiles.map((fileName, index) => (
                    <li key={index}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14,2 14,8 20,8"/>
                      </svg>
                      {fileName}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Filter Section */}
          <div className="sidebar-section">
            <h3>Filter Results</h3>

            {/* Date Range Filter */}
            <div className="filter-group">
              <label className="filter-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                Date Range
              </label>
              <select
                value={filters.dateRange.type}
                onChange={(e) => handleDateRangeChange(e.target.value as FilterState['dateRange']['type'])}
                className="filter-select"
              >
                <option value="lastWeek">Last 7 days</option>
                <option value="lastMonth">Last 30 days</option>
                <option value="last6Months">Last 6 months</option>
                <option value="fullRange">All time</option>
                <option value="custom">Custom range</option>
              </select>

              {showCustomDate && (
                <div className="custom-date-inputs">
                  <div className="date-input-group">
                    <label>From:</label>
                    <input
                      type="date"
                      value={filters.dateRange.customRange.start?.toISOString().split('T')[0] || ''}
                      onChange={(e) => handleCustomDateChange('start', e.target.value)}
                      className="filter-input"
                    />
                  </div>
                  <div className="date-input-group">
                    <label>To:</label>
                    <input
                      type="date"
                      value={filters.dateRange.customRange.end?.toISOString().split('T')[0] || ''}
                      onChange={(e) => handleCustomDateChange('end', e.target.value)}
                      className="filter-input"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Quantity Range Filter */}
            <div className="filter-group">
              <label className="filter-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"/>
                  <path d="M9 21v-4a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v4"/>
                </svg>
                Quantity Sold
              </label>
              <div className="quantity-inputs">
                <div className="quantity-input-group">
                  <label>Min:</label>
                  <input
                    type="number"
                    min="0"
                    value={filters.quantityRange.min || ''}
                    onChange={(e) => handleQuantityChange('min', e.target.value)}
                    placeholder="0"
                    className="filter-input"
                  />
                </div>
                <div className="quantity-input-group">
                  <label>Max:</label>
                  <input
                    type="number"
                    min="0"
                    value={filters.quantityRange.max || ''}
                    onChange={(e) => handleQuantityChange('max', e.target.value)}
                    placeholder="No limit"
                    className="filter-input"
                  />
                </div>
              </div>
            </div>

            {/* Revenue Range Filter */}
            <div className="filter-group">
              <label className="filter-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--success-color)' }}>
                  <line x1="12" y1="1" x2="12" y2="23"/>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
                Revenue ($)
              </label>
              <div className="quantity-inputs">
                <div className="quantity-input-group">
                  <label>Min:</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={filters.revenueRange.min || ''}
                    onChange={(e) => handleRevenueChange('min', e.target.value)}
                    placeholder="0.00"
                    className="filter-input"
                  />
                </div>
                <div className="quantity-input-group">
                  <label>Max:</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={filters.revenueRange.max || ''}
                    onChange={(e) => handleRevenueChange('max', e.target.value)}
                    placeholder="No limit"
                    className="filter-input"
                  />
                </div>
              </div>
            </div>

            {/* Filter Summary */}
            <div className="filter-summary">
              <div className="filter-summary-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <span>{filterSummary.totalItems} items</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="filter-actions">
              <button
                className="btn btn-secondary"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Anonymous Mode Section */}
          <div className="sidebar-section">
            <h3>Display Options</h3>
            <div className="anonymous-mode-container">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isAnonymousMode}
                  onChange={onAnonymousModeToggle}
                  className="anonymous-mode-checkbox"
                />
                Anonymous Mode
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarModal;