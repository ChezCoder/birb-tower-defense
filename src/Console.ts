import { LOG_ENTRIES } from "./ElementDefinitions";
import { GameLoader } from "./GameLoader";
import { Force, Vector2 } from "./lib/Util";

type LogGenerator = (msg: any) => void;

export namespace Console {
    const element: HTMLDivElement = LOG_ENTRIES;
    const _template: string = `<div class="log-entry"><span class="log-time">{time}</span><span class="log-{type}">{msg}</span></div>`;
    
    export const log: LogGenerator = createLogGenerator("log");
    export const warn: LogGenerator = createLogGenerator("warn");
    export const error: LogGenerator = createLogGenerator("error");
    
    export const throwError = (err: Error | ErrorConstructor, msg: string = "") => {
        if (err instanceof Error) {
            error(err.message);
            return err;
        } else {
            try {
                const e = new err(msg);
    
                if (e.message) {
                    error(e.message)
                } else {
                    error(e.name);
                }
    
                return e;
            } catch {
                return new Error(String(err));
            }
        }
    }

    export const clear = () => element.innerHTML = "";

    export function _scrollToBottom() {
        element.scrollTop = element.scrollHeight;
    }

    function createLogGenerator(type: "log" | "warn" | "error"): LogGenerator {
        return function(msg: any) {
            const safeMsg = String(msg).replace(/\&/g, "&amp;").replace(/\</g, "&lt;").replace(/\>/g, "&gt;");
            const timestamp = new Date().toLocaleTimeString("en-us", { "hour12": false });
            const html = _template.replace("{type}", type).replace("{msg}", safeMsg).replace("{time}", timestamp);
            element.innerHTML += html;

            if (element.children.length > 0) {
                const s = element.scrollHeight - element.scrollTop - element.clientHeight

                if (s <= 40) _scrollToBottom();
            }
        };
    }

    (<any>window)._GameConsole = {
        "log": log,
        "warn": warn,
        "error": error,
        "clear": clear
    };

    export function initialize() {
        const $DRAGGABLE = $("#log-draggable");
        const $LOG = $("#log");
        
        let location: Vector2 = new Vector2(window.innerWidth / 2, window.innerHeight / 2);
        let offset: Force = new Force(0, 0);
        let dragging = false;
        
        $DRAGGABLE.on("mousedown", ev => {
            offset = location.toForce(new Vector2(ev.clientX, ev.clientY));
            dragging = true
        });

        $(window).on("keypress", ev => {
            (ev.key == "`" ? GameLoader.toggleDebugLog() : null);
            dragging = false;
            moveLogTo(location);
        });

        $(window).on("mouseup", () => dragging = false);
    
        $(window).on("mousemove", ev => {
            if (dragging) {
                const newloc = new Vector2(ev.clientX, ev.clientY)
                newloc.addForce(offset);
                location = newloc;
                moveLogTo(location);
            }
        });
    
        function moveLogTo(location: Vector2) {
            const w = $LOG[0].clientWidth;
            const h = $LOG[0].clientHeight;

            $LOG[0].style.left = `${location.x - w / 2}px`;
            $LOG[0].style.top = `${location.y - h / 2}px`;
        }
    }
}