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

export interface UserData {
    name: string
    timestamp: number
}

// Local saves ONLY
export namespace Saves {
    export const STORE_ENCODING = "binary";
    export const COMPRESSION_LEVEL = 6;
    export const SAVE_KEY = "td_saves";

    export let currentSaveID: string;
    export let currentSaveData: SaveData;

    let saves: {
        save: SaveData[],
        user: UserData | null
    } = {
        save: [],
        user: null
    };

    export function getUser(): UserData | null {
        return saves.user;
    }
    
    export function setUser(name: string) {
        saves.user = {
            "name": name,
            "timestamp": Date.now()
        }
    }

    export function listSaveIDs(): string[] {
        return saves.save.map(save => save.id);
    }

    export function getSave(): boolean {
        if (saves.save.length > 0) {
            const save = saves.save.find(save => save.id == currentSaveID);
    
            if (save) {
                currentSaveData = save;
                return true;
            }
    
            currentSaveID = currentSaveData.id;
        }
        return false;
    }

    export function setSave() {
        const saveIndex = saves.save.findIndex(save => save.id == currentSaveID);

        if (saveIndex) {
            saves.save[saveIndex] = currentSaveData;
        } else {
            saves.save.push(currentSaveData);
        }
    }

    export function createSave(saveName: string): string {
        const id = Math.floor(Math.random() * 10 ** 20).toString(26);

        saves.save.push({
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
        const saveIndex = saves.save.findIndex(save => save.id == id);

        if (saveIndex != -1) {
            saves.save.splice(saveIndex, 1);
            save();
            return true;
        }
        return false;
    }

    export function load() {
        const rawSaves = window.localStorage.getItem(SAVE_KEY);

        if (rawSaves) {
            try {
                const decompressedData = brotli.decompress(Buffer.from(rawSaves, STORE_ENCODING));
                saves = JSON.parse(Buffer.from(decompressedData).toString());
            } catch (e) {
                Console.error("SaveManager: Failed to load saves from localStorage");
            }
        }
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