
interface PlaybackSettings {
    fadeIn?: number
    fadeOut?: number
    
    start?: number
    end?: number

    volume?: number
    speed?: number
    preservePitch?: boolean

    loop?: boolean
}

export namespace AudioSystem {
    export function play(audio: HTMLAudioElement, settings: PlaybackSettings): Promise<void> {
        return new Promise(res => {
            const loop = settings.loop || false;

            const maxVolume = settings.volume || 1;
            const start = settings.start || 0;
            const duration = settings.end || (audio.duration * 1000);
            const fadeInDuration = (settings.fadeIn || 0);
            const fadeOutDuration = (settings.fadeOut || 0);

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
    
            const tickingInterval = setInterval(() => {
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
                        audio.currentTime = 0;
                        audio.volume = 1;
                        audio.playbackRate = 1;
                        audio.preservesPitch = false;
                        res();
                    } else {
                        setupAudioSettings();
                        audio.play();
                    }
                }
            });
        });
    }
}