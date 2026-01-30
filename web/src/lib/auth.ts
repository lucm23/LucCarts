// Cookie helpers + middleware utilities
export const setAuthCookie = (authenticated: boolean) => {
  if (typeof document !== 'undefined') {
    document.cookie = `mini_session=${authenticated}; path=/`;
  }
};

export const getAuthCookie = (): boolean => {
  if (typeof document !== 'undefined') {
    return document.cookie.includes('mini_session=true');
  }
  return false;
};

export const clearAuthCookie = () => {
  if (typeof document !== 'undefined') {
    document.cookie = 'mini_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
};
