import { AssetManager } from "../../AssetManager";
import { AudioSystem } from "../../AudioSystem";
import { Console } from "../../Console";
import { VIDEOS } from "../../ElementDefinitions";
import Game from "../../lib/BaseGame";
import { Routine, WaitFor, WaitForSeconds } from "../../lib/Scheduler";
import { Random } from "../../lib/Util";

export default class MenuScreen extends Game {
    private openingDone: boolean = false;
    private menuScreenEnable: boolean = false;
    private openingVideo = AssetManager.load<HTMLVideoElement>("Opening")!;

    public setup(): void {
        this.openingVideo.muted = false;
        this.openingVideo.volume = 0.1;
        this.openingVideo.style.transition = "opacity 1s";

        VIDEOS.appendChild(this.openingVideo);

        this.openingVideo.play();

        setTimeout(() => {
            Console.log("MenuScreen: Starting menu screen");
            this.menuScreenEnable = true;
        }, 8500);

        setTimeout(() => {
            const instance = this;

            Routine.startTask(function*() {
                for (let vol = instance.openingVideo.volume;vol > 0;vol -= instance.openingVideo.volume / 100) {
                    instance.openingVideo.volume = vol;
                    yield new WaitForSeconds(0.05);
                }
            });

            const bgm = AssetManager.load<HTMLAudioElement>("Menu Screen");
            
            AudioSystem.play(bgm, {
                "fadeIn": 10000,
                "volume": 0.1,
                "loop": true
            });
        }, 10000);

        (window as any).AssetManager = AssetManager;

        this.openingVideo.onended = () => {
            Console.log("MenuScreen: Destroying video instance");
            this.openingDone = true;
            this.openingVideo.style.opacity = "0";
            
            setTimeout(() => {
                this.openingVideo.remove();
            }, 1000);
        };
    }
    
    public loop(): void {
        if (!this.openingDone) {
            this._openingVideo();
        }

        if (this.menuScreenEnable) {
            this._backgroundComponents();
            this._gameTitle();
        }
    }

    private _gameTitle() {
        this.ctx.save();
        this.ctx.beginPath();

        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillStyle = "#000000";
        this.ctx.font = "50px Metropolis";

        this.ctx.fillText("MenuScreen#_gameTitle()", this.canvas.width / 2, this.canvas.height / 2);

        this.ctx.closePath();
        this.ctx.restore();

    }

    private _backgroundComponents() {
        this.ctx.save();
        this.ctx.beginPath();
        
        this.ctx.fillStyle = "#ffffff";
        
        this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fill();

        this.ctx.closePath();
        this.ctx.restore();
    }

    private _openingVideo() {
        this.openingVideo.style.left = `${this.canvas.width / 2 - this.openingVideo.width / 2}px`;
        this.openingVideo.style.top = `${this.canvas.height / 2 - this.openingVideo.height / 2}px`;
        this.openingVideo.controls = false;
        
        const videoAspRatio = this.openingVideo.width / this.openingVideo.height;
        
        this.openingVideo.height = this.canvas.height;
        this.openingVideo.width = this.canvas.height * videoAspRatio;

        if (this.openingVideo.width < this.canvas.width) {
            this.openingVideo.width = this.canvas.width;
            this.openingVideo.height = this.canvas.width / videoAspRatio;
        }
    }
}