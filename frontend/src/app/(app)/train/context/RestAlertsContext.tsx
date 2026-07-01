"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

const REST_ALERT_SOUND =
  "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAEAAQARAAIAIgAAABZAAAIAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2" +
  "YyFxaM0O3jlVIlDA+Z7vXupF4fEBCt8v79s20tEhK29v//tHEvFxfG/f///8SAAB";

type NotificationPermissionState = NotificationPermission | "unsupported";

interface RestAlertsContextValue {
  alertsReady: boolean;
  notificationPermission: NotificationPermissionState;
  unlockAlerts: () => Promise<NotificationPermissionState>;
  playRestEndAlert: () => void;
}

const RestAlertsContext = createContext<RestAlertsContextValue | null>(null);

export function RestAlertsProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [alertsReady, setAlertsReady] = useState(false);
  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermissionState>(() =>
      typeof window !== "undefined" && "Notification" in window
        ? Notification.permission
        : "unsupported",
    );

  // iOS/Safari only allows unlocking the audio element's playback inside a
  // direct user gesture. We play it once (silently) here so the same
  // element can be triggered programmatically later, when the rest timer
  // ends without any user interaction.
  const unlockAlerts = useCallback(async () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(REST_ALERT_SOUND);
    }
    const audio = audioRef.current;
    const previousVolume = audio.volume;
    audio.volume = 0;
    try {
      await audio.play();
      audio.pause();
      audio.currentTime = 0;
    } catch {
      // Ignored: if this fails, playback later will also silently fail.
    } finally {
      audio.volume = previousVolume;
    }

    let permission: NotificationPermissionState = "unsupported";
    if (typeof window !== "undefined" && "Notification" in window) {
      try {
        permission = await Notification.requestPermission();
      } catch {
        permission = Notification.permission;
      }
      setNotificationPermission(permission);
    }

    setAlertsReady(true);
    return permission;
  }, []);

  const playRestEndAlert = useCallback(() => {
    audioRef.current?.play().catch(() => {});

    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission === "granted"
    ) {
      new Notification("Descanso encerrado!", {
        body: "Hora de voltar ao treino 💪",
        icon: "/icon-192x192.png",
      });
    }
  }, []);

  const value = useMemo(
    () => ({ alertsReady, notificationPermission, unlockAlerts, playRestEndAlert }),
    [alertsReady, notificationPermission, unlockAlerts, playRestEndAlert],
  );

  return (
    <RestAlertsContext.Provider value={value}>
      {children}
    </RestAlertsContext.Provider>
  );
}

export function useRestAlerts() {
  const ctx = useContext(RestAlertsContext);
  if (!ctx) {
    throw new Error("useRestAlerts must be used within a RestAlertsProvider");
  }
  return ctx;
}
