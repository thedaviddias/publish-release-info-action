/**
 * Parse the JIRA ticket number from a title string.
 *
 * @param {string} title - The title string to search for the JIRA ticket number.
 * @param {string} prefix - The prefix for the JIRA ticket number, e.g., 'ABC-'.
 * @returns {string | null} - The extracted JIRA ticket number or `null` if not found.
 */
export function parseTicketNumberFromTitle(
  title: string,
  prefix: string
): string | null {
  const regex = new RegExp(`${prefix}-\\d+`, 'i')
  const match = title.match(regex)

  return match ? match[0] : null
}
