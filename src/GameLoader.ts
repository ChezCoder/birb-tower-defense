import { AssetDirectoryParser } from "./AssetDirectoryParser";
import { AssetManager } from "./AssetManager";
import { Console } from "./Console";
import Game, { GameConstructor } from "./Game";

export namespace GameLoader {
    // TODO create a json file or some sort of config to store this
    export const BASE_DIRECTORY = "/assets/game/directory.xml";

    export let game: Game | null;
    let GameClass: GameConstructor;
    let timestamp: number;

    const $loadTitle = $<HTMLSpanElement>("#title");
    const $loadPercent = $<HTMLSpanElement>("#percent");

    export function load(gameClass: GameConstructor) {
        GameClass = gameClass;

        Console.log("GameLoader: Preparing to load new game");

        timestamp = Date.now();

        $("#menu").removeClass("d-flex");
        $("#menu").hide();
        $("main").show();

        Console.log(`GameLoader: Asset base directory is '${BASE_DIRECTORY}'`);

        loadAssets(BASE_DIRECTORY).catch(e => {
            Console.error("GameLoader: Failed to load some assets");
            if (e.length) {
                (<string[]> e).forEach(err => Console.error("GameLoader: " + err));
            }

            // $("#menu").addClass("d-flex");
            // $loadTitle.text("Error");
            // $loadPercent.text("Loading aborted");
        }).finally(() => {
            Console.log(`GameLoader: Finished loading! (took ${(Date.now() - timestamp) / 1000}s)`);
            startGame();
        });
    }

    export async function loadAssets(baseDirectory: string) {
        let error: any[] = [];
        
        $loadTitle.text("Calculating size...");
        Console.log("GameLoader: Calculating size...");
        
        try {
            const assets = await AssetDirectoryParser.loadDirectories(baseDirectory);
            let assetsLoaded = 0;

            Console.log(`GameLoader: Found ${assets.length} assets to load`);
            
            $loadTitle.text("Loading assets...");

            for (const asset of assets) {
                $loadPercent.text(`${Math.floor((assetsLoaded / assets.length) * 100)}%`);
                try {
                    await AssetManager.save(asset.type, asset.name, asset.path);
                } catch (e) {
                    Console.error(`GameLoader: ${asset.name}: Failed to save new '${asset.type}' asset`);
                }
                assetsLoaded++;
            }

            $loadPercent.text(`100%`);
            $loadTitle.text("Loading game...");
        } catch (e) {
            error.push(e);
        }

        if (error.length !== 0) throw error;
    }

    async function startGame() {
        $(".loader").hide();
        Console.log(`GameLoader: Launching new '${GameClass.name}' game`);
        try {
            game = new GameClass($<HTMLCanvasElement>("#game")[0]);
            game.start();
        } catch (err) {
            if (err instanceof Error) {
                Console.throwError(err);
            } else {
                Console.error(err);
            }
        }
    }

    export function stopGame() {
        if (game) {
            Console.log(`GameLoader: Stopping and destroying '${GameClass.name}' game`);
            game.stop();
            game = null;
        }
    }

    export function toggleDebugLog() {
        const log = <HTMLDivElement> document.getElementById("log")!;
        Console._scrollToBottom();
        log.style.display = (!log.style.display || log.style.display == "none") ? "flex" : "none";
    }
}