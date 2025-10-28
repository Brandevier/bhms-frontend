self.addEventListener("push", function (event) {
    if (event.data) {
        const payload = event.data.json();
        console.log("📩 Received push event:", payload);

        const options = {
            body: payload.notification.body,
            icon: "/assets/logo.svg", // Change to your app's logo
            sound: "/notification.wav", // Custom notification sound
        };

        self.registration.showNotification(payload.notification.title, options);

        // Play sound manually since `sound` is not always supported
        self.playNotificationSound();
    }
});

// Custom function to play a sound
self.playNotificationSound = function () {
    self.clients.matchAll({ includeUncontrolled: true, type: "window" }).then((clients) => {
        clients.forEach((client) => {
            client.postMessage({ type: "PLAY_NOTIFICATION_SOUND" });
        });
    });
};
