'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { AppDispatch, RootState } from '../store/store';
import { fetchP2POrders, setFilters, setSelectedOrder, initiateTrade } from '../store/p2pSlice';
import { P2POrder } from '../types/p2p';
import TopMenuList from '../components/shared/top-menu-list/TopMenuList';
import P2PLayout from '../components/p2p/P2PLayout/P2PLayout';
import P2PHeader from '../components/p2p/P2PHeader/P2PHeader';
import P2PGuide from '../components/p2p/P2PGuide/P2PGuide';
import TradingForm from '../components/p2p/TradingForm/TradingForm';
import P2PMarket from '../components/p2p/P2PMarket/P2PMarket';
import P2PFilters from '../components/p2p/P2PFilters/P2PFilters';
import TradeModal from '../components/p2p/TradeModal/TradeModal';
import { mockQuery } from '../p2pMockData';
import styles from './page.module.css';

export default function P2PPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { orders, filters, loading, selectedOrder } = useSelector((state: RootState) => state.p2p);
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [showOrderList, setShowOrderList] = useState(false);

  // Use mock data for demo
  const [mockOrders, setMockOrders] = useState<P2POrder[]>(mockQuery.p2pOrders);

  const menuItems = [
    { title: 'Giao dịch Nhanh', onClick: () => router.push('/p2p') },
    { title: 'Giao dịch P2P', onClick: () => router.push('/p2p/market') },
    { title: 'Giao dịch Lô', onClick: () => router.push('/p2p/bulk') },
    { title: 'Lệnh của tôi', onClick: () => router.push('/p2p/orders') },
    { title: 'Hồ sơ của tôi', onClick: () => router.push('/p2p/profile') },
    { title: 'Thêm', onClick: () => {} }
  ];

  useEffect(() => {
    // In real app, this would fetch from API
    // dispatch(fetchP2POrders(filters));
    
    // For demo, filter mock data
    const filteredOrders = mockQuery.p2pOrders.filter(order => {
      if (filters.cryptocurrency !== order.cryptocurrency) return false;
      if (filters.fiatCurrency !== order.fiatCurrency) return false;
      if (filters.paymentMethods.length > 0) {
        const hasMatchingPayment = order.paymentMethods.some(pm => 
          filters.paymentMethods.includes(pm.id)
        );
        if (!hasMatchingPayment) return false;
      }
      return true;
    });
    
    setMockOrders(filteredOrders);
  }, [filters]);

  const handleTabChange = (tab: 'buy' | 'sell') => {
    setActiveTab(tab);
  };

  const handleTradeClick = (order: P2POrder) => {
    dispatch(setSelectedOrder(order));
    setIsTradeModalOpen(true);
  };

  const handleCloseTradeModal = () => {
    setIsTradeModalOpen(false);
    dispatch(setSelectedOrder(null));
  };

  const handleConfirmTrade = async (amount: number, paymentMethodId: string) => {
    if (selectedOrder) {
      try {
        // In real app, this would call the API
        // await dispatch(initiateTrade({ orderId: selectedOrder.id, amount }));
        
        console.log('Trade initiated:', { 
          orderId: selectedOrder.id, 
          amount, 
          paymentMethodId 
        });
        
        handleCloseTradeModal();
        
        // Show success message or redirect
        alert('Giao dịch đã được khởi tạo thành công!');
      } catch (error) {
        console.error('Error initiating trade:', error);
        alert('Có lỗi xảy ra khi khởi tạo giao dịch');
      }
    }
  };

  const handleFindTraders = () => {
    setShowOrderList(true);
  };

  // Filter orders based on active tab
  const displayOrders = mockOrders.filter(order => 
    activeTab === 'buy' ? order.type === 'sell' : order.type === 'buy'
  );

  const leftContent = (
    <div>
      <P2PHeader 
        title="Giao dịch Nhanh P2P"
        subtitle="Mua USDT bằng VND"
        description="Giao dịch Nhanh P2P tìm giá mua USDT tốt nhất cho bạn trong số những lựa chọn hiện có trên thị trường P2P."
      />
      <P2PGuide />
      
      {showOrderList && (
        <div className={styles.orderListSection}>
          <P2PFilters />
          <P2PMarket 
            orders={displayOrders}
            loading={loading}
            tradeType={activeTab}
            onTradeClick={handleTradeClick}
          />
        </div>
      )}
    </div>
  );

  const rightContent = (
    <TradingForm 
      onTradeTypeChange={handleTabChange}
      activeTradeType={activeTab}
    />
  );

  return (
    <div className={styles.container}>
      <TopMenuList 
        menuItems={menuItems} 
        defaultActive={0} 
        splitLayout={true}
        leftItemsCount={3}
      />
      
      <div className={styles.contentWrapper}>
        <P2PLayout 
          leftContent={leftContent}
          rightContent={rightContent}
        />
      </div>

      <TradeModal
        selectedOrder={selectedOrder}
        isOpen={isTradeModalOpen}
        onClose={handleCloseTradeModal}
        onConfirmTrade={handleConfirmTrade}
      />
    </div>
  );
}