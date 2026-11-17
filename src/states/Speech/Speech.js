/**
 * Speech holds whether text will be spoken and performs browser TTS.
 * There is a single instance, owned by SpeechInterface.
 */
export default class Speech {
    constructor() {
        this.enabled = true;
        this.rate = 1.0;
        this.pendingSpeak = null;
    }

    speak(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = this.rate;
        console.log("ready to speak", text)
        window.speechSynthesis.speak(utterance);
        console.log("spoken")
    }

    /**
     * Stops current speech, then speaks text. A short delay avoids a browser
     * bug where cancel() also drops an utterance queued in the same turn.
     */
    interruptAndSpeak(text) {
        this.cancel();
        if (typeof window === "undefined" || !window.speechSynthesis) {
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = this.rate;
        this.pendingSpeak = window.setTimeout(() => {
            this.pendingSpeak = null;
            console.log("ready to speak", text);
            window.speechSynthesis.speak(utterance);
            console.log("spoken");
        }, 50);
    }

    /**
     * Stops the current speech and clears queued speech.
     * @author Henry Tavares
     */
    cancel() {
        if (this.pendingSpeak) {
            window.clearTimeout(this.pendingSpeak);
            this.pendingSpeak = null;
        }
        if (typeof window !== "undefined" && window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
    }
}
