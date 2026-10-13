import { MusicToggle } from "./MusicToggle";
import { PetalToggle } from "./PetalToggle";

/** Cụm nút điều khiển cố định ở góc trên bên phải. */
export function ControlDock() {
  return (
    <div className="control-dock" role="group" aria-label="Điều khiển nhạc nền và hiệu ứng">
      <PetalToggle />
      <MusicToggle />
    </div>
  );
}
