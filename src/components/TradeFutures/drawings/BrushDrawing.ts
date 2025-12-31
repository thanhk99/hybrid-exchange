import { ISeriesApi, IChartApi } from 'lightweight-charts';
import { DrawingPrimitive, DrawingPoint, DrawingOptions } from './DrawingPrimitive';

export class BrushDrawing extends DrawingPrimitive {
    constructor(options?: DrawingOptions) {
        super(options);
    }

    draw(ctx: CanvasRenderingContext2D, chart: IChartApi, series: ISeriesApi<any>): void {
        if (this.points.length < 2) return;

        this.setLineStyle(ctx);
        ctx.beginPath();

        let first = true;
        this.points.forEach(p => {
            const x = this.timeToCoordinate(p.time, chart);
            const y = this.priceToCoordinate(p.price, series);

            if (x === null || y === null) return;

            if (first) {
                ctx.moveTo(x, y);
                first = false;
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.stroke();

        if (this.selected) {
            this.drawSelectionHighlights(ctx, chart, series);
        }
    }

    hitTest(px: number, py: number, chart: IChartApi, series: ISeriesApi<any>): boolean {
        if (this.points.length < 2) return false;

        // Check if cursor is near any segment of the brush path
        for (let i = 0; i < this.points.length - 1; i++) {
            const x1 = this.timeToCoordinate(this.points[i].time, chart);
            const y1 = this.priceToCoordinate(this.points[i].price, series);
            const x2 = this.timeToCoordinate(this.points[i + 1].time, chart);
            const y2 = this.priceToCoordinate(this.points[i + 1].price, series);

            if (x1 === null || y1 === null || x2 === null || y2 === null) continue;

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
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 8) return true;
        }

        return false;
    }

    move(deltaPrice: number, deltaTime: number): void {
        this.points = this.points.map(p => ({
            price: p.price + deltaPrice,
            time: (Number(p.time) + deltaTime) as any
        }));
    }

    // Brush is never really "complete" until mouse up, handled by TradingChart
    isComplete(): boolean {
        return this.points.length >= 2;
    }

    // Override updateLastPoint to always ADD points for brush during mousemove
    // This is a special case for brush
}
