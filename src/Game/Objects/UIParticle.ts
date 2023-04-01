import Game from "../../lib/BaseGame";
import Loopable from "../../lib/Loopable";
import { Angle, Color, Force, Random, Vector2 } from "../../lib/Util";

export default class UIParticle extends Loopable {
    public loop(ctx: CanvasRenderingContext2D, game: Game) {
        void ctx, game;
    }
}

export class BasicUIParticle extends Loopable {
    public readonly color: Color.RGB;

    
    public enabled: boolean = false;
    public velocity: Force = new Force(0, 0);
    public location: Vector2;
    public size: number;
    
    private readonly originGravity: Force;
    private gravity: Force;
    private ang = 0;
    private angm = Angle.toRadians(Random.random(10, 5, false));

    constructor(location: Vector2, size: number, gravity: Force = new Force(0, 0)) {
        super();

        const pastelColorValues = [ 0xff, 0xff, 0xff, 0x7f, 0x7f, 0x7f, 0, 0, 0 ];
        const v = Random.sample(pastelColorValues, 3);

        this.color = new Color.RGB(v[0], v[1], v[2]);
        this.location = location;
        this.originGravity = gravity;
        this.gravity = gravity.clone();
        this.size = size;
    }

    public loop(ctx: CanvasRenderingContext2D, _game: Game) {
        if (!this.enabled) return;

        this.location.addForce(this.velocity);
        this.location.addForce(this.gravity);

        this.gravity.magnitude *= 1.05;
        this.ang += this.angm;
        
        ctx.save();
        ctx.beginPath();
        
        ctx.fillStyle = this.color.toString();
        ctx.globalAlpha = 0.5;

        ctx.translate(this.location.x, this.location.y);
        ctx.rotate(this.ang);
        
        const m = this.size / 2;
        ctx.moveTo(0, -m);
        ctx.lineTo(m * Math.sin(Angle.toRadians(120)), -m * Math.cos(Angle.toRadians(120)));
        ctx.lineTo(m * Math.sin(Angle.toRadians(240)), -m * Math.cos(Angle.toRadians(240)));
        
        ctx.fill();

        ctx.closePath();
        ctx.restore();
    }

    public reset() {
        this.gravity = this.originGravity.clone();
        this.velocity = new Force(0, 0);
    }
}