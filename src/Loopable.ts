import Game from "./Game";

export default class Loopable {
    private static _i: number = 0;
    public name: string;

    constructor(name: string = `loopable${Loopable._i++}`) {
        this.name = name;
    }

    public loop(ctx: CanvasRenderingContext2D, game: Game) {
        void ctx, game;
    }
}