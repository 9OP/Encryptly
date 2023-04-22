const getAuthorizationUrl = (): string => {
  // Documentation:
  // https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow#creatingclient

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_REDIRECT_URI;

  const scopes = [
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/drive.appdata",
    "https://www.googleapis.com/auth/userinfo.email",
    "openid",
  ];

  const url =
    "https://accounts.google.com/o/oauth2/v2/auth?" +
    "access_type=online&" +
    "prompt=select_account&" +
    "response_type=token&" +
    "include_granted_scopes=false&" +
    `client_id=${clientId}&` +
    `scope=${scopes.join(" ")}&` +
    `redirect_uri=${redirectUri}&`;

  return url;
};

export default getAuthorizationUrl;
