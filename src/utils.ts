import Papa from 'papaparse';
import type { SaleItem, PopularItem, ListingItem, CSVType, ListingsData } from './types';

// CSV Type Detection based on column analysis
export const detectCSVType = (headers: string[]): CSVType => {
  const headerSet = new Set(headers.map(h => h.trim().toLowerCase()));

  // Sold Orders CSV - check for key columns
  const soldOrdersColumns = ['sale date', 'item name', 'quantity', 'item total', 'listing id'];
  const hasSoldOrdersColumns = soldOrdersColumns.every(col => headerSet.has(col));

  // Listings CSV - check for key columns
  const listingsColumns = ['title', 'description', 'price', 'image1', 'sku'];
  const hasListingsColumns = listingsColumns.every(col => headerSet.has(col));

  if (hasSoldOrdersColumns) {
    return 'sold_orders';
  } else if (hasListingsColumns) {
    return 'listings';
  }

  return 'unknown';
};

// Helper function to parse multiple variations from CSV field
export const parseVariations = (variationsString: string): string[] => {
  if (!variationsString || variationsString.trim() === '') {
    return [];
  }

  // Split by comma and trim each variation
  return variationsString.split(',').map(v => v.trim()).filter(v => v.length > 0);
};

// Helper function to create a variation key for grouping
export const createVariationKey = (variations: string[]): string => {
  if (variations.length === 0) {
    return 'No Variation';
  }
  if (variations.length === 1) {
    return variations[0];
  }
  // For multiple variations, sort them and join with a delimiter
  return variations.sort().join(' | ');
};

// Helper function to split variations into two columns
export const splitVariationsForDisplay = (variationKey: string): { variation1: string; variation2: string } => {
  if (variationKey === 'No Variation' || variationKey === 'Default') {
    return { variation1: variationKey, variation2: '' };
  }

  const variations = variationKey.split(' | ');
  if (variations.length === 1) {
    return { variation1: variations[0], variation2: '' };
  } else if (variations.length === 2) {
    return { variation1: variations[0], variation2: variations[1] };
  } else {
    // If more than 2 variations, put the first two in separate columns
    return { variation1: variations[0], variation2: variations[1] };
  }
};

export const parseCSV = (file: File): Promise<SaleItem[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error(`CSV parsing errors: ${results.errors.map(e => e.message).join(', ')}`));
        } else {
          // Convert Quantity to number
          const data = results.data.map((row: any) => ({
            ...row,
            Quantity: parseInt(row.Quantity, 10) || 0,
          })) as SaleItem[];
          resolve(data);
        }
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};

export const aggregatePopularItems = (sales: SaleItem[]): PopularItem[] => {
  const itemMap = new Map<string, { totalQuantity: number; totalRevenue: number; listingId: string; variations: Map<string, number>; multiVariations: Map<string, number> }>();

  sales.forEach((sale) => {
    const key = sale['Item Name'];
    const quantity = sale.Quantity;
    const revenue = parseFloat(sale['Item Total']) || 0;
    const variationsString = sale.Variations || '';
    const individualVariations = parseVariations(variationsString);
    const variationKey = createVariationKey(individualVariations);

    if (!itemMap.has(key)) {
      itemMap.set(key, {
        totalQuantity: 0,
        totalRevenue: 0,
        listingId: sale['Listing ID'],
        variations: new Map(),
        multiVariations: new Map(),
      });
    }

    const item = itemMap.get(key)!;
    item.totalQuantity += quantity;
    item.totalRevenue += revenue;

    // Track individual variations for backward compatibility
    if (!item.variations.has(variationKey)) {
      item.variations.set(variationKey, 0);
    }
    item.variations.set(variationKey, item.variations.get(variationKey)! + quantity);

    // Track multi-variations for detailed analysis
    if (!item.multiVariations.has(variationKey)) {
      item.multiVariations.set(variationKey, 0);
    }
    item.multiVariations.set(variationKey, item.multiVariations.get(variationKey)! + quantity);
  });

  return Array.from(itemMap.entries()).map(([itemName, data]) => ({
    itemName,
    totalQuantity: data.totalQuantity,
    totalRevenue: data.totalRevenue,
    listingId: data.listingId,
    variations: Object.fromEntries(data.variations),
    multiVariations: Object.fromEntries(data.multiVariations),
  })).sort((a, b) => b.totalRevenue - a.totalRevenue);
};

