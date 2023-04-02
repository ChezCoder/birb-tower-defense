import { ExposableConsole } from "../Console";

declare global {
    const BUILD_VERSION: string
    
    interface Window {
        GameConsole: ExposableConsole
    }

    const GameConsole: ExposableConsole
}