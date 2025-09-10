'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import P2PPage from './p2p/page';

export default function P2PTradingPreview() {
  return (
    <Provider store={store}>
      <div style={{ minHeight: '100vh', background: 'var(--color-bg-primary)' }}>
        <P2PPage />
      </div>
    </Provider>
  );
}