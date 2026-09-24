import Speech from "states/Speech/Speech";

/**
 * SpeechInterface is the API for enabling, disabling, and speaking text.
 */

const speech = new Speech();

/**
 * Controls whether text will be spoken
 * @todo allow this value to be controlled by the user
 */
function setSpeech(toSpeak) {
    console.log(`-> setSpeech, spokenText = ${speech.enabled}, toSpeak = ${toSpeak}`)
    speech.enabled = toSpeak;
}

/**
 * Controls to change the speed of the speech
 * @todo allow this value to be controlled by the user
 */
function setSpeechSpeed(speed) {
    console.log(`-> setSpeechSpeed, new speed = ${speed}`);
    speech.speed = speed;
}

function spoken() {
    return speech.enabled;
}

function speakText(text) {
    speech.speak(text);
}

const SpeechInterface = {
    spoken,
    setSpeech,
    speakText,
    setSpeechSpeed
};

export default SpeechInterface;