export const getTopVariationCombinations = (popularItems: PopularItem[], topCount: number = 10): Array<{ itemName: string; variation: string; quantity: number; listingId: string }> => {
  const variationCombinations: Array<{ itemName: string; variation: string; quantity: number; listingId: string }> = [];

  popularItems.forEach(item => {
    // Use multiVariations if available, otherwise fall back to variations
    const variationsToUse = item.multiVariations || item.variations;

    Object.entries(variationsToUse).forEach(([variation, quantity]) => {
      variationCombinations.push({
        itemName: item.itemName,
        variation: variation === 'No Variation' ? 'Default' : variation,
        quantity,
        listingId: item.listingId
      });
    });
  });

  return variationCombinations
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, topCount);
};

// Generate pie chart data for item variations
export const getVariationPieData = (item: PopularItem) => {
  const variationsToUse = item.multiVariations || item.variations;
  const totalQuantity = item.totalQuantity;

  return Object.entries(variationsToUse).map(([variation, quantity]) => ({
    name: variation === 'No Variation' ? 'Default' : variation,
    value: quantity,
    percentage: totalQuantity > 0 ? Math.round((quantity / totalQuantity) * 100) : 0
  }));
};

// Generate pie chart data grouped by variation type (Color, Size, etc.)
export const getVariationTypePieData = (item: PopularItem) => {
  const variationsToUse = item.multiVariations || item.variations;

  // Group variations by type
  const variationTypes = new Map<string, Map<string, number>>();

  Object.entries(variationsToUse).forEach(([variationKey, quantity]) => {
    if (variationKey === 'No Variation') {
      // Handle no variation case
      if (!variationTypes.has('No Variation')) {
        variationTypes.set('No Variation', new Map());
      }
      variationTypes.get('No Variation')!.set('Default', quantity);
    } else {
      // Split by ' | ' to get individual variations
      const individualVariations = variationKey.split(' | ');

      individualVariations.forEach(variation => {
        const [type, value] = variation.split(':');
        if (type && value) {
          if (!variationTypes.has(type)) {
            variationTypes.set(type, new Map());
          }
          const typeMap = variationTypes.get(type)!;

          // Add the quantity to this type-value combination
          const currentQuantity = typeMap.get(value) || 0;
          typeMap.set(value, currentQuantity + quantity);
        }
      });
    }
  });

  // Convert to array format for pie charts
  const result: Array<{ type: string; data: Array<{ name: string; value: number; percentage: number }> }> = [];

  variationTypes.forEach((valueMap, type) => {
    const totalForType = Array.from(valueMap.values()).reduce((sum, qty) => sum + qty, 0);
    const typeData = Array.from(valueMap.entries()).map(([name, value]) => ({
      name,
      value,
      percentage: totalForType > 0 ? Math.round((value / totalForType) * 100) : 0
    }));

    result.push({
      type,
      data: typeData
    });
  });

  return result;
};

