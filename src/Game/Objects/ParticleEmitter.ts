import Game from "../../lib/BaseGame";
import Loopable from "../../lib/Loopable";
import { Force, Random, Vector2 } from "../../lib/Util";
import { BasicUIParticle } from "./UIParticle";

export default class ParticleEmitter extends Loopable {
    private particles: BasicUIParticle[] = [];
    private particlesOngoing: boolean = false;

    public location: Vector2;

    constructor(location: Vector2, count: number) {
        super();
        this.location = location;

        for (let i = 0;i < count;i++) {
            this.particles.push(new BasicUIParticle(new Vector2(0, 0), Random.random(20, 10), new Force(Math.PI * 0.5, 1)));
        }
    }

    public loop(ctx: CanvasRenderingContext2D, game: Game) {
        this.particles.forEach(p => p.loop(ctx, game));
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