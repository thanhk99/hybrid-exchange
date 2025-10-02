'use client';
import React, {useEffect, useState} from "react";
import SpotRow from "./row/spotRow";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useSpotSocket } from "../hooks/useSpotSocket";
import './spot.css'

const MarketTable: React.FC = () => {
  useSpotSocket();

  const market = useSelector((state: RootState) => state.spot);

  return (
    <table className="table-spot">
      <thead>
        <tr>
          <th>Symbol</th>
          <th>Price</th>
          <th>Change</th>
          <th>Low</th>
          <th>High</th>
          <th>Volume</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(market).map(([symbol, data]) => (
          <SpotRow
            key={symbol}
            symbol={symbol}
            price={data.price}
            changePercent={data.changePercent}
            low24h={data.low24h}
            high24h={data.high24h}
            volume={data.volume}
            onClick={() => {}}
          />
        ))}
      </tbody>
    </table>
  );
};

export default MarketTable;