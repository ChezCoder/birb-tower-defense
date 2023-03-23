import { TextUtils } from "./Util";
import { Input } from "./UserInput";
import Loopable from "./Loopable";

export interface GameConstructor {
    new(canvas: HTMLCanvasElement): Game;
}

export default abstract class Game {
    public readonly input = new Input();

    public clear: boolean = true;

    protected canvas: HTMLCanvasElement;
    protected ctx: CanvasRenderingContext2D;
    protected lastFrameTimestamp: number = Date.now();
    protected renderObjects: Loopable[] = [];
    
    private stopped = false;

    public readonly frame = () => {
        if (!this.stopped) {
            requestAnimationFrame(this.frame.bind(this));
            this.cursor = "default";
            this.input.step();
            
            if (this.clear) this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.renderObjects.forEach(object => object.loop(this.ctx, this));
            this.loop();
    
            this.lastFrameTimestamp = Date.now();
        }
    }

    public readonly onresize = () => {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    public get deltaTime(): number { return (Date.now() - this.lastFrameTimestamp) / 1000; }
    public set cursor(cursor: string) { this.canvas.style.cursor = cursor; }
    public get cursor(): string { return this.canvas.style.cursor; }

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d")!;

        this.preinitialize();
    }

    public preinitialize() {
        TextUtils.ctx = this.ctx;
        
        this.onresize();

        window.onresize = this.onresize.bind(this);
    }

    public start() {
        this.setup();
        this.frame();
    }

    public stop() {
        this.renderObjects = [];
        this.stopped = true;
    }

    public setup() {}
    protected loop() {}
}