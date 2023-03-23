import { Console } from "./Console";

// import brotli from "brotli-wasm"; // TODO
const Buffer = require("buffer").Buffer;

namespace brotli {
    export function compress(data: any, _settings: any): Buffer {
        return data;
    }

    export function decompress(data: any): Buffer {
        return data;
    }
}

export interface SaveData {
    id: string
    name: string
    timestamp: number
    round: number
    cash: number
}

// Local saves ONLY
export namespace Saves {
    export const SAVE_KEY = "td_saves";
    export const STORE_ENCODING = "binary";
    export const COMPRESSION_LEVEL = 6;

    export let currentSaveID: string;
    export let currentSaveData: SaveData;
    let saves: SaveData[] = [];

    export function listSaveIDs(): string[] {
        return saves.map(save => save.id);
    }

    export function getSave(): boolean {
        const save = saves.find(save => save.id == currentSaveID);

        if (save) {
            currentSaveData = save;
            return true;
        }

        currentSaveID = currentSaveData.id;
        return false;
    }

    export function setSave() {
        const saveIndex = saves.findIndex(save => save.id == currentSaveID);

        if (saveIndex) {
            saves[saveIndex] = currentSaveData;
        } else {
            saves.push(currentSaveData);
        }
    }

    export function createSave(saveName: string): string {
        const id = Math.floor(Math.random() * 10 ** 20).toString(26);

        saves.push({
            "id": id,
            "name": saveName,
            "round": 1,
            "cash": 10,
            "timestamp": Date.now()
        });

        save();

        return id;
    }

    export function deleteSave(id: string): boolean {
        const saveIndex = saves.findIndex(save => save.id == id);

        if (saveIndex != -1) {
            saves.splice(saveIndex, 1);
            save();
            return true;
        }

        return false;
    }

    export function load(): boolean {
        const rawSaves = window.localStorage.getItem(SAVE_KEY);

        if (rawSaves) {
            try {
                const decompressedData = brotli.decompress(Buffer.from(rawSaves, STORE_ENCODING));
                saves = JSON.parse(Buffer.from(decompressedData).toString());
            } catch (e) {
                saves = [];
                Console.error("SaveManager: Failed to load saves from localStorage");
                return false;
            }
        } else {
            saves = [];
        }
        return true;
    }

    export function save(): boolean {
        try {
            const compressedData = brotli.compress(Buffer.from(JSON.stringify(saves)), {
                "mode": 1,
                "quality": 11,
                "lgwin": 22
            });
    
            window.localStorage.setItem(SAVE_KEY, Buffer.from(compressedData).toString("binary"));
        } catch (e) {
            Console.error("SaveManager: Failed to create save to localStorage");
            return false;
        }
        return true;
    }
}