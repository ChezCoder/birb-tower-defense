
import { Console } from "../../Console";
import { BezierUtils, MathUtils, Vector2 } from "../../Util";
import Game from "../../Game";
import Loopable from "../../Loopable";
import ControlHandle, { SimpleHandle } from "./ControlHandle";

export interface SimpleBezier {
    handles: SimpleHandleConnector[]
}

interface SimpleHandleConnector {
    point1: SimpleHandle
    point2: SimpleHandle
}

class HandleConnector extends Loopable {
    public point1: ControlHandle;
    public point2!: ControlHandle;
    public helper: boolean;
    
    public LUT: Map<number, number> = new Map();
    public arclength: number = 0;

    constructor(point1: ControlHandle, point2?: ControlHandle, helper = false) {
        super();
        this.point1 = point1;
        if (point2) this.point2 = point2;
        this.helper = helper;
    }

    public loop(ctx: CanvasRenderingContext2D, game: Game): void {
        if (this.helper && this.point2) {
            const start = this.point1.point.location;
            const control1 = this.point1.handle2.location;
            const control2 = this.point2.handle1.location;
            const end = this.point2.point.location;

            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "black";
            ctx.moveTo(start.x, start.y);
            ctx.bezierCurveTo(control1.x, control1.y, control2.x, control2.y, end.x, end.y);
            ctx.stroke();
            ctx.closePath();
        }
        this.point1.helper = this.helper;
        this.point1.loop(ctx, game);

        if (this.point2) {
            this.point2.helper = this.helper;
            this.point2.loop(ctx, game);
        }
    }

    public generateLUT(quality: number = 1) {
        const segments = Math.floor(this.arclength * quality);
        const tInc = 1 / segments;
        
        this.LUT.clear();
        
        let cumulativeLen = 0;
        let prevPos = this.start;

        for (let t = tInc;t <= 1;t += tInc) {
            const tpos = this.tPos(t);
            cumulativeLen += prevPos.distanceTo(tpos);
            this.LUT.set(cumulativeLen, t);
            prevPos = tpos;
        }
    }

    public tPos(t: number): Vector2 {
        if (t > 1) {
            throw Console.throwError(RangeError, `BezierCurve: T value out of range (${t})`);
        }

        return new Vector2(
            BezierUtils.cubic(this.start.x, this.control1.x, this.control2.x, this.end.x, t),
            BezierUtils.cubic(this.start.y, this.control1.y, this.control2.y, this.end.y, t)
        );
    }

    public getT(distance: number): number {
        if (distance === 0) return 0;
        if (distance > this.arclength) {
            throw Console.throwError(RangeError, `BezierCurve: Distance value is out of connector range (${distance})`);
        }

        const distances = Array.from(this.LUT.keys());
        const minDist = Math.min(...distances);

        if (distance < minDist) {
            return MathUtils.remapRange(
                distance, 0, minDist,
                0, this.LUT.get(minDist)!
            );
        }

        if (distance == this.arclength) {
            return 1;
        } else {
            const entries = Array.from(this.LUT.entries());

            for (let i = 0;i < entries.length - 1;i++) {
                const d = entries[i][0];
                const t = entries[i][1];
                const nextD = entries[i + 1][0];
                const nextT = entries[i + 1][1];

                if (MathUtils.between(distance, d, nextD)) {
                    return MathUtils.remapRange(distance, d, nextD, t, nextT);
                }
            }
        }
        return distance;
    }

    public toJSON(): SimpleHandleConnector {
        if (!this.point2) throw Console.throwError(TypeError, "BezierCurve: Point 2 is undefined");

        return {
            "point1": this.point1.toJSON(),
            "point2": this.point2.toJSON()
        };
    }

    public get start(): Vector2 { return this.point1.point.location; }
    public get control1(): Vector2 { return this.point1.handle2.location; }
    public get control2(): Vector2 { return this.point2.handle1.location; }
    public get end(): Vector2 { return this.point2.point.location; }

