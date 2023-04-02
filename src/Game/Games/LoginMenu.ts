import { Console } from "../../Console";
import { GameLoader } from "../../GameLoader";
import Game from "../../lib/BaseGame";
import { Routine, WaitFor, WaitForSeconds } from "../../lib/Scheduler";
import { Dimension2, Force, LerpUtils, MathUtils, Random, TextUtils, Vector2, Angle, SimpleVector2 } from "../../lib/Util";
import { Saves } from "../../SaveManager";
import { TextInputManager } from "../../TextInputManager";
import ClickableRegion from "../Objects/ClickableRegion";

interface Floater {
    type: "square" | "circle" | "triangle";
    pos: Vector2;
    size: number;
    vel: Force;
    ang: number;
    angm: number;
}

export default class LoginMenu extends Game {
    private hasUser: boolean = false;

    private dimensions: Dimension2 = { width: 500, height: 300 };
    private text: string = "";
    private midButton: string = "";
    private usernameInput: TextInputManager = new TextInputManager("username", true);

    public setupButtonClickableRegion = new ClickableRegion();
    public signinButtonClickableRegion = new ClickableRegion();
    
    private scale: number = 0;
    private bufferedScale: number = 0;
    private alpha: number = 0;
    private bufferedAlpha: number = 0;
    private subText: string = "";
    private subTextAlpha: number = 0;
    private bufferedSubTextAlpha: number = 0;
    private buttonAlpha: number = 0;
    private bufferedButtonAlpha: number = 0;
    private signinButtonAlpha: number = 0;
    private bufferedSigninButtonAlpha: number = 0;
    private y: number = 0;
    private bufferedY: number = 0;
    private textY: number = 0;
    private bufferedTextY: number = 0;

    private floaters: Floater[] = [];
    
    private rate: number = 0.02;



    public setup(): void {
        this.scale = 0.75;
        this.bufferedScale = 1;
        
        this.alpha = 0;
        this.bufferedAlpha = 1;

        this.buttonAlpha = 0;
        this.bufferedButtonAlpha = 0;

        this.signinButtonAlpha = 0;
        this.bufferedSigninButtonAlpha = 0;
        
        this.y = this.canvas.height;
        this.bufferedY = 0;
        
        this.textY = 0;
        this.bufferedTextY = 0;

        this.usernameInput.maxlen = 20;
        this.usernameInput.styles.color = "white";
        this.usernameInput.styles.display = "none";
        this.usernameInput.styles.fontSize = "40px";
        this.usernameInput.styles.textAlign = "center";
        this.usernameInput.styles.fontWeight = "lighter";
        this.usernameInput.styles.fontFamily = "Metropolis";
        this.usernameInput._element.placeholder = "Username...";

        this.setupButtonClickableRegion.enabled = false;
        this.signinButtonClickableRegion.enabled = false;


        
        Saves.load();

        const user = Saves.getUser();

        if (user) {
            const greetings = [
                "Welcome back",
                "Hello again",
                "Hi again",
                "Hows it going",
                "Great to see you",
                "Greetings"
            ];
            this.midButton = "Log In";
            this.text = Random.sample(greetings)[0];
            this.hasUser = true;
            this.subText = user.name;
            Console.log(`LoginMenu: User data found: ${user.name}, skipping user setup`);
        } else {
            const greetings = [
                "Welcome!",
                "Hello there!",
                "Let's get started!",
                "Nice to meet you!",
                "Hi there!"
            ];
            this.midButton = "Setup";
            this.text = Random.sample(greetings)[0];
            Console.log("LoginMenu: No user data found, starting user setup");
        }

        const instance = this;

        Routine.startTask(function*() {
            yield new WaitForSeconds(0.5);
            
            if (instance.hasUser) {
                instance.bufferedTextY = -80;
                instance.bufferedSubTextAlpha = 1;
            } else {
                instance.bufferedTextY = -60;
            }

            yield new WaitForSeconds(1);

            instance.bufferedButtonAlpha = 1;
            instance.setupButtonClickableRegion.enabled = true;
        });

        this.setupButtonClickableRegion.onclick = () => {
            this.setupButtonClickableRegion.enabled = false;

            if (this.hasUser) {
                this._endgameSequence();
            } else {
                this.bufferedButtonAlpha = 0;
                
                setTimeout(() => {
                    this.signinButtonClickableRegion.enabled = true;
                    this.usernameInput.styles.display = "block";
                    this.usernameInput._element.focus();
                }, 1500);
            }
        }

        this.signinButtonClickableRegion.onclick = () => {
            this.signinButtonClickableRegion.enabled = false;
            this.bufferedSigninButtonAlpha = 0;
            this.usernameInput.disabled = true;

            Console.log(`LoginMenu: Saving new user data`);
            Saves.setUser(this.usernameInput.value.trim()); // FIXME
            Saves.save();

            this._endgameSequence();
        }

        for (let i = 0;i < this.canvas.width / 100 * 2;i++) {
            const rx = Math.random() * this.canvas.width;
            const ry = Math.random() * this.canvas.height;
            const s = Random.random(40, 20);

            this.floaters.push({
                "type": Random.sample<"square" | "circle" | "triangle">(["square", "circle", "triangle"])[0],
                "pos": new Vector2(rx, ry),
                "size": s,
                "vel": new Force(Math.random() * Math.PI * 2, 1),
                "angm": Random.random(Angle.toRadians(1), Angle.toRadians(0.1), false) * (Random.random() ? -1 : 1),
                "ang": Math.PI * 4 * Math.random()
            });
        }

        this.renderObjects.push(this.setupButtonClickableRegion);
        this.renderObjects.push(this.signinButtonClickableRegion);
    }

