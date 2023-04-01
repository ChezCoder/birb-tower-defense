import { Console } from "../Console";
import Loopable from "./Loopable";
import { Input } from "./UserInput";

export interface GameConstructor<G extends Game = Game> {
    new(ctx: HTMLCanvasElement): G;
}

export default abstract class Game {
    public readonly input = new Input();
    public readonly ctx: CanvasRenderingContext2D;
    public readonly canvas: HTMLCanvasElement;

    public clear: boolean = true;

    protected lastFrameTimestamp: number = Date.now();
    protected renderObjects: Loopable[] = [];
    
    private started = false;
    private stopped = false;
    private gameEndRes: Function = () => {};

    public readonly frame = () => {
        if (!this.stopped) {
            requestAnimationFrame(this.frame.bind(this));
            this.input.step();
            
            if (this.clear) {
                this.cursor = "default";
                
                this.ctx.save();
                this.ctx.beginPath();
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
                this.ctx.closePath();
                this.ctx.restore();
            }
            
            this.renderObjects.forEach(object => object.loop(this.ctx, this));
            this.loop();
    
            this.lastFrameTimestamp = Date.now();
        }
    }

    public readonly onresize = () => {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    public readonly __stop = () => {
        this.renderObjects = [];
        this.stopped = true;
        this.gameEndRes.apply(this);
    }
    
    /**
     * Used in promise chaining in GameLoader
     * @returns A promise that resolves when the game ends, for use in Promise chaining
     */
    public readonly start: () => Promise<void> = () => {
        if (!this.started) {
            this.started = true;
            this.setup();
            this.frame();
    
            return new Promise(res => {
                this.gameEndRes = res;
            });
        } else {
            Console.warn("BaseGame: Attempted to start an already initialized game");
            return new Promise(res => res());
        }
    }

    public readonly isStopped = () => {
        return this.stopped;
    };

    public get deltaTime(): number { return (Date.now() - this.lastFrameTimestamp) / 1000; }
    public set cursor(cursor: string) { document.body.style.cursor = cursor; }
    public get cursor(): string { return document.body.style.cursor; }

    /**
     * Do not instantiate game class without using a GameLoader
     */
    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d")!;
        
        this.onresize();
        window.onresize = this.onresize.bind(this);
    }

    public setup() {}
    public loop() {}
}