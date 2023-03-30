import { AssetDirectoryParser } from "./AssetDirectoryParser";
import { AssetManager } from "./AssetManager";
import { Console } from "./Console";
import { $LOADER, $MAIN, LOG } from "./ElementDefinitions";
import Game, { GameConstructor } from "./lib/BaseGame";
import { TextUtils } from "./lib/Util";

export namespace GameLoader {
    // TODO create a json file or some sort of config to store this
    export const BASE_DIRECTORY = "/assets/game/directory.xml";

    export let game: Game | null;
    let GameClass: GameConstructor;
    let timestamp: number;

    const $loadTitle = $<HTMLSpanElement>("#title");
    const $loadPercent = $<HTMLSpanElement>("#percent");

    export async function load<T extends Game>(gameClass: GameConstructor<T>, assetDirectory?: string): Promise<T> {
        return new Promise((res, rej) => {
            GameClass = gameClass;
    
            Console.log("GameLoader: Preparing to load new game");
    
            timestamp = Date.now();
    
            $("#menu").removeClass("d-flex");
            $("#menu").hide();
            $MAIN.show();
    
            Console.log(`GameLoader: Asset base directory is '${BASE_DIRECTORY}'`);
    
            loadAssets(assetDirectory || BASE_DIRECTORY).catch(e => {
                Console.error("GameLoader: Failed to load some assets");
                if (e.length) {
                    (<string[]> e).forEach(err => Console.error("GameLoader: " + err));
                }
    
                // $("#menu").addClass("d-flex");
                // $loadTitle.text("Error");
                // $loadPercent.text("Loading aborted");
            }).finally(async () => {
                Console.log(`GameLoader: Finished loading! (took ${(Date.now() - timestamp) / 1000}s)`);
                try {
                    res(<T> await startGame());
                } catch (err) {
                    rej(err);
                }
            });
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
                $loadPercent.text(`${Math.floor(((assetsLoaded + 1) / assets.length) * 100)}%`);
                try {
                    if (asset.dims)
                        await AssetManager.save(asset.type, asset.name, asset.path, asset.dims);
                    else
                        await AssetManager.save(asset.type, asset.name, asset.path);
                } catch (e) {
                    Console.error(`GameLoader: ${asset.name}: Failed to save new '${asset.type}' asset`);
                }
                assetsLoaded++;
            }
        } catch (e) {
            error.push(e);
        }

        if (error.length !== 0) throw error;
    }

    async function startGame(): Promise<Game> {
        return new Promise((res, rej) => {
            $LOADER.hide(); // TODO do not make loading screen dependent of GameLoader in the future
            Console.log(`GameLoader: Launching new '${GameClass.name}' game`);
            try {
                game = new GameClass($<HTMLCanvasElement>("#game")[0]);
                TextUtils.ctx = game.ctx;
                res(game);
                game.__start();
            } catch (err) {
                rej(err);
            }
        });
    }

    export function endGame() {
        if (game) {
            Console.log(`GameLoader: Stopping and destroying '${GameClass.name}' game`);
            game.__stop();
            game = null;
        }
    }

    export function toggleDebugLog() {
        Console._scrollToBottom();
        LOG.style.display = (!LOG.style.display || LOG.style.display == "none") ? "flex" : "none";
    }
}