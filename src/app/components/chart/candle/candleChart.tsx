"use client";

import { useEffect, useRef } from "react";
import { createChart, ColorType, UTCTimestamp } from "lightweight-charts";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { useCandle } from "@/app/hooks/useCandle";
import { useMarketSocket } from "@/app/hooks/useMarketSocket";


export function CandleChart() {
  const { symbol, interval, candles } = useSelector((s: RootState) => s.market);
  const { data: snapshot } = useCandle(symbol ?? "", interval);
  useMarketSocket();

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ReturnType<typeof createChart> | null>(null);
  const seriesRef = useRef<any>(null);
  const lastPriceLine = useRef<any>(null);

  // khởi tạo chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth || 600,
      height: 400,
      layout: {
        background: { type: ColorType.Solid, color: "#000000" },
        textColor: "#DDDDDD",
      },
      grid: {
        vertLines: { color: "#1f1f1f" },
        horzLines: { color: "#1f1f1f" },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
        borderColor: "#71649C",
      },
      rightPriceScale: {
        borderColor: "#71649C",
        visible: true,
      },
    });

    chartRef.current = chart;
    seriesRef.current = chart.addCandlestickSeries({
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderDownColor: "#ef5350",
      borderUpColor: "#26a69a",
      wickDownColor: "#ef5350",
      wickUpColor: "#26a69a",
    });

    // resize chart khi thay đổi kích thước cửa sổ
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        const width = chartContainerRef.current.clientWidth || 600;
        chartRef.current.resize(width, 400);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, []);

  // load snapshot lần đầu
  useEffect(() => {
    if (seriesRef.current && snapshot) {
      seriesRef.current.setData(snapshot);
      chartRef.current?.timeScale().fitContent();
    }
  }, [snapshot, symbol, interval]);

  // update nến realtime từ Redux (candles cập nhật nhờ WS)
  useEffect(() => {
    if (seriesRef.current && candles.length > 0) {
      const latest = candles[candles.length - 1];
      // seriesRef.current.update(latest);

      // Chuyển dữ liệu về dạng chart cần
      const candleForChart = {
        time: Math.floor(latest.time / 1000), 
        // time: latest.time as UTCTimestamp,
        open: latest.open,
        high: latest.high,
        low: latest.low,
        close: latest.close,
        volume: latest.volume,
      };

      // update nến cuối cùng
      seriesRef.current.update(candleForChart);

      // xóa price line cũ
      if (lastPriceLine.current) {
        seriesRef.current.removePriceLine(lastPriceLine.current);
      }

      // thêm price line mới
      lastPriceLine.current = seriesRef.current.createPriceLine({
        price: latest.close,
        color: latest.close >= latest.open ? "#26a69a" : "#ef5350",
        lineWidth: 1,
        lineStyle: 2, // sọc
        axisLabelVisible: false,
        title: "",
      });
    }
  }, [candles]);

  return (
    <div
      ref={chartContainerRef}
      style={{ width: "100%", height: "400px", position: "relative" }}
    />
  );
}
