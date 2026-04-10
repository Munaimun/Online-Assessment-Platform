"use client";

import { useEffect } from "react";
import type { BehaviorEvent } from "@/types";

interface UseBehaviorTrackingOptions {
  onEvent: (event: BehaviorEvent) => void;
}

export function useBehaviorTracking({ onEvent }: UseBehaviorTrackingOptions) {
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        onEvent({
          type: "tab_switch",
          timestamp: new Date().toISOString(),
          details: "Candidate switched tab or minimized the browser window.",
        });
      }
    };

    const onFullscreenChange = () => {
      if (!document.fullscreenElement) {
        onEvent({
          type: "fullscreen_exit",
          timestamp: new Date().toISOString(),
          details: "Candidate exited fullscreen mode.",
        });
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    document.addEventListener("fullscreenchange", onFullscreenChange);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, [onEvent]);
}
