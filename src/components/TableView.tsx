import React from 'react';
import type { PopularItem, ListingsData } from '../types';
import { splitVariationsForDisplay, anonymizeNumber, anonymizeCurrency } from '../utils';
import '../styles/TableView.css';

interface TableViewProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortBy: 'quantity' | 'name' | 'revenue';
  setSortBy: (sort: 'quantity' | 'name' | 'revenue') => void;
  sortDirection: 'asc' | 'desc';
  setSortDirection: (direction: 'asc' | 'desc') => void;
  paginatedItems: PopularItem[];
  totalPages: number;
  currentPage: number;
  handlePageChange: (page: number) => void;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSortChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleHeaderClick: (column: 'name' | 'quantity' | 'revenue') => void;
  handleItemClick: (item: PopularItem) => void;
  topItem: PopularItem | undefined;
  itemsPerPage: number;
  listingsData: ListingsData;
  isAnonymousMode?: boolean;
}

const TableView = React.memo(({
  searchTerm,
  // @ts-ignore
  setSearchTerm,
  sortBy,
  // @ts-ignore
  setSortBy,
  sortDirection,
  // @ts-ignore
  setSortDirection,
  paginatedItems,
  totalPages,
  currentPage,
  handlePageChange,
  handleSearchChange,
  handleSortChange,
  handleHeaderClick,
  handleItemClick,
  topItem,
  itemsPerPage,
  listingsData,
  isAnonymousMode = false
}: TableViewProps) => {
  return (
    <div id="table-panel" role="tabpanel" aria-labelledby="table-tab">
      <div className="table-view-container">
        <div className="controls animate-fade-in" style={{ animationDelay: '0.3s' }} role="toolbar" aria-label="Data filtering and sorting controls">
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={handleSearchChange}
            aria-label="Search items by name"
            aria-describedby="search-help"
          />
          <select value={sortBy} onChange={handleSortChange} aria-label="Sort items">
            <option value="revenue">Sort by Revenue</option>
            <option value="quantity">Sort by Quantity</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>

        <div className="animate-fade-in" style={{ background: 'var(--background)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-light)', animationDelay: '0.5s' }} role="region" aria-label="Popular items data table">
          <table className="items-table" role="table" aria-label="Etsy items analysis" aria-rowcount={paginatedItems.length + 1}>
            <thead>
              <tr>
                <th onClick={() => handleHeaderClick('name')} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21,15 16,10 5,21"/>
                    </svg>
                    Image
                  </div>
                </th>
                <th onClick={() => handleHeaderClick('name')} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14,2 14,8 20,8"/>
                    </svg>
                    Item Name
                    {sortBy === 'name' && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: sortDirection === 'asc' ? 'rotate(0deg)' : 'rotate(180deg)' }}>
                        <polyline points="18,15 12,9 6,15"/>
                      </svg>
                    )}
                  </div>
                </th>
                <th onClick={() => handleHeaderClick('quantity')} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="1" x2="12" y2="23"/>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                    </svg>
                    Total Sold
                    {sortBy === 'quantity' && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: sortDirection === 'asc' ? 'rotate(0deg)' : 'rotate(180deg)' }}>
                        <polyline points="18,15 12,9 6,15"/>
                      </svg>
                    )}
                  </div>
                </th>
                <th onClick={() => handleHeaderClick('revenue')} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--success-color)' }}>
                      <line x1="12" y1="1" x2="12" y2="23"/>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                    </svg>
                    Total Revenue
                    {sortBy === 'revenue' && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: sortDirection === 'asc' ? 'rotate(0deg)' : 'rotate(180deg)' }}>
                        <polyline points="18,15 12,9 6,15"/>
                      </svg>
                    )}
                  </div>
                </th>
                <th>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 3v18h18"/>
                      <path d="M18.7 8a3 3 0 0 0-5.4 0"/>
                      <path d="M16.4 4a5 5 0 0 0-8.8 0"/>
                    </svg>
                    Variation 1
                  </div>
                </th>
                <th>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 3v18h18"/>
                      <path d="M18.7 8a3 3 0 0 0-5.4 0"/>
                      <path d="M16.4 4a5 5 0 0 0-8.8 0"/>
                    </svg>
                    Variation 2
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((item, index) => (
                <tr
                  key={(currentPage - 1) * itemsPerPage + index}
                  onClick={() => {
                    console.log('TableView: Item clicked:', item.itemName, item);
                    handleItemClick(item);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <td>
                    {(() => {
                      const listing = listingsData[item.listingId] || listingsData[item.itemName];
                      return listing && listing.IMAGE1 ? (
                        <img
                          src={listing.IMAGE1}
                          alt={item.itemName}
                          style={{
                            width: '60px',
                            height: '60px',
                            objectFit: 'cover',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-light)',
                            cursor: 'pointer'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleItemClick(item);
                          }}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div style={{
                          width: '60px',
                          height: '60px',
                          background: 'var(--background-tertiary)',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-light)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--text-muted)',
                          fontSize: 'var(--font-size-xs)'
                        }}>
                          No Image
                        </div>
                      );
                    })()}
                  </td>
                  <td>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                      {item.itemName}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                      ID: {item.listingId}
                    </div>
                    <div style={{
                      position: 'absolute',
                      bottom: '0.5rem',
                      left: '1rem',
                      opacity: '0.7',
                      pointerEvents: 'none'
                    }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <polyline points="9,12 12,15 20,6"/>
                      </svg>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{
                        fontSize: 'var(--font-size-lg)',
                        fontWeight: '700',
                        color: 'var(--text-secondary)'
                      }}>
                        {isAnonymousMode ? anonymizeNumber(item.totalQuantity) : item.totalQuantity}
                      </div>
                      <div style={{
                        width: '60px',
                        height: '6px',
                        background: 'var(--background-tertiary)',
                        borderRadius: '3px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${topItem ? Math.min((item.totalQuantity / topItem.totalQuantity) * 100, 100) : 0}%`,
                          height: '100%',
                          background: 'var(--text-muted)',
                          borderRadius: '3px'
                        }}></div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{
                        fontSize: 'var(--font-size-lg)',
                        fontWeight: '700',
                        color: 'var(--text-secondary)'
                      }}>
                        {isAnonymousMode ? anonymizeCurrency(item.totalRevenue) : `$${item.totalRevenue.toFixed(2)}`}
                      </div>
                      <div style={{
                        width: '60px',
                        height: '6px',
                        background: 'var(--background-tertiary)',
                        borderRadius: '3px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${topItem ? Math.min((item.totalRevenue / topItem.totalRevenue) * 100, 100) : 0}%`,
                          height: '100%',
                          background: 'var(--text-muted)',
                          borderRadius: '3px'
                        }}></div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      {Object.entries(item.multiVariations || item.variations)
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 3)
                        .map(([variation, qty]) => {
                          const { variation1 } = splitVariationsForDisplay(variation);

                          return (
                            <div key={variation} style={{
                              position: 'relative',
                              height: '60px',
                              padding: '0.25rem',
                              background: 'var(--background-secondary)',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--border-light)'
                            }}>
                              {variation1 ? (() => {
                                const [name, value] = variation1.split(':');
                                return (
                                  <div style={{ marginBottom: '0.25rem' }}>
                                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', marginBottom: '0.125rem' }}>
                                      {name}:
                                    </div>
                                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-primary)', fontWeight: '500' }}>
                                      {value}
                                    </div>
                                  </div>
                                );
                              })() : (
                                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-primary)', fontWeight: '500' }}>
                                  -
                                </div>
                              )}
                              <span style={{
                                position: 'absolute',
                                bottom: '0.5rem',
                                right: '0.5rem',
                                background: 'var(--background-tertiary)',
                                color: 'var(--text-primary)',
                                padding: '0.25rem 0.5rem',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: 'var(--font-size-xs)',
                                fontWeight: '600'
                              }}>
                                {isAnonymousMode ? anonymizeNumber(qty) : qty}
                              </span>
                            </div>
                          );
                        })}
                      {(Object.keys(item.multiVariations || item.variations).length > 3) && (
                        <div style={{
                          textAlign: 'center',
                          color: 'var(--text-secondary)',
                          fontSize: 'var(--font-size-xs)',
                          fontStyle: 'italic'
                        }}>
                          +{(Object.keys(item.multiVariations || item.variations).length - 3)} more variation combinations
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      {Object.entries(item.multiVariations || item.variations)
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 3)
                        .map(([variation, qty]) => {
                          const { variation2 } = splitVariationsForDisplay(variation);

                          return (
                            <div key={`${variation}-v2`} style={{
                              position: 'relative',
                              height: '60px',
                              padding: '0.25rem',
                              background: 'var(--background-secondary)',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--border-light)'
                            }}>
                              {variation2 ? (() => {
                                const [name, value] = variation2.split(':');
                                return (
                                  <div style={{ marginBottom: '0.25rem' }}>
                                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', marginBottom: '0.125rem' }}>
                                      {name}:
                                    </div>
                                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-primary)', fontWeight: '500' }}>
                                      {value}
                                    </div>
                                  </div>
                                );
                              })() : (
                                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-primary)', fontWeight: '500' }}>
                                  -
                                </div>
                              )}
                              <span style={{
                                position: 'absolute',
                                bottom: '0.5rem',
                                right: '0.5rem',
                                background: 'var(--background-tertiary)',
                                color: 'var(--text-primary)',
                                padding: '0.25rem 0.5rem',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: 'var(--font-size-xs)',
                                fontWeight: '600'
                              }}>
                                {isAnonymousMode ? anonymizeNumber(qty) : qty}
                              </span>
                            </div>
                          );
                        })}
                      {(Object.keys(item.multiVariations || item.variations).length > 3) && (
                        <div style={{
                          textAlign: 'center',
                          color: 'var(--text-secondary)',
                          fontSize: 'var(--font-size-xs)',
                          fontStyle: 'italic'
                        }}>
                          +{(Object.keys(item.multiVariations || item.variations).length - 3)} more variation combinations
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <nav className="pagination" role="navigation" aria-label="Pagination navigation">
            <button
              className="btn btn-secondary"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              aria-label="Go to previous page"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15,18 9,12 15,6"/>
              </svg>
              Previous
            </button>

            <div style={{ display: 'flex', gap: '0.25rem', margin: '0 1rem' }}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                const isCurrentPage = page === currentPage;
                const isNearCurrent = Math.abs(page - currentPage) <= 1;
                const isFirst = page === 1;
                const isLast = page === totalPages;

                if (!isNearCurrent && !isFirst && !isLast) {
                  if (page === currentPage - 2 || page === currentPage + 2) {
                    return <span key={page} style={{ padding: '0.5rem', color: 'var(--text-muted)' }} aria-hidden="true">...</span>;
                  }
                  return null;
                }

                return (
                  <button
                    key={page}
                    className={`btn ${isCurrentPage ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => handlePageChange(page)}
                    style={{
                      minWidth: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    aria-label={`Go to page ${page}`}
                    aria-current={isCurrentPage ? 'page' : undefined}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              className="btn btn-secondary"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              aria-label="Go to next page"
            >
              Next
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9,18 15,12 9,6"/>
              </svg>
            </button>
          </nav>
        )}
      </div>
    </div>
  );
});

export default TableView;