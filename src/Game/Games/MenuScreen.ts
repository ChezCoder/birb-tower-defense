import { AssetManager } from "../../AssetManager";
import { AudioSystem, PlaybackHook } from "../../AudioSystem";
import { Console } from "../../Console";
import { VIDEOS } from "../../ElementDefinitions";
import { GameLoader } from "../../GameLoader";
import Game from "../../lib/BaseGame";
import { Routine, WaitForSeconds } from "../../lib/Scheduler";
import { LerpUtils, Vector2 } from "../../lib/Util";
import { Saves } from "../../SaveManager";
import Tooltip from "../Objects/Tooltip";
import UIParticleButton from "../Objects/UIParticleButton";
import { Translatable } from "../TranslatableText";

export default class MenuScreen extends Game {
    public skipOpening: boolean = true;

    private bgmPlayback!: PlaybackHook;

    private openingDone: boolean = false;
    private menuScreenDrawEnable: boolean = false;
    private menuScreenInteractEnable: boolean = false;
    private openingVideo = AssetManager.load<HTMLVideoElement>("Opening")!;

    private rate: number = 0.01;

    private alpha: number = 0;
    private bufferedAlpha: number = 0;

    private beatOffsetAmount: number = 0;
    private beatstart: number = 0;

    private startButton: UIParticleButton = new UIParticleButton(Translatable.text("menu.button.start"), "40px Metropolis", new Vector2(0, 0));
    private startButtonBGRectW: number = 0;
    private bufferedStartButtonBGRectW: number = 0;
    
    private settingsButton: UIParticleButton = new UIParticleButton(Translatable.text("menu.button.settings"), "40px Metropolis", new Vector2(0, 0));
    private settingsButtonBGRectW: number = 0;
    private bufferedSettingsButtonBGRectW: number = 0;

    private tooltip: Tooltip = new Tooltip(this.canvas.width * 0.25);

    public setup(): void {
        Console.log(`MenuScreen: Skipping opening: ${this.skipOpening}`);
        if (this.skipOpening) {
            this._menuScreenSequence();
        } else {
            this.openingVideo.muted = false;
            this.openingVideo.volume = 0.1;
            this.openingVideo.style.opacity = "1";
            this.openingVideo.style.transition = "opacity 3s";
    
            VIDEOS.appendChild(this.openingVideo);
    
            const instance = this;
            
            Routine.startTask(function*() {
                instance.openingVideo.play();
    
                yield new WaitForSeconds(8.5);
    
                instance._menuScreenSequence();
            });
    
            this.openingVideo.onended = () => {
                Console.log("MenuScreen: Destroying video instance");
                this.openingDone = true;
                this.openingVideo.remove();
            };
        }
        
        this.startButton.onmouseover = /*this.settingsButton.onmouseover =*/ function() {
            const fx = AssetManager.load<HTMLAudioElement>("UI Hover");
            AudioSystem.play(fx, { "volume": .2 });
            this.emitParticles();
        }

        this.startButton.onclick = () => {
            this.startButton.disabled = true;
            this.settingsButton.disabled = true;

            // TODO transparent + scaled up version of the button behind it

            const instance = this;

            Routine.startTask(function*() {
                instance.menuScreenInteractEnable = false;
                instance.bufferedAlpha = 0;
                instance.rate *= 1.5;

                if (instance.bgmPlayback) {
                    for (let vol = instance.bgmPlayback.maxVolume;vol > 0;vol -= instance.bgmPlayback.maxVolume / 100) {
                        instance.bgmPlayback.audio.volume = vol;
                        yield new WaitForSeconds(0.02);
                    }

                    instance.bgmPlayback.stop();
                } else {
                    yield new WaitForSeconds(2);
                }

                GameLoader.endGame();
            });
        };
    }
    
    public loop(): void {
        if (!this.openingDone) {
            this._openingVideo();
        }

        if (this.menuScreenDrawEnable) {
            this._beatOffset();
            this._backgroundComponents();
            this._gameTitle();
            this._gameButtons();

            if (this.menuScreenInteractEnable) this.tooltip.loop(this.ctx, this);
        }

        this.alpha = LerpUtils.lerp(this.alpha, this.bufferedAlpha, this.rate);
        this.startButtonBGRectW = LerpUtils.lerp(this.startButtonBGRectW, this.bufferedStartButtonBGRectW, this.rate * 4);
        this.settingsButtonBGRectW = LerpUtils.lerp(this.settingsButtonBGRectW, this.bufferedSettingsButtonBGRectW, this.rate * 4);
    }

