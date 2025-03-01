import { useEffect } from "react";

const NotificationSound = () => {
    useEffect(() => {
        navigator.serviceWorker.addEventListener("message", (event) => {
            if (event.data && event.data.type === "PLAY_NOTIFICATION_SOUND") {
                const audio = new Audio("/notification.mp3"); // Path to your sound file
                audio.play().catch((e) => console.error("🔇 Error playing sound:", e));
            }
        });
    }, []);

    return null; // No UI needed
};

export default NotificationSound;
 