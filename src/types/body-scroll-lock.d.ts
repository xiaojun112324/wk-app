declare module 'body-scroll-lock' {
  export function disableBodyScroll(targetElement: HTMLElement, options?: any): void;
  export function enableBodyScroll(targetElement: HTMLElement): void;
  export function clearAllBodyScrollLocks(): void;
}
