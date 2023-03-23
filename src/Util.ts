export type WeightMap = {[key: string]: number};

export interface SimpleVector2 {
    x: number
    y: number
}

export interface SimpleForce {
    magnitude: number
    radians: number
}

export interface Dimension2 {
	width: number;
	height: number;
}

/**
 * Class representing an x and y value in euclidean geometry
 * 
 * Converting to a force will use it's x and y vectors as the force's x and y vectors
 */
export class Vector2 {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public distanceTo(vector: Vector2): number {
        return Math.sqrt(((this.x - vector.x) ** 2) + ((this.y - vector.y) ** 2));
    }

    public toForce(fromVector: Vector2 = Vector2.ORIGIN): Force {
        return new Force(Math.atan2(this.y - fromVector.y, this.x - fromVector.x), this.distanceTo(fromVector));
    }

    public add(vector: Vector2): void {
        this.x += vector.x;
        this.y += vector.y;
    }

    public addForce(force: Force): void {
        this.add(force.toVector());
    }

    public static difference(from: Vector2, to: Vector2): Vector2 {
        return new Vector2(to.x - from.x, to.y - from.y);
    }

    public static dot(vector1: Vector2, vector2: Vector2): Vector2 {
        return new Vector2(vector1.x * vector2.x, vector1.y * vector2.y);
    }

    public clone(): Vector2 {
        return new Vector2(this.x, this.y);
    }

    public simplify(): SimpleVector2 {
        return {
            x: this.x,
            y: this.y
        }
    }

    public static get ORIGIN(): Vector2 {
        return new Vector2(0, 0);
    }

    public static add(vector1: Vector2, vector2: Vector2): Vector2 {
        return new Vector2(vector1.x + vector2.x, vector1.y + vector2.y);
    }

    public static between(vector: Vector2, topLeft: Vector2, bottomRight: Vector2) {
        return MathUtils.between(vector.x, topLeft.x, bottomRight.x) && MathUtils.between(vector.y, topLeft.y, bottomRight.y);
    }

    public equals(other: Vector2) {
        return this.x == other.x && this.y == other.y;
    }

	public setX(x: number): this {
		this.x = x;
		return this;
	}

	public setY(y: number): this {
		this.y = y;
		return this;
	}
}

/**
 * Class representing a force with magnitude and radians.
 * 
 * Manipulate individual x and y vectors with Force#setVectors()
 */
export class Force {
    public radians: number;
    public magnitude: number;

    constructor(radians: number, magnitude: number) {
        this.radians = radians;
        this.magnitude = magnitude;
    }

    public toVector(): Vector2 {
        return new Vector2(Math.cos(this.radians) * this.magnitude, Math.sin(this.radians) * this.magnitude);
    }

    public setVectors(vectors: SimpleVector2) {
        const force = new Vector2(vectors.x, vectors.y).toForce(Vector2.ORIGIN);
        this.magnitude = force.magnitude;
        this.radians = force.radians;
    }

    public clone(): Force {
        return new Force(this.radians, this.magnitude);
    }

    public add(force: Force): void {
        const resultant = Vector2.add(this.toVector(), force.toVector()).toForce(Vector2.ORIGIN);
        this.radians = resultant.radians;
        this.magnitude = resultant.magnitude;
    }

    public simplify(): SimpleForce {
        return {
            magnitude: this.magnitude,
            radians: this.radians
        }
    }

    get degrees(): number {
        return Angle.toDegrees(this.radians);
    }

    set degrees(degrees: number) {
        this.radians = Angle.toRadians(degrees);
    }

    public equals(other: Force) {
        return this.radians == other.radians && this.magnitude == other.magnitude;
    }

	public setRadians(radians: number): this {
		this.radians = radians;
		return this;
	}

	public setDegrees(degrees: number): this {
		this.degrees = degrees;
		return this;
	}

	public setMagnitude(magnitude: number): this {
		this.magnitude = magnitude;
		return this;
	}

    public static add(force1: Force, force2: Force): Force {
        return Vector2.add(force1.toVector(), force2.toVector()).toForce(Vector2.ORIGIN);
    }
}

/**
 * Utility class for converting between radians (0 - 2π) and degrees (0 - 360).
 * 
 * Values are unclamped
 */
export namespace Angle {
    export function toRadians(degrees: number) {
        return degrees * (Math.PI / 180);
    }

    export function toDegrees(radians: number) {
        return radians * (180 / Math.PI);
    }
}

