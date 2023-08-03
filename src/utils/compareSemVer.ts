/**
 * Compare two semantic version strings.
 *
 * @param version1 - The first version string
 * @param version2 - The second version string
 *
 * @returns -1 if version1 < version2, 0 if they're equal, and 1 if version1 > version2.
 */
export function compareSemVer(version1: string, version2: string): number {
  const v1parts = version1.split('.').map(Number)
  const v2parts = version2.split('.').map(Number)

  for (let i = 0; i < v1parts.length; ++i) {
    if (v2parts.length === i) {
      return 1
    }
    if (v1parts[i] === v2parts[i]) {
      continue
    } else if (v1parts[i] > v2parts[i]) {
      return 1
    } else {
      return -1
    }
  }
  return v1parts.length !== v2parts.length ? -1 : 0
}
