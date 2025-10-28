import { useEffect } from "react";

const NotificationSound = () => {
    useEffect(() => {
        const playSound = () => {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const audioElement = new Audio("/notification.wav");

            // Create MediaElementAudioSourceNode
            const track = audioContext.createMediaElementSource(audioElement);
            track.connect(audioContext.destination);

            // Resume audio context (Required for some browsers)
            if (audioContext.state === "suspended") {
                audioContext.resume();
            }

            audioElement.play().catch((e) => console.error("🔇 Error playing sound:", e));
        };

        // Listen for notification events from service worker
        navigator.serviceWorker.addEventListener("message", (event) => {
            if (event.data && event.data.type === "PLAY_NOTIFICATION_SOUND") {
                playSound();
            }
        });

        // Allow sound to be enabled on user interaction
        document.addEventListener("click", playSound, { once: true });

        return () => {
            document.removeEventListener("click", playSound);
        };
    }, []);

    return null; // No UI needed
};

export default NotificationSound;
