import Game from "../../lib/BaseGame";
// import { MathUtils, Vector2 } from "../Util";
// import CubicBezierCurve from "./Objects/BezierCurve";
// import ControlHandle from "./Objects/ControlHandle";

export default class MapEditor extends Game {
//     private bezier = new CubicBezierCurve(true);

//     private inc = 0;

//     public setup() {
//         this.bezier.addControlHandle(new ControlHandle(new Vector2(200, 200)));
//         this.bezier.addControlHandle(new ControlHandle(new Vector2(500, 300)));
//         this.bezier.addControlHandle(new ControlHandle(new Vector2(350, 400)));
//         this.bezier.addControlHandle(new ControlHandle(new Vector2(500, 500)));

//         this.renderObjects.push(this.bezier);
//     }
    
//     protected loop() {
//         this.ctx.beginPath();
//         this.ctx.fillStyle = "black";
//         this.ctx.font = "30px Arial";
//         this.ctx.fillText(`Arc Length: ${this.bezier.arclength}`, 10, 30);
//         this.ctx.closePath();

//         const balls = 50;

//         for (let i = 0;i < balls;i++) {
//             const dist = MathUtils.wrapClamp(i * this.bezier.arclength / balls + this.inc, 0, this.bezier.arclength);
//             const vec = this.bezier.tPos(this.bezier.getT(dist));

//             this.ctx.beginPath();
//             this.ctx.fillStyle = "#ff0000";
//             this.ctx.arc(vec.x, vec.y, 7, 0, Math.PI * 2);
//             this.ctx.fill();
//             this.ctx.closePath();
//         }
//         this.inc++;
//     }
}