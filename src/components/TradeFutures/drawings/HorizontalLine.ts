import { ISeriesApi, IChartApi } from 'lightweight-charts';
import { DrawingPrimitive, DrawingPoint, DrawingOptions } from './DrawingPrimitive';

export class HorizontalLine extends DrawingPrimitive {
    constructor(options?: DrawingOptions) {
        super({ ...options, lineStyle: 'dashed' });
    }

    draw(ctx: CanvasRenderingContext2D, chart: IChartApi, series: ISeriesApi<any>): void {
        if (this.points.length < 1) return;

        const p1 = this.points[0];
        const y = this.priceToCoordinate(p1.price, series);

        if (y === null) return;

        const width = ctx.canvas.width;

        this.setLineStyle(ctx);

        // Draw horizontal line
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();

        // Draw price label
        ctx.fillStyle = '#ffffff';
        ctx.font = '11px Roboto Mono';
        ctx.fillText(p1.price.toFixed(2), width - 70, y - 5);

        if (this.selected) {
            this.drawSelectionHighlights(ctx, chart, series);
        }
    }

    hitTest(px: number, py: number, chart: IChartApi, series: ISeriesApi<any>): boolean {
        if (this.points.length < 1) return false;
        const y = this.priceToCoordinate(this.points[0].price, series);
        if (y === null) return false;
        return Math.abs(py - y) < 8;
    }

    move(deltaPrice: number, deltaTime: number): void {
        this.points = this.points.map(p => ({
            price: p.price + deltaPrice,
            time: p.time
        }));
    }

    isComplete(): boolean {
        return this.points.length >= 1;
    }
}
