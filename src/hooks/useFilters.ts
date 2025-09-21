import { useState, useMemo } from 'react';
import type { FilterState, FilterSummary } from '../types';

export const useFilters = () => {
  const [filters, setFilters] = useState<FilterState>({
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
  const [isFiltersCollapsed, setIsFiltersCollapsed] = useState(true);

  // Helper function to get date range
  const getDateRange = (type: FilterState['dateRange']['type']): { start: Date; end: Date } | null => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (type) {
      case 'lastWeek':
        return {
          start: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
          end: today
        };
      case 'lastMonth':
        return {
          start: new Date(today.getFullYear(), today.getMonth() - 1, today.getDate()),
          end: today
        };
      case 'last6Months':
        return {
          start: new Date(today.getFullYear(), today.getMonth() - 6, today.getDate()),
          end: today
        };
      case 'fullRange':
        return null; // No date filtering
      case 'custom':
        const { start, end } = filters.dateRange.customRange;
        if (start && end) {
          return { start, end };
        } else if (start) {
          return { start, end: today };
        } else if (end) {
          return { start: new Date(2020, 0, 1), end }; // Default start date
        }
        return null;
      default:
        return null;
    }
  };

  // Filter summary
  const filterSummary: FilterSummary = useMemo(() => {
    const getDateFilterLabel = () => {
      switch (filters.dateRange.type) {
        case 'lastWeek':
          return 'Last 7 days';
        case 'lastMonth':
          return 'Last 30 days';
        case 'last6Months':
          return 'Last 6 months';
        case 'fullRange':
          return 'All time';
        case 'custom':
          const { start, end } = filters.dateRange.customRange;
          if (start && end) {
            return 'Custom range';
          } else if (start) {
            return 'From custom date';
          } else if (end) {
            return 'Until custom date';
          }
          return 'Custom range';
        default:
          return 'All time';
      }
    };

    const getQuantityFilterLabel = () => {
      const { min, max } = filters.quantityRange;
      if (min !== null && max !== null) {
        return `${min}-${max} sold`;
      } else if (min !== null) {
        return `Min ${min} sold`;
      } else if (max !== null) {
        return `Max ${max} sold`;
      }
      return 'Any quantity';
    };

    const getRevenueFilterLabel = () => {
      const { min, max } = filters.revenueRange;
      if (min !== null && max !== null) {
        return `$${min}-$${max}`;
      } else if (min !== null) {
        return `Min $${min}`;
      } else if (max !== null) {
        return `Max $${max}`;
      }
      return 'Any revenue';
    };

    return {
      dateFilter: getDateFilterLabel(),
      quantityFilter: getQuantityFilterLabel(),
      revenueFilter: getRevenueFilterLabel(),
      totalItems: 0 // Will be set in App.tsx
    };
  }, [filters]);

  return {
    filters,
    setFilters,
    isFiltersCollapsed,
    setIsFiltersCollapsed,
    getDateRange,
    filterSummary
  };
};