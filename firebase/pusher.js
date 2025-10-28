import * as PusherPushNotifications from "@pusher/push-notifications-web";

// Initialize Pusher Beams
const beamsClient = new PusherPushNotifications.Client({
    instanceId: "d9fe2540-c217-4b5c-b986-d96c371ccd47", // Replace with your instance ID
});

// Start Pusher Beams
beamsClient.start()
    .then(() => beamsClient.addDeviceInterest(`user-${userId}`)) // Add interest for the user
    .then(() => console.log("Successfully registered with Pusher Beams"))
    .catch(console.error);

