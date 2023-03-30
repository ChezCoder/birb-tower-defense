import { Console } from "./Console";
import { Dimension2 } from "./lib/Util";

export namespace AssetManager {
    type HTMLVisualAssetElement = HTMLVideoElement | HTMLImageElement;
    type HTMLAssetElement = HTMLAudioElement | HTMLVisualAssetElement;

    export type AssetType = "img" | "video" | "audio";

    let assets: Map<string, HTMLAssetElement> = new Map();
    let fonts: Map<string, FontFace> = new Map();

    export async function loadFont(name: string, url: string, descriptors?: FontFaceDescriptors): Promise<void> {
        return new Promise(async (res, rej) => {
            if (!fonts.has(name)) {
                const font = new FontFace(name, `url(${url})`, descriptors);

                try {
                    await font.load();
                    Console.log(`AssetManager: Loaded new font "${name}" from ${url}`);
                } catch (e) {
                    Console.error(`AssetManager: Failed to load font "${name}"`);
                    return rej();
                }
    
                fonts.set(name, font);
            } else {
                Console.log(`AssetManager: ${name}: Font already loaded, skipping`);
            }
            res();
        });
    }

    export function getFont(key: string): FontFace | null {
        return fonts.get(key) || null;
    }

    export async function save(type: AssetType, key: string, url: string, dims: Dimension2 | null = null, force: boolean = false): Promise<void> {
        return new Promise(async (res, rej) => {
            if (force || !(assets.has(key) && assets.get(key)!.nodeName.toLowerCase() == type)) {
                const el = document.createElement(type);
                let loaded = false;

                let attempts = 1;

                while (attempts != 5) {
                    try {
                        el.src = url;
                        
                        if (dims) {
                            (el as HTMLVisualAssetElement).width = dims.width;
                            (el as HTMLVisualAssetElement).height = dims.height;
                        }

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

    export function load<EL extends HTMLAssetElement>(key: string): EL {
        if (has(key)) {
            return assets.get(key) as EL || null;
        }
        throw Console.throwError(Error, `AssetManager: ${key}: Asset could not be found`);
    }

    export function has(key: string): boolean {
        return assets.has(key);
    }
}