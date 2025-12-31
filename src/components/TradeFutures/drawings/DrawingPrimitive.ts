import { ISeriesApi, IChartApi, Time } from 'lightweight-charts';

export interface DrawingPoint {
    time: Time;
    price: number;
}

export interface DrawingOptions {
    color?: string;
    lineWidth?: number;
    lineStyle?: 'solid' | 'dashed' | 'dotted';
}

export abstract class DrawingPrimitive {
    protected selected: boolean = false;
    protected points: DrawingPoint[] = [];
    protected options: DrawingOptions;
    protected isDrawing: boolean = false;
    protected id: string;

    constructor(options: DrawingOptions = {}) {
        this.id = `drawing_${Date.now()}_${Math.random()}`;
        this.options = {
            color: '#f0b90b',
            lineWidth: 2,
            lineStyle: 'solid',
            ...options
        };
    }

    abstract draw(ctx: CanvasRenderingContext2D, chart: IChartApi, series: ISeriesApi<any>): void;

    /**
     * Test if a point (x, y) hits any part of this drawing
     */
    abstract hitTest(x: number, y: number, chart: IChartApi, series: ISeriesApi<any>): boolean;

    /**
     * Move the entire drawing by a price/time delta
     */
    abstract move(deltaPrice: number, deltaTime: number): void;

    setSelected(selected: boolean): void {
        this.selected = selected;
    }

    isSelected(): boolean {
        return this.selected;
    }

    protected drawSelectionHighlights(ctx: CanvasRenderingContext2D, chart: IChartApi, series: ISeriesApi<any>): void {
        if (!this.selected) return;

        ctx.save();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);

        this.points.forEach(p => {
            const x = this.timeToCoordinate(p.time, chart);
            const y = this.priceToCoordinate(p.price, series);
            if (x !== null && y !== null) {
                ctx.beginPath();
                ctx.arc(x, y, 6, 0, Math.PI * 2);
                ctx.stroke();

                // Draw a small solid dot in the middle
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(x, y, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        });
        ctx.restore();
    }

    addPoint(point: DrawingPoint): void {
        this.points.push(point);
    }

    updateLastPoint(point: DrawingPoint): void {
        if (this.points.length > 0) {
            this.points[this.points.length - 1] = point;
        }
    }

    isComplete(): boolean {
        return false; // Override in subclasses
    }

    getId(): string {
        return this.id;
    }

    getPoints(): DrawingPoint[] {
        return this.points;
    }

    setPoints(points: DrawingPoint[]): void {
        this.points = points;
    }

    protected timeToCoordinate(time: Time, chart: IChartApi): number | null {
        return chart.timeScale().timeToCoordinate(time);
    }

    protected priceToCoordinate(price: number, series: ISeriesApi<any>): number | null {
        return series.priceToCoordinate(price);
    }

    protected setLineStyle(ctx: CanvasRenderingContext2D): void {
        ctx.strokeStyle = this.options.color || '#f0b90b';
        ctx.lineWidth = this.options.lineWidth || 2;

        if (this.options.lineStyle === 'dashed') {
            ctx.setLineDash([5, 5]);
        } else if (this.options.lineStyle === 'dotted') {
            ctx.setLineDash([2, 2]);
        } else {
            ctx.setLineDash([]);
        }
    }
}
