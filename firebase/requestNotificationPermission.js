// import * as PusherPushNotifications from "@pusher/push-notifications-web";

// // Initialize Pusher Beams
// const beamsClient = new PusherPushNotifications.Client({
//     instanceId: "d9fe2540-c217-4b5c-b986-d96c371ccd47", // Replace with your instance ID
// });

// // Request notification permission and register device
// export const requestNotificationPermission = async (userId) => {
//     try {
//         // Request permission
//         const permission = await Notification.requestPermission();

//         if (permission === "granted") {
//             console.log("Notification permission granted.");

//             // Start Pusher Beams
//             await beamsClient.start();

//             // Add interest for the user
//             await beamsClient.addDeviceInterest(`user-${userId.id}`);

//             console.log("Successfully registered with Pusher Beams.");
//         } else {
//             console.log("Notification permission denied.");
//         }
//     } catch (error) {
//         console.error("Error requesting notification permission:", error);
//     }
// };

