import App from "./App";
import { ResourceManager } from "./Resource";
import { Vector2 } from "./Util";

export interface DrawOptions {
    draw: (ctx: CanvasRenderingContext2D) => void
    origin?: Vector2
    strokeStyle?: string
    fillStyle?: string
    lineWidth?: number
    alpha?: number
    rotation?: number
}

export abstract class Renderable<S extends Scene = Scene> {
    private static id: number = 0;
    
    readonly id: number;

    public enabled: boolean = true;

    protected scene: S;

    constructor(scene: S) {
        this.id = Renderable.id++;
        this.scene = scene;
    }

    public draw(): void {
        this.scene.draw({
            "draw": () => {}
        });
    }
}

export default abstract class Scene {
    readonly app: App;
    readonly ctx: CanvasRenderingContext2D;
    readonly name: string;
    readonly resource: ResourceManager;
    readonly persistResources: boolean;

    public renderables: Renderable<Scene>[] = [];

    constructor(app: App, name: string, persistResources: boolean = true) {
        this.app = app;
        this.name = name;
        this.ctx = app.ctx;
        this.resource = new ResourceManager();
        this.persistResources = persistResources;
    }

    public setup() {}

    public loop() {}

    public addRenderable(renderable: Renderable): number {
        this.renderables.push(renderable);
        return renderable.id;
    }

    public draw(options: DrawOptions | Renderable): void {
        if (options instanceof Renderable) {
            return options.draw();
        }
        
        this.ctx.save();
        this.ctx.beginPath();

        if (options.origin) {
            const offset = options.origin;
            this.ctx.translate(offset.x, offset.y);
        }
        
        this.ctx.strokeStyle = options.strokeStyle || "#000000";
        this.ctx.fillStyle = options.fillStyle || "#000000";
        this.ctx.globalAlpha = options.alpha === 0 ? 0 : options.alpha || 1;
        this.ctx.lineWidth = options.lineWidth === 0 ? 0 : options.lineWidth || 1;

        if (options.rotation) this.ctx.rotate(options.rotation);

        options.draw(this.ctx);

        if (options.strokeStyle) this.ctx.stroke();
        if (options.fillStyle) this.ctx.fill();

        this.ctx.closePath();
        this.ctx.restore();
    }
}