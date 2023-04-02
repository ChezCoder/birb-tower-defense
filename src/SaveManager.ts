import { Console } from "./Console";
import { Locale, Translatable } from "./Game/TranslatableText";

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
    id: string;
    name: string;
    timestamp: number;
    round: number;
    cash: number;
}

export interface SettingsData {
    language: Locale
}

export interface UserData {
    name: string;
    timestamp: number;
}

export interface SessionData {
    save: SaveData[];
    user: UserData | null;
    settings: SettingsData;
    lastLogin: number;
}

// Local saves ONLY
export namespace Saves {
    export const STORE_ENCODING = "binary";
    export const COMPRESSION_LEVEL = 6;
    export const SAVE_KEY = "td_saves";

    export const BROWSER_LOCALE: Locale = <Locale> navigator.language.replace("-", "_").toLowerCase();

    const DEFAULT_SETTINGS: SettingsData = {
        "language": BROWSER_LOCALE || "en_us"
    };

    export let currentSaveID: string;
    export let currentSaveData: SaveData;

    let session: SessionData = {
        save: [],
        user: null,
        settings: DEFAULT_SETTINGS,
        lastLogin: -1
    };

    let lastLogin: number = 0;

    export function getLastLogin(): number {
        return lastLogin;
    }

    export function getUser(): UserData | null {
        return session.user;
    }
    
    export function setUser(name: string) {
        session.user = {
            "name": name,
            "timestamp": Date.now()
        }
    }

    export function setSetting<T extends keyof SettingsData>(setting: T, value: SettingsData[T]) {
        session.settings[setting] = value;
    }

    export function getSetting<T extends keyof SettingsData>(setting: T): SettingsData[T] {
        return session.settings[setting] || DEFAULT_SETTINGS[setting];
    }

    export function listSaveIDs(): string[] {
        return session.save.map(save => save.id);
    }

    export function getSave(): boolean {
        if (session.save.length > 0) {
            const save = session.save.find(save => save.id == currentSaveID);
    
            if (save) {
                currentSaveData = save;
                return true;
            }
    
            currentSaveID = currentSaveData.id;
        }
        return false;
    }

    export function setSave() {
        const saveIndex = session.save.findIndex(save => save.id == currentSaveID);

        if (saveIndex) {
            session.save[saveIndex] = currentSaveData;
        } else {
            session.save.push(currentSaveData);
        }
    }

    export function createSave(saveName: string): string {
        const id = Math.floor(Math.random() * 10 ** 20).toString(26);

        session.save.push({
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
        const saveIndex = session.save.findIndex(save => save.id == id);

        if (saveIndex != -1) {
            session.save.splice(saveIndex, 1);
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
                const data = JSON.parse(Buffer.from(decompressedData).toString());

                if (data.lastLogin) session.lastLogin = data.lastLogin;
                if (data.save) session.save = data.save;
                if (data.settings) session.settings = data.settings;
                if (data.user) session.user = data.user;

                lastLogin = session.lastLogin.valueOf();
            } catch (e) {
                Console.error("SaveManager: Failed to load saves from localStorage");
            }
        }
    }

    export function save(): boolean {
        try {
            session.lastLogin = Date.now();
            
            const compressedData = brotli.compress(Buffer.from(JSON.stringify(session)), {
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