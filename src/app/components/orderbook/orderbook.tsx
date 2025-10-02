"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { useOrderBookSocket } from "@/app/hooks/useOrderBookSocket";
import './orderbook.css'

export function OrderBook() {
  const { bids, asks } = useSelector((s: RootState) => s.orderBook);
  useOrderBookSocket();
  const { symbol } = useSelector((s: RootState) => s.market);
  const base = symbol?.replace("USDT", "") || "";
  const quote = "USDT";

  const calcCumulative = (orders: any[]) => {
    let sum = 0;
    return orders.map((o) => {
      sum += o.quanlity;
      return { ...o, total: sum };
    });
  };

  const asksWithTotal = calcCumulative([...asks].slice(0, 15));
  const bidsWithTotal = calcCumulative([...bids].slice(0, 15));

  const maxTotal = Math.max(
    ...asksWithTotal.map((o) => o.total),
    ...bidsWithTotal.map((o) => o.total),
    1
  );

  return (
    <div className="orderbook">
      <div className="header-book">
        <span>Giá ({quote})</span>
        <span>Số ({base})</span>
        <span>Tổng ({base})</span>
      </div>

      <div className="asks">
        {asksWithTotal.map((o, i) => (
          <div className="row ask" key={i}>
            <span className="price red">{o.price.toFixed(1)}</span>
            <span>{o.quanlity.toFixed(5)}</span>
            <span>{o.total.toFixed(5)}</span>
            <div
              className="depth red-bg"
              style={{ width: `${(o.total / maxTotal) * 100}%` }}
            />
          </div>
        ))}
      </div>

      <div className="bids">
        {bidsWithTotal.map((o, i) => (
          <div className="row bid" key={i}>
            <span className="price green">{o.price.toFixed(1)}</span>
            <span>{o.quanlity.toFixed(5)}</span>
            <span>{o.total.toFixed(5)}</span>
            <div
              className="depth green-bg"
              style={{ width: `${(o.total / maxTotal) * 100}%` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