    private _menuScreenSequence() {
        const instance = this;

        Saves.save();

        Routine.startTask(function*() {
            Console.log("MenuScreen: Starting menu screen");

            instance.openingVideo.style.opacity = "0";
            instance.menuScreenDrawEnable = true;
            instance.menuScreenInteractEnable = true;

            instance.startButton.disabled = false;
            instance.settingsButton.disabled = false;

            if (instance.skipOpening) {
                instance.bufferedAlpha = 1;
            } else {
                instance.alpha = instance.bufferedAlpha = 1;
            }
    
            let volFrom = instance.openingVideo.volume.valueOf();
    
            if (!instance.skipOpening) {
                for (let vol = instance.openingVideo.volume;vol > volFrom * 0.3;vol -= volFrom / 100) {
                    instance.openingVideo.volume = vol;
                    yield new WaitForSeconds(0.05);
                }
            }
            
            if (instance.menuScreenInteractEnable) {
                const bgm = AssetManager.load<HTMLAudioElement>("Menu Screen");
                    
                instance.bgmPlayback = AudioSystem.play(bgm, {
                    "fadeIn": instance.skipOpening ? 1000 : 2000,
                    "volume": 0.15,
                    "loop": true
                });
    
                instance.bgmPlayback.onplay = () => instance.beatstart = Date.now();
            }

            for (let vol = instance.openingVideo.volume;vol > volFrom * 0;vol -= volFrom / 100) {
                instance.openingVideo.volume = vol;
                yield new WaitForSeconds(0.02);
            }
        });
    }

    private _beatOffset() {
        const jitteredDelay = 320;
        const bpmDelay = 60 * 1000 / 90;
        const beatProgression = ((Date.now() + jitteredDelay) - this.beatstart) % bpmDelay;
        const earliness = 4;
        
        this.beatOffsetAmount = Math.min(1, (beatProgression * earliness) / bpmDelay);
    }

    private _getBeatScale(): number {
        return LerpUtils.lerp(1, 1.02, this.beatOffsetAmount, LerpUtils.Functions.SmoothSpike);
    }

    private _gameTitle() {
        this.ctx.save();
        this.ctx.beginPath();

        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillStyle = "#000000";
        this.ctx.font = "70px Metropolis";
        this.ctx.globalAlpha = this.alpha;
        this.ctx.translate(this.canvas.width / 2, this.canvas.height * 0.28);
        this.ctx.scale(this._getBeatScale(), this._getBeatScale());
        
        this.ctx.fillText("MenuScreen#_gameTitle()", 0, 0, this.canvas.width * 0.9);
        
        this.ctx.closePath();
        this.ctx.restore();



        this.ctx.save();
        this.ctx.beginPath();

        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillStyle = "#000000";
        this.ctx.font = "30px Metropolis";
        this.ctx.globalAlpha = this.alpha;
        this.ctx.translate(this.canvas.width / 2, this.canvas.height * 0.36);
        this.ctx.scale(this._getBeatScale(), this._getBeatScale());
        
        this.ctx.fillText(Translatable.text("menu.text.versioning").replace("{}", BUILD_VERSION), 0, 0, this.canvas.width * 0.9);
        
        this.ctx.closePath();
        this.ctx.restore();
    }

    private _gameButtons() {
        this.startButton.location = new Vector2(this.canvas.width / 2, this.canvas.height / 2);
        this.settingsButton.location = new Vector2(this.canvas.width / 2, this.canvas.height * 0.6);

        this.startButton.alpha = this.settingsButton.alpha = this.alpha;

        const pad = 40;

        this.bufferedStartButtonBGRectW = -this.canvas.width * .25;
        this.bufferedSettingsButtonBGRectW = -this.canvas.width * .25;

        if (this.startButton.clickableRegion.hovering) {
            this.bufferedStartButtonBGRectW = this.canvas.width * 1.25;
        }
        
        if (this.settingsButton.clickableRegion.hovering) {
            // TODO settings
            // this.bufferedSettingsButtonBGRectW = this.canvas.width * 1.25;
            this.settingsButton.cursor = "none";
            this.tooltip.text = Translatable.text("general.text.wip");
            this.tooltip.enabled = true;
        }

        this.ctx.save();
        this.ctx.beginPath();

        this.ctx.fillStyle = "#00ffff";

        const startCorner = new Vector2(0, this.startButton.location.y - pad);
        this.ctx.rect(startCorner.x, startCorner.y, this.startButtonBGRectW, pad * 2);
        this.ctx.fill();

        this.ctx.closePath();
        this.ctx.beginPath();
        
        this.ctx.fillStyle = "#ff7f00";
        
        const settingsCorner = new Vector2(0, this.settingsButton.location.y - pad);
        this.ctx.rect(settingsCorner.x, settingsCorner.y, this.settingsButtonBGRectW, pad * 2);
        this.ctx.fill();

        this.ctx.closePath();
        this.ctx.restore();

        this.startButton.loop(this.ctx, this);
        this.settingsButton.loop(this.ctx, this);
    }
    
    private _backgroundComponents() {
        this.ctx.save();
        this.ctx.beginPath();
        
        this.ctx.fillStyle = "#ffffff";
        this.ctx.globalAlpha = this.alpha;
        
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