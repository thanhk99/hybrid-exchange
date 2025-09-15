"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { setSymbol } from "@/app/store/marketSlice";
import { useSymbols, useIntervals } from "@/app/hooks/useCandle";
import './marketSelector.css'

export function MarketSelector() {
  const dispatch = useDispatch();
  const { data: symbols } = useSymbols();
  const { data: intervals } = useIntervals();
  const { symbol, interval } = useSelector((s: RootState) => s.market);

  return (
    <div className="market-selector">
      <div className="symbols-list">
        {symbols?.map((s) => (
          <div
            key={s}
            className={`symbol-item ${symbol === s ? "active" : ""}`}
            onClick={() => dispatch(setSymbol({ symbol: s, interval }))}
          >
            {s}
          </div>
        ))}
      </div>

      <div className="intervals-list">
        {intervals?.map((i) => (
          <div
            key={i}
            className={`interval-item ${interval === i ? "active" : ""}`}
            onClick={() =>
              dispatch(setSymbol({ symbol: symbol ?? "", interval: i }))
            }
          >
            {i}
          </div>
        ))}
      </div>
    </div>
  );
}
