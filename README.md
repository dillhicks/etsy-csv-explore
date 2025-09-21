# Etsy CSV Explorer

A web application for analyzing and visualizing Etsy sales data from CSV exports. Built with React, TypeScript, and Vite, this tool helps to analyze sales patterns and product performance.

## Features

Long story short, this does a few things that 

### Data Analysis
- Upload and parse Etsy CSV files
- View detailed sales data in organized tables
- Analyze sales trends over time
- Track product performance metrics

### Visualizations
- Interactive charts and graphs
- Statistics cards showing key metrics
- Custom tooltips for detailed data points
- Responsive design for various screen sizes

### Filtering and Organization
- Filter data by date ranges, products, or other criteria
- Sort and organize data for better insights
- Search functionality for specific items
- Collapsible sections for better navigation

## Screenshots

### Main Dashboard
![Main Dashboard](public/images/main.png)
*Main application interface showing the dashboard with key metrics and navigation*

### Data Table View
![Data Table View](public/images/table_view.png)
*Table view displaying sales data with sorting and filtering options*

### Analysis Charts
![Analysis Charts](public/images/analysis_charts.png)
*Analysis tab with interactive charts and data visualizations*

### Item Details Modal
![Item Details Modal](public/images/item_modal.png)
*Detailed modal window showing comprehensive item information*

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd etsy-csv-explorer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the URL given.

## Usage

1. Export your sales data from Etsy as a CSV file
2. Upload the CSV file to the application
3. Explore your data using the various views and filters
4. Use the analysis tools to gain insights into your sales performance

## Technology Stack

- **Frontend**: React 19, TypeScript
- **Build Tool**: Vite
- **CSV Processing**: PapaParse
- **Charts**: Recharts

## Project Structure

```
src/
├── components/          # Reusable UI components
├── hooks/              # Custom React hooks
├── styles/             # CSS files and styling
├── types.ts           # TypeScript type definitions
├── utils.ts           # Utility functions
└── App.tsx            # Main application component
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build