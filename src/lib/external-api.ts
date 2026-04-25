export function getExternalUserApiUrl() {
  const externalUserApiUrl = process.env.EXTERNAL_USER_API_URL;
  if (!externalUserApiUrl) {
    throw new Error("EXTERNAL_USER_API_URL não configurado");
  }

  const parsedUrl = new URL(externalUserApiUrl);
  if (parsedUrl.pathname === "/" || parsedUrl.pathname === "") {
    parsedUrl.pathname = "/api/users/me";
  }
  return parsedUrl.toString();
}

export function getExternalApiBaseUrl() {
  const userApiUrl = getExternalUserApiUrl();
  return new URL(userApiUrl).origin;
}

export function getExternalAuthRoute(path: string) {
  const baseUrl = getExternalApiBaseUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}
