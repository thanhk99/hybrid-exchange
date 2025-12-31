import { ISeriesApi, IChartApi } from 'lightweight-charts';
import { DrawingPrimitive, DrawingPoint, DrawingOptions } from './DrawingPrimitive';

export class MultiPointDrawing extends DrawingPrimitive {
    private maxPoints: number;
    private labels: string[];

    constructor(maxPoints: number, labels: string[] = [], options?: DrawingOptions) {
        super(options);
        this.maxPoints = maxPoints;
        this.labels = labels;
    }

    draw(ctx: CanvasRenderingContext2D, chart: IChartApi, series: ISeriesApi<any>): void {
        if (this.points.length < 2) return;

        this.setLineStyle(ctx);
        ctx.beginPath();

        this.points.forEach((p, i) => {
            const x = this.timeToCoordinate(p.time, chart);
            const y = this.priceToCoordinate(p.price, series);

            if (x === null || y === null) return;

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }

            // Draw point and label
            const oldAlpha = ctx.globalAlpha;
            ctx.fillStyle = this.options.color || '#f0b90b';
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();

            if (this.labels[i]) {
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 12px Roboto Mono';
                ctx.fillText(this.labels[i], x + 8, y - 8);
            }

            ctx.globalAlpha = oldAlpha;
            ctx.beginPath(); // Reset for line continuation
            ctx.moveTo(x, y);
        });

        ctx.stroke();

        if (this.selected) {
            this.drawSelectionHighlights(ctx, chart, series);
        }
    }

    hitTest(px: number, py: number, chart: IChartApi, series: ISeriesApi<any>): boolean {
        if (this.points.length < 2) return false;

        for (let i = 0; i < this.points.length - 1; i++) {
            const x1 = this.timeToCoordinate(this.points[i].time, chart);
            const y1 = this.priceToCoordinate(this.points[i].price, series);
            const x2 = this.timeToCoordinate(this.points[i + 1].time, chart);
            const y2 = this.priceToCoordinate(this.points[i + 1].price, series);

            if (x1 === null || y1 === null || x2 === null || y2 === null) continue;

            // Distance from point to line segment
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

    isComplete(): boolean {
        return this.points.length >= this.maxPoints;
    }

    // Allow adding more points if not complete
    addPoint(point: DrawingPoint): void {
        if (this.points.length < this.maxPoints) {
            super.addPoint(point);
        }
    }
}
