import { ISeriesApi, IChartApi } from 'lightweight-charts';
import { DrawingPrimitive, DrawingPoint, DrawingOptions } from './DrawingPrimitive';

export class TrendLine extends DrawingPrimitive {
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

        this.setLineStyle(ctx);

        // Draw line
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Draw anchor points if selected
        if (this.selected) {
            ctx.fillStyle = this.options.color || '#f0b90b';
            [{ x: x1, y: y1 }, { x: x2, y: y2 }].forEach(point => {
                ctx.beginPath();
                ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
                ctx.fill();
            });
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

        const A = px - x1;
        const B = py - y1;
        const C = x2 - x1;
        const D = y2 - y1;

        const dot = A * C + B * D;
        const len_sq = C * C + D * D;
        let param = -1;
        if (len_sq !== 0) param = dot / len_sq;

        let xx, yy;
        if (param < 0) {
            xx = x1;
            yy = y1;
        } else if (param > 1) {
            xx = x2;
            yy = y2;
        } else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }

        const dx = px - xx;
        const dy = py - yy;
        return Math.sqrt(dx * dx + dy * dy) < 8;
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
