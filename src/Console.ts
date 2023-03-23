import { GameLoader } from "./GameLoader";

type LogGenerator = (msg: any) => void;

export namespace Console {
    const element: HTMLDivElement = <HTMLDivElement> document.getElementById("log-entries")!;
    const _template: string = `<div class="log-entry"><span class="log-time">{time}</span><span class="log-{type}">{msg}</span></div>`;
    
    export const log: LogGenerator = createLogGenerator("log");
    export const warn: LogGenerator = createLogGenerator("warn");
    export const error: LogGenerator = createLogGenerator("error");
    
    export const throwError = (err: Error | ErrorConstructor, msg: string = "") => {
        console.log(err instanceof Error);
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

    window.addEventListener("keypress", ev => ev.key == "`" ? GameLoader.toggleDebugLog() : null);
    
    (<any>window)._GameConsole = {
        "log": log,
        "warn": warn,
        "error": error,
        "clear": clear
    };
}