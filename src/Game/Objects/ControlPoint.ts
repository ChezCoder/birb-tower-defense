import { LerpUtils, MathUtils, Vector2 } from "../../Util";
import Game from "../../Game";
import Loopable from "../../Loopable";

export default class ControlPoint extends Loopable {
    public location: Vector2;
    public ondrag: (from: Vector2, to: Vector2) => void = () => {};
    public color: string = "#007fff";
    public limX: [] | [number] | [number, number] = [];
    public limY: [] | [number] | [number, number] = [];
    public helper: boolean = false;
    public hover: boolean = false;

    private readonly radius: number = 10;
    
    private dragging: boolean = false;
    private innerRadius: number = 3;
    private bufferedInnerRadius: number = 0;

    constructor(location: Vector2 = new Vector2(0, 0), helper = true) {
        super();
        this.location = location;
        this.helper = helper;
    }

    public loop(ctx: CanvasRenderingContext2D, game: Game): void {
        const secondaryColor = this.color + "40";

        ctx.beginPath();
        ctx.fillStyle = secondaryColor;
        ctx.arc(this.location.x, this.location.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.location.x, this.location.y, this.bufferedInnerRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();

        if (game.input.mousePos.distanceTo(this.location) <= this.radius || this.dragging) {
            this.hover = true;
            if (this.helper) {
                ctx.beginPath();
                if (this.limX.length == 2 && this.limY.length == 2) {
                    ctx.fillStyle = secondaryColor;
                    ctx.rect(this.limX[0], this.limY[0], this.limX[1] - this.limX[0], this.limY[1] - this.limY[0]);
                    ctx.fill();
                } else {
                    if (this.limY.length === 2) {
                        if (this.limX.length === 1) {
                            ctx.strokeStyle = this.color;
                            ctx.lineWidth = 2;
                            ctx.moveTo(this.limX[0], this.limY[0]);
                            ctx.lineTo(this.limX[0], this.limY[1]);
                            ctx.stroke();
                        } else {
                            ctx.fillStyle = secondaryColor;
                            ctx.rect(0, this.limY[0], ctx.canvas.width, this.limY[1] - this.limY[0]);
                            ctx.fill();
                        }
                        ctx.closePath();
                    } else if (this.limX.length === 2) {
                        ctx.beginPath();
                        if (this.limY.length === 1) {
                            ctx.strokeStyle = this.color;
                            ctx.lineWidth = 2;
                            ctx.moveTo(this.limX[0], this.limY[0]);
                            ctx.lineTo(this.limX[1], this.limY[0]);
                            ctx.stroke();
                        } else {
                            ctx.fillStyle = secondaryColor;
                            ctx.rect(this.limX[0], 0, this.limX[1] - this.limX[0], ctx.canvas.height);
                            ctx.fill();
                        }
                    }
                }
                ctx.closePath();
            }

            game.cursor = "move";

            if (this.limX.length === 1 || this.limY.length === 1) {
                if (this.limX.length === 1) game.cursor = "ns-resize";
                if (this.limY.length === 1) game.cursor = "ew-resize";
            }

            this.innerRadius = 5;

            if (game.input.mouseClick) {
                this.dragging = true;
            }

            if (game.input.mouseDown && this.dragging) {
                const oldLoc = this.location.clone();
                this.location = game.input.mousePos.clone();

                this.applyLimits();
                this.ondrag.apply(this, [oldLoc, this.location]);
            } else {
                this.dragging = false;
            }

        } else {
            this.hover = false;
            this.innerRadius = 3;
        }

        this.bufferedInnerRadius = LerpUtils.lerp(this.bufferedInnerRadius, this.innerRadius, 0.3);
        this.applyLimits();
    }

    public applyLimits() {
        if (this.limX.length === 1) this.location.setX(this.limX[0]);
        if (this.limY.length === 1) this.location.setY(this.limY[0]);
        if (this.limX.length == 2) this.location.setX(MathUtils.clamp(this.location.x, this.limX[0], this.limX[1]));
        if (this.limY.length == 2) this.location.setY(MathUtils.clamp(this.location.y, this.limY[0], this.limY[1]));
    }
}