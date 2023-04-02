import { ExposableConsole } from "../Console";
import { Locale } from "../Game/TranslatableText";

declare global {
    const BUILD_VERSION: string

    let LANGUAGE: Locale;
    
    interface Window {
        GameConsole: ExposableConsole
    }

    const GameConsole: ExposableConsole
}