export class Raycast {
	public readonly position: Vector2;
	public readonly rotation: number;

	constructor(position: Vector2, rotation: number) {
		this.position = position;
		this.rotation = rotation;
	}

	/**
	 * @deprecated
	 * Use `MathUtils.isLineIntersectingLine()` instead.
	 */
	public cast(): void {}
}

export namespace Random {
    export function random(min: number = 0, max: number = 100) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    export function weightedRandom(weightMap: WeightMap): string {
        let dcWeightMap: WeightMap = {};
        Object.assign(dcWeightMap, weightMap);
    
        let sum = 0;
        let random = Math.random();
    
        for (let i in dcWeightMap) {
            sum += dcWeightMap[i];
    
            if (random <= sum)
                return i;
        }
    
        return Object.keys(dcWeightMap).filter(item => dcWeightMap[item] == (Math.max(...Object.values(dcWeightMap))))[0];
    }
    
    export function sample<T>(array: T[], amount: number = 1): T[] {
        return array.sort(() => 0.5 - Math.random()).slice(0, amount);
    }
}

export namespace TextUtils {
    export let ctx: CanvasRenderingContext2D;

    export function measureTextMetrics(text: string, font: string): TextMetrics {
        const oldFont = ctx.font;
        ctx.font = font;

		// todo make no util function use App namespace

        const textm = ctx.measureText(text);
        ctx.font = oldFont;
        
		return textm;
    }
    
    export function measureTextHeight(text: string, font: string): number {
        const metrics = measureTextMetrics(text, font);
        return Math.abs(metrics.actualBoundingBoxAscent) + Math.abs(metrics.actualBoundingBoxDescent);
    }
    
    export function measureTextWidth(text: string, font: string): number {
		const metrics = measureTextMetrics(text, font);
        return Math.abs(metrics.actualBoundingBoxLeft) + Math.abs(metrics.actualBoundingBoxRight);
    }

	export function prefixSpacing(text: string, prefix: string, length: number): string {
        if (text.length >= length) return text;
        return prefix.repeat(length - text.length) + text;
    }

    export function suffixSpacing(text: string, suffix: string, length: number): string {
        if (text.length >= length) return text;
        return text + suffix.repeat(length - text.length);
    }

	export function wrapText(text: string, maxWidth: number, font: string): string[] {
		const words = text.split(" ");
		let lines = [];
		let line = words[0];

		for (var i = 1; i < words.length; i++) {
			const word = words[i];
			const width = measureTextWidth(text, font);

			if (width < maxWidth) {
				line += " " + word;
			} else {
				lines.push(line);
				line = word;
			}
		}
		
		lines.push(line);
		return lines;
	}
}

export namespace Utils {
	/**
	 * @deprecated
	 */
	 export function setMouseCursor(cursorSource: string = "default") {
        document.body.style.cursor = cursorSource || "default";
    }
}

export namespace MathUtils {
    export function clamp(n: number, min: number = 0, max: number = 1): number {
        return Math.max(min, Math.min(n, max));
    }

    export function wrapClamp(n: number, min: number = 0, max: number = 1): number {
        return (n % ((max + 1) + min)) - min;
    }

    export function between(n: number, min: number, max: number): boolean {
        return n >= min && n <= max;
    }

    export function normalize(n: number, max: number = 1, min: number = 0): number {
        return (n - min) / (max - min);
    }

    export function remapRange(n: number, from1: number, to1: number, from2: number, to2: number) {
        return (n - from1) / (to1 - from1) * (to2 - from2) + from2;
    }

    export function isPositionOnLine(pos: Vector2, linePos1: Vector2, linePos2: Vector2, fault: number = 1): boolean {
        const posFromLinePoints = pos.distanceTo(linePos1) + pos.distanceTo(linePos2);
        const lineLength = linePos1.distanceTo(linePos2);
        return between(posFromLinePoints, lineLength - fault, lineLength + fault);
    }
    
    export function isLineIntersectingLine(lp1: Vector2, lp2: Vector2, lp3: Vector2, lp4: Vector2): boolean {
        let a = lp1.x,
            b = lp1.y,
            c = lp2.x,
            d = lp2.y;
		let p = lp3.x,
            q = lp3.y,
            r = lp4.x,
            s = lp4.y;
    
        var det, gamma, lambda;
        det = (c - a) * (s - q) - (r - p) * (d - b);

        if (det === 0) {
            return false;
		}

		lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
		gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
		return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
	}

