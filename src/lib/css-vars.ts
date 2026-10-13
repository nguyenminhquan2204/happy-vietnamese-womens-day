import type { CSSProperties } from "react";

type CSSVariables = Record<`--${string}`, string | number>;

/** Gắn CSS custom properties vào `style` mà vẫn giữ type-safety. */
export function cssVars(vars: CSSVariables, base?: CSSProperties): CSSProperties {
  return { ...base, ...vars } as CSSProperties;
}

/** Số giả ngẫu nhiên ổn định theo index — tránh lệch hydration giữa server và client. */
export function seeded(index: number, salt = 1): number {
  const x = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}
