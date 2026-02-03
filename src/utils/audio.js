let audioContext = null;

/**
 * Initialize Audio Context (must be called from user interaction)
 */
export function initAudioContext() {
    if (audioContext) return audioContext;

    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContext = new AudioContext();
        return audioContext;
    } catch (e) {
        console.warn('Audio Context not supported:', e);
        return null;
    }
}

/**
 * Play notification sound
 * @param {'success' | 'error' | 'info' | 'warning'} type - Sound type
 */
export function playSound(type = 'success') {
    const ctx = initAudioContext();
    if (!ctx) return;

    try {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        // Configure sound based on type
        const sounds = {
            success: { freq: 880, type: 'sine', duration: 0.15 },
            error: { freq: 220, type: 'sawtooth', duration: 0.3 },
            info: { freq: 660, type: 'sine', duration: 0.1 },
            warning: { freq: 440, type: 'triangle', duration: 0.2 },
        };

        const sound = sounds[type] || sounds.success;

        oscillator.frequency.setValueAtTime(sound.freq, ctx.currentTime);
        oscillator.type = sound.type;

        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + sound.duration);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + sound.duration);
    } catch (e) {
        console.warn('Error playing sound:', e);
    }
}

/**
 * Play double beep for important notifications
 */
export function playDoubleBeep() {
    playSound('success');
    setTimeout(() => playSound('success'), 150);
}

/**
 * Vibrate device if supported
 * @param {number | number[]} pattern - Vibration pattern
 */
export function vibrate(pattern = 200) {
    if ('vibrate' in navigator) {
        navigator.vibrate(pattern);
    }
}
/**
 * Play quiet background audio to keep AudioContext active (Wake Lock hack)
 */
let backgroundOscillator = null;

export function toggleBackgroundAudio(enable) {
    const ctx = initAudioContext();
    if (!ctx) return;

    if (enable) {
        if (backgroundOscillator) return; // Already running

        try {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.value = 10; // 10Hz (inaudible mostly)
            gain.gain.value = 0.001; // Almost silent

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            backgroundOscillator = { osc, gain };
            console.log('Background audio loop started');
        } catch (e) {
            console.warn('Failed to start background audio:', e);
        }
    } else {
        if (backgroundOscillator) {
            try {
                backgroundOscillator.osc.stop();
                backgroundOscillator.osc.disconnect();
                backgroundOscillator.gain.disconnect();
            } catch (e) { }
            backgroundOscillator = null;
            console.log('Background audio loop stopped');
        }
    }
}
