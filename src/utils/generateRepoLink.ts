/**
 * Generate a repo link from the base URL, owner and repo.
 *
 * @param {string} baseUrl - The base URL.
 * @param {string} owner - The owner of the repo.
 * @param {string} repo - The repo name.
 * @returns {string} The repo link.
 */
export function generateRepoLink(
  baseUrl: string,
  owner: string,
  repo: string
): string {
  return `${baseUrl}/${owner}/${repo}`
}
