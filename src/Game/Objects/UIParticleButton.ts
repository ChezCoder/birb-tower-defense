import Game from "../../lib/BaseGame";
import Loopable from "../../lib/Loopable";
import { Force, Random, TextUtils, Vector2 } from "../../lib/Util";
import ClickableRegion from "./ClickableRegion";
import { BasicUIParticle } from "./UIParticle";

export default class UIParticleButton extends Loopable {
    private particles: BasicUIParticle[] = [];
    private particlesOngoing: boolean = false;
    private hover: boolean = false;
    
    public readonly clickableRegion: ClickableRegion;

    public text: string;
    public font: string;
    public location: Vector2;
    public disabled: boolean = false;
    public alpha: number = 0;

    public onclick: () => void = () => {};
    public onhover: () => void = () => {};
    public onmouseover: () => void = () => {};

    constructor(text: string, font: string, location: Vector2) {
        super();
        this.text = text;
        this.font = font;
        this.location = location.clone();

        this.clickableRegion = new ClickableRegion();

        this.clickableRegion.onclick = this.onclick;
        this.clickableRegion.onhover = this.onhover;

        for (let i = 0;i < 30;i++) {
            this.particles.push(new BasicUIParticle(new Vector2(0, 0), Random.random(20, 10), new Force(Math.PI * 0.5, 1)));
        }
    }

    public loop(ctx: CanvasRenderingContext2D, game: Game) {
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
            game.cursor = "pointer";
            this.onhover.apply(this);
        } else {
            this.hover = false;
        }

        ctx.translate(this.location.x, this.location.y);
        ctx.fillText(this.text, 0, 0);
        
        ctx.closePath();
        ctx.restore();

        this.particles.forEach(p => p.loop(ctx, game));

        this.clickableRegion.loop(ctx, game);
    }

    public releaseParticles() {
        if (!this.particlesOngoing) {
            this.particlesOngoing = true;
            this.particles.forEach(p => {
                const f = new Force(Math.random() * Math.PI * 2, Random.random(10, 5));
                p.velocity = f;
                p.location = this.location.clone();
                p.enabled = true;
            });

            setTimeout(() => this.resetParticles(), 60 * 1000 / 90 * 4);
        }
    }

    public resetParticles() {
        this.particlesOngoing = false;
        this.particles.forEach(p => {
            p.enabled = false;
            p.reset();
        });
    }
}