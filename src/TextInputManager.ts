import { Console } from "./Console";
import { INPUTS } from "./ElementDefinitions";
import { Vector2 } from "./lib/Util";

export class TextInputManager {
    private static readonly inputs: Map<string, TextInputManager> = new Map();
    private static readonly inputContainer = INPUTS;

    public readonly id: string;
    public readonly centered: boolean;
    public _element: HTMLInputElement;

    public location: Vector2 = new Vector2(0, 0);

    constructor(id: string, centered: boolean) {
        this.id = id;

        TextInputManager.inputs.set(id, this);
        
        this.centered = centered;
        this._element = document.createElement("input");
        this._element.style.background = "transparent";
        this._element.style.border = "none";
        this._element.style.padding = "0px";
        this._element.style.outline = "none";
        this._element.style.margin = "0px";
        this._element.autocomplete = "off";
        this._element.spellcheck = false;
        
        TextInputManager.inputContainer.appendChild(this._element);

        if (this.centered) {
            this._element.style.textAlign = "center";
            this.location = new Vector2(0, 0);
        }

        setInterval(() => {
            const c = this.centered ? " - 50%" : "";
            this.styles.transform = `translate(calc(${this.location.x}px${c}), calc(${this.location.y}px${c}))`;
        });
    }

    public get value(): string {
        return this._element.value;
    }

    public set value(value: string) {
        this._element.value = value;
    }

    public get styles(): CSSStyleDeclaration {
        return this._element.style;
    }

    public set disabled(disabled: boolean) {
        this._element.disabled = disabled;
    }

    public get disabled(): boolean {
        return !this._element || this._element.disabled;
    }

    public set maxlen(len: number) {
        this._element.maxLength = len;
    }

    public set type(type: string) {
        this._element.type = type;
    }

    public static discard(id: string) {
        if (this.has(id)) {
            this.inputs.get(id)!._element.remove();
            this.inputs.delete(id);
        }
    }

    private static has(id: string): boolean {
        if (this.inputs.has(id)) {
            return true;
        }
        Console.warn(`TextInputManager: No input found with id of '${id}'`);
        return false;
    }
}