    public loop(): void {
        this._backgroundGrad();
        this._floaters();
        this._modalRect();
        this._modalButtons();
        this._modalText();
        this._modalInputs();

        this.y = LerpUtils.lerp(this.y, this.bufferedY, this.rate * 4);
        this.textY = LerpUtils.lerp(this.textY, this.bufferedTextY, this.rate * 2);
        this.scale = LerpUtils.lerp(this.scale, this.bufferedScale, this.rate * 2);
        this.alpha = LerpUtils.lerp(this.alpha, this.bufferedAlpha, this.rate);
        this.subTextAlpha = LerpUtils.lerp(this.subTextAlpha, this.bufferedSubTextAlpha, this.rate);
        this.buttonAlpha = LerpUtils.lerp(this.buttonAlpha, this.bufferedButtonAlpha, this.rate * (this.setupButtonClickableRegion.enabled ? 1 : 4));
        this.signinButtonAlpha = LerpUtils.lerp(this.signinButtonAlpha, this.bufferedSigninButtonAlpha, this.rate * 4);
    }

    private _floaters() {
        this.floaters.forEach(floater => {
            this.ctx.save();
            this.ctx.beginPath();

            this.ctx.strokeStyle = "#7f7f7f40";
            this.ctx.lineWidth = 5;
            this.ctx.globalAlpha = this.alpha;

            this.ctx.translate(floater.pos.x, floater.pos.y);
            this.ctx.rotate(floater.ang);

            switch (floater.type) {
                case "circle":
                    this.ctx.arc(0, 0, floater.size / 2, 0, Math.PI * 2);
                    break;
                case "square":
                    this.ctx.roundRect(-floater.size / 2, -floater.size / 2, floater.size, floater.size, 5);
                    break;
                case "triangle":
                    const m = floater.size / 2;
                    this.ctx.moveTo(0, -m);
                    this.ctx.lineTo(m * Math.sin(Angle.toRadians(120)), -m * Math.cos(Angle.toRadians(120)));
                    this.ctx.lineTo(m * Math.sin(Angle.toRadians(240)), -m * Math.cos(Angle.toRadians(240)));
                    break;
            }
            
            this.ctx.closePath();

            this.ctx.stroke();
            
            this.ctx.restore();

            floater.ang += floater.angm;

            const nextLoc = Vector2.addForce(floater.pos, floater.vel);
            const offPageCorner = new Vector2(this.canvas.width * -0.25, this.canvas.height * -0.25);

            if (MathUtils.isPointInRectangle(nextLoc, offPageCorner, this.canvas.width * 1.5, this.canvas.height * 1.5)) {
                floater.pos = nextLoc;
            } else {
                const newAngle = new Vector2(this.canvas.width / 2, this.canvas.height / 2).toForce(floater.pos).degrees;
                floater.vel.degrees = newAngle + Random.random(40, -40)
                floater.pos.addForce(floater.vel);
            }
        });
    }

    private _backgroundGrad() {
        this.ctx.save();
        this.ctx.beginPath();

        const grad = this.ctx.createLinearGradient(0, this.canvas.height * -0.4, this.canvas.width, this.canvas.height * 1.4);
        grad.addColorStop(0, "#0b70dc");
        grad.addColorStop(0.45, "#2d1164");
        grad.addColorStop(0.55, "#2d1164");
        grad.addColorStop(1, "#d82747");

        this.ctx.globalAlpha = this.alpha;
        this.ctx.fillStyle = grad;
        this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fill();

        this.ctx.closePath();
        this.ctx.restore();
    }

    private _modalText(): void {
        this.ctx.save();
        this.ctx.beginPath();
        
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.font = "Bold " + (50 * this.scale) + "px Metropolis";
        this.ctx.globalAlpha = this.alpha;
        this.ctx.fillStyle = "#ffffff";

        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2 + this.y + this.textY);
        this.ctx.fillText(this.text, 0, 0);
        
        this.ctx.closePath();
        this.ctx.restore();


        

