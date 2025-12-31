import { ISeriesApi, IChartApi } from 'lightweight-charts';
import { DrawingPrimitive, DrawingPoint, DrawingOptions } from './DrawingPrimitive';

export class VerticalLine extends DrawingPrimitive {
    constructor(options?: DrawingOptions) {
        super({ ...options, lineStyle: 'dashed' });
    }

    draw(ctx: CanvasRenderingContext2D, chart: IChartApi, series: ISeriesApi<any>): void {
        if (this.points.length < 1) return;

        const p1 = this.points[0];
        const x = this.timeToCoordinate(p1.time, chart);

        if (x === null) return;

        const height = ctx.canvas.height;

        this.setLineStyle(ctx);

        // Draw vertical line
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();

        if (this.selected) {
            this.drawSelectionHighlights(ctx, chart, series);
        }
    }

    hitTest(px: number, py: number, chart: IChartApi, series: ISeriesApi<any>): boolean {
        if (this.points.length < 1) return false;
        const x = this.timeToCoordinate(this.points[0].time, chart);
        if (x === null) return false;
        return Math.abs(px - x) < 8;
    }

    move(deltaPrice: number, deltaTime: number): void {
        this.points = this.points.map(p => ({
            price: p.price,
            time: (Number(p.time) + deltaTime) as any
        }));
    }

    isComplete(): boolean {
        return this.points.length >= 1;
    }
}
