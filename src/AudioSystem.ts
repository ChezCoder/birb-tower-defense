
interface PlaybackSettings {
    fadeIn?: number;
    fadeOut?: number;
    
    start?: number;
    end?: number;

    volume?: number;
    speed?: number;
    preservePitch?: boolean;

    loop?: boolean;
}

export interface PlaybackHook {
    onplay: (audio: HTMLAudioElement) => void;
    onend: (audio: HTMLAudioElement) => void;

    readonly stop: () => void;

    readonly maxVolume: number;
    readonly audio: HTMLAudioElement;
}

class AudPlaybackHook implements PlaybackHook {
    public onplay: (audio: HTMLAudioElement) => void = () => {};
    public onend: (audio: HTMLAudioElement) => void = () => {};
    
    readonly stop: () => void;

    public readonly maxVolume: number;
    public readonly audio: HTMLAudioElement;

    constructor(audio: HTMLAudioElement, maxVolume: number, stopAction: () => void) {
        this.audio = audio;
        this.maxVolume = maxVolume;
        this.stop = stopAction;
    }
}

export namespace AudioSystem {
    export const audCtx = new AudioContext();

    export function play(source: HTMLAudioElement, settings: PlaybackSettings): AudPlaybackHook {
        const loop = settings.loop || false;
        const audio = <HTMLAudioElement> source.cloneNode(true);

        const maxVolume = settings.volume || 1;
        const start = settings.start || 0;
        const duration = settings.end || (source.duration * 1000);
        const fadeInDuration = (settings.fadeIn || 0);
        const fadeOutDuration = (settings.fadeOut || 0);
        
        let tickingInterval = 0;
        
        const playbackHook = new AudPlaybackHook(audio, maxVolume, () => {
            clearInterval(tickingInterval);
            audio.pause();
        });

        
        // BUG playback rate does not go intoo calculations

        audio.playbackRate = settings.speed || 1;
        audio.preservesPitch = !!settings.preservePitch;

        let fadeInEndTime = 0, fadeOutStartTime = 0, audioEndTime = 0;

        const setupAudioSettings = () => {
            audio.currentTime = start;
            audio.volume = (fadeInDuration == 0) ? maxVolume : 0;

            fadeInEndTime = Date.now() + (settings.fadeIn || 0);
            fadeOutStartTime = Date.now() + duration - (settings.fadeOut || 0);
            audioEndTime = Date.now() + duration;
        }

        setupAudioSettings();
        audio.play();
        playbackHook.onplay(audio);

        tickingInterval = window.setInterval(() => {
            if (Date.now() <= audioEndTime) {
                if (fadeInDuration != 0) {
                    if (Date.now() <= fadeInEndTime) {
                        const fadeInTimeRemaining = fadeInEndTime - Date.now();
                        const progress = 1 - (fadeInTimeRemaining / fadeInDuration);
                        audio.volume = maxVolume * progress;
                    }
                }
    
                if (fadeOutDuration != 0) {
                    if (Date.now() >= fadeOutStartTime) {
                        const fadeOutTimeRemaining = audioEndTime - Date.now();
                        const progress = fadeOutTimeRemaining / fadeOutDuration;
                        audio.volume = maxVolume * progress;
                    }
                }
            } else {
                if (!loop) {
                    clearInterval(tickingInterval);
                    audio.pause();
                    playbackHook.onend(audio);
                } else {
                    setupAudioSettings();
                    audio.play();
                    playbackHook.onplay(audio);
                }
            }
        });

        return playbackHook;
    }
}