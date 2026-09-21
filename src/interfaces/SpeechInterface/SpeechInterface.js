import Speech from "states/Speech/Speech";
import { getDefaultStore } from "jotai";
import { speechEnabledAtom } from "states/_atoms/atoms";

/**
 * SpeechInterface is the API for enabling, disabling, and speaking text.
 */

const speech = new Speech();
const store = getDefaultStore();

// Follow the user's setting without saving temporary changes made during revert.
store.sub(speechEnabledAtom, () => setSpeech(store.get(speechEnabledAtom)));
setSpeech(store.get(speechEnabledAtom));

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

function speakText(text) {
    if (spoken()) speech.speak(text);
}

/**
 * Stops speech without changing whether future text will be spoken.
 */
function cancelSpeech() {
    speech.cancel();
}

const SpeechInterface = {
    spoken,
    setSpeech,
    speakText,
    cancelSpeech
};

export default SpeechInterface;
