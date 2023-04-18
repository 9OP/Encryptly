const ACCESS_TOKEN = "access-token";

export const getAccessToken = (): string => {
  return sessionStorage.getItem(ACCESS_TOKEN) || "";
};

export const setAccessToken = (token: string) => {
  sessionStorage.setItem(ACCESS_TOKEN, token);
};

export const delAccessToken = () => {
  sessionStorage.removeItem(ACCESS_TOKEN);
};