    export function isPointInRectangle(point: Vector2, rectPos: Vector2, width: number, height: number): boolean {
        return Vector2.between(point, rectPos, Vector2.add(rectPos, new Vector2(width, height)));
    }
    
    export function isPointInPolygon(point: Vector2, polygon: Vector2[], globalWidth: number, globalHeight: number): boolean {
        let xIntersections = 0;
        let yIntersections = 0;
        let testLineX = [point, new Vector2(globalWidth, point.y)];
        let testLineY = [point, new Vector2(point.x, globalHeight)];
    
        polygon.forEach((position, posi) => {
            if (posi == (polygon.length - 1)) return;
            
            if (isLineIntersectingLine(testLineX[0], testLineX[1], position, polygon[posi + 1]))
                xIntersections++;
            
            if (isLineIntersectingLine(testLineY[0], testLineY[1], position, polygon[posi + 1]))
                yIntersections++;
        });
    
        return (xIntersections % 2 === 1) && (yIntersections % 2 === 1);
    }
    
    export function isPointInCircle(point: Vector2, circle: Vector2, radius: number) {
        if (radius === 0) return false;
        var dx = circle.x - point.x;
        var dy = circle.y - point.y;
        return dx * dx + dy * dy <= radius;
    }

    export function isLineInCircle(lineSegment: [Vector2, Vector2], circle: Vector2, radius: number) {
        let t: Vector2 = new Vector2(0, 0);
        let nearest: Vector2 = new Vector2(0, 0);
    
        if (isPointInCircle(lineSegment[0], circle, radius) || isPointInCircle(lineSegment[1], circle, radius)) {
            return true
        }
    
        let x1 = lineSegment[0].x,
            y1 = lineSegment[0].y,
            x2 = lineSegment[1].x,
            y2 = lineSegment[1].y,
            cx = circle.x,
            cy = circle.y
    
        let dx = x2 - x1;
        let dy = y2 - y1;
        let lcx = cx - x1;
        let lcy = cy - y1;
        let dLen2 = dx * dx + dy * dy;
        let px = dx;
        let py = dy;
    
        if (dLen2 > 0) {
            let dp = (lcx * dx + lcy * dy) / dLen2;
            px *= dp;
            py *= dp;
        }
    
        if (!nearest) nearest = t;
        nearest.x = x1 + px;
        nearest.y = y1 + py;
    
        let pLen2 = px * px + py * py;
        return isPointInCircle(nearest, circle, radius) && pLen2 <= dLen2 && (px * dx + py * dy) >= 0;
    }
    
    export function safeDivide(a: number, b: number): number {
        return isFinite(a / b) ? a / b : 0;
    }
}

export class QuadraticBezier {}

export class CubicBezier {
	private _start: Vector2;
	private _controlPoint1: Vector2;
	private _controlPoint2: Vector2;
	private _end: Vector2;
	private _arclength: number = 0;
	private _lut: Map<number, number> = new Map();
	private _segmentation: number = 30;

	constructor(start: Vector2, controlPoint1: Vector2, controlPoint2: Vector2, end: Vector2) {
		this._start = start;
		this._controlPoint1 = controlPoint1;
		this._controlPoint2 = controlPoint2;
		this._end = end;
		this.refactor();
	}

	public set start(vector: Vector2) {
		this._start = vector;
		this.refactor();
	}
	
	public set controlPoint1(vector: Vector2) {
		this._controlPoint1 = vector;
		this.refactor();
	}
	
	public set controlPoint2(vector: Vector2) {
		this._controlPoint2 = vector;
		this.refactor();
	}

	public set end(vector: Vector2) {
		this._end = vector;
		this.refactor();
	}

	public set segmentation(segments: number) {
		this._segmentation = segments;
		this.refactor();
	}

	public get start(): Vector2 { return this._start; }
	public get controlPoint1(): Vector2 { return this._controlPoint1; }
	public get controlPoint2(): Vector2 { return this._controlPoint2; }
	public get end(): Vector2 { return this._end; }
	public get arclength(): number { return this._arclength; }
	public get segmentation(): number { return this._segmentation; }

	private refactor() {
		this._arclength = BezierUtils.ArcLength.cubic(this._start, this._controlPoint1, this._controlPoint2, this._end, this._segmentation);
		void this._lut;
		// this._lut = BezierUtils.Parameterize.cubic(this._start, this._controlPoint1, this._controlPoint2, this._end, 1 / this._segmentation);
	}
}

