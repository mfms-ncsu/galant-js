import { useEffect, useRef } from "react";
import { Dialog } from "@headlessui/react";
import SpeechInterface from "interfaces/SpeechInterface/SpeechInterface";

export default function IntroductionDialog({ title, text, onClose, onHelp }) {
    const continueButton = useRef();

    useEffect(() => {
        SpeechInterface.interruptAndSpeak(`${title}. ${text}`);
        return () => SpeechInterface.cancelSpeech();
    }, [title, text]);

    return (
        <Dialog open={true} onClose={onClose} initialFocus={continueButton} className="relative z-[100]">
            <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-6">
                <Dialog.Panel data-workflow-dialog className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-xl">
                    <Dialog.Title className="text-2xl font-semibold text-slate-900">{title}</Dialog.Title>
                    <Dialog.Description className="my-6 max-h-[60vh] overflow-auto whitespace-pre-wrap text-lg text-slate-700">
                        {text}
                    </Dialog.Description>
                    <div className="flex justify-end gap-3">
                        {onHelp && <button type="button" onClick={onHelp} className="rounded-lg border px-4 py-2">Help</button>}
                        <button type="button" ref={continueButton} onClick={onClose} className="rounded-lg bg-blue-600 px-5 py-2 text-white">Continue</button>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}
