import { ISeriesApi, IChartApi } from 'lightweight-charts';
import { DrawingPrimitive, DrawingPoint, DrawingOptions } from './DrawingPrimitive';

export class Rectangle extends DrawingPrimitive {
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

        const width = x2 - x1;
        const height = y2 - y1;

        this.setLineStyle(ctx);

        // Draw filled rectangle with transparency
        ctx.globalAlpha = 0.15;
        ctx.fillStyle = this.options.color || '#f0b90b';
        ctx.fillRect(x1, y1, width, height);

        // Draw border
        ctx.globalAlpha = 1;
        ctx.strokeRect(x1, y1, width, height);

        if (this.selected) {
            this.drawSelectionHighlights(ctx, chart, series);
        }
    }

    hitTest(px: number, py: number, chart: IChartApi, series: ISeriesApi<any>): boolean {
        if (this.points.length < 2) return false;

        const x1 = this.timeToCoordinate(this.points[0].time, chart);
        const y1 = this.priceToCoordinate(this.points[0].price, series);
        const x2 = this.timeToCoordinate(this.points[1].time, chart);
        const y2 = this.priceToCoordinate(this.points[1].price, series);

        if (x1 === null || y1 === null || x2 === null || y2 === null) return false;

        const minX = Math.min(x1, x2);
        const maxX = Math.max(x1, x2);
        const minY = Math.min(y1, y2);
        const maxY = Math.max(y1, y2);

        // Hit if inside or very close to border
        return px >= minX - 5 && px <= maxX + 5 && py >= minY - 5 && py <= maxY + 5;
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
