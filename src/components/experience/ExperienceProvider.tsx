"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { REDUCED_MOTION_QUERY } from "@/lib/use-media-query";

/**
 * sealed    → phong bì đang đóng
 * opening   → nắp mở, thiệp trượt lên
 * revealing → lớp phong bì mờ dần, nội dung chính xuất hiện
 * open      → đã mở xong, có thể cuộn trang
 */
export type Phase = "sealed" | "opening" | "revealing" | "open";

const OPENING_MS = 1900;
const REVEALING_MS = 1000;
const BURST_LIFETIME_MS = 8000;

interface ExperienceContextValue {
  phase: Phase;
  isRevealed: boolean;
  replayCount: number;
  bursts: number[];
  petalsPaused: boolean;
  openCard: () => void;
  replay: () => void;
  triggerBurst: () => void;
  togglePetals: () => void;
}

const ExperienceContext = createContext<ExperienceContextValue | null>(null);

export function useExperience(): ExperienceContextValue {
  const context = useContext(ExperienceContext);
  if (!context) throw new Error("useExperience phải được dùng bên trong <ExperienceProvider>");
  return context;
}

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>("sealed");
  const [replayCount, setReplayCount] = useState(0);
  const [bursts, setBursts] = useState<number[]>([]);
  const [petalsPaused, setPetalsPaused] = useState(false);
  const timers = useRef<number[]>([]);
  const burstId = useRef(0);

  const schedule = useCallback((callback: () => void, delay: number) => {
    timers.current.push(window.setTimeout(callback, delay));
  }, []);

  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const triggerBurst = useCallback(() => {
    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return;
    const id = ++burstId.current;
    setBursts((current) => [...current.slice(-1), id]);
    window.setTimeout(() => setBursts((current) => current.filter((item) => item !== id)), BURST_LIFETIME_MS);
  }, []);

  const openCard = useCallback(() => {
    if (phase !== "sealed") return;
    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) {
      // Bỏ qua animation, nhưng vẫn để nội dung hiện ra trước khi chuyển focus vào tiêu đề.
      setPhase("revealing");
      schedule(() => setPhase("open"), 100);
      return;
    }
    setPhase("opening");
    schedule(() => {
      setPhase("revealing");
      triggerBurst();
    }, OPENING_MS);
    schedule(() => setPhase("open"), OPENING_MS + REVEALING_MS);
  }, [phase, schedule, triggerBurst]);

  const replay = useCallback(() => {
    clearTimers();
    window.scrollTo({ top: 0, behavior: "instant" });
    setPhase("sealed");
    setReplayCount((count) => count + 1);
  }, [clearTimers]);

  const togglePetals = useCallback(() => setPetalsPaused((paused) => !paused), []);

  // Chuyển focus tới tiêu đề khi thiệp mở xong, giúp người dùng bàn phím/trình đọc màn hình.
  useEffect(() => {
    if (phase !== "open") return;
    // Nội dung chính vừa chuyển từ `visibility: hidden` sang hiện, nên focus có thể chưa nhận ngay;
    // thử lại mỗi frame (tối đa ~10 frame) cho tới khi tiêu đề thực sự được focus.
    let frame = 0;
    let attempts = 0;
    const tryFocus = () => {
      const title = document.getElementById("hero-title");
      title?.focus({ preventScroll: true });
      if (title && document.activeElement !== title && ++attempts < 10) {
        frame = requestAnimationFrame(tryFocus);
      }
    };
    frame = requestAnimationFrame(tryFocus);
    return () => cancelAnimationFrame(frame);
  }, [phase]);

  const value = useMemo<ExperienceContextValue>(
    () => ({
      phase,
      isRevealed: phase === "revealing" || phase === "open",
      replayCount,
      bursts,
      petalsPaused,
      openCard,
      replay,
      triggerBurst,
      togglePetals,
    }),
    [phase, replayCount, bursts, petalsPaused, openCard, replay, triggerBurst, togglePetals],
  );

  return (
    <ExperienceContext.Provider value={value}>
      <div className="experience" data-phase={phase}>
        {children}
      </div>
    </ExperienceContext.Provider>
  );
}
