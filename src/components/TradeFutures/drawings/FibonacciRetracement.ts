import { ISeriesApi, IChartApi } from 'lightweight-charts';
import { DrawingPrimitive, DrawingPoint, DrawingOptions } from './DrawingPrimitive';

export class FibonacciRetracement extends DrawingPrimitive {
    private levels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];

    constructor(options?: DrawingOptions) {
        super(options);
    }

    draw(ctx: CanvasRenderingContext2D, chart: IChartApi, series: ISeriesApi<any>): void {
        if (this.points.length < 2) return;

        const p1 = this.points[0];
        const p2 = this.points[1];

        const x1 = this.timeToCoordinate(p1.time, chart);
        const y1 = this.priceToCoordinate(p1.price, series);
        const x2 = this.timeToCoordinate(p2.time, chart);
        const y2 = this.priceToCoordinate(p2.price, series);

        if (x1 === null || y1 === null || x2 === null || y2 === null) return;

        const priceDiff = p2.price - p1.price;
        const minX = Math.min(x1, x2);
        const maxX = Math.max(x1, x2);

        ctx.lineWidth = 1;
        ctx.font = '10px Roboto Mono';

        this.levels.forEach(level => {
            const price = p1.price + priceDiff * level;
            const y = this.priceToCoordinate(price, series);

            if (y === null) return;

            // Draw level line
            ctx.strokeStyle = this.options.color || '#f0b90b';
            ctx.setLineDash([]);
            ctx.beginPath();
            ctx.moveTo(minX, y);
            ctx.lineTo(maxX, y);
            ctx.stroke();

            // Draw label
            ctx.fillStyle = '#ffffff';
            ctx.globalAlpha = 0.8;
            const label = `${(level * 100).toFixed(1)}% (${price.toFixed(2)})`;
            ctx.fillText(label, maxX + 5, y + 3);
            ctx.globalAlpha = 1;
        });

        if (this.selected) {
            this.drawSelectionHighlights(ctx, chart, series);
        }
    }

    hitTest(px: number, py: number, chart: IChartApi, series: ISeriesApi<any>): boolean {
        if (this.points.length < 2) return false;

        const p1 = this.points[0];
        const p2 = this.points[1];

        const x1 = this.timeToCoordinate(p1.time, chart);
        const x2 = this.timeToCoordinate(p2.time, chart);
        const y1 = this.priceToCoordinate(p1.price, series);
        const y2 = this.priceToCoordinate(p2.price, series);

        if (x1 === null || x2 === null || y1 === null || y2 === null) return false;

        const minX = Math.min(x1, x2);
        const maxX = Math.max(x1, x2);

        // Check if cursor is within horizontal span
        if (px < minX - 5 || px > maxX + 5) return false;

        const priceDiff = p2.price - p1.price;

        // Check each level
        return this.levels.some(level => {
            const price = p1.price + priceDiff * level;
            const y = this.priceToCoordinate(price, series);
            if (y === null) return false;
            return Math.abs(py - y) < 8;
        });
    }

    move(deltaPrice: number, deltaTime: number): void {
        this.points = this.points.map(p => ({
            price: p.price + deltaPrice,
            time: (Number(p.time) + deltaTime) as any
        }));
    }

    isComplete(): boolean {
        return this.points.length >= 2;
    }
}
