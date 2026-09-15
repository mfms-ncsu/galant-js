/**
 * Speech holds whether text will be spoken and performs browser TTS.
 * There is a single instance, owned by SpeechInterface.
 */
export default class Speech {
    constructor() {
        this.enabled = true;
    }

    speak(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        console.log("ready to speak", text)
        window.speechSynthesis.speak(utterance);
        console.log("spoken")
    }
}
