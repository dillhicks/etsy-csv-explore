import React, { useState } from 'react';
import StatisticsCards from './StatisticsCards';
import ChartSection from './ChartSection';
import VariationsSection from './VariationsSection';
import ConsistencySection from './ConsistencySection';
import '../styles/AnalysisTab.css';
import type { ConsistentItem, PopularItem, ListingsData } from '../types';

interface AnalysisTabProps {
  totalItems: number;
  totalRevenue: number;
  avgRevenuePerItem: number;
  totalVariations: number;
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
  topVariationCount: number;
  setTopVariationCount: (count: number) => void;
  topVariationCombinations: Array<{
    itemName: string;
    listingId: string;
    variation: string;
    quantity: number;
  }>;
  consistentItems: ConsistentItem[];
  consistentItemsCount: number;
  setConsistentItemsCount: (count: number) => void;
  isAnonymousMode?: boolean;
  onItemClick: (item: PopularItem) => void;
  popularItems: PopularItem[];
  listingsData: ListingsData;
}

const AnalysisTab = React.memo(({
  totalItems,
  totalRevenue,
  avgRevenuePerItem,
  totalVariations,
  chartMetric,
  setChartMetric,
  sortDirection,
  setSortDirection,
  topItemsCount,
  setTopItemsCount,
  topItemsChartData,
  topVariationCount,
  setTopVariationCount,
  topVariationCombinations,
  consistentItems,
  consistentItemsCount,
  setConsistentItemsCount,
  isAnonymousMode = false,
  onItemClick,
  popularItems,
  listingsData
}: AnalysisTabProps) => {
  const [collapsedSections, setCollapsedSections] = useState({
    chart: true,
    variations: true,
    consistency: true
  });

  const toggleSection = (section: keyof typeof collapsedSections) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div id="analysis-panel" role="tabpanel" aria-labelledby="analysis-tab">
      {/* Statistics Cards */}
      <StatisticsCards
        totalItems={totalItems}
        totalRevenue={totalRevenue}
        avgRevenuePerItem={avgRevenuePerItem}
        totalVariations={totalVariations}
        isAnonymousMode={isAnonymousMode}
      />

      <ChartSection
        isCollapsed={collapsedSections.chart}
        onToggle={() => toggleSection('chart')}
        chartMetric={chartMetric}
        setChartMetric={setChartMetric}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        topItemsCount={topItemsCount}
        setTopItemsCount={setTopItemsCount}
        topItemsChartData={topItemsChartData}
        isAnonymousMode={isAnonymousMode}
        onItemClick={onItemClick}
        popularItems={popularItems}
      />

      <VariationsSection
        isCollapsed={collapsedSections.variations}
        onToggle={() => toggleSection('variations')}
        topVariationCount={topVariationCount}
        setTopVariationCount={setTopVariationCount}
        topVariationCombinations={topVariationCombinations}
        isAnonymousMode={isAnonymousMode}
        onItemClick={onItemClick}
        popularItems={popularItems}
        listingsData={listingsData}
      />

      {consistentItems.length > 0 && (
        <ConsistencySection
          isCollapsed={collapsedSections.consistency}
          onToggle={() => toggleSection('consistency')}
          consistentItemsCount={consistentItemsCount}
          setConsistentItemsCount={setConsistentItemsCount}
          consistentItems={consistentItems}
          isAnonymousMode={isAnonymousMode}
          onItemClick={onItemClick}
          popularItems={popularItems}
          listingsData={listingsData}
        />
      )}
    </div>
  );
});

export default AnalysisTab;