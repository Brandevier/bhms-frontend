importScripts("https://www.gstatic.com/firebasejs/10.10.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.10.0/firebase-messaging-compat.js");

// Your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyClrYuOC4lhJlwNeAlOfdg8vwv9425qCh8",
    authDomain: "fb-clone-90480.firebaseapp.com",
    projectId: "fb-clone-90480",
    storageBucket: "fb-clone-90480.firebasestorage.app",
    messagingSenderId: "81417758403",
    appId: "1:81417758403:web:b430d95f30142b11eb6476",
    measurementId: "G-MSSH4Y06DC",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Background message handler
messaging.onBackgroundMessage((payload) => {
    console.log("Received background message:", payload);

    self.registration.showNotification(payload.notification.title, {
        body: payload.notification.body,
        icon: "/firebase-logo.png",
    });
});
