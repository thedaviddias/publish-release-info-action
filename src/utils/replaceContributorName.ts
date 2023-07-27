/**
 * Replace characters in the contributor name.
 *
 * @param {string} contributor - The contributor name.
 * @param {string} contributorReplaceChar - The character to replace in the contributor name.
 * @param {string} contributorReplaceRegex - The regex pattern to identify characters to be replaced in the contributor name.
 * @returns {string} The updated contributor name.
 */
export function replaceContributorName(
  contributor: string,
  contributorReplaceChar: string,
  contributorReplaceRegex: string
): string {
  if (contributorReplaceChar && contributorReplaceRegex) {
    return contributor.replace(
      new RegExp(contributorReplaceRegex, 'g'),
      contributorReplaceChar
    )
  } else if (contributorReplaceChar) {
    return contributor.replace(/-/g, contributorReplaceChar)
  } else {
    return contributor
  }
}
