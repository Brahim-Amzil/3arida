const HTTPS_PROTOCOL = 'https:';

type ValidationOptions = {
  allowSubdomains?: boolean;
};

export function assertTrustedExternalUrl(
  urlValue: string,
  allowedHosts: string[],
  options: ValidationOptions = {},
): URL {
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(urlValue);
  } catch {
    throw new Error('Invalid external URL');
  }

  if (parsedUrl.protocol !== HTTPS_PROTOCOL) {
    throw new Error('Only HTTPS external URLs are allowed');
  }

  const host = parsedUrl.hostname.toLowerCase();
  const isAllowed = allowedHosts.some((allowedHost) => {
    const normalizedHost = allowedHost.toLowerCase();
    if (host === normalizedHost) return true;
    if (!options.allowSubdomains) return false;
    return host.endsWith(`.${normalizedHost}`);
  });

  if (!isAllowed) {
    throw new Error(`External host "${host}" is not allowed`);
  }

  if (parsedUrl.username || parsedUrl.password) {
    throw new Error('External URL credentials are not allowed');
  }

  return parsedUrl;
}
