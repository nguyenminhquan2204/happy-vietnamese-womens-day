/**
 * Gradient dùng chung cho mọi minh họa SVG trên trang.
 * Không dùng `display: none` vì một số trình duyệt sẽ bỏ qua gradient khi đó.
 */
export function FloralDefs() {
  return (
    <svg
      width="0"
      height="0"
      aria-hidden="true"
      focusable="false"
      style={{ position: "absolute", overflow: "hidden" }}
    >
      <defs>
        <radialGradient id="petal-blush" cx="50%" cy="100%" r="115%">
          <stop offset="0" stopColor="#E6A0B4" />
          <stop offset="0.55" stopColor="#F6CDD9" />
          <stop offset="1" stopColor="#FFF4F7" />
        </radialGradient>
        <radialGradient id="petal-rose" cx="50%" cy="100%" r="115%">
          <stop offset="0" stopColor="#B4456A" />
          <stop offset="0.5" stopColor="#D96C8A" />
          <stop offset="1" stopColor="#F5B8C8" />
        </radialGradient>
        <radialGradient id="petal-deep" cx="50%" cy="100%" r="115%">
          <stop offset="0" stopColor="#5A1F36" />
          <stop offset="0.5" stopColor="#8B3756" />
          <stop offset="1" stopColor="#C9607F" />
        </radialGradient>
        <radialGradient id="petal-cream" cx="50%" cy="100%" r="115%">
          <stop offset="0" stopColor="#EDCBAE" />
          <stop offset="0.5" stopColor="#FBE8DC" />
          <stop offset="1" stopColor="#FFFCF8" />
        </radialGradient>
        <radialGradient id="core-gold" cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#F6E4B8" />
          <stop offset="1" stopColor="#BF9752" />
        </radialGradient>
        <linearGradient id="leaf" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#6F8862" />
          <stop offset="1" stopColor="#BCCBAE" />
        </linearGradient>
        <linearGradient id="gold-line" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#B8924E" />
          <stop offset="0.5" stopColor="#ECD6A2" />
          <stop offset="1" stopColor="#B8924E" />
        </linearGradient>
        <radialGradient id="seal-wax" cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor="#A9506F" />
          <stop offset="0.6" stopColor="#702D46" />
          <stop offset="1" stopColor="#4A1A2D" />
        </radialGradient>
        <linearGradient id="env-side-l" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#F2C6D3" />
          <stop offset="1" stopColor="#F8DCE4" />
        </linearGradient>
        <linearGradient id="env-side-r" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="#EFBFCD" />
          <stop offset="1" stopColor="#F7D8E1" />
        </linearGradient>
        <linearGradient id="env-bottom" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#FBE6EC" />
          <stop offset="1" stopColor="#F4CDD9" />
        </linearGradient>
        <linearGradient id="env-flap" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F1C2D0" />
          <stop offset="1" stopColor="#F9DEE6" />
        </linearGradient>
        <linearGradient id="env-flap-inside" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFF6F0" />
          <stop offset="1" stopColor="#F6DCD9" />
        </linearGradient>
      </defs>
    </svg>
  );
}
