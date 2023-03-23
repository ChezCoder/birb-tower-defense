import { Console } from "./Console";

export namespace AssetManager {
    type HTMLAssetElement = HTMLAudioElement | HTMLVideoElement | HTMLImageElement;
    export type AssetType = "img" | "video" | "audio";

    let assets: Map<string, HTMLAssetElement> = new Map();

    export function save(type: AssetType, key: string, url: string, force: boolean = false): Promise<void> {
        return new Promise(async (res, rej) => {
            if (force || !(assets.has(key) && assets.get(key)!.nodeName.toLowerCase() == type)) {
                const el = document.createElement(type);
                let loaded = false;

                let attempts = 1;

                while (attempts != 5) {
                    try {
                        el.src = url;

                        await new Promise<void>((resolve, reject) => {
                            el.onload = el.onloadeddata = () => {
                                assets.set(key, el);
                                resolve();
                                loaded = true;
                                Console.log(`AssetManager: Loaded ${type} "${key}" from ${url}`);
                            }

                            el.onerror = reject;
                        });

                        break;
                    } catch {
                        Console.warn(`AssetManager: ${key}: Attempting to load asset (Attempt ${attempts})...`);
                        attempts++;
                        await new Promise<void>(res => setTimeout(res, 500));
                    }
                }

                if (!loaded) {
                    Console.error(`AssetManager: ${key}: Could not load asset, asset timed out`);
                    rej();
                } else {
                    res();
                }
            } else {
                Console.warn(`AssetManager: ${key}: Asset already saved, skipping`);
                res();
            }
        });
    }

    export function load<EL extends HTMLAssetElement>(key: string): EL | null {
        return assets.get(key) as EL || null;
    }

    export function has(key: string): boolean {
        return assets.has(key);
    }
}