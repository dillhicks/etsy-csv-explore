import React, { useState, lazy, Suspense } from 'react';
import type { SaleItem, PopularItem, ListingsData } from './types';
import Toolbar from './components/Toolbar';
import SidebarModal from './components/SidebarModal';
import ItemModal from './components/ItemModal';
import EmptyState from './components/EmptyState';
import { useFilters } from './hooks/useFilters';
import { useDataProcessing } from './hooks/useDataProcessing';
import { useChartData } from './hooks/useChartData';
import './App.css';

const AnalysisTab = lazy(() => import('./components/AnalysisTab'));
const TableView = lazy(() => import('./components/TableView'));

function App() {
  const [rawSalesData, setRawSalesData] = useState<SaleItem[]>([]);
  const [popularItems, setPopularItems] = useState<PopularItem[]>([]);
  const [listingsData, setListingsData] = useState<ListingsData>({});

  // Debug logging for listingsData
  React.useEffect(() => {
    console.log('App - Listings Data Keys:', Object.keys(listingsData));
    console.log('App - Listings Data Sample:', Object.values(listingsData).slice(0, 2));
  }, [listingsData]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'quantity' | 'name' | 'revenue'>('revenue');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<'analysis' | 'table'>('analysis');
  const [chartMetric, setChartMetric] = useState<'revenue' | 'quantity'>('revenue');
  const [topItemsCount, setTopItemsCount] = useState<number>(10);
  const [topVariationCount, setTopVariationCount] = useState<number>(10);
  const [consistentItemsCount, setConsistentItemsCount] = useState<number>(10);
  const [selectedItem, setSelectedItem] = useState<PopularItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAnonymousMode, setIsAnonymousMode] = useState(false);
  const itemsPerPage = 10;

  // Filter state
  const { filters, setFilters, getDateRange, filterSummary: baseFilterSummary } = useFilters();

  // Data processing moved to useDataProcessing hook
  const { dateFilteredSalesData, dateFilteredPopularItems, filteredSalesData, consistentItems } = useDataProcessing({
    rawSalesData,
    filters,
    searchTerm,
    sortBy,
    sortDirection,
    getDateRange
  });

  const filteredAndSortedItems = filteredSalesData;

  const totalPages = Math.ceil(filteredAndSortedItems.length / itemsPerPage);
  const paginatedItems = filteredAndSortedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Statistics calculations - use date-filtered data as base, then apply quantity/revenue filters
  const baseStatsData = dateFilteredPopularItems.length > 0 ? dateFilteredPopularItems : popularItems;
  const statsData = filteredSalesData.length > 0 ? filteredSalesData : baseStatsData;

  // Update filterSummary with totalItems
  const filterSummary = { ...baseFilterSummary, totalItems: baseStatsData.length };

  // filterSummary moved to useFilters hook
  const totalItems = statsData.length;
  const totalRevenue = statsData.reduce((sum, item) => sum + item.totalRevenue, 0);
  const avgRevenuePerItem = totalItems > 0 ? totalRevenue / totalItems : 0;
  const topItem = statsData[0];
  const totalVariations = statsData.reduce((sum, item) => sum + Object.keys(item.multiVariations || item.variations).length, 0);

  // Chart data moved to useChartData hook
  const { topItemsChartData, topVariationCombinations } = useChartData({
    baseStatsData,
    sortDirection,
    chartMetric,
    topItemsCount,
    topVariationCount
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as 'quantity' | 'name' | 'revenue';
    setSortBy(value);
    setSortDirection(value === 'name' ? 'asc' : 'desc');
    setCurrentPage(1); // Reset to first page on sort
  };

  const handleHeaderClick = (column: 'name' | 'quantity' | 'revenue') => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection(column === 'name' ? 'asc' : 'desc');
    }
    setCurrentPage(1);
  };

  const handleItemClick = (item: PopularItem) => {
    console.log('App: handleItemClick called with:', item.itemName, item);
    setSelectedItem(item);
    setIsModalOpen(true);
    console.log('App: State updated - selectedItem:', item, 'isModalOpen:', true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };


  return (
    <div className="app">
      <Toolbar
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        isMenuOpen={isSidebarOpen}
      />

      <SidebarModal
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onDataProcessed={(salesData, aggregated, listingsData = {}) => {
          if (salesData !== undefined) setRawSalesData(salesData);
          if (aggregated !== undefined) setPopularItems(aggregated);
          if (listingsData !== undefined) setListingsData(listingsData);
        }}
        onPageReset={() => setCurrentPage(1)}
        filters={filters}
        onFiltersChange={setFilters}
        filterSummary={filterSummary}
        isAnonymousMode={isAnonymousMode}
        onAnonymousModeToggle={() => setIsAnonymousMode(!isAnonymousMode)}
      />

      {popularItems.length > 0 ? (
        <div className="results animate-fade-in">
          {/* Tab Navigation */}
          <div className="tab-navigation" role="tablist" aria-label="View options">
            <button
              className={`tab-button ${activeTab === 'analysis' ? 'active' : ''}`}
              onClick={() => setActiveTab('analysis')}
              role="tab"
              aria-selected={activeTab === 'analysis'}
              aria-controls="analysis-panel"
              id="analysis-tab"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '0.5rem' }}>
                <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
              </svg>
              Analysis
            </button>
            <button
              className={`tab-button ${activeTab === 'table' ? 'active' : ''}`}
              onClick={() => setActiveTab('table')}
              role="tab"
              aria-selected={activeTab === 'table'}
              aria-controls="table-panel"
              id="table-tab"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '0.5rem' }}>
                <path d="M3 6h18"/>
                <path d="M3 12h18"/>
                <path d="M3 18h18"/>
              </svg>
              Item Table View
            </button>
          </div>

          {/* Tab Content with Suspense */}
          <Suspense fallback={<div className="loading-container"><div className="loading-dots"><div className="loading-dot"></div><div className="loading-dot"></div><div className="loading-dot"></div></div><p>Loading...</p></div>}>
            {activeTab === 'analysis' && (
              <AnalysisTab
                totalItems={totalItems}
                totalRevenue={totalRevenue}
                avgRevenuePerItem={avgRevenuePerItem}
                totalVariations={totalVariations}
                chartMetric={chartMetric}
                setChartMetric={setChartMetric}
                sortDirection={sortDirection}
                setSortDirection={setSortDirection}
                topItemsCount={topItemsCount}
                setTopItemsCount={setTopItemsCount}
                topItemsChartData={topItemsChartData}
                topVariationCount={topVariationCount}
                setTopVariationCount={setTopVariationCount}
                topVariationCombinations={topVariationCombinations}
                consistentItems={consistentItems}
                consistentItemsCount={consistentItemsCount}
                setConsistentItemsCount={setConsistentItemsCount}
                isAnonymousMode={isAnonymousMode}
                onItemClick={handleItemClick}
                popularItems={popularItems}
                listingsData={listingsData}
              />
            )}

            {activeTab === 'table' && (
              <TableView
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                sortBy={sortBy}
                setSortBy={setSortBy}
                sortDirection={sortDirection}
                setSortDirection={setSortDirection}
                paginatedItems={paginatedItems}
                totalPages={totalPages}
                currentPage={currentPage}
                handlePageChange={handlePageChange}
                handleSearchChange={handleSearchChange}
                handleSortChange={handleSortChange}
                handleHeaderClick={handleHeaderClick}
                handleItemClick={handleItemClick}
                topItem={topItem}
                itemsPerPage={itemsPerPage}
                listingsData={listingsData}
                isAnonymousMode={isAnonymousMode}
              />
            )}
          </Suspense>
        </div>
      ) : (
        <EmptyState onOpenUpload={() => setIsSidebarOpen(true)} />
      )}

      <ItemModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        rawSalesData={rawSalesData}
        dateFilteredSalesData={dateFilteredSalesData}
        listingsData={listingsData}
        isAnonymousMode={isAnonymousMode}
      />
    </div>
  );
}

export default App;
