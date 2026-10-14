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
import { MusicBox } from "@/lib/music-box";
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
  musicPlaying: boolean;
  /** Đổi giá trị để remount nội dung chính — mọi hiệu ứng xuất hiện chạy lại từ đầu. */
  effectsKey: number;
  openCard: () => void;
  replay: () => void;
  triggerBurst: () => void;
  togglePetals: () => void;
  toggleMusic: () => void;
  restartEffects: () => void;
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
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [effectsKey, setEffectsKey] = useState(0);
  const musicBox = useRef<MusicBox | null>(null);
  /** Người xem đã tự tắt nhạc — khi "Mở lại tấm thiệp" thì không tự bật lại. */
  const musicMuted = useRef(false);
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
  useEffect(() => () => musicBox.current?.dispose(), []);

  // Trình duyệt chỉ cho phát âm thanh trong một thao tác của người dùng (click/phím),
  // nên hàm này phải được gọi đồng bộ ngay trong handler. Trạng thái "đang phát" chỉ bật
  // khi âm thanh thực sự chạy (bị chặn thì `resume()` treo, nút vẫn hiện "Nhạc nền").
  const startMusic = useCallback(() => {
    const box = (musicBox.current ??= new MusicBox());
    if (box.isAudible) return;
    box
      .play()
      .then(() => setMusicPlaying(box.isAudible))
      .catch(() => setMusicPlaying(false));
  }, []);

  // Thử phát nhạc ngay khi vào trang (trình duyệt cho phép thì chạy luôn). Nếu bị chặn,
  // thử lại ở mỗi lần chạm/bấm phím cho tới khi có tiếng — trên điện thoại chỉ `touchend`
  // mới được tính là thao tác hợp lệ, `pointerdown` thì không.
  useEffect(() => {
    startMusic();

    const events = ["pointerdown", "pointerup", "touchend", "keydown"] as const;
    const removeListeners = () => events.forEach((type) => window.removeEventListener(type, onGesture, true));
    function onGesture(event: Event) {
      if (musicBox.current?.isAudible || musicMuted.current) return removeListeners();
      // Bấm thẳng vào nút nhạc thì để nút tự xử lý, tránh vừa bật đã tắt
      if (event.target instanceof Element && event.target.closest(".dock-button--music")) return;
      startMusic();
    }
    events.forEach((type) => window.addEventListener(type, onGesture, true));
    return removeListeners;
  }, [startMusic]);

  const toggleMusic = useCallback(() => {
    if (musicBox.current?.isAudible) {
      musicBox.current.pause();
      musicMuted.current = true;
      setMusicPlaying(false);
    } else {
      musicMuted.current = false;
      setMusicPlaying(true);
      startMusic();
    }
  }, [startMusic]);

  const triggerBurst = useCallback(() => {
    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return;
    const id = ++burstId.current;
    setBursts((current) => [...current.slice(-1), id]);
    window.setTimeout(() => setBursts((current) => current.filter((item) => item !== id)), BURST_LIFETIME_MS);
  }, []);

  const openCard = useCallback(() => {
    if (phase !== "sealed") return;
    // Cú bấm mở phong bì là thao tác đầu tiên của người xem — tận dụng để bật nhạc nền ngay
    if (!musicMuted.current) startMusic();
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
  }, [phase, schedule, triggerBurst, startMusic]);

  const replay = useCallback(() => {
    clearTimers();
    window.scrollTo({ top: 0, behavior: "instant" });
    setPhase("sealed");
    setReplayCount((count) => count + 1);
  }, [clearTimers]);

  const togglePetals = useCallback(() => setPetalsPaused((paused) => !paused), []);
  const restartEffects = useCallback(() => setEffectsKey((key) => key + 1), []);

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
      musicPlaying,
      effectsKey,
      openCard,
      replay,
      triggerBurst,
      togglePetals,
      toggleMusic,
      restartEffects,
    }),
    [
      phase,
      replayCount,
      bursts,
      petalsPaused,
      musicPlaying,
      effectsKey,
      openCard,
      replay,
      triggerBurst,
      togglePetals,
      toggleMusic,
      restartEffects,
    ],
  );

  return (
    <ExperienceContext.Provider value={value}>
      <div className="experience" data-phase={phase}>
        {children}
      </div>
    </ExperienceContext.Provider>
  );
}
