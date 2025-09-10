import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { P2POrder, P2PTrade, P2PFilters, P2PState } from '../types/p2p';
import p2pService from '../services/p2pService';

const initialState: P2PState = {
  orders: [],
  myOrders: [],
  activeTrades: [],
  tradeHistory: [],
  filters: {
    cryptocurrency: 'USDT',
    fiatCurrency: 'VND',
    paymentMethods: [],
    onlineOnly: false,
    sortBy: 'price',
    sortOrder: 'asc'
  },
  loading: false,
  error: null,
  selectedOrder: null,
  currentTrade: null
};

// Async thunks
export const fetchP2POrders = createAsyncThunk(
  'p2p/fetchOrders',
  async (filters: P2PFilters) => {
    return await p2pService.getOrders(filters);
  }
);

export const createP2POrder = createAsyncThunk(
  'p2p/createOrder',
  async (orderData: Partial<P2POrder>) => {
    return await p2pService.createOrder(orderData);
  }
);

export const initiateTrade = createAsyncThunk(
  'p2p/initiateTrade',
  async ({ orderId, amount }: { orderId: string; amount: number }) => {
    return await p2pService.initiateTrade(orderId, amount);
  }
);

export const fetchMyOrders = createAsyncThunk(
  'p2p/fetchMyOrders',
  async () => {
    return await p2pService.getMyOrders();
  }
);

export const fetchActiveTrades = createAsyncThunk(
  'p2p/fetchActiveTrades',
  async () => {
    return await p2pService.getActiveTrades();
  }
);

const p2pSlice = createSlice({
  name: 'p2p',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<P2PFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSelectedOrder: (state, action: PayloadAction<P2POrder | null>) => {
      state.selectedOrder = action.payload;
    },
    setCurrentTrade: (state, action: PayloadAction<P2PTrade | null>) => {
      state.currentTrade = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchP2POrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchP2POrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchP2POrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Lỗi tải dữ liệu';
      })
      .addCase(createP2POrder.fulfilled, (state, action) => {
        state.myOrders.push(action.payload);
      })
      .addCase(initiateTrade.fulfilled, (state, action) => {
        state.activeTrades.push(action.payload);
        state.currentTrade = action.payload;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.myOrders = action.payload;
      })
      .addCase(fetchActiveTrades.fulfilled, (state, action) => {
        state.activeTrades = action.payload;
      });
  }
});

export const { setFilters, setSelectedOrder, setCurrentTrade, clearError } = p2pSlice.actions;
export default p2pSlice.reducer;