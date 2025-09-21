import { useMemo } from 'react';
import { getTopVariationCombinations } from '../utils';
import type { PopularItem } from '../types';

interface UseChartDataProps {
  baseStatsData: PopularItem[];
  sortDirection: 'asc' | 'desc';
  chartMetric: 'revenue' | 'quantity';
  topItemsCount: number;
  topVariationCount: number;
}

export const useChartData = ({
  baseStatsData,
  sortDirection,
  chartMetric,
  topItemsCount,
  topVariationCount
}: UseChartDataProps) => {
  // Chart data - sorted by selected metric and direction
  const topItemsChartData = useMemo(() => {
    return baseStatsData
      .sort((a, b) => {
        const multiplier = sortDirection === 'asc' ? 1 : -1;
        if (chartMetric === 'quantity') {
          return multiplier * (a.totalQuantity - b.totalQuantity);
        } else {
          return multiplier * (a.totalRevenue - b.totalRevenue);
        }
      })
      .slice(0, topItemsCount)
      .map(item => ({
        name: item.itemName.length > 40 ? item.itemName.substring(0, 40) + '...' : item.itemName,
        fullName: item.itemName, // Store full name for tooltip
        revenue: Math.round(parseFloat(item.totalRevenue.toString()) * 100) / 100,
        quantity: item.totalQuantity
      }));
  }, [baseStatsData, sortDirection, chartMetric, topItemsCount]);

  // Top n item/variation combinations by quantity
  const topVariationCombinations = useMemo(() => {
    return getTopVariationCombinations(baseStatsData, topVariationCount);
  }, [baseStatsData, topVariationCount]);

  return {
    topItemsChartData,
    topVariationCombinations
  };
};