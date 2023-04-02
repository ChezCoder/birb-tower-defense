import Game from "../../lib/BaseGame";
import Loopable from "../../lib/Loopable";
import { TextUtils } from "../../lib/Util";

/**
 * At most one tooltip class per game object
 */
export default class Tooltip extends Loopable {
    public enabled: boolean = false;
    public text: string = "Tooltip";
    public maxwidth: number = 0;

    constructor(maxwidth: number) {
        super();
        this.maxwidth = maxwidth;
    }

    public loop(ctx: CanvasRenderingContext2D, game: Game) {
        if (this.enabled) {
            const pad = 10;
            const linespace = 5;
            const font = "15px Metropolis";
            const pos = game.input.mousePos.clone();
            const offset = 5;
            const texts = TextUtils.wrapText(this.text, this.maxwidth, font);
            
            let widest = 0;
            let height = 0;
            
            let renderQueue: [string, number, number][] = [];
            
            for (let i = 0;i < texts.length;i++) {
                const line = texts[i];
                const tm = TextUtils.measureTextMetrics(line, font);
                const tdims = TextUtils.metricsToDim2(tm);
                
                if (tdims.width > widest) widest = tdims.width;
                if (tdims.height > height) height = tdims.height;
                
                renderQueue.push([line, pos.x + pad + offset, pos.y + pad + ((tdims.height + linespace * Math.min(1, i)) * i) + offset]);
            }
            
            ctx.save();
            ctx.beginPath();

            ctx.fillStyle = "#222222C0";
            
            ctx.roundRect(pos.x + offset, pos.y + offset, widest + pad * 2, texts.length * height + (texts.length - 1) * linespace + pad * 2, 5);
            ctx.fill();

            ctx.closePath();
            ctx.beginPath();

            ctx.font = font;
            ctx.fillStyle = "#ffffff";
            ctx.textBaseline = "top";

            for (const renderItem of renderQueue) {
                ctx.fillText(renderItem[0], renderItem[1], renderItem[2]);
            }

            ctx.closePath();
            ctx.restore();
        }

        this.enabled = false;
    }
}