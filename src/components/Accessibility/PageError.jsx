import { useEffect } from "react";
import { useRouteError } from "react-router-dom";
import SpeechInterface from "interfaces/SpeechInterface/SpeechInterface";

export default function PageError() {
    const error = useRouteError();
    const message = "GALANT could not finish this action. Save any work in your editor windows, then refresh this page. If it happens again, check your graph and algorithm before trying again.";
    useEffect(() => {
        console.error(error);
        SpeechInterface.interruptAndSpeak(message);
    }, [error]);

    return (
        <main className="mx-auto max-w-xl p-8">
            <h1 className="text-2xl font-semibold">Something went wrong</h1>
            <p role="alert" className="my-4">{message}</p>
            <button type="button" onClick={() => window.location.reload()} className="rounded-lg bg-blue-600 px-4 py-2 text-white">Refresh page</button>
        </main>
    );
}