export namespace BezierUtils {
	export namespace Parameterize {
		export function quadratic(start: Vector2, control: Vector2, end: Vector2, steps: number = 0.05): Map<number, number> {
			let arclength = 0;
			let lut = new Map<number, number>();

			for (let t = 0;t < 1;t += steps) {
				const px1 = BezierUtils.quadratic(start.x, control.x, end.x, t);
				const py1 = BezierUtils.quadratic(start.y, control.y, end.y, t);
				const px2 = BezierUtils.quadratic(start.x, control.x, end.x, t + steps);
				const py2 = BezierUtils.quadratic(start.y, control.y, end.y, t + steps);

				arclength += new Vector2(px1, py1).distanceTo(new Vector2(px2, py2));
				t += steps;
				lut.set(t, arclength);
			}

			const px1 = BezierUtils.quadratic(start.x, control.x, end.x, 1 - steps);
			const py1 = BezierUtils.quadratic(start.y, control.y, end.y, 1 - steps);
			const px2 = BezierUtils.quadratic(start.x, control.x, end.x, 1);
			const py2 = BezierUtils.quadratic(start.y, control.y, end.y, 1);
			arclength += new Vector2(px1, py1).distanceTo(new Vector2(px2, py2));
			lut.set(1, arclength);

			return lut;
		}
		
		export function cubic(start: Vector2, control1: Vector2, control2: Vector2, end: Vector2, steps: number = 0.05) {
			let arclength = 0;
			let lut = new Map<number, number>();

			for (let t = 0;t < 1;t += steps) {
				const px1 = BezierUtils.cubic(start.x, control1.x, control2.x, end.x, t);
				const py1 = BezierUtils.cubic(start.y, control1.y, control2.y, end.y, t);
				const px2 = BezierUtils.cubic(start.x, control1.x, control2.x, end.x, t + steps);
				const py2 = BezierUtils.cubic(start.y, control1.y, control2.y, end.y, t + steps);

				arclength += new Vector2(px1, py1).distanceTo(new Vector2(px2, py2));
				t += steps;
				lut.set(t, arclength);
			}

			const px1 = BezierUtils.cubic(start.x, control1.x, control2.x, end.x, 1 - steps);
			const py1 = BezierUtils.cubic(start.y, control1.y, control2.y, end.y, 1 - steps);
			const px2 = BezierUtils.cubic(start.x, control1.x, control2.x, end.x, 1);
			const py2 = BezierUtils.cubic(start.y, control1.y, control2.y, end.y, 1);
			arclength += new Vector2(px1, py1).distanceTo(new Vector2(px2, py2));
			lut.set(1, arclength);

			return lut;
		}
	}

	export namespace ArcLength {
		export function quadratic(start: Vector2, control: Vector2, end: Vector2, segments: number = 30) {
			let arclength = 0;

			for (let i = 0;i < segments - 1;i++) {
				const t1 = i / segments;
				const t2 = (i + 1) / segments;
				const px1 = BezierUtils.quadratic(start.x, control.x, end.x, t1);
				const py1 = BezierUtils.quadratic(start.y, control.y, end.y, t1);
				const px2 = BezierUtils.quadratic(start.x, control.x, end.x, t2);
				const py2 = BezierUtils.quadratic(start.y, control.y, end.y, t2);

				arclength += new Vector2(px1, py1).distanceTo(new Vector2(px2, py2));
			}

			return arclength;
		}

		export function cubic(start: Vector2, control1: Vector2, control2: Vector2, end: Vector2, segments: number = 30): number {
			let arclength = 0;

			for (let i = 0;i < segments - 1;i++) {
				const t1 = i / segments;
				const t2 = (i + 1) / segments;
				const px1 = BezierUtils.cubic(start.x, control1.x, control2.x, end.x, t1);
				const py1 = BezierUtils.cubic(start.y, control1.y, control2.y, end.y, t1);
				const px2 = BezierUtils.cubic(start.x, control1.x, control2.x, end.x, t2);
				const py2 = BezierUtils.cubic(start.y, control1.y, control2.y, end.y, t2);

				arclength += new Vector2(px1, py1).distanceTo(new Vector2(px2, py2));
			}

			return arclength;
		}
	}

	export function linear(start: number, end: number, t: number) {
		return start + (end - start) * t;
	}

