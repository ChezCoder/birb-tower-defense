import { Force, SimpleVector2, Vector2 } from "../../Util";
import Game from "../../Game";
import Loopable from "../../Loopable";
import ControlPoint from "./ControlPoint";

export interface SimpleHandle {
    point: SimpleVector2
    handle1: SimpleVector2
    handle2: SimpleVector2
}

export default class ControlHandle extends Loopable {
    public point: ControlPoint = new ControlPoint();
    public handle1: ControlPoint = new ControlPoint();
    public handle2: ControlPoint = new ControlPoint();
    public helper: boolean = false;
    public handleSync: boolean;
    public onchange: () => void = () => {};
    
    constructor(point: Vector2, handle1: Vector2 = point.clone().setX(point.x - 100), handle2: Vector2 = point.clone().setX(point.x + 100), handleSync: boolean = true) {
        super();
        
        this.handleSync = handleSync;
        this.handle1.color = "#ff0000";
        this.handle2.color = "#ff7f00";

        this.handle1.ondrag = () => {
            this.handleSync ? this.syncHandles(1) : null;
            this.onchange.call(this);
        }

        this.handle2.ondrag = () => {
            this.handleSync ? this.syncHandles(2) : null;
            this.onchange.call(this);
        }

        
        this.point.ondrag = (from, to) => {
            const forceToNewLoc = to.toForce(from);
            this.handle1.location.addForce(forceToNewLoc);
            this.handle2.location.addForce(forceToNewLoc);
            this.onchange.call(this);
        }

        this.point.location = point;
        this.handle1.location = handle1;
        this.handle2.location = handle2;
    }

    /**
     * Render a helper
     * @param ctx Context
     */
    public loop(ctx: CanvasRenderingContext2D, game: Game): void {
        if (this.helper) {
            this.point.loop(ctx, game);
            this.handle1.loop(ctx, game);
            this.handle2.loop(ctx, game);

            ctx.beginPath();
            ctx.strokeStyle = "#0000ff";
            ctx.lineWidth = 1;
            ctx.moveTo(this.handle1.location.x, this.handle1.location.y);
            ctx.lineTo(this.handle2.location.x, this.handle2.location.y);
            ctx.stroke();
            ctx.closePath();
        }
    }

    public syncHandles(fromHandle: 1 | 2) {
        let constAsForce: Force;
        let modPoint: ControlPoint;

        switch (fromHandle) {
            case 1:
                constAsForce = this.handle1.location.toForce(this.point.location);
                modPoint = this.handle2;
                break;
            case 2:
                constAsForce = this.handle2.location.toForce(this.point.location);
                modPoint = this.handle1;
                break;
        }

        constAsForce.magnitude *= -1;
        modPoint.location = Vector2.add(constAsForce.toVector(), this.point.location);
    }

    public toJSON(): SimpleHandle {
        return {
            "point": this.point.location.simplify(),
            "handle1": this.handle1.location.simplify(),
            "handle2": this.handle2.location.simplify()
        }
    }

    public static fromJSON(json: SimpleHandle): ControlHandle {
        return new ControlHandle(new Vector2(json.point.x, json.point.y), new Vector2(json.handle1.x, json.handle2.y), new Vector2(json.handle2.x, json.handle2.y));
    }
}