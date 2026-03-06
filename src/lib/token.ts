const TOKEN_KEY = "token";
const COOKIE_KEY = "cs_token";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

const isInvalidToken = (val?: string | null) => {
  if (!val) return true;
  const v = String(val).trim();
  return !v || v === "null" || v === "undefined";
};

const getCookie = (name: string): string | null => {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  if (!match) return null;
  return decodeURIComponent(match[1]);
};

const setCookie = (name: string, value: string, maxAgeSeconds: number) => {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; samesite=lax`;
};

const removeCookie = (name: string) => {
  document.cookie = `${name}=; path=/; max-age=0; samesite=lax`;
};

export const setToken = (token?: string | null) => {
  if (isInvalidToken(token)) {
    clearToken();
    return;
  }
  const t = String(token).trim();
  localStorage.setItem(TOKEN_KEY, t);
  setCookie(COOKIE_KEY, t, COOKIE_MAX_AGE);
};

export const getToken = (): string | null => {
  const localToken = localStorage.getItem(TOKEN_KEY);
  if (!isInvalidToken(localToken)) {
    return String(localToken).trim();
  }

  const cookieToken = getCookie(COOKIE_KEY);
  if (!isInvalidToken(cookieToken)) {
    const t = String(cookieToken).trim();
    localStorage.setItem(TOKEN_KEY, t);
    return t;
  }

  return null;
};

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  removeCookie(COOKIE_KEY);
};

