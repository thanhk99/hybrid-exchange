import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Order {
  price: number;
  quanlity: number;
  type: string;
}

export interface OrderBookState {
  bids: Order[];
  asks: Order[];
}

const initialState: OrderBookState = {
  bids: [],
  asks: [],
};

const orderBookSlice = createSlice({
  name: "orderBook",
  initialState,
  reducers: {
    updateOrderBook(state, action: PayloadAction<Order>) {
      const { price, quanlity, type } = action.payload;
      const book = type === "buy" ? state.bids : state.asks;
      const idx = book.findIndex((o) => o.price === price);

      if (quanlity === 0) {
        if (idx >= 0) book.splice(idx, 1);
      } else if (idx >= 0) {
        book[idx].quanlity = quanlity;
      } else {
        book.push({ price, quanlity, type });
        book.sort((a, b) =>
          type === "buy" ? b.price - a.price : a.price - b.price
        );
      }
    },
    clearOrderBook(state) {
      state.bids = [];
      state.asks = [];
    },
  },
});

export const { updateOrderBook, clearOrderBook } = orderBookSlice.actions;
export default orderBookSlice.reducer;
