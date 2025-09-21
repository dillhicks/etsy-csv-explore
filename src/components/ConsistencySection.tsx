import React from 'react';
import CollapsibleSectionHeader from './CollapsibleSectionHeader';
import type { ConsistentItem, PopularItem, ListingsData } from '../types';
import { anonymizeNumber } from '../utils';

interface ConsistencySectionProps {
  isCollapsed: boolean;
  onToggle: () => void;
  consistentItemsCount: number;
  setConsistentItemsCount: (count: number) => void;
  consistentItems: ConsistentItem[];
  isAnonymousMode?: boolean;
  onItemClick: (item: PopularItem) => void;
  popularItems: PopularItem[];
  listingsData: ListingsData;
}

const ConsistencySection: React.FC<ConsistencySectionProps> = ({
  isCollapsed,
  onToggle,
  consistentItemsCount,
  setConsistentItemsCount,
  consistentItems,
  isAnonymousMode = false,
  onItemClick,
  popularItems,
  listingsData
}) => {
  const consistencyIcon = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  );

  return (
    <div className="animate-fade-in" style={{
      background: 'linear-gradient(145deg, var(--background), var(--background-secondary))',
      padding: '1.5rem',
      borderRadius: 'var(--radius-lg)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
      border: '1px solid var(--border-light)',
      animationDelay: '0.7s',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: 'var(--border-color)'
      }} />

      <CollapsibleSectionHeader
        icon={consistencyIcon}
        title="Most Consistent Items"
        description="Items with steady revenue and high sales volume"
        isCollapsed={isCollapsed}
        onToggle={onToggle}
      />

      {!isCollapsed && (
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            background: 'var(--background-tertiary)',
            padding: '0.25rem 0.5rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-light)',
            marginBottom: '1rem',
            alignSelf: 'flex-start'
          }}>
            <label style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-xs)', fontWeight: '500' }}>Show:</label>
            <select
              value={consistentItemsCount}
              onChange={(e) => setConsistentItemsCount(parseInt(e.target.value, 10))}
              style={{
                padding: '0.25rem 0.5rem',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--background)',
                color: 'var(--text-primary)',
                fontSize: 'var(--font-size-xs)',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem',
            transition: 'all 0.3s ease'
          }}>
            {consistentItems.map((item, index) => (
              <div key={`${item.itemName}-${index}`} style={{
                background: 'linear-gradient(145deg, var(--background-secondary), var(--background-tertiary))',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                position: 'relative',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                cursor: 'pointer',
                boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.06)'
              }}
              onClick={() => {
                // Find the full item data from popularItems
                const fullItem = popularItems.find(popularItem =>
                  popularItem.itemName === item.itemName ||
                  popularItem.listingId === item.listingId
                );
                if (fullItem) {
                  onItemClick(fullItem);
                }
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
                e.currentTarget.style.borderColor = 'var(--border-light)';
              }}>
                <div style={{
                  position: 'absolute',
                  top: '0.75rem',
                  right: '0.75rem',
                  background: index < 3 ? 'var(--background-tertiary)' : 'var(--background-secondary)',
                  color: 'var(--text-primary)',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: '700',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  border: '1px solid var(--border-light)',
                  zIndex: 10
                }}>
                  {index + 1}
                </div>

                <div style={{ marginBottom: '0.75rem', flex: 1, paddingRight: '2rem' }}>
                  {/* Item Image */}
                  {(() => {
                    const listingData = listingsData[item.listingId] || listingsData[item.itemName];
                    const imageUrl = listingData?.IMAGE1;
                    console.log('ConsistencySection - Item:', item.itemName, 'Listing ID:', item.listingId, 'Image URL:', imageUrl, 'Listings Data:', listingData);
                    return imageUrl ? (
                      <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: 'var(--radius-sm)',
                        overflow: 'hidden',
                        marginBottom: '0.75rem',
                        border: '1px solid var(--border-light)',
                        background: 'var(--background-tertiary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <img
                          src={imageUrl}
                          alt={item.itemName}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    ) : null;
                  })()}

                  <h4 style={{
                    margin: 0,
                    color: 'var(--text-primary)',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: '600',
                    lineHeight: '1.3',
                    marginBottom: '0.5rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {item.itemName}
                  </h4>
                  <div style={{
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--text-secondary)',
                    background: 'var(--background-tertiary)',
                    padding: '0.2rem 0.4rem',
                    borderRadius: 'var(--radius-sm)',
                    display: 'inline-block',
                    fontFamily: 'var(--font-family)',
                    fontWeight: '500'
                  }}>
                    ID: {item.listingId}
                  </div>
                </div>

                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.5rem'
                  }}>
                    <div style={{
                      background: 'var(--background-tertiary)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-light)',
                      padding: '0.4rem 0.6rem',
                      textAlign: 'center'
                    }}>
                      <div style={{
                        fontSize: 'var(--font-size-xs)',
                        color: 'var(--text-secondary)',
                        marginBottom: '0.25rem',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        Consistency
                      </div>
                      <div style={{
                        fontSize: 'var(--font-size-xs)',
                        color: 'var(--text-primary)',
                        fontWeight: '600'
                      }}>
                        {item.consistency}
                      </div>
                    </div>
                    <div style={{
                      background: 'var(--background-tertiary)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-light)',
                      padding: '0.4rem 0.6rem',
                      textAlign: 'center'
                    }}>
                      <div style={{
                        fontSize: 'var(--font-size-xs)',
                        color: 'var(--text-secondary)',
                        marginBottom: '0.25rem',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        CV
                      </div>
                      <div style={{
                        fontSize: 'var(--font-size-xs)',
                        color: 'var(--text-primary)',
                        fontWeight: '600'
                      }}>
                        {isAnonymousMode ? '***%' : `${item.coefficientOfVariation.toFixed(1)}%`}
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 'auto'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.75rem 1rem',
                    background: 'linear-gradient(135deg, var(--background) 0%, var(--background-secondary) 100%)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    border: '1px solid var(--border-light)',
                    flex: 1,
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2.5" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))' }}>
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14,2 14,8 20,8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                      <polyline points="10,9 9,9 8,9"/>
                    </svg>
                    <span style={{
                      fontSize: 'var(--font-size-lg)',
                      fontWeight: '700',
                      color: '#c2410c'
                    }}>
                      {isAnonymousMode ? anonymizeNumber(item.totalQuantity) : item.totalQuantity}
                    </span>
                    <span style={{
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--text-secondary)',
                      fontWeight: '500'
                    }}>
                      sold
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginLeft: '0.5rem',
                    minWidth: '60px'
                  }}>
                    <div style={{
                      fontSize: 'var(--font-size-xs)',
                      color: 'var(--text-secondary)',
                      marginBottom: '0.25rem',
                      fontWeight: '500',
                      textAlign: 'center'
                    }}>
                      Revenue
                    </div>
                    <div style={{
                      width: '60px',
                      height: '3px',
                      background: 'var(--background-tertiary)',
                      borderRadius: '2px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${Math.min((item.totalRevenue / Math.max(...consistentItems.map(c => c.totalRevenue))) * 100, 100)}%`,
                        height: '100%',
                        background: 'var(--border-color)',
                        borderRadius: '2px',
                        transition: 'width 0.8s ease-out'
                      }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsistencySection;