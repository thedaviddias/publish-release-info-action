/**
 * Appends '/browse/' to the provided URL.
 *
 * @param {string} url - The URL to modify.
 * @return {string} The modified URL. If the input URL is empty, it is returned unchanged.
 */
export function appendBrowseToUrl(url: string): string {
  if (!url) return url

  // Ensure url ends with a slash
  const formattedUrl = url.endsWith('/') ? url : `${url}/`

  return `${formattedUrl}browse/`
}
