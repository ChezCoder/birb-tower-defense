import { AssetManager } from "../../AssetManager";
import Game from "../../lib/BaseGame";
import Loopable from "../../lib/Loopable";
import { Dimension2, LerpUtils, MathUtils, Vector2 } from "../../lib/Util";

export default class Button extends Loopable {
    public readonly assetName: string;
    public readonly asset: HTMLImageElement;
    public dimensions: Dimension2;
    public location: Vector2;

    public onhover: () => void = () => {};
    public onclick: () => void = () => {};

    public _lerpRate: number = 0.1;

    private _bufferedSize: number = 0;
    private _size: number = 0;

    constructor(assetName: string, location: Vector2, dimensions: Dimension2 = { "width": 100, "height": 100 }) {
        super("Button " + assetName);

        this.assetName = assetName;
        this.location = location;
        this.dimensions = dimensions;
        
        if (AssetManager.has(assetName)) {
            this.asset = AssetManager.load<HTMLImageElement>(this.assetName)!;

            if (!dimensions) {
                this.dimensions = {
                    "width": this.asset.width,
                    "height": this.asset.height,
                }
            }
        } else {
            this.asset = new Image();

            if (!dimensions) {
                this.dimensions = {
                    "width": 100,
                    "height": 100
                };
            }
        }
    }

    public loop(ctx: CanvasRenderingContext2D, game: Game): void {
        const aspectRatio = this.dimensions.width / this.dimensions.height;
        const additionalHeight = this.dimensions.height + this._size;
        const additionalWidth = additionalHeight * aspectRatio;

        ctx.beginPath();
        ctx.drawImage(this.asset, this.location.x - additionalWidth / 2, this.location.y - additionalHeight / 2, this.dimensions.width + additionalWidth, this.dimensions.height + additionalHeight);
        ctx.closePath();

        const hover = MathUtils.isPointInRectangle(game.input.mousePos, this.location, this.dimensions.width, this.dimensions.height);


        if (game.input.mouseClick) {
            if (hover) {
                this.onclick.apply(this);
            }
        }

        if (hover) {
            this._bufferedSize = this.dimensions.width * 0.1;
            this.onhover.apply(this);
        } else {
            this._bufferedSize = 0;
        }

        this._size = LerpUtils.lerp(this._size, this._bufferedSize, this._lerpRate);
    }
}