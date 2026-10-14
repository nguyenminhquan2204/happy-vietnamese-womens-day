import { AutoScrollToggle } from "./AutoScrollToggle";
import { MusicToggle } from "./MusicToggle";
import { PetalToggle } from "./PetalToggle";

/** Cụm nút điều khiển cố định ở góc trên bên phải. */
export function ControlDock() {
  return (
    <div className="control-dock" role="group" aria-label="Điều khiển nhạc nền, hiệu ứng và tự cuộn">
      <PetalToggle />
      <AutoScrollToggle />
      <MusicToggle />
    </div>
  );
}