    public static fromJSON(json: SimpleHandleConnector): HandleConnector {
        return new HandleConnector(ControlHandle.fromJSON(json.point1), ControlHandle.fromJSON(json.point2));
    }
}

export default class CubicBezierCurve extends Loopable {
    private _arclength: number = 0;
    
    public _connectors: HandleConnector[] = [];
    public quality = 1;
    public approxCloseness = 1;
    public helper: boolean;

    constructor(helper: boolean = false) {
        super();
        this.helper = helper;
    }

    public loop(ctx: CanvasRenderingContext2D, game: Game): void {
        this._connectors.forEach(connector => {
            connector.helper = this.helper;
            connector.loop(ctx, game);
        });
    }

    public getT(distance: number): number {
        if (distance > this.arclength) {
            distance = MathUtils.clamp(distance, 0, this.arclength);
        }

        let cumulativeDistance = distance.valueOf();
        
        for (let i = 0;i < this._connectors.length;i++) {
            const connector = this._connectors[i];

            if (cumulativeDistance <= connector.arclength) {
                return (i + connector.getT(cumulativeDistance)) / this._connectors.length;
            }

            cumulativeDistance -= connector.arclength;
        }

        return 0;
    }

    public tPos(t: number): Vector2 {
        if (this._connectors.length > 0) {
            const normT = this._connectors.length * t;
    
            if (normT === 0)
                return this._connectors[0].start;
    
            return this._tPos(normT);
        } else {
            return new Vector2(0, 0);
        }
    }

    public _tPos(t: number): Vector2 {
        const connector = this._connectors[Math.floor(t)];
        const localT = t % 1;

        if (t == this._connectors.length)
            return this._connectors[t - 1].end;

        if (connector) {
            return connector.tPos(localT);
        } else {
            throw Console.throwError(RangeError, `BezierCurve: T value out of range (${t})`);
        }
    }

    public refactor() {
        let arclen = 0;

        this._connectors.forEach(connector => {
            if (connector.point2) {
                let prev = 0;

                do {
                    prev = connector.arclength.valueOf();
                    
                    if (connector.arclength === 0) {
                        connector.arclength = connector.start.distanceTo(connector.control1) + connector.control1.distanceTo(connector.control2) + connector.control2.distanceTo(connector.end);
                    } else {
                        connector.arclength = BezierUtils.ArcLength.cubic(connector.start, connector.control1, connector.control2, connector.end, Math.floor(connector.arclength * this.quality));
                    }
                } while (Math.abs(prev - connector.arclength) > this.approxCloseness);

                connector.generateLUT(this.quality);
                arclen += connector.arclength;
            }
        });
        
        this._arclength = arclen;
    }

    public addControlHandle(controlHandle: ControlHandle) {
        controlHandle.onchange = () => this.refactor();
        const prevAvailableConn = this._connectors[this._connectors.length - 1];

        if (prevAvailableConn) {
            if (prevAvailableConn.point2) {
                this._connectors.push(new HandleConnector(this._connectors[this._connectors.length - 1].point2, controlHandle));
            } else if (prevAvailableConn.point1) {
                prevAvailableConn.point2 = controlHandle;
            } else {
                prevAvailableConn.point1 = controlHandle;
            }
        } else {
            this._connectors.push(new HandleConnector(controlHandle));
        }

        this.refactor();
    }
    
    public get arclength(): number { return this._arclength; }

    public toJSON(): SimpleBezier {
        return {
            "handles": this._connectors.map(a => a.toJSON())
        };
    }

    public static fromJSON(json: SimpleBezier): CubicBezierCurve {
        const curve = new CubicBezierCurve();
        json.handles.forEach(connector => {
            const handle = HandleConnector.fromJSON(connector);
            curve.addControlHandle(handle.point1);
            curve.addControlHandle(handle.point2);
        });
        return curve;
    }
}
