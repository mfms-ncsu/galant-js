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

/**
 * @todo this should have a different name, e.g., speechOn
 */
function spoken() {
    return speech.enabled;
}

/**
 * Sets the speech speed from 1x to 4.5x.
 */
function setRate(rate) {
    const changed = speech.rate !== rate;
    speech.rate = rate;
    if (changed) {
        interruptAndSpeak("Speech speed " + rate);
    }
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
 * @author Henry Tavares
 */
function cancelSpeech() {
    speech.cancel();
}

/**
 * Announces whether speech is on or off.
 * @author Henry Tavares
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
 * @author Henry Tavares
 */
function announceGskState(enabled) {
    cancelSpeech();
    if ( ! speech.enabled ) return
    if (enabled) {
        speech.speak("Exploration mode."
            + " Shift-G to exit."
            + " Up/down arrows to explore incident edges."
            + " Right/left arrows to move to other endpoint and back."
        )
    } else {
        speech.speak("Exploration mode off");
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
