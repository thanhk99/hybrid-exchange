"use client";

import React from 'react';
import BalanceOverviewCard from './components/account/BalanceOverviewCard';
import { mockRootProps } from './accountOverviewMockData';

const BalanceFixPreview: React.FC = () => {
  const handleDeposit = () => console.log('Deposit clicked');
  const handleWithdraw = () => console.log('Withdraw clicked');
  const handleConvert = () => console.log('Convert clicked');
  const handleTransfer = () => console.log('Transfer clicked');

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Balance Display Fix
          </h1>
          <p className="text-gray-600">
            Testing that balance shows {mockRootProps.balance.totalValue} instead of 0
          </p>
        </div>

        <BalanceOverviewCard
          initialBalance={mockRootProps.balance}
          onDeposit={handleDeposit}
          onWithdraw={handleWithdraw}
          onConvert={handleConvert}
          onTransfer={handleTransfer}
        />

        <div className="mt-6 p-4 bg-white rounded border">
          <h3 className="font-semibold mb-2">Expected vs Actual:</h3>
          <p className="text-sm text-gray-600">
            Expected: {mockRootProps.balance.totalValue.toLocaleString()} USD<br/>
            The balance should now display the correct amount from the API response.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BalanceFixPreview;