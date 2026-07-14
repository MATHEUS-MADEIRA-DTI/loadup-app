"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const REST_ALERT_SOUND =
  "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAEAAQARAAIAIgAAABZAAAIAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2" +
  "YyFxaM0O3jlVIlDA+Z7vXupF4fEBCt8v79s20tEhK29v//tHEvFxfG/f///8SAAB";

const ACTIVATED_STORAGE_KEY = "loadup:restAlertsActivated";

type NotificationPermissionState = NotificationPermission | "unsupported";

interface RestAlertsContextValue {
  alertsReady: boolean;
  notificationPermission: NotificationPermissionState;
  shouldPromptForAlerts: boolean;
  unlockAlerts: () => Promise<NotificationPermissionState>;
  dismissAlertsPrompt: () => void;
  playRestEndAlert: () => void;
}

const RestAlertsContext = createContext<RestAlertsContextValue | null>(null);

function readStoredActivation() {
  try {
    return window.localStorage.getItem(ACTIVATED_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function persistActivation() {
  try {
    window.localStorage.setItem(ACTIVATED_STORAGE_KEY, "1");
  } catch {
    // Ignored: worst case the prompt shows again next time.
  }
}

export function RestAlertsProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [alertsReady, setAlertsReady] = useState(false);
  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermissionState>("unsupported");
  const [shouldPromptForAlerts, setShouldPromptForAlerts] = useState(false);

  // iOS/Safari only allows unlocking the audio element's playback inside a
  // direct user gesture. We play it once (silently) here so the same
  // element can be triggered programmatically later, when the rest timer
  // ends without any user interaction.
  const runUnlock = useCallback(async () => {
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
    if ("Notification" in window) {
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

  // Determined only after mount to avoid an SSR/client markup mismatch,
  // since it depends on localStorage and the browser's Notification API.
  useEffect(() => {
    const supported = "Notification" in window;
    const currentPermission: NotificationPermissionState = supported
      ? Notification.permission
      : "unsupported";
    setNotificationPermission(currentPermission);

    const alreadyActivated = readStoredActivation();
    if (currentPermission === "granted" && !alreadyActivated) {
      persistActivation();
    }
    setShouldPromptForAlerts(currentPermission !== "granted" && !alreadyActivated);
  }, []);

  // Someone who activated alerts in a previous visit still needs a fresh
  // user gesture to unlock this page load's Audio element on iOS/Safari —
  // piggyback on their first tap instead of showing the prompt again.
  useEffect(() => {
    if (alertsReady || shouldPromptForAlerts) return;
    if (!readStoredActivation()) return;

    const handleFirstInteraction = () => {
      void runUnlock();
    };
    document.addEventListener("pointerdown", handleFirstInteraction, {
      once: true,
    });
    return () =>
      document.removeEventListener("pointerdown", handleFirstInteraction);
  }, [alertsReady, shouldPromptForAlerts, runUnlock]);

  const unlockAlerts = useCallback(async () => {
    const permission = await runUnlock();
    persistActivation();
    setShouldPromptForAlerts(false);

    // iOS/Safari silently drops the first Notification fired after a
    // permission grant unless the app is in the foreground at the time.
    // Firing one right here (while the user is still in the app, mid
    // gesture) "warms up" the delivery pipeline so later ones — like the
    // rest-timer alert, fired with the app backgrounded — go through.
    if (permission === "granted") {
      new Notification("Alertas de treino ativados!", {
        body: "A partir de agora você será avisado quando o descanso acabar.",
        icon: "/icon-192x192.png",
      });
    }

    return permission;
  }, [runUnlock]);

  const dismissAlertsPrompt = useCallback(() => {
    setShouldPromptForAlerts(false);
  }, []);

  const playRestEndAlert = useCallback(() => {
    audioRef.current?.play().catch(() => {});
  }, []);

  const value = useMemo(
    () => ({
      alertsReady,
      notificationPermission,
      shouldPromptForAlerts,
      unlockAlerts,
      dismissAlertsPrompt,
      playRestEndAlert,
    }),
    [
      alertsReady,
      notificationPermission,
      shouldPromptForAlerts,
      unlockAlerts,
      dismissAlertsPrompt,
      playRestEndAlert,
    ],
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
