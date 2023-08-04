/**
 * Compare two semantic version strings. Semantic versioning strings are
 * typically in the form of `major.minor.patch` (e.g., "1.2.3").
 *
 * @param previousTagVersion - The semantic version string for the previous tag.
 * @param currentTagVersion - The semantic version string for the current tag.
 *
 * @returns  1 if previousTagVersion < currentTagVersion,
 *           0 if they're equal,
 *          -1 if previousTagVersion > currentTagVersion.
 */
export function compareSemVer(
  previousTagVersion: string,
  currentTagVersion: string
): number {
  // Remove "v" and split the version strings into arrays of numbers
  const previousParts = previousTagVersion.replace('v', '').split('.').map(Number)
  const currentParts = currentTagVersion.replace('v', '').split('.').map(Number)

  // Get the maximum length between the two arrays
  const maxLength = Math.max(previousParts.length, currentParts.length)

  // Iterate over each number in the version arrays
  for (let i = 0; i < maxLength; i++) {
    // If previousPart is greater than currentPart or currentPart doesn't exist, return -1
    if (previousParts[i] > (currentParts[i] || 0)) {
      return -1
    }
    // If previousPart is less than currentPart or previousPart doesn't exist, return 1
    if ((previousParts[i] || 0) < currentParts[i]) {
      return 1
    }
  }

  // If all parts are equal, return 0
  return 0
}
