import { Console } from "../Console";
import { Saves } from "../SaveManager";

interface RawLocaleDefinition {
    translations: {
        [codename: string]: string
    }
}

interface LocaleDefinition extends RawLocaleDefinition {
    uiName: string
}

class LocaleLoaderHook {
    public readonly localeNames: string[];

    public onloadstart: (locale: Locale) => void = () => {};
    public onloadend: (locale: Locale) => void = () => {};
    public onerror: (error: any, locale: Locale) => void = () => {};
    public onfinish: () => void = () => {};

    constructor(localeNamess: string[]) {
        this.localeNames = localeNamess;
    }
}

export type Locale =
    "en_us" |
    "es_es" |
    "fr_fr" |
    "ja_jp" |
    "zh_cn"
    ;

export namespace Translatable {
    export const __PL_LOCALES: Locale[] = [
        "en_us",
        "es_es",
        "fr_fr",
        "ja_jp",
        "zh_cn"
    ];

    const locales: Map<Locale, LocaleDefinition> = new Map();

    function getLocale(): Locale {
        return (<any> window)._GameLocale || Saves.getSetting("language");
    }

    (<any> window)._GetLocale = getLocale;

    export function list(): Locale[] {
        return Array.from(locales.keys());
    }

    export function name(localeName: Locale): string {
        const locale = locales.get(localeName);
        if (locale) return locale.uiName;
        Console.error(`TranslatableText: Could not find locale ${localeName}`);
        return localeName;
    }

    export function text(codename: string): string {
        const locale = locales.get(getLocale());
        if (locale) {
            const translatable = locale.translations[codename];

            if (!translatable) Console.warn(`TranslatableText: Unknown codename ${codename}`);
            
            return translatable || codename;

        }
        Console.error(`TranslatableText: Could not find locale ${getLocale()}`);
        return codename;
    }

    export function loadLocales(path: string): Promise<LocaleLoaderHook> {
        return new Promise((res, rej) => {
            const localeListingPath = new URL(path, location.href);
    
            const request = new XMLHttpRequest();
            request.open("GET", localeListingPath);
            request.send();
    
            request.onreadystatechange = () => {
                if (request.readyState == 4) {
                    if (request.status == 200) {
                        try {
                            const j = JSON.parse(request.responseText);
                            const localesNames: string[] = Object.keys(j);
                            const loaderHook = new LocaleLoaderHook(localesNames);

                            res(loaderHook);

                            setTimeout(async () => {
                                for (const localeName of localesNames) {
                                    const locale: Locale = j[localeName];
    
                                    if (locale) {
                                        const path = new URL(`${locale}.json`, localeListingPath);
                                        loaderHook.onloadstart.apply(loaderHook, [ locale ]);
                                        
                                        try {
                                            await findAndLoadLangFile(locale, path.href);
                                        } catch (err) {
                                            Console.error(`TranslatableText: Failed to load and parse "${locale}"`);
                                            loaderHook.onerror.apply(loaderHook, [ err, locale ]);
                                        }
                                    } else {
                                        Console.warn(`TranslatableText: No locale defininition found for "${localeName}", skipping`);
                                    }
                                    
                                    loaderHook.onloadend.apply(loaderHook, [ locale ]);
                                }
    
                                loaderHook.onfinish.apply(loaderHook);
                            });
                        } catch (err) {
                            if (err instanceof Error) {
                                rej(Console.throwError(err, `TranslatableText: Failed to load and parse locale listing at ${localeListingPath.href}`));
                            } else {
                                Console.error(err);
                            }
                        }
                    } else {
                        Console.error(`TranslatableText: Could not load locale listing at ${localeListingPath.href}`);
                        rej(request);
                    }
                }
            }
        });
    }

    function findAndLoadLangFile(name: Locale, path: string): Promise<void> {
        return new Promise((res, rej) => {
            if (locales.has(name)) {
                Console.warn(`TranslatableText: ${name}: Locale already loaded, skipping`);
                return res();
            }

            const request = new XMLHttpRequest();
            request.open("GET", path);
            request.send();

            request.onreadystatechange = () => {
                if (request.readyState == 4) {
                    if (request.status == 200) {
                        try {
                            const j: RawLocaleDefinition = JSON.parse(request.responseText);
                            locales.set(name, {
                                "uiName": name,
                                "translations": j.translations
                            });
                            Console.log(`TranslatableText: ${name}: Loaded new lang file with ${Object.keys(j.translations).length} translations`);
                            res();
                        } catch (err) {
                            if (err instanceof Error) {
                                rej(Console.throwError(err, `TranslatableText: ${name}: Failed to load and parse definitions`));
                            } else {
                                Console.error(err);
                            }
                        }
                    } else {
                        Console.error(`TranslatableText: Could not load lang "${name}" at ${path}`);
                        rej(request);
                    }
                }
            };
        });
    }
}