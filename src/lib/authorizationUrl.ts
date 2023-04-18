const getAuthorizationUrl = (): string => {
  // Documentation:
  // https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow#creatingclient

  const clientId = "828562980720-bri8rf8in7g48bs4mlk708u6oipil1ph.apps.googleusercontent.com";
  const redirectUri = "http://localhost:3000";
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