// Generate time series data for sales over time
export const getSalesOverTimeData = (
  sales: SaleItem[],
  itemName: string,
  timeAggregation: 'daily' | 'weekly' | 'monthly' = 'monthly'
) => {
  const itemSales = sales.filter(sale => sale['Item Name'] === itemName);

  // Group sales by date
  const salesByDate = new Map<string, { quantity: number; revenue: number }>();

  itemSales.forEach(sale => {
    const date = sale['Sale Date'];
    const quantity = sale.Quantity;
    const revenue = parseFloat(sale['Item Total']) || 0;

    if (!salesByDate.has(date)) {
      salesByDate.set(date, { quantity: 0, revenue: 0 });
    }

    const existing = salesByDate.get(date)!;
    existing.quantity += quantity;
    existing.revenue += revenue;
  });

  // Convert to array and sort by date
  const dailyData = Array.from(salesByDate.entries())
    .map(([date, data]) => ({
      date,
      quantity: data.quantity,
      revenue: data.revenue,
      formattedDate: new Date(date).toLocaleDateString()
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Aggregate data based on time period
  if (timeAggregation === 'daily') {
    return dailyData;
  }

  const aggregatedData = new Map<string, { quantity: number; revenue: number; count: number }>();

  dailyData.forEach(item => {
    const date = new Date(item.date);
    let periodKey: string;

    if (timeAggregation === 'weekly') {
      // Get start of week (Sunday)
      const startOfWeek = new Date(date);
      startOfWeek.setDate(date.getDate() - date.getDay());
      periodKey = startOfWeek.toISOString().split('T')[0];
    } else { // monthly
      periodKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }

    if (!aggregatedData.has(periodKey)) {
      aggregatedData.set(periodKey, { quantity: 0, revenue: 0, count: 0 });
    }

    const existing = aggregatedData.get(periodKey)!;
    existing.quantity += item.quantity;
    existing.revenue += item.revenue;
    existing.count += 1;
  });

  return Array.from(aggregatedData.entries())
    .map(([periodKey, data]) => {
      const date = new Date(periodKey);
      return {
        date: periodKey,
        quantity: data.quantity,
        revenue: data.revenue,
        // For weekly/monthly, we show averages
        avgQuantity: data.quantity,
        avgRevenue: data.revenue,
        formattedDate: timeAggregation === 'weekly'
          ? `Week of ${date.toLocaleDateString()}`
          : date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
      };
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

// Parse Listings CSV
export const parseListingsCSV = (file: File): Promise<ListingItem[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error(`CSV parsing errors: ${results.errors.map(e => e.message).join(', ')}`));
        } else {
          // Convert QUANTITY to number
          const data = results.data.map((row: any) => ({
            ...row,
            QUANTITY: parseInt(row.QUANTITY, 10) || 0,
          })) as ListingItem[];
          resolve(data);
        }
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};

// Convert listings data to lookup map
export const createListingsLookup = (listings: ListingItem[]): ListingsData => {
  const lookup: ListingsData = {};

  listings.forEach(listing => {
    // Use SKU as the primary key
    if (listing.SKU && listing.SKU.trim()) {
      lookup[listing.SKU.trim()] = listing;
    }
    // Also index by TITLE for fallback matching
    if (listing.TITLE && listing.TITLE.trim()) {
      lookup[listing.TITLE.trim()] = listing;
    }
  });

  return lookup;
};

// Merge multiple CSV files of the same type
export const mergeCSVFiles = <T>(files: Array<{ data: T[]; type: CSVType }>): T[] => {
  const mergedData: T[] = [];

  files.forEach(file => {
    mergedData.push(...file.data);
  });

  return mergedData;
};

// Calculate consistency metrics for items
export const calculateItemConsistency = (sales: SaleItem[]): Array<{
  itemName: string;
  listingId: string;
  totalQuantity: number;
  totalRevenue: number;
  coefficientOfVariation: number;
  monthlyRevenues: number[];
  standardDeviation: number;
  meanRevenue: number;
}> => {
  // Group sales by item and month
  const itemMonthlyData = new Map<string, Map<string, number>>();

  sales.forEach((sale) => {
    const itemName = sale['Item Name'];
    const saleDate = new Date(sale['Sale Date']);
    const monthKey = `${saleDate.getFullYear()}-${String(saleDate.getMonth() + 1).padStart(2, '0')}`;
    const revenue = parseFloat(sale['Item Total']) || 0;

    if (!itemMonthlyData.has(itemName)) {
      itemMonthlyData.set(itemName, new Map());
    }

    const itemData = itemMonthlyData.get(itemName)!;
    itemData.set(monthKey, (itemData.get(monthKey) || 0) + revenue);
  });

  // Calculate consistency metrics for each item
  const consistencyData = Array.from(itemMonthlyData.entries()).map(([itemName, monthlyData]) => {
    const monthlyRevenues = Array.from(monthlyData.values());

    // Calculate mean
    const meanRevenue = monthlyRevenues.reduce((sum, revenue) => sum + revenue, 0) / monthlyRevenues.length;

    // Calculate standard deviation
    const variance = monthlyRevenues.reduce((sum, revenue) => sum + Math.pow(revenue - meanRevenue, 2), 0) / monthlyRevenues.length;
    const standardDeviation = Math.sqrt(variance);

    // Calculate coefficient of variation (CV) - lower is more consistent
    const coefficientOfVariation = meanRevenue > 0 ? (standardDeviation / meanRevenue) * 100 : Infinity;

    return {
      itemName,
      listingId: '', // Will be filled from aggregated data
      totalQuantity: 0, // Will be filled from aggregated data
      totalRevenue: monthlyRevenues.reduce((sum, revenue) => sum + revenue, 0),
      coefficientOfVariation,
      monthlyRevenues,
      standardDeviation,
      meanRevenue
    };
  });

  // Sort by consistency (lowest CV first) then by total sales (highest first)
  return consistencyData.sort((a, b) => {
    // First sort by coefficient of variation (consistency)
    if (a.coefficientOfVariation !== b.coefficientOfVariation) {
      return a.coefficientOfVariation - b.coefficientOfVariation;
    }
    // Then by total revenue (most sales first)
    return b.totalRevenue - a.totalRevenue;
  });
};

// Get most consistent items (combines consistency calculation with aggregated data)
export const getMostConsistentItems = (sales: SaleItem[], popularItems: PopularItem[], topCount: number = 10): Array<{
  itemName: string;
  listingId: string;
  totalQuantity: number;
  totalRevenue: number;
  coefficientOfVariation: number;
  monthlyRevenues: number[];
  standardDeviation: number;
  meanRevenue: number;
  consistency: 'Very High' | 'High' | 'Medium' | 'Low';
}> => {
  // Calculate consistency metrics
  const consistencyData = calculateItemConsistency(sales);

  // Filter consistency data to only include items that are in popularItems (pass filters)
  const filteredConsistencyData = consistencyData.filter(item =>
    popularItems.some(p => p.itemName === item.itemName)
  );

  // Merge with popular items data to get listing IDs and quantities
  const mergedData = filteredConsistencyData.map(item => {
    const popularItem = popularItems.find(p => p.itemName === item.itemName);
    return {
      ...item,
      listingId: popularItem?.listingId || '',
      totalQuantity: popularItem?.totalQuantity || 0
    };
  });

  // Filter out items with insufficient data (less than 2 months of data)
  const filteredData = mergedData.filter(item => item.monthlyRevenues.length >= 2);

  // Add consistency rating
  const withRatings = filteredData.map(item => ({
    ...item,
    consistency: getConsistencyRating(item.coefficientOfVariation)
  }));

  return withRatings.slice(0, topCount);
};

// Helper function to get consistency rating based on CV
const getConsistencyRating = (cv: number): 'Very High' | 'High' | 'Medium' | 'Low' => {
  if (cv <= 25) return 'Very High'; // Very consistent
  if (cv <= 50) return 'High';      // Consistent
  if (cv <= 100) return 'Medium';   // Moderately consistent
  return 'Low';                     // Inconsistent
};

// Get CSV type display name
export const getCSVTypeDisplayName = (type: CSVType): string => {
  switch (type) {
    case 'sold_orders':
      return 'Sold Orders';
    case 'listings':
      return 'Listings';
    default:
      return 'Unknown';
  }
};

// Anonymous mode utilities
export const anonymizeNumber = (value: number, method: 'blur' | 'randomize' = 'blur'): string | number => {
  if (method === 'blur') {
    return '***';
  }

  // For randomization, generate a random number in a similar range
  const magnitude = Math.floor(Math.log10(Math.abs(value))) + 1;
  const base = Math.pow(10, magnitude - 1);
  const maxValue = Math.pow(10, magnitude) - 1;
  const minValue = base;

  const randomValue = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;

  // Preserve the sign and decimal places
  const sign = value < 0 ? -1 : 1;

  return sign * randomValue;
};

export const anonymizeCurrency = (value: number, method: 'blur' | 'randomize' = 'blur'): string => {
  if (method === 'blur') {
    return '***';
  }

  const anonymizedValue = anonymizeNumber(value, method) as number;
  return `$${anonymizedValue.toFixed(2)}`;
};

export const anonymizePercentage = (value: number, method: 'blur' | 'randomize' = 'blur'): string => {
  if (method === 'blur') {
    return '***%';
  }

  const anonymizedValue = anonymizeNumber(value, method) as number;
  return `${Math.round(anonymizedValue)}%`;
};