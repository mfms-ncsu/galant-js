/**
 * Contains functions for queueing and dequeueing prompts from the
 * prompt queue.
 * 
 * @author Henry Morris
 */

function dequeuePrompt(promptQueue) {
    promptQueue.shift();
    return [...promptQueue];
}

function queuePrompt(promptQueue, data, callback) {
    return [...promptQueue, {data, callback}];
}

const PromptInterface = {
    dequeuePrompt,
    queuePrompt
};
export default PromptInterface;