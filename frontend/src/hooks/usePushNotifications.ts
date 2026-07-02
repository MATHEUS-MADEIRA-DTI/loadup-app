import { useEffect, useRef } from "react";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const output = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    output[i] = rawData.charCodeAt(i);
  }
  return output;
}

export function usePushNotifications() {
  const subscriptionRef = useRef<PushSubscription | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

    async function setup() {
      try {
        const reg = await navigator.serviceWorker.register("/sw.js");
        await navigator.serviceWorker.ready;

        if (Notification.permission === "default") {
          await Notification.requestPermission();
        }
        if (Notification.permission !== "granted") return;

        const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        if (!vapidKey) return;

        const existing = await reg.pushManager.getSubscription();
        subscriptionRef.current =
          existing ??
          (await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(vapidKey) as BufferSource,
          }));
      } catch (err) {
        console.warn("Push setup failed:", err);
      }
    }

    void setup();
  }, []);

  return subscriptionRef;
}
