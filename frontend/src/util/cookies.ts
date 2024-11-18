export const getCookie = (key: string): string | null => {
  const cookies = document.cookie.split(";");

  for (const c of cookies) {
    if (!c.startsWith(`${key}=`)) continue;

    return c.split("=", 2)[1];
  }

  return null;
};

export const getCsrf = async (): Promise<string> => {
  let retries = 0;
  let csrf = getCookie("csrf_token") ?? "";

  while (!csrf) {
    if (retries > 3) throw new Error("Failed to get CSRF token");

    csrf = getCookie("csrf_token") ?? "";
    await fetch("/api/auth");

    retries++;
  }

  return csrf;
};
