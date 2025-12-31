import { ISeriesApi, IChartApi } from 'lightweight-charts';
import { DrawingPrimitive, DrawingPoint, DrawingOptions } from './DrawingPrimitive';

export class TextDrawing extends DrawingPrimitive {
    private text: string;

    constructor(text: string = 'Văn bản', options?: DrawingOptions) {
        super(options);
        this.text = text;
    }

    draw(ctx: CanvasRenderingContext2D, chart: IChartApi, series: ISeriesApi<any>): void {
        const p1 = this.points[0];
        if (!p1) return;

        const x = this.timeToCoordinate(p1.time, chart);
        const y = this.priceToCoordinate(p1.price, series);

        if (x === null || y === null) return;

        ctx.fillStyle = this.options.color || '#ffffff';
        ctx.font = '14px Roboto, Arial, sans-serif';
        ctx.fillText(this.text, x, y);

        // Draw selection highlights or insertion indicator
        if (this.selected) {
            this.drawSelectionHighlights(ctx, chart, series);

            // Draw a rectangle around text if selected
            const metrics = ctx.measureText(this.text);
            ctx.strokeStyle = '#ffffff';
            ctx.setLineDash([2, 4]);
            ctx.strokeRect(x - 4, y - 16, metrics.width + 8, 20);
        } else if (!this.isComplete()) {
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    hitTest(px: number, py: number, chart: IChartApi, series: ISeriesApi<any>): boolean {
        if (this.points.length < 1) return false;

        const x = this.timeToCoordinate(this.points[0].time, chart);
        const y = this.priceToCoordinate(this.points[0].price, series);

        if (x === null || y === null) return false;

        // Approximate hit box for text
        // Note: in a real app we'd need the actual context to measure, but we can estimate
        const width = this.text.length * 8;
        return px >= x - 5 && px <= x + width + 5 && py >= y - 20 && py <= y + 5;
    }

    getText(): string {
        return this.text;
    }

    setText(text: string): void {
        this.text = text;
    }

    move(deltaPrice: number, deltaTime: number): void {
        this.points = this.points.map(p => ({
            price: p.price + deltaPrice,
            time: (Number(p.time) + deltaTime) as any
        }));
    }

    isComplete(): boolean {
        return this.points.length >= 1;
    }
}
