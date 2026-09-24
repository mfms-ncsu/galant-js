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
 * Sets the speech rate multiplier (0.25–2 in 0.25 steps from the popover).
 */
function setRate(rate) {
    speech.rate = rate;
}

function speakText(text) {
    if (spoken()) speech.speak(text);
}

/**
 * Stops speech without changing whether future text will be spoken.
 */
function cancelSpeech() {
    speech.cancel();
}

/**
 * Announces the current setting, including when speech is turned off.
 */
function announceSpeechState() {
    cancelSpeech();
    speech.speak(spoken() ? "Speech on" : "Speech off");
}

const SpeechInterface = {
    spoken,
    setSpeech,
    speakText,
    cancelSpeech,
    announceSpeechState
};

export default SpeechInterface;