	export function quadratic(start: number, control: number, end: number, t: number) {
		return Math.pow(1 - t, 2) * start + 2 * t * (1 - t) * control + Math.pow(t, 2) * end;
	}
	
	export function cubic(start: number, control1: number, control2: number, end: number, t: number) {
		return Math.pow(1 - t, 3) * start + 3 * Math.pow(1 - t, 2) * t * control1 + 3 * (1 - t) * Math.pow(t, 2) * control2 + Math.pow(t, 3) * end;
	}
}

export namespace LerpUtils {
    export type LerpFunction = (x: number) => number;

    export class Lerper {
        private readonly from: number;
        private readonly to: number;
        private readonly duration: number;
        public startTime: number;
        public clamped: boolean;
        public lerpFunction: LerpFunction = Functions.Linear;

        constructor(from: number, to: number, duration: number, clamped: boolean = true) {
            this.from = from;
            this.to = to;
            this.duration = duration;
            this.clamped = clamped;
            this.startTime = Date.now();
        }

        public value(currentTime: number = Date.now()): number {
            if (this.clamped)
                return LerpUtils.lerp(this.from, this.to, MathUtils.clamp((currentTime - this.startTime) / this.duration), this.lerpFunction);
            else
                return LerpUtils.lerp(this.from, this.to, (currentTime - this.startTime) / this.duration, this.lerpFunction);
        }

        public reset() {
            this.startTime = Date.now();
        }

        public get done() {
            return (this.startTime + this.duration) < Date.now();
        }
    }

	export function lerp(from: number, to: number, time: number, f: LerpFunction = Functions.Linear) {
		return BezierUtils.linear(from, to, f(time));
	}

    export namespace Functions {
        export const Linear: LerpFunction = x => x;
        export const Reverse: LerpFunction = x => 1 - x;
        export const EaseIn: LerpFunction = x => x * x;
        export const EaseOut: LerpFunction = x => EaseIn(Reverse(x));
        export const EaseInOut: LerpFunction = x => LerpUtils.lerp(EaseIn(x), EaseOut(x), x);
        export const Spike: LerpFunction = x => x <= 0.5 ? EaseIn(x / 0.5) : EaseIn(Reverse(x) / 0.5);
    }
}

export namespace Color {
	export function rbgToHex(red: number, blue: number, green: number): string {
        return `#${TextUtils.prefixSpacing(red.toString(16), "0", 2)}${TextUtils.prefixSpacing(blue.toString(16), "0", 2)}${TextUtils.prefixSpacing(green.toString(16), "0", 2)}`;
    }

    export function rbgaToHex(red: number, blue: number, green: number, alpha: number): string {
        return `#${TextUtils.prefixSpacing(red.toString(16), "0", 2)}${TextUtils.prefixSpacing(blue.toString(16), "0", 2)}${TextUtils.prefixSpacing(green.toString(16), "0", 2)}${TextUtils.prefixSpacing((Math.round(255 * alpha)).toString(16), "0", 2)}`;
    }

	export class RGB {
        public red: number;
        public green: number;
        public blue: number;

        constructor(red: number, green: number, blue: number) {
            this.red = red;
            this.green = green;
            this.blue = blue;
        }

        public toHex(): Hex {
            const space = (str: string) => TextUtils.prefixSpacing(str, "0", 2);
            return new Hex(`#${space(this.red.toString(16))}${space(this.green.toString(16))}${space(this.blue.toString(16))}`);
        }

        public toString(): string {
            return `rgb(${this.red}, ${this.green}, ${this.blue})`;
        }

        public clone(): RGB {
            return new RGB(this.red, this.green, this.blue);
        }
    }

    export class Hex {
        private _value: number;

        constructor(hexadecimal: number | string) {
            if (Number.isInteger(hexadecimal)) {
                this._value = +hexadecimal;
            } else {
                this._value = parseInt(hexadecimal.toString().substring(1), 16);
            }
        }


        public toRGB(): RGB {
            const stringified = this.toString();
            return new RGB(parseInt(stringified.substring(1, 3), 16), parseInt(stringified.substring(3, 5), 16), parseInt(stringified.substring(5, 7), 16));
        }

        public toString(): string {
            return `#${TextUtils.prefixSpacing(this._value.toString(16), "0", 6)}`;
        }

        public clone(): Hex {
            return new Hex(this.toString());
        }
    }
}