import Game from "../../lib/BaseGame";
import Loopable from "../../lib/Loopable";
import { TextUtils, Vector2 } from "../../lib/Util";
import ClickableRegion from "./ClickableRegion";
import ParticleEmitter from "./ParticleEmitter";

export default class UIParticleButton extends Loopable {
    private hover: boolean = false;
    private particleEmitters: ParticleEmitter[] = [];
    
    public readonly clickableRegion: ClickableRegion;

    public text: string;
    public font: string;
    public location: Vector2;
    public disabled: boolean = true;
    public alpha: number = 0;
    public cursor: string;

    public onclick: () => void = () => {};
    public onhover: () => void = () => {};
    public onmouseover: () => void = () => {};

    constructor(text: string, font: string, location: Vector2, cursor: string = "pointer") {
        super();
        this.text = text;
        this.font = font;
        this.location = location.clone();
        this.cursor = cursor;
        
        this.clickableRegion = new ClickableRegion();
        
        this.clickableRegion.onclick = this.onclick;
        this.clickableRegion.onhover = this.onhover;
    }
    
    public loop(ctx: CanvasRenderingContext2D, game: Game) {
        this.clickableRegion.enabled = !this.disabled;

        ctx.save();
        ctx.beginPath();
        
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#000000";
        ctx.globalAlpha = this.alpha;
        ctx.font = this.font;
        
        const tm = TextUtils.measureTextMetrics(this.text, this.font);
        const tdims = TextUtils.metricsToDim2(tm);
        
        this.clickableRegion.location.x = this.location.x - tdims.width / 2;
        this.clickableRegion.location.y = this.location.y - tdims.height / 2;
        this.clickableRegion.dimensions.width = tdims.width;
        this.clickableRegion.dimensions.height = tdims.height;
        
        if (this.clickableRegion.hovering && !this.disabled) {
            if (!this.hover) this.onmouseover.apply(this);
            this.hover = true;
            ctx.fillStyle = "#474747";
            game.cursor = this.cursor;
            
            this.onhover.apply(this);

            if (game.input.mouseClick) this.onclick.apply(this);
        } else {
            this.hover = false;
        }

        ctx.translate(this.location.x, this.location.y);
        ctx.fillText(this.text, 0, 0);
        
        ctx.closePath();
        ctx.restore();

        this.clickableRegion.loop(ctx, game);
        this.particleEmitters.forEach(e => e.loop(ctx, game));
    }

    public emitParticles(): ParticleEmitter {
        const emitter = new ParticleEmitter(this.location, 30);
        emitter.releaseParticles();

        this.particleEmitters.push(emitter);

        setTimeout(() => {
            emitter.resetParticles();
            this.particleEmitters.splice(this.particleEmitters.findIndex(e => e == emitter), 1);
        }, 2000);

        return emitter;
    }
}