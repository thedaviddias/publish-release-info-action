/**
 * Generate a release link from the repo link and the release version.
 *
 * @param {string} repoLink - The repo link.
 * @param {string} releaseVersion - The release version.
 * @returns {string} The release link.
 */
export function generateReleaseLink(
  repoLink: string,
  releaseVersion: string
): string {
  return `${repoLink}/releases/tag/${releaseVersion}`
}
