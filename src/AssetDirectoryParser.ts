import { Console } from "./Console"

export interface UnloadedAsset {
    type: "img" | "video" | "audio"
    name: string
    path: string
    dims?: {
        width: number
        height: number
    }
}

export namespace AssetDirectoryParser {
    export async function loadDirectories(xmlPath: string): Promise<UnloadedAsset[]> {
        return new Promise((res, rej) => {
            const request = new XMLHttpRequest();
            let url: URL;
            let assets: UnloadedAsset[] = [];
            let attempts = 1;
    
            request.addEventListener("readystatechange", async () => {
                if (request.readyState == 4) {
                    if (request.status < 200 && request.status > 299) {
                        if (attempts == 5) {
                            Console.error(`AssetDirectoryParser: Failed to load directory at '${xmlPath}'`);
                            return rej(request);
                        }

                        attempts++;

                        setTimeout(() => {
                            request.open("GET", url.href);
                            request.send();
                        }, 500);

                        return;
                    }
                    
                    const xmlDoc = request.responseXML;
                    
                    if (!xmlDoc) {
                        Console.error(`AssetDirectoryParser: Could not parse XML at '${xmlPath}'`);
                        return rej("Invalid XML found at " + xmlPath);
                    }
    
                    for (const asset of xmlDoc.querySelectorAll("assets > asset")) {
                        const type = asset.getElementsByTagName("type")[0].textContent!;
                        const name = asset.getElementsByTagName("name")[0].textContent!;
                        try {
                            const assetPath = new URL(asset.getElementsByTagName("path")[0].textContent!, url).href;
                
                            switch (type) {
                                case "directory":
                                    assets.push(...await loadDirectories(assetPath));
                                    break;
                                case "image":
                                case "video":
                                case "audio":
                                    assets.push({
                                        "name": name,
                                        "type": type == "image" ? "img" : type,
                                        "path": assetPath
                                    });
                                    break;
                                default:
                                    Console.error(`AssetDirectoryParser: ${xmlPath}: Unrecognized asset type "${type}"`);
                                    continue;
                            }
                        } catch (e) {
                            rej(e)
                            continue;
                        }
                    }
                    res(assets);
                }
            });
    
            try {
                url = new URL(xmlPath);
            } catch {
                url = new URL(xmlPath, document.baseURI);
            }
    
            Console.log(`AssetDirectoryParser: Loading directory '${url.href}'`);

            request.open("GET", url.href);
            request.send();
        });
    }
}