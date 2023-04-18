const ACCESS_TOKEN = "access-token";

export const getStorageAccessToken = (): string => {
  return sessionStorage.getItem(ACCESS_TOKEN) || "";
};

export const setStorageAccessToken = (token: string) => {
  sessionStorage.setItem(ACCESS_TOKEN, token);
};

export const delStorageAccessToken = () => {
  sessionStorage.removeItem(ACCESS_TOKEN);
};
