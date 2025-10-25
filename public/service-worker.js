self.addEventListener("install", (e) => {
  console.log("Service Worker installed");
});

self.addEventListener("activate", (e) => {
  console.log("Service Worker activated");
});

self.addEventListener("fetch", () => {});

// Note: This service worker handles 'push' events only if you integrate
// Firebase Cloud Messaging or another push service that sends push messages.
self.addEventListener("push", (event) => {
  try {
    const data = event.data.json();
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icon-192.png"
    });
  } catch (err) {
    console.error('Push event error', err);
  }
});
