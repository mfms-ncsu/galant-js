import Speech from "states/Speech/Speech";
import { getDefaultStore } from "jotai";
import { speechEnabledAtom, speechSpeedAtom } from "states/_atoms/atoms";

/**
 * SpeechInterface is the API for enabling, disabling, and speaking text.
 */

const speech = new Speech();
const store = getDefaultStore();

// Follow the user's setting without saving temporary changes made during revert.
store.sub(speechEnabledAtom, () => setSpeech(store.get(speechEnabledAtom)));
setSpeech(store.get(speechEnabledAtom));
store.sub(speechSpeedAtom, () => setRate(store.get(speechSpeedAtom)));
setRate(store.get(speechSpeedAtom));

/**
 * Controls whether text will be spoken
 */
function setSpeech(toSpeak) {
    console.log(`-> setSpeech, spokenText = ${speech.enabled}, toSpeak = ${toSpeak}`)
    speech.enabled = toSpeak;
    if (!toSpeak) cancelSpeech();
}

function spoken() {
    return speech.enabled;
}

/**
 * Sets the speech speed from 1x to 4.5x.
 */
function setRate(rate) {
    speech.rate = rate;
}

function speakText(text) {
    if (spoken()) speech.speak(text);
}

/**
 * Cancels current speech and starts new text when narration is enabled.
 */
function interruptAndSpeak(text) {
    if (spoken()) speech.interruptAndSpeak(text);
}

/**
 * Stops speech without changing whether future text will be spoken.
 */
function cancelSpeech() {
    speech.cancel();
}

/**
 * Announces whether speech is on or off.
 */
function announceSpeechState() {
    cancelSpeech();
    if (spoken()) {
        speech.speak("Speech on");
    } else {
        speech.speak("Speech off");
    }
}

/**
 * Announces GSK mode even when narration is off.
 */
function announceGskState(enabled) {
    cancelSpeech();
    if (enabled) {
        speech.speak("GSK mode on");
    } else {
        speech.speak("GSK mode off");
    }
}

const SpeechInterface = {
    spoken,
    setSpeech,
    speakText,
    interruptAndSpeak,
    cancelSpeech,
    announceSpeechState,
    announceGskState
};

export default SpeechInterface;