        this.ctx.save();
        this.ctx.beginPath();
        
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.font = "Bold " + (30 * this.scale) + "px Metropolis";
        this.ctx.globalAlpha = Math.min(this.alpha, this.subTextAlpha);
        this.ctx.fillStyle = "#ffffff";

        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2 + this.y - 10);
        this.ctx.fillText(this.subText, 0, 0, this.dimensions.width * this.scale * 0.9);
        
        this.ctx.closePath();
        this.ctx.restore();
    }

    private _modalButtons(): void {
        const Y_OFFSET = 70;

        // TODO
        // this.ctx.save();
        // this.ctx.beginPath();
        // this.ctx.globalAlpha = Math.min(this.alpha, this.buttonAlpha);
        // this.ctx.strokeStyle = "#4e4e50";
        // this.ctx.fillStyle = "#00000000";
        // this.ctx.lineWidth = 3;
        
        // const boxPad = 10;

        // this.ctx.roundRect(textPosTL.x - boxPad, textPosTL.y - boxPad, tdims.width + 2 * boxPad, tdims.height + 2 * boxPad, 10);
        // this.ctx.fill();
        // this.ctx.stroke();
        
        // this.ctx.closePath();
        // this.ctx.restore();
        
        
        
        this.ctx.save();
        this.ctx.beginPath();

        this.ctx.globalAlpha = Math.min(this.alpha, this.buttonAlpha);
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.font = "40px Metropolis";
        this.ctx.fillStyle = "#ffffff";

        if (this.setupButtonClickableRegion.hovering) {
            this.ctx.fillStyle = "#cfcfcf";
            this.cursor = "pointer";
        }

        const tmetrics = TextUtils.measureTextMetrics(this.midButton, "40px Metropolis");
        const tdims = TextUtils.metricsToDim2(tmetrics);
        const textPosTL = new Vector2(this.canvas.width / 2 - tdims.width / 2, this.canvas.height / 2 - tdims.height / 2 + Y_OFFSET);

        this.setupButtonClickableRegion.location = textPosTL;
        this.setupButtonClickableRegion.dimensions = tdims;
        
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2 + Y_OFFSET);
        this.ctx.fillText(this.midButton, 0, 0);

        this.ctx.closePath();
        this.ctx.restore();



        const SIGNIN_Y_OFFSET = 80;
        this.ctx.save();
        this.ctx.beginPath();

        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.font = "30px Metropolis";
        this.ctx.globalAlpha = Math.min(this.alpha, this.signinButtonAlpha);
        this.ctx.fillStyle = "#ffffff";

        const signinTMetrics = TextUtils.measureTextMetrics("Sign In", "30px Metropolis");
        const signinDims = TextUtils.metricsToDim2(signinTMetrics);
        const signinTextPosTL = new Vector2(this.canvas.width / 2 - signinDims.width / 2, this.canvas.height / 2 - signinDims.height / 2 + SIGNIN_Y_OFFSET);
        const validUsername = this.usernameInput.value.trim().length > 0;

        this.signinButtonClickableRegion.location = signinTextPosTL;
        this.signinButtonClickableRegion.dimensions = signinDims;
        
        if (!this.usernameInput.disabled) this.bufferedSigninButtonAlpha = validUsername ? 1 : 0;

        if (this.signinButtonClickableRegion.hovering) {
            this.ctx.fillStyle = "#c0c0c0";
            this.cursor = validUsername ? "pointer" : "default";
        }

        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2 + SIGNIN_Y_OFFSET);
        this.ctx.strokeText("Sign In", 0, 0);
        this.ctx.fillText("Sign In", 0, 0);
        
        this.ctx.closePath();
        this.ctx.restore();
    }

    private _modalRect(): void {
        const cornerY = -this.dimensions.height / 2 * this.scale;
        const cornerX = -this.dimensions.width / 2 * this.scale;
        this.ctx.save();
        this.ctx.beginPath();

        this.ctx.strokeStyle = "#363740";
        this.ctx.lineWidth = 5;
        this.ctx.fillStyle = "#2d2e35";
        this.ctx.globalAlpha = this.alpha;

        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2 + this.y);
        this.ctx.roundRect(cornerX, cornerY, this.dimensions.width * this.scale, this.dimensions.height * this.scale, 10);
        
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.restore();
    }

    private _modalInputs() {
        this.usernameInput.styles.opacity = `${this.alpha}`;
        this.usernameInput.location = new Vector2(this.canvas.width / 2, this.canvas.height / 2 + 20);
    }

    private _endgameSequence() {
        this.bufferedAlpha = 0;
        this.rate *= 1.5;

        const slowdownTimer = setInterval(() => {
            this.floaters.forEach(floater => {
                floater.vel.magnitude *= 0.9;
                floater.angm *= 0.9;
            });
        }, 50);

        setTimeout(() => {
            clearInterval(slowdownTimer);
            TextInputManager.discard(this.usernameInput.id);
            GameLoader.endGame();
        }, 2500);
    }
}