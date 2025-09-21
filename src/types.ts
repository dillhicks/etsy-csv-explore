export interface SaleItem {
  'Sale Date': string;
  'Item Name': string;
  Buyer: string;
  Quantity: number;
  Price: string;
  'Coupon Code': string;
  'Coupon Details': string;
  'Discount Amount': string;
  'Shipping Discount': string;
  'Order Shipping': string;
  'Order Sales Tax': string;
  'Item Total': string;
  Currency: string;
  'Transaction ID': string;
  'Listing ID': string;
  'Date Paid': string;
  'Date Shipped': string;
  'Ship Name': string;
  'Ship Address1': string;
  'Ship Address2': string;
  'Ship City': string;
  'Ship State': string;
  'Ship Zipcode': string;
  'Ship Country': string;
  'Order ID': string;
  Variations: string;
  'Order Type': string;
  'Listings Type': string;
  'Payment Type': string;
  'InPerson Discount': string;
  'InPerson Location': string;
  'VAT Paid by Buyer': string;
  SKU: string;
}

export interface PopularItem {
  itemName: string;
  totalQuantity: number;
  totalRevenue: number;
  listingId: string;
  variations: { [variation: string]: number };
  multiVariations?: { [variationKey: string]: number }; // For items with multiple variations
}

export interface VariationDetail {
  variation: string;
  quantity: number;
}

export interface MultiVariationItem {
  itemName: string;
  listingId: string;
  variations: string[]; // Array of individual variations like ["Color:Black", "Lanyard Loop?:Without Lanyard Loop"]
  quantity: number;
  revenue: number;
}

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface FilterState {
  dateRange: {
    type: 'lastWeek' | 'lastMonth' | 'last6Months' | 'fullRange' | 'custom';
    customRange: DateRange;
  };
  quantityRange: {
    min: number | null;
    max: number | null;
  };
  revenueRange: {
    min: number | null;
    max: number | null;
  };
}

export interface FilterSummary {
  dateFilter: string;
  quantityFilter: string;
  revenueFilter: string;
  totalItems: number;
}

// CSV Type Detection
export type CSVType = 'sold_orders' | 'listings' | 'unknown';

export interface ListingItem {
  TITLE: string;
  DESCRIPTION: string;
  PRICE: string;
  CURRENCY_CODE: string;
  QUANTITY: number;
  TAGS: string;
  MATERIALS: string;
  IMAGE1: string;
  IMAGE2: string;
  IMAGE3: string;
  IMAGE4: string;
  IMAGE5: string;
  IMAGE6: string;
  IMAGE7: string;
  IMAGE8: string;
  IMAGE9: string;
  IMAGE10: string;
  'VARIATION 1 TYPE': string;
  'VARIATION 1 NAME': string;
  'VARIATION 1 VALUES': string;
  'VARIATION 2 TYPE': string;
  'VARIATION 2 NAME': string;
  'VARIATION 2 VALUES': string;
  SKU: string;
}

export interface UploadedFile {
  id: string;
  file: File;
  type: CSVType;
  data: SaleItem[] | ListingItem[];
  processed: boolean;
}

export interface ListingsData {
  [listingId: string]: ListingItem;
}

export interface ConsistentItem {
  itemName: string;
  listingId: string;
  totalQuantity: number;
  totalRevenue: number;
  coefficientOfVariation: number;
  monthlyRevenues: number[];
  standardDeviation: number;
  meanRevenue: number;
  consistency: 'Very High' | 'High' | 'Medium' | 'Low';
}