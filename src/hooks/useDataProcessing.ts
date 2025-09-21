import { useMemo } from 'react';
import { aggregatePopularItems, getMostConsistentItems } from '../utils';
import type { SaleItem, FilterState} from '../types';

interface UseDataProcessingProps {
  rawSalesData: SaleItem[];
  filters: FilterState;
  searchTerm: string;
  sortBy: 'quantity' | 'name' | 'revenue';
  sortDirection: 'asc' | 'desc';
  getDateRange: (type: FilterState['dateRange']['type']) => { start: Date; end: Date } | null;
}

export const useDataProcessing = ({
  rawSalesData,
  filters,
  searchTerm,
  sortBy,
  sortDirection,
  getDateRange
}: UseDataProcessingProps) => {
  // Filter raw sales data by date range first
  const dateFilteredSalesData = useMemo(() => {
    if (!rawSalesData.length) return [];

    const dateRange = getDateRange(filters.dateRange.type);
    if (!dateRange) return rawSalesData; // No date filtering for 'fullRange'

    return rawSalesData.filter(sale => {
      const saleDate = new Date(sale['Sale Date']);
      return saleDate >= dateRange.start && saleDate <= dateRange.end;
    });
  }, [rawSalesData, filters.dateRange, getDateRange]);

  // Aggregate the date-filtered sales data
  const dateFilteredPopularItems = useMemo(() => {
    if (!dateFilteredSalesData.length) return [];
    return aggregatePopularItems(dateFilteredSalesData);
  }, [dateFilteredSalesData]);

  // Filter aggregated data based on quantity/revenue filters (without search for consistency)
  const quantityRevenueFilteredPopularItems = useMemo(() => {
    if (!dateFilteredPopularItems.length) return [];

    return dateFilteredPopularItems.filter(item => {
      // Quantity filter
      const { min, max } = filters.quantityRange;
      if (min !== null && item.totalQuantity < min) {
        return false;
      }
      if (max !== null && item.totalQuantity > max) {
        return false;
      }

      // Revenue filter
      const { min: revenueMin, max: revenueMax } = filters.revenueRange;
      if (revenueMin !== null && item.totalRevenue < revenueMin) {
        return false;
      }
      if (revenueMax !== null && item.totalRevenue > revenueMax) {
        return false;
      }

      return true;
    });
  }, [dateFilteredPopularItems, filters.quantityRange, filters.revenueRange]);

  // Filter aggregated data based on quantity/revenue filters and search
  const filteredSalesData = useMemo(() => {
    if (!quantityRevenueFilteredPopularItems.length) return [];

    let filtered = quantityRevenueFilteredPopularItems.filter(item => {
      // Search filter
      if (searchTerm && item.itemName && !item.itemName.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      return true;
    });

    // Sort the filtered items
    const multiplier = sortDirection === 'asc' ? 1 : -1;
    if (sortBy === 'name') {
      filtered.sort((a, b) => multiplier * ((a.itemName || '').localeCompare(b.itemName || '')));
    } else if (sortBy === 'quantity') {
      filtered.sort((a, b) => multiplier * (a.totalQuantity - b.totalQuantity));
    } else if (sortBy === 'revenue') {
      filtered.sort((a, b) => multiplier * (a.totalRevenue - b.totalRevenue));
    }

    return filtered;
  }, [quantityRevenueFilteredPopularItems, searchTerm, sortBy, sortDirection]);

  // Filter sales data to only include items that pass quantity/revenue filters for consistency calculation
  const consistencySalesData = useMemo(() => {
    if (!dateFilteredSalesData.length || !quantityRevenueFilteredPopularItems.length) return [];
    const itemNames = new Set(quantityRevenueFilteredPopularItems.map(p => p.itemName));
    return dateFilteredSalesData.filter(sale => itemNames.has(sale['Item Name']));
  }, [dateFilteredSalesData, quantityRevenueFilteredPopularItems]);

  // Calculate consistency metrics using filtered sales data
  const consistentItems = useMemo(() => {
    if (!consistencySalesData.length || !quantityRevenueFilteredPopularItems.length) return [];
    return getMostConsistentItems(consistencySalesData, quantityRevenueFilteredPopularItems, 10);
  }, [consistencySalesData, quantityRevenueFilteredPopularItems]);

  return {
    dateFilteredSalesData,
    dateFilteredPopularItems,
    filteredSalesData,
    consistentItems
  };
};