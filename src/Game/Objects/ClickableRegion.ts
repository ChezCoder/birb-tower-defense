import Game from "../../lib/BaseGame";
import Loopable from "../../lib/Loopable";
import { Dimension2, MathUtils, Vector2 } from "../../lib/Util";

export default class ClickableRegion extends Loopable {
    public location: Vector2;
    public dimensions: Dimension2;
    public enabled: boolean;

    public onhover: () => void = () => {};
    public onclick: () => void = () => {};

    public hovering: boolean = false;
    public clicking: boolean = false;

    constructor(location: Vector2 = new Vector2(0, 0), dimensions: Dimension2 = { width: 0, height: 0 }) {
        super();
        this.location = location;
        this.dimensions = dimensions;
        this.enabled = true;
    }

    public loop(_ctx: CanvasRenderingContext2D, game: Game) {
        this.hovering = false;
        this.clicking = false;

        if (!this.enabled) return;
        
        if (MathUtils.isPointInRectangle(game.input.mousePos, this.location, this.dimensions.width, this.dimensions.height)) {
            this.hovering = true;
            this.onhover.apply(this);

            if (game.input.mouseClick) {
                this.onclick.apply(this)
                this.clicking = true;
            }
        }
    }
}