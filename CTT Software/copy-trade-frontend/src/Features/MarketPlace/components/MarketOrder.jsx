import React, { useState, useEffect, useRef } from 'react';
import TradeForm from './TradeForm';

const markets = [
  {
    marketName: 'Germany 40',
    marketId: '17068',
    quoteId: '6374'
  },
  {
    marketName: 'UK 100',
    marketId: '16645',
    quoteId: '5945'
  },
  {
    marketName: 'Wall Street 30',
    marketId: '17322',
    quoteId: '6647'
  },
  {
    marketName: 'US Tech 100',
    marketId: '20190',
    quoteId: '16917'
  },
  {
    marketName: 'US 500 (Per 1.0)',
    marketId: '67995',
    quoteId: '872703'
  },
  {
    marketName: 'US 2000',
    marketId: '68744',
    quoteId: '875464'
  },
];
export default function MarketOrder() {
  const [selectedMarkets, setSelectedMarkets] = useState(() => {
    const savedMarkets = localStorage.getItem('selectedMarkets');
    return savedMarkets ? JSON.parse(savedMarkets) : markets;
  });

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedMarkets', JSON.stringify(selectedMarkets));
  }, [selectedMarkets]);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleMarketSelection = (market) => {
    const index = selectedMarkets.findIndex((m) => m.marketId === market.marketId);
    if (index === -1) {
      setSelectedMarkets([...selectedMarkets, market]);
    } else {
      const updatedMarkets = [...selectedMarkets];
      updatedMarkets.splice(index, 1);
      setSelectedMarkets(updatedMarkets);
    }
  };

  return (
    <section className="w-full">
      <section className="w-full">
        <div className="grid grid-cols-2 gap-y-3">
          {selectedMarkets.map((market) => (
            <TradeForm
              key={market.marketId}
              marketData={market}
              className={`${showDropdown ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
            />
          ))}
        </div>
      </section>
      <div className="relative mt-5" ref={dropdownRef}>
        <input
          type="text"
          placeholder="Select Markets"
          onClick={toggleDropdown}
          readOnly
          className="w-full border rounded py-2 px-3 focus:outline-none focus:border-blue-500"
        />
        <div className={`${showDropdown ? 'block' : 'hidden'} absolute z-10 bg-white border rounded mt-1 w-full transition-opacity duration-300`}>
          {markets.map((market) => (
            <label key={market.marketId} className="block cursor-pointer">
              <input
                type="checkbox"
                checked={selectedMarkets.some((m) => m.marketId === market.marketId)}
                onChange={() => handleMarketSelection(market)}
                className="mr-2 leading-tight"
              />
              {market.marketName}
            </label>
          ))}
        </div>
      </div>
    </section>
  );